import type { PlayerSymbol } from "@task6/lib";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

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
            className={cn(
                "h-24 sm:h-32 w-full rounded-xl flex items-center justify-center relative overflow-hidden",
                "transition-colors duration-300 border-2",
                !value && !disabled && "hover:bg-slate-700 cursor-pointer active:bg-slate-600",
                (value ?? disabled) && "cursor-default",
                isWinning ? "bg-green-500/20 border-green-500" : "bg-slate-800 border-slate-700",
            )}
        >
            {value && (
                <motion.span
                    initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={cn(
                        "text-5xl sm:text-6xl font-black select-none",
                        value === "X" ? "text-indigo-400" : "text-rose-400",
                        isWinning && "text-green-400",
                    )}
                >
                    {value}
                </motion.span>
            )}
        </button>
    );
}
