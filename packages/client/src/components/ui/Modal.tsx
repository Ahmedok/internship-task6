import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface ModalProps {
    isOpen: boolean;
    title: string;
    children: ReactNode;
    variant?: "neutral" | "success" | "danger";
}

export function Modal({ isOpen, title, children, variant = "neutral" }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={cn(
                                "w-full max-w-sm rounded-2xl p-6 shadow-2xl border flex flex-col items-center gap-4 text-center",
                                "bg-slate-900",
                                variant === "success" && "border-green-500/50 shadow-green-900/20",
                                variant === "danger" && "border-rose-500/50 shadow-rose-900/20",
                                variant === "neutral" && "border-slate-700 shadow-black/40",
                            )}
                        >
                            <h2
                                className={cn(
                                    "text-3xl font-black uppercase tracking-tight",
                                    variant === "success" && "text-green-400",
                                    variant === "danger" && "text-rose-400",
                                    variant === "neutral" && "text-white",
                                )}
                            >
                                {title}
                            </h2>

                            <div className="w-full text-slate-300">{children}</div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
