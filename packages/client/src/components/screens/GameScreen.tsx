import { useTicTacToe } from "../../hooks/useTicTacToe";
import { Board } from "../game/Board";
import { Cell } from "../game/Cell";
import { Button } from "../ui/Button";
import { CenterLayout } from "../layout/CenterLayout";
import { cn } from "../../lib/utils";
import { useState } from "react";

export function GameScreen() {
    const game = useTicTacToe();

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        game.copyRoomId();
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <CenterLayout>
            <div className="w-full flex justify-between items-center text-slate-400 mb-4">
                <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider">Room ID</span>
                    <button
                        onClick={handleCopy}
                        className="font-mono text-white hover:text-indigo-400 transition-colors text-left flex items-center gap-2"
                    >
                        {game.roomId}
                        <span
                            className={cn(
                                "text-xs transition-opacity",
                                copied
                                    ? "opacity-100 text-green-400"
                                    : "opacity-0 group-hover:opacity-50",
                            )}
                        >
                            {copied ? "Copied!" : "Copy"}
                        </span>
                    </button>
                </div>
                <div className="text-right">
                    <span className="text-xs uppercase tracking-wider block">You are</span>
                    <span
                        className={cn(
                            "text-2xl font-bold",
                            game.mySymbol === "X" ? "text-indigo-400" : "text-rose-400",
                        )}
                    >
                        {game.mySymbol}
                    </span>
                </div>
            </div>
            <div
                className={cn(
                    "w-full py-4 rounded-xl text-center font-bold text-xl mb-6 transition-all duration-300 shadow-lg",
                    game.statusColor === "active" &&
                        "bg-indigo-600 text-white shadow-indigo-500/20 scale-105",
                    game.statusColor === "success" &&
                        "bg-green-600 text-white shadow-green-500/20 scale-110",
                    game.statusColor === "danger" && "bg-rose-600 text-white shadow-rose-500/20",
                    game.statusColor === "neutral" &&
                        "bg-slate-800 text-slate-400 border border-slate-700",
                )}
            >
                {game.statusText}
            </div>
            <Board>
                {game.board.map((cellValue, index) => {
                    const isWinningCell = Boolean(game.winningLine?.includes(index));

                    return (
                        <Cell
                            key={index}
                            value={cellValue}
                            isWinning={isWinningCell}
                            disabled={game.isGameOver || cellValue !== null}
                            onClick={() => {
                                game.onCellClick(index);
                            }}
                        />
                    );
                })}
            </Board>
            <div className="w-full mt-8 flex flex-col gap-3">
                {game.isGameOver && (
                    <Button onClick={game.onPlayAgain} className="animate-bounce">
                        Play Again
                    </Button>
                )}

                <Button variant="secondary" onClick={game.onLeave}>
                    Leave Game
                </Button>
            </div>
        </CenterLayout>
    );
}
