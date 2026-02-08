import type { ReactNode } from "react";

export function Board({ children }: { children: ReactNode }) {
    return <div className="grid grid-cols-3 gap-3 w-full max-w-100 mx-auto">{children}</div>;
}
