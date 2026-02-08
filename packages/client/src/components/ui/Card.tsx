import type { ReactNode } from "react";

export function Card({ children, title }: { children: ReactNode; title?: string }) {
    return (
        <div className="w-full bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl shadow-black/20">
            {title && (
                <h2 className="text-2xl font-bold text-center mb-6 text-white tracking-tight">
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
}
