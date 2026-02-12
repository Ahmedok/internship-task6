import { useGameStorage } from "../store/game";
import { type PlayerSymbol } from "@task6/lib";

export function useTicTacToe() {
    const { gameState, playerId, makeMove, leaveGame, playAgain } = useGameStorage();

    if (!gameState) throw new Error("useTicTacToe must be only used when gameState exists");

    const me = gameState.players.find((p) => p.id === playerId);
    const opponent = gameState.players.find((p) => p.id !== playerId);

    const iVoted = gameState.rematchVotes.includes(playerId ?? "");
    const opponentVoted = gameState.rematchVotes.some((id) => id !== playerId);

    const mySymbol: PlayerSymbol | undefined = me?.symbol;
    const isMyTurn = gameState.turn === mySymbol && gameState.status === "PLAYING";
    const isGameOver = gameState.status === "FINISHED";

    const isWinner = mySymbol && gameState.winner === `${mySymbol}_WIN`;
    const isDraw = gameState.winner === "DRAW";

    const { text: statusText, color: statusColor } = (() => {
        if (gameState.status === "WAITING")
            return { text: "Waiting for opponent...", color: "neutral" };
        if (gameState.status === "ABORTED")
            return { text: "Opponent disconnected", color: "danger" };
        if (isGameOver) {
            if (isWinner) return { text: "YOU WON!", color: "success" };
            if (isDraw) return { text: "It's a Draw!", color: "neutral" };
            return { text: "You Lost", color: "danger" };
        }
        return isMyTurn
            ? { text: "Your Turn", color: "active" }
            : { text: `${opponent?.name ?? "Opponent"}'s Turn`, color: "neutral" };
    })();

    const handleCellClick = (index: number) => {
        if (!isMyTurn || isGameOver || gameState.board[index] !== null) return;
        makeMove(index);
    };

    return {
        roomId: gameState.roomId,
        board: gameState.board,
        winningLine: gameState.winningLine,
        mySymbol,
        opponentName: opponent?.name,

        isMyTurn,
        isGameOver,
        isWinner,

        statusText,
        statusColor,

        onCellClick: handleCellClick,
        onLeave: leaveGame,
        onPlayAgain: playAgain,

        rematchState: {
            iVoted,
            opponentVoted,
            buttonText: iVoted
                ? "Waiting for opponent..."
                : opponentVoted
                  ? "Accept Rematch!"
                  : "Play Again",
            isDisabled: iVoted,
        },
    };
}
