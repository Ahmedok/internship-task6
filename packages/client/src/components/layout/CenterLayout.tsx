import type { ReactNode } from "react";

interface CenterLayoutProps {
    children: ReactNode;
}

export function CenterLayout({ children }: CenterLayoutProps) {
    return (
        <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md flex flex-col items-center gap-6">{children}</div>
        </div>
    );
}
