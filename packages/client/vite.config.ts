import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        watch: {
            ignored: ["!**/node_modules/@task6/lib/**"],
        },
        port: 5173,
        host: true,
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
            "/health": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
            "/socket.io": {
                target: "http://localhost:3000",
                changeOrigin: true,
                ws: true,
            },
        },
    },
});
