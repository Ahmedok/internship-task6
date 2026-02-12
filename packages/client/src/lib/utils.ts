import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function copyRoomId(text = "", url?: boolean): Promise<boolean> {
    let textToCopy = "";
    if (url) {
        textToCopy = `${window.location.origin}/?room=${text}`;
    } else {
        textToCopy = text;
    }

    // Try modern Clipboard API
    try {
        await navigator.clipboard.writeText(textToCopy);
        return true;
    } catch (err: unknown) {
        console.warn("Clipboard API failed, trying fallback:", err);
    }

    // Fallback
    try {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        return successful;
    } catch (err: unknown) {
        console.error("Failed to copy:", err);
        return false;
    }
}
