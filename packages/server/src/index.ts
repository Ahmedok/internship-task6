import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GAME_NAME } from "@task6/lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

const PORT = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok", game: GAME_NAME });
});

// API
app.get("/api/status", (_req, res) => {
    res.json({
        game: GAME_NAME,
        connectedPlayers: io.engine.clientsCount,
        timestamp: new Date().toISOString(),
    });
});

io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
    });

    socket.on("move", (data) => {
        console.log("Move received:", data);
        socket.broadcast.emit("move", data);
    });
});

if (process.env.NODE_ENV === "production") {
    const clientDistPath = path.join(__dirname, "../../client/dist");
    app.use(express.static(clientDistPath));

    app.get("*", (_req, res) => {
        res.sendFile(path.join(clientDistPath, "index.html"));
    });
}

httpServer.listen(PORT, () => {
    console.log(`${GAME_NAME} server running on port ${String(PORT)}`);
    console.log(`Environment: ${process.env.NODE_ENV ?? "development"}`);
});
