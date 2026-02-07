# Multi-stage build for Task6 monorepo
# Stage 1: Base
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY packages/lib/package*.json ./packages/lib/
COPY packages/client/package*.json ./packages/client/
COPY packages/server/package*.json ./packages/server/
RUN npm ci --workspaces

# Stage 2: Build lib
FROM base AS build-lib
COPY packages/lib ./packages/lib
COPY packages/lib/tsconfig.json ./packages/lib/
RUN npm run build --workspace=packages/lib

# Stage 3: Build client
FROM base AS build-client
COPY --from=build-lib /app/packages/lib/dist ./packages/lib/dist
COPY packages/client ./packages/client
RUN npm run build --workspace=packages/client

# Stage 4: Build server
FROM base AS build-server
COPY --from=build-lib /app/packages/lib/dist ./packages/lib/dist
COPY packages/server ./packages/server
RUN npm run build --workspace=packages/server

# Stage 5: Production runtime
FROM node:24-alpine AS production
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/lib/package*.json ./packages/lib/
COPY packages/server/package*.json ./packages/server/

# Install production dependencies only
RUN npm ci --workspaces --omit=dev

# Copy built artifacts
COPY --from=build-lib /app/packages/lib/dist ./packages/lib/dist
COPY --from=build-server /app/packages/server/dist ./packages/server/dist
COPY --from=build-client /app/packages/client/dist ./packages/client/dist

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start server (serves both API and static files)
CMD ["node", "packages/server/dist/index.js"]
