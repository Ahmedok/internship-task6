import { useState } from "react";
import type { PlayerSymbol, WinSide } from "@task6/lib";

export function useSessionScore(
    winner: WinSide | null,
    mySymbol: PlayerSymbol | undefined,
    opponentId: string | undefined,
) {
    const [score, setScore] = useState({ me: 0, opponent: 0 });
    const [lastProcessedWinner, setLastProcessedWinner] = useState<WinSide | null>(null);
    const [prevOpponentId, setPrevOpponentId] = useState(opponentId);

    if (opponentId !== prevOpponentId) {
        setPrevOpponentId(opponentId);
        setScore({ me: 0, opponent: 0 });
        setLastProcessedWinner(null);
    }

    if (!winner && lastProcessedWinner !== null) {
        setLastProcessedWinner(null);
    }

    if (winner && winner !== "DRAW" && winner !== lastProcessedWinner) {
        const amIWinner =
            (winner === "X_WIN" && mySymbol === "X") || (winner === "O_WIN" && mySymbol === "O");

        setScore((prev) => ({
            me: amIWinner ? prev.me + 1 : prev.me,
            opponent: amIWinner ? prev.opponent : prev.opponent + 1,
        }));

        setLastProcessedWinner(winner);
    }

    return score;
}
