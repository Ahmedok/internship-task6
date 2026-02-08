import { useGameStorage } from "../../store/game";
import { Board } from "../game/Board";
import { Cell } from "../game/Cell";
import { Button } from "../ui/Button";
import { CenterLayout } from "../layout/CenterLayout";
import { cn } from "../../lib/utils";
import type { PlayerSymbol } from "@task6/lib";

export function GameScreen() {
    const { gameState, playerId, makeMove, leaveGame, playAgain } = useGameStorage();

    if (!gameState) return null;

    const me = gameState.players.find((p) => p.id === playerId);
    const opponent = gameState.players.find((p) => p.id !== playerId);

    const mySymbol: PlayerSymbol | undefined = me?.symbol;
    const isMyTurn = gameState.turn === mySymbol && gameState.status === "PLAYING";
    const isGameOver = gameState.status === "FINISHED";

    const isWinner = mySymbol && gameState.winner === `${mySymbol}_WIN`;
    const isDraw = gameState.winner === "DRAW";

    const getStatusText = (): string => {
        if (gameState.status === "WAITING") return "Waiting for opponent...";
        if (isGameOver) {
            if (isWinner) return "YOU WON!";
            if (isDraw) return "It's a Draw!";
            return "You Lost";
        }
        return isMyTurn ? "Your Turn" : `${opponent?.name ?? "Opponent"}'s Turn`;
    };

    const copyRoomId = () => {
        navigator.clipboard
            .writeText(gameState.roomId)
            .then(() => {
                alert("Room ID copied to clipboard!");
            })
            .catch((err: unknown) => {
                console.error("Failed to copy:", err);
                alert("Failed to copy Room ID");
            });
    };

    return (
        <CenterLayout>
            <div className="w-full flex justify-between items-center text-slate-400 mb-4">
                <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider">Room ID</span>
                    <button
                        onClick={copyRoomId}
                        className="font-mono text-white hover:text-indigo-400 transition-colors text-left flex items-center gap-2"
                    >
                        {gameState.roomId}
                    </button>
                </div>
                <div className="text-right">
                    <span className="text-xs uppercase tracking-wider block">You are</span>
                    <span
                        className={cn(
                            "text-2xl font-bold",
                            mySymbol === "X" ? "text-indigo-400" : "text-rose-400",
                        )}
                    >
                        {mySymbol}
                    </span>
                </div>
            </div>
            <div
                className={cn(
                    "w-full py-4 rounded-xl text-center font-bold text-xl mb-6 transition-all duration-300",
                    isMyTurn
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-105"
                        : "bg-slate-800 text-slate-400",
                )}
            >
                {getStatusText()}
            </div>
            <Board>
                {gameState.board.map((cellValue, index) => {
                    const isWinningCell = Boolean(gameState.winningLine?.includes(index));

                    return (
                        <Cell
                            key={index}
                            value={cellValue}
                            isWinning={isWinningCell}
                            disabled={!isMyTurn || isGameOver}
                            onClick={() => {
                                makeMove(index);
                            }}
                        />
                    );
                })}
            </Board>
            <div className="w-full mt-8 flex flex-col gap-3">
                {isGameOver && (
                    <Button
                        onClick={() => {
                            playAgain();
                        }}
                        className="animate-bounce"
                    >
                        Play Again
                    </Button>
                )}

                <Button
                    variant="secondary"
                    onClick={() => {
                        leaveGame();
                    }}
                >
                    Leave Game
                </Button>
            </div>
        </CenterLayout>
    );
}
