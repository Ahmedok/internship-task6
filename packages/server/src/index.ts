import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GAME_NAME } from "@task6/lib";

import type { ClientToServerEvents, ServerToClientEvents } from "@task6/lib";
import { registerSocketHandlers, type InterServerEvents, type SocketData } from "./handlers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT ?? 3000);
const IS_PROD = process.env.NODE_ENV === "production";

const app = express();
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    httpServer,
    {
        cors: {
            origin: IS_PROD ? false : "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    },
);

app.use(cors());
app.use(express.json());
app.disable("x-powered-by");

app.get("/health", (_req, res) => {
    res.json({ status: "ok", game: GAME_NAME });
});

app.get("/api/status", (_req, res) => {
    res.json({
        game: GAME_NAME,
        online: io.engine.clientsCount,
        uptime: process.uptime(),
        env: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);

    registerSocketHandlers(io, socket);

    socket.on("disconnect", (reason) => {
        console.log(`Player disconnected: ${socket.id} (${reason})`);
    });
});

if (IS_PROD) {
    const clientDistPath = path.join(__dirname, "../../client/dist");
    console.log(`Serving static files from: ${clientDistPath}`);
    app.use(express.static(clientDistPath));

    app.get("*", (_req, res) => {
        res.sendFile(path.join(clientDistPath, "index.html"));
    });
}

const shutdown = (signal: string) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    void io.close(() => {
        console.log("Socket.io closed.");
        httpServer.close(() => {
            console.log("HTTP Server closed.");
            process.exit(0);
        });
    });
};

if (process.argv[1] === __filename) {
    httpServer.listen(PORT, "0.0.0.0", () => {
        console.log(`${GAME_NAME} server running on port ${String(PORT)}`);
        console.log(`Environment: ${IS_PROD ? "Production" : "Development"}`);
    });

    process.on("SIGTERM", () => {
        shutdown("SIGTERM");
    });
    process.on("SIGINT", () => {
        shutdown("SIGINT");
    });
}

export { app, httpServer, io };
