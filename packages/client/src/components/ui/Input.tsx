import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string | null;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="w-full flex flex-col gap-1.5">
                {label && <label className="text-sm font-medium text-slate-400">{label}</label>}

                <input
                    ref={ref}
                    className={`w-full bg-slate-900 border rounded-lg px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-600 ${error ? "border-red-500 focus:border-red-500" : "border-slate-700 focus:border-indigo-500 hover:border-slate-600"}${className}`}
                    {...props}
                />

                {error && <span className="text-xs text-red-400">{error}</span>}
            </div>
        );
    },
);
