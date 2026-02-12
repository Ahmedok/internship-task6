import * as z from "zod";

// Shared types

export const GAME_NAME = "TicTacToe";

export type PlayerSymbol = "X" | "O";

export type GameStatus = "WAITING" | "PLAYING" | "FINISHED" | "ABORTED";

export type WinSide = "X_WIN" | "O_WIN" | "DRAW";

export type WinType = "HORIZONTAL" | "VERTICAL" | "DIAGONAL";

export type BoardState = (PlayerSymbol | null)[];

export interface Player {
    id: string;
    name: string;
    symbol: PlayerSymbol;
}

export interface GameState {
    roomId: string;
    status: GameStatus;
    board: BoardState;
    turn: PlayerSymbol;
    players: Player[];
    winner: WinSide | null;
    winType: WinType | null;
    winningLine: readonly [number, number, number] | null;
    rematchVotes: string[];
}

// Shemas with zod

export const JoinGameSchema = z.object({
    name: z
        .string()
        .min(2, "Name has to be at least 2 characters long")
        .max(12, "Name can't be longer than 12 characters"),
    roomId: z.string().optional(),
});
export type JoinGamePayload = z.infer<typeof JoinGameSchema>;

export const MakeMoveSchema = z.object({
    roomId: z.string(),
    index: z.number().min(0).max(8),
});
export type MakeMovePayload = z.infer<typeof MakeMoveSchema>;

// Socket events

export interface ClientToServerEvents {
    join_lobby: () => void;
    join_game: (
        payload: JoinGamePayload,
        callback: (response: { error?: string; roomId?: string }) => void,
    ) => void;
    make_move: (payload: MakeMovePayload) => void;
    play_again: (payload: { roomId: string }) => void;
    abort_game: (payload: { roomId: string }) => void;
}

export interface ServerToClientEvents {
    game_state_update: (state: GameState) => void;
    lobby_list_update: (games: GameState[]) => void;
    error: (message: string) => void;
    game_over: (result: { winner: WinSide; message: string }) => void;
}

export const WINNING_COMBINATIONS = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
] as const;

export function checkWinner(board: BoardState): {
    winner: WinSide;
    winType: WinType;
    winningLine: readonly [number, number, number];
} | null {
    for (const [i, combination] of WINNING_COMBINATIONS.entries()) {
        const [a, b, c] = combination;
        const cellA = board[a];

        if (cellA && cellA === board[b] && cellA === board[c]) {
            const winner: WinSide = cellA === "X" ? "X_WIN" : "O_WIN";
            const winType: WinType = i < 3 ? "HORIZONTAL" : i < 6 ? "VERTICAL" : "DIAGONAL";
            return { winner, winType, winningLine: combination };
        }
    }
    return null;
}

export function isBoardFull(board: BoardState): boolean {
    return board.every((cell) => cell !== null);
}
