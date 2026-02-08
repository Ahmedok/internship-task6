import type { PlayerSymbol } from "@task6/lib";

interface CellProps {
    value: PlayerSymbol | null;
    onClick: () => void;
    disabled?: boolean;
    isWinning?: boolean;
}

export function Cell({ value, onClick, disabled, isWinning }: CellProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled ?? value !== null}
            className={`h-24 sm:h-32 w-full rounded-xl text-5xl sm:text-6xl font-black flex items-center justify-center transition-all duration-300
                ${!value && !disabled ? "hover:bg-slate-700 cursor-pointer" : "cursor-default"}
                ${isWinning ? "bg-green-500/20 text-green-400 border-2 border-green-500" : "bg-slate-800 border-2 border-slate-700"}
                ${value === "X" ? "text-indigo-400" : "text-rose-400"}
                `}
        >
            <span
                className={
                    value
                        ? "scale-100 opacity-100 transition-all duration-200"
                        : "scale-50 opacity-0"
                }
            >
                {value}
            </span>
        </button>
    );
}
