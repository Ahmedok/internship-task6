import type { ReactNode } from "react";
import { StrikeLine } from "./StrikeLine";

interface BoardProps {
    children: ReactNode;
    winningLine: readonly number[] | null;
}

export function Board({ children, winningLine }: BoardProps) {
    return (
        <div className="grid grid-cols-3 gap-3 w-full max-w-100 mx-auto relative">
            {children}
            <StrikeLine winningLine={winningLine} />
        </div>
    );
}
