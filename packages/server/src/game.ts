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

    public lastActivity: number;

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
            rematchVotes: [],
        };
        this.lastActivity = Date.now();
    }

    get publicState(): GameState {
        return {
            ...this.state,
            board: [...this.state.board],
            players: this.state.players.map((p) => ({ ...p })),
        };
    }

    get playerCount(): number {
        return this.state.players.length;
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

        this.lastActivity = Date.now();
        return true;
    }

    removePlayer(playerId: string): void {
        this.state.players = this.state.players.filter((p) => p.id !== playerId);

        if (this.state.players.length === 0) return;

        this.resetGame();

        if (this.state.players[0]) {
            this.state.players[0].symbol = "X";
        }

        this.lastActivity = Date.now();
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

        this.lastActivity = Date.now();
        return true;
    }

    touch(): void {
        this.lastActivity = Date.now();
    }

    resetGame(): void {
        this.state.board = Array(9).fill(null) as BoardState;
        this.state.turn = "X";
        this.state.winner = null;
        this.state.winType = null;
        this.state.winningLine = null;
        this.state.status = this.state.players.length === 2 ? "PLAYING" : "WAITING";
        this.state.rematchVotes = [];
    }

    voteRematch(playerId: string): void {
        if (this.state.rematchVotes.includes(playerId)) return;
        this.state.rematchVotes.push(playerId);

        if (
            this.state.rematchVotes.length >= this.state.players.length &&
            this.state.players.length > 0
        )
            this.resetGame();
    }
}
