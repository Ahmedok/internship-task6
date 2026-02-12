import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { useState } from "react";
import { cn, copyRoomId } from "../../lib/utils";

interface WaitingOverlayProps {
    roomId: string;
}

export function WaitingOverlay({ roomId }: WaitingOverlayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyBtn = () => {
        copyRoomId(roomId);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4"
        >
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-xl" />

            <div className="relative z-30 flex flex-col items-center gap-6 text-center">
                <div className="relative">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center"
                    >
                        <div className="w-3 h-3 bg-indigo-400 rounded-full animate-ping" />
                    </motion.div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Waiting for an opponent...</h2>
                    <p className="text-slate-400 text-sm">Share this Room ID to invite a friend</p>
                </div>

                <Button
                    onClick={handleCopyBtn}
                    className="group relative flex items-center gap-3 px-6 py-4 bg-slate-800 border-2 border-slate-700 rounded-xl hover:border-indigo-500 transition-all active:scale-95"
                >
                    <span className="font-mono text-2xl font-bold tracking-widest text-white">
                        {roomId}
                    </span>
                    <span
                        className={cn(
                            "absolute -top-3 -right-3 px-2 py-1 text-xs font-bold rounded-full transition-all shadow-lg",
                            copied
                                ? "bg-green-500 text-white scale-100"
                                : "bg-indigo-500 text-white scale-0 group-hover:scale-100",
                        )}
                    >
                        {copied ? "COPIED ID!" : "COPY ID"}
                    </span>
                </Button>

                <p className="text-xl text-slate-500 opacity-70">
                    Game will start automatically when an opponent joins
                </p>
            </div>
        </motion.div>
    );
}
