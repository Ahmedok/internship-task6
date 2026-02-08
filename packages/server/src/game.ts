import {
    type GameState,
    isBoardFull,
    type Player,
    type PlayerSymbol,
    type BoardState,
    checkWinner,
} from "@task6/lib";

export class Game {
    private state: GameState;

    constructor(roomId: string) {
        this.state = {
            roomId,
            status: "WAITING",
            board: Array(9).fill(null) as BoardState,
            turn: "X",
            players: [],
            winner: null,
            winType: null,
            winningLine: null,
        };
    }

    get publicState(): GameState {
        return {
            ...this.state,
            board: [...this.state.board],
            players: this.state.players.map((p) => ({ ...p })),
        };
    }

    addPlayer(player: Player): boolean {
        if (this.state.players.length >= 2) return false;
        if (this.state.status !== "WAITING") return false;

        const symbol: PlayerSymbol = this.state.players.length === 0 ? "X" : "O";
        const newPlayer: Player = { ...player, symbol };

        this.state.players.push(newPlayer);

        if (this.state.players.length === 2) {
            this.state.status = "PLAYING";
        }

        return true;
    }

    removePlayer(playerId: string): void {
        this.state.players = this.state.players.filter((p) => p.id !== playerId);

        if (this.state.status === "PLAYING") {
            this.state.status = "ABORTED";
        } else {
            this.state.status = "WAITING";
            if (this.state.players[0]) {
                this.state.players[0].symbol = "X";
            }
        }
    }

    makeMove(playerId: string, index: number): boolean {
        if (this.state.status !== "PLAYING") return false;

        const player = this.state.players.find((p) => p.id === playerId);

        if (player?.symbol !== this.state.turn) return false;

        if (this.state.board[index] !== null) return false;

        this.state.board[index] = player.symbol;

        const winResult = checkWinner(this.state.board);
        if (winResult) {
            this.state.status = "FINISHED";
            this.state.winner = winResult.winner;
            this.state.winType = winResult.winType;
            this.state.winningLine = winResult.winningLine;
        } else if (isBoardFull(this.state.board)) {
            this.state.status = "FINISHED";
            this.state.winner = "DRAW";
        } else {
            this.state.turn = this.state.turn === "X" ? "O" : "X";
        }
        return true;
    }

    resetGame(): void {
        this.state.board = Array(9).fill(null) as BoardState;
        this.state.turn = "X";
        this.state.winner = null;
        this.state.winType = null;
        this.state.winningLine = null;
        this.state.status = this.state.players.length === 2 ? "PLAYING" : "WAITING";
    }
}
