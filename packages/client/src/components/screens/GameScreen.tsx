import { useTicTacToe } from "../../hooks/useTicTacToe";
import { Board } from "../game/Board";
import { Cell } from "../game/Cell";
import { Button } from "../ui/Button";
import { CenterLayout } from "../layout/CenterLayout";
import { cn } from "../../lib/utils";
import { useState, useEffect, useRef } from "react";
import { Modal } from "../ui/Modal";
import { useGameSounds } from "../../hooks/useGameSounds";

export function GameScreen() {
    const game = useTicTacToe();

    const { playWin, playLose, playPop } = useGameSounds();
    const hasPlayedEndSound = useRef(false);

    const [copied, setCopied] = useState(false);

    const [showDelayedModal, setShowDelayedModal] = useState(false);

    useEffect(() => {
        if (game.isGameOver) {
            const timer = setTimeout(() => {
                setShowDelayedModal(true);
            }, 1500);
            return () => {
                clearTimeout(timer);
            };
        } else {
            const timer = setTimeout(() => {
                setShowDelayedModal(false);
            }, 0);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [game.isGameOver]);

    useEffect(() => {
        if (game.isGameOver && !hasPlayedEndSound.current) {
            if (game.isWinner) {
                playWin();
            } else {
                playLose();
            }
            hasPlayedEndSound.current = true;
        } else if (!game.isGameOver) hasPlayedEndSound.current = false;
    }, [game.isGameOver, game.isWinner, playWin, playLose]);

    const handleCopy = () => {
        game.copyRoomId();
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const modalVariant = game.isWinner
        ? "success"
        : game.statusColor === "danger"
          ? "danger"
          : "neutral";

    return (
        <CenterLayout>
            <Modal isOpen={showDelayedModal} title={game.statusText} variant={modalVariant}>
                <div className="flex flex-col gap-3 mt-2">
                    <p className="mb-4 text-sm opacity-80">
                        {game.isWinner
                            ? "Great job! Want to play again?"
                            : "Don't give up! Try again?"}
                    </p>
                    <Button
                        onClick={game.onPlayAgain}
                        className={cn(
                            "w-full transition-all",
                            !game.rematchState.iVoted &&
                                game.rematchState.opponentVoted &&
                                "bg-green-600 hover:bg-green-500 animate-pulse",
                        )}
                        disabled={game.rematchState.isDisabled}
                    >
                        {game.rematchState.buttonText}
                    </Button>
                    <Button variant="secondary" onClick={game.onLeave} className="w-full">
                        Back to Lobby
                    </Button>
                </div>
            </Modal>
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
                            {copied ? "Copied URL to clipboard" : "Copy to clipboard"}
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
                    game.isGameOver ? "opacity-0 pointer-events-none" : "opacity-100",
                    game.statusColor === "active" &&
                        "bg-indigo-600 text-white shadow-indigo-500/20 scale-105",
                    game.statusColor === "neutral" &&
                        "bg-slate-800 text-slate-400 border border-slate-700",
                )}
            >
                {game.statusText}
            </div>
            <Board winningLine={game.winningLine}>
                {game.board.map((cellValue, index) => {
                    const isWinningCell = Boolean(game.winningLine?.includes(index));

                    return (
                        <Cell
                            key={index}
                            value={cellValue}
                            isWinning={isWinningCell}
                            disabled={game.isGameOver || cellValue !== null}
                            onClick={() => {
                                playPop();
                                game.onCellClick(index);
                            }}
                        />
                    );
                })}
            </Board>
            <div className="w-full mt-8 flex flex-col gap-3">
                {!game.isGameOver && (
                    <div className="w-full mt-8">
                        <Button
                            variant="secondary"
                            onClick={game.onLeave}
                            className="opacity-50 hover:opacity-100 transition-opacity"
                        >
                            Leave Game
                        </Button>
                    </div>
                )}
            </div>
        </CenterLayout>
    );
}
