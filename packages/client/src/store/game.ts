import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { socket } from "../services/socket";
import type { GameState, JoinGamePayload } from "@task6/lib";

interface GameStateStore {
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;

    gameState: GameState | null;
    playerId: string | null;
    lobbyGames: GameState[];

    connect: () => void;
    joinLobby: () => void;
    joinGame: (payload: JoinGamePayload) => Promise<boolean>;
    makeMove: (index: number) => void;
    playAgain: () => void;
    leaveGame: () => void;
    resetError: () => void;
}

export const useGameStorage = create<GameStateStore>()(
    devtools((set, get) => ({
        isConnected: false,
        isConnecting: false,
        error: null,
        gameState: null,
        playerId: null,
        lobbyGames: [],

        connect: () => {
            if (socket.connected) return;

            socket.connect();

            socket.on("connect", () => {
                set({ isConnected: true, playerId: socket.id ?? null });
            });

            socket.on("disconnect", () => {
                set({ isConnected: false });
            });

            socket.on("lobby_list_update", (games) => {
                set({ lobbyGames: games });
            });

            socket.on("game_state_update", (newState) => {
                set({ gameState: newState });
            });

            socket.on("error", (msg) => {
                set({ error: msg });
            });

            socket.on("game_over", (result) => {
                console.log("Game over:", result.message);
            });
        },

        joinLobby: () => {
            socket.emit("join_lobby");
        },

        joinGame: async (payload) => {
            set({ isConnecting: true, error: null });

            return new Promise((resolve) => {
                socket.emit("join_game", payload, (response) => {
                    if (response.error) {
                        set({ isConnecting: false, error: response.error });
                        resolve(false);
                    } else {
                        set({ isConnecting: false });
                        resolve(true);
                    }
                });
            });
        },

        makeMove: (index) => {
            const { gameState } = get();
            if (!gameState) return;

            socket.emit("make_move", { roomId: gameState.roomId, index });
        },

        playAgain: () => {
            const { gameState } = get();
            if (!gameState) return;

            socket.emit("play_again", { roomId: gameState.roomId });
        },

        leaveGame: () => {
            socket.disconnect();
            set({ gameState: null, isConnected: false });
            socket.connect();
        },

        resetError: () => {
            set({ error: null });
        },
    })),
);
