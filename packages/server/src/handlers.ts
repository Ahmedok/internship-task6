import { Server, Socket } from "socket.io";
import {
    type ClientToServerEvents,
    type ServerToClientEvents,
    JoinGameSchema,
    MakeMoveSchema,
} from "@task6/lib";
import { gameStorage } from "./store.js";
import { Game } from "./game.js";

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
    const broadcastLobbyUpdate = () => {
        const games = gameStorage.getOpenGames();
        io.to("lobby").emit("lobby_list_update", games);
    };

    socket.on("join_lobby", async () => {
        await socket.join("lobby");
        socket.emit("lobby_list_update", gameStorage.getOpenGames());
    });

    socket.on("join_game", async (payload, callback) => {
        try {
            const validation = JoinGameSchema.safeParse(payload);
            if (!validation.success) {
                if (typeof callback === "function") {
                    callback({ error: "Invalid data: " + validation.error.message });
                }
                return;
            }

            const { name, roomId } = validation.data;
            let game: Game | undefined;

            if (roomId === "FAST_PLAY") {
                const openGames = gameStorage.getOpenGames();

                const firstGame = openGames[0];
                if (firstGame) game = gameStorage.findGame(firstGame.roomId);

                game ??= gameStorage.createGame();
            } else if (roomId) {
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

            await socket.leave("lobby");

            socket.data.roomId = game.publicState.roomId;
            socket.data.playerName = name;

            await socket.join(game.publicState.roomId);

            if (typeof callback === "function") callback({ roomId: game.publicState.roomId });

            io.to(game.publicState.roomId).emit("game_state_update", game.publicState);

            broadcastLobbyUpdate();
        } catch (error) {
            console.error("Error in join_game handler:", error);
            if (typeof callback === "function") callback({ error: "Internal server error" });
        }
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

        game.voteRematch(socket.id);
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
