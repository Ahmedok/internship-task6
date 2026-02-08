import { Server, Socket } from "socket.io";
import {
    type ClientToServerEvents,
    type ServerToClientEvents,
    JoinGameSchema,
    MakeMoveSchema,
} from "@task6/lib";
import { gameStorage } from "./store";

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    roomId?: string;
    playerName?: string;
}

export type TypedServer = Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>;
export type TypedSocket = Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>;

export function registerSocketHandlers(io: TypedServer, socket: TypedSocket) {
    socket.on("join_game", async (payload, callback) => {
        const validation = JoinGameSchema.safeParse(payload);
        if (!validation.success) {
            if (typeof callback === "function") {
                callback({ error: "Invalid data: " + validation.error.message });
            }
            return;
        }

        const { name, roomId } = validation.data;
        let game;

        if (roomId) {
            game = gameStorage.findGame(roomId);
            if (!game) {
                if (typeof callback === "function") callback({ error: "Room not found" });
                return;
            }
        } else {
            game = gameStorage.createGame();
        }

        const success = game.addPlayer({
            id: socket.id,
            name: name,
            symbol: "X",
        });

        if (!success) {
            if (typeof callback === "function")
                callback({ error: "Room is full or game has already started" });
            return;
        }

        socket.data.roomId = game.publicState.roomId;
        socket.data.playerName = name;

        await socket.join(game.publicState.roomId);

        if (typeof callback === "function") callback({ roomId: game.publicState.roomId });

        io.to(game.publicState.roomId).emit("game_state_update", game.publicState);
    });

    socket.on("make_move", (payload) => {
        const validation = MakeMoveSchema.safeParse(payload);
        if (!validation.success) return;

        const { roomId, index } = validation.data;
        const game = gameStorage.findGame(roomId);

        if (!game) return;

        const moveSuccess = game.makeMove(socket.id, index);

        if (moveSuccess) {
            io.to(roomId).emit("game_state_update", game.publicState);

            if (game.publicState.status === "FINISHED") {
                const winner = game.publicState.winner;

                if (winner) {
                    const message =
                        winner === "DRAW"
                            ? "It's a draw!"
                            : `Player ${winner === "X_WIN" ? "X" : "O"} won!`;

                    io.to(roomId).emit("game_over", { winner, message });
                }
            }
        }
    });

    socket.on("play_again", ({ roomId }) => {
        const game = gameStorage.findGame(roomId);
        if (!game || socket.data.roomId !== roomId) return;

        game.resetGame();
        io.to(roomId).emit("game_state_update", game.publicState);
    });

    socket.on("disconnect", () => {
        const roomId = socket.data.roomId;
        if (!roomId) return;

        const game = gameStorage.findGame(roomId);
        if (game) {
            game.removePlayer(socket.id);

            if (game.playerCount > 0) io.to(roomId).emit("game_state_update", game.publicState);
        }
    });
}
