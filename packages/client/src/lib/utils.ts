import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function copyRoomId(text = "", url?: boolean) {
    let textToCopy = "";
    if (url) {
        textToCopy = `${window.location.origin}/?room=${text}`;
    } else {
        textToCopy = text;
    }

    navigator.clipboard.writeText(textToCopy).catch((err: unknown) => {
        console.error("Failed to copy:", err);
    });
    return true;
}
