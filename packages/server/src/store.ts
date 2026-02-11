import { Game } from "./game.js";

const CLEANUP_INTERVAL_MS = 60 * 1000; // 1 min
const STALE_DURATION_MS = 5 * 60 * 1000; // 5 min
const MAX_INACTIVITY_MS = 30 * 60 * 1000; // 30 min

export class GameStorage {
    private games = new Map<string, Game>();

    constructor() {
        setInterval(() => {
            this.cleanup();
        }, CLEANUP_INTERVAL_MS);
    }

    createGame(): Game {
        let roomId = this.generateRoomId();
        while (this.games.has(roomId)) {
            roomId = this.generateRoomId();
        }

        const game = new Game(roomId);
        this.games.set(roomId, game);
        return game;
    }

    findGame(roomId: string): Game | undefined {
        const game = this.games.get(roomId);
        if (game) game.touch();
        return game;
    }

    removeGame(roomId: string): boolean {
        return this.games.delete(roomId);
    }

    private generateRoomId(): string {
        return Math.random().toString(36).substring(2, 8);
    }

    private cleanup(): void {
        const now = Date.now();
        let deletedCount = 0;

        this.games.forEach((game, roomId) => {
            const inactiveDuration = now - game.lastActivity;

            const isEmptyAndStale = game.playerCount === 0 && inactiveDuration > STALE_DURATION_MS;
            const isTooOld = inactiveDuration > MAX_INACTIVITY_MS;

            if (isEmptyAndStale || isTooOld) {
                this.games.delete(roomId);
                deletedCount++;
            }
        });

        if (deletedCount > 0) {
            console.log(`Game Cleanup: Deleted ${deletedCount.toString()} stale games.`);
            console.log(`Game Stats: ${this.games.size.toString()} active games remaining.`);
        }
    }
}

export const gameStorage = new GameStorage();
