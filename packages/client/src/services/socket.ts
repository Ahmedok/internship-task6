import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@task6/lib";

const URL = import.meta.env.PROD ? undefined : "/";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
    autoConnect: false,
    reconnection: true,
    transports: ["websocket", "polling"],
});
