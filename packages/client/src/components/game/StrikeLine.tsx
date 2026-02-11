import { motion } from "framer-motion";

interface StrikeLineProps {
    winningLine: number[] | null;
}

export function StrikeLine({ winningLine }: StrikeLineProps) {
    if (!winningLine || winningLine.length < 3) return null;

    const getCoords = (line: number[]): [string, string, string, string] => {
        const s = line.join("");
        switch (s) {
            case "012":
                return ["5%", "16.6%", "95%", "16.6%"];
            case "345":
                return ["5%", "50%", "95%", "50%"];
            case "678":
                return ["5%", "83.3%", "95%", "83.3%"];
            case "036":
                return ["16.6%", "5%", "16.6%", "95%"];
            case "147":
                return ["50%", "5%", "50%", "95%"];
            case "258":
                return ["83.3%", "5%", "83.3%", "95%"];
            case "048":
                return ["5%", "5%", "95%", "95%"];
            case "246":
                return ["95%", "5%", "5%", "95%"];
            default:
                return ["0", "0", "0", "0"];
        }
    };

    const [x1, y1, x2, y2] = getCoords(winningLine);

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
            <motion.line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                className="text-green-400 opacity-90 filter drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]"
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut", delay: 0.15 }}
            />
        </svg>
    );
}
