import { useState, useEffect } from "react";
import { useGameStorage } from "../../store/game";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { CenterLayout } from "../layout/CenterLayout";
import { motion } from "framer-motion";

function getInitialRoomId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("room") ?? "";
}

export function LobbyScreen() {
    const { connect, joinLobby, joinGame, isConnecting, error, resetError, lobbyGames } =
        useGameStorage();

    const [name, setName] = useState("");
    const [joinRoomId, setJoinRoomId] = useState(getInitialRoomId());

    const [nameError, setNameError] = useState(false);

    const validateName = (): boolean => {
        if (!name.trim()) {
            setNameError(true);
            navigator.vibrate(50);
            return false;
        }
        if (name.length > 12) return false;

        return true;
    };

    useEffect(() => {
        connect();
        joinLobby();
    }, [connect, joinLobby]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.has("room")) {
            window.history.replaceState({}, "", window.location.pathname);
        }
    }, []);

    const handleCreate = () => {
        if (!validateName()) return;
        joinGame({ name }).catch((err: unknown) => {
            console.error("Failed to create game:", err);
        });
    };

    const handleJoin = () => {
        if (!validateName() || !joinRoomId.trim()) return;
        joinGame({ name, roomId: joinRoomId.toLowerCase() }).catch((err: unknown) => {
            console.error("Failed to join game:", err);
        });
    };

    const handleFastPlay = () => {
        if (!validateName()) return;
        joinGame({ name: name || "Guest", roomId: "FAST_PLAY" }).catch((err: unknown) => {
            console.error("Failed to join fast play:", err);
        });
    };

    const handleQuickJoin = (roomId: string) => {
        if (!validateName()) return;
        joinGame({ name, roomId }).catch((err: unknown) => {
            console.error("Failed to quick join:", err);
        });
    };

    return (
        <CenterLayout>
            <Card title="Tic-Tac-Toe Online">
                <div className="flex flex-col gap-4">
                    <motion.div
                        animate={nameError ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                        <Input
                            placeholder="Enter your name"
                            value={name}
                            maxLength={12}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (nameError) setNameError(false);
                                if (error) resetError();
                            }}
                            error={nameError ? "Name is required to play!" : null}
                        />
                    </motion.div>
                    <Button onClick={handleCreate} disabled={isConnecting} isLoading={isConnecting}>
                        Create New Game
                    </Button>

                    <div className="relative flex items-center py-2">
                        <div className="grow border-t border-slate-700"></div>
                        <span className="shrink-0 mx-4 text-slate-500 text-sm">OR JOIN</span>
                        <div className="grow border-t border-slate-700"></div>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Room ID"
                            value={joinRoomId}
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase().replace(/\s/g, "");
                                setJoinRoomId(value);
                                if (error) resetError();
                            }}
                            className="font-mono text-center uppercase tracking-widest"
                            maxLength={6}
                        />
                        <Button
                            variant="secondary"
                            onClick={handleJoin}
                            disabled={isConnecting}
                            isLoading={isConnecting}
                            className="w-1/3"
                        >
                            Join
                        </Button>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <div className="w-full mt-6">
                        <div className="relative flex items-center py-2 mb-4">
                            <div className="grow border-t border-slate-700"></div>
                            <span className="shrink-0 mx-4 text-slate-500 text-xs uppercase">
                                Quick Match
                            </span>
                            <div className="grow border-t border-slate-700"></div>
                        </div>

                        <Button
                            variant="secondary"
                            onClick={handleFastPlay}
                            disabled={isConnecting}
                            className="mb-4 bg-linear-to-r from-indigo-900 to-slate-800 border border-indigo-500/30"
                            isLoading={isConnecting}
                        >
                            Fast Play (Random)
                        </Button>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {lobbyGames.length === 0 ? (
                                <div className="text-center text-slate-600 text-xs py-4">
                                    No active lobbies. Be the first!
                                </div>
                            ) : (
                                lobbyGames.map((game) => (
                                    <div
                                        key={game.roomId}
                                        className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-300">
                                                {game.players[0]?.name}'s Game
                                            </span>
                                            <span className="text-xs text-slate-500 font-mono">
                                                ID: {game.roomId}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                handleQuickJoin(game.roomId);
                                            }}
                                            disabled={isConnecting}
                                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Join
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="my-2 border-t border-slate-700/50"></div>

                    {/* Instructions */}
                    <div className="text-xs text-slate-400 space-y-2 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                        <h3 className="font-bold text-slate-300 uppercase tracking-wider mb-1">
                            How to play:
                        </h3>
                        <ul className="list-disc list-inside space-y-1 ml-1">
                            <li>
                                <span className="text-indigo-400 font-medium">Create</span> a game
                                and share the Room (by clicking on the ID).
                            </li>
                            <li>
                                Or <span className="text-rose-400 font-medium">join</span> a friend
                                using their Room ID.
                            </li>
                            <li>
                                Win by lining up <strong>3 symbols</strong>.
                            </li>
                            <li>
                                Both players must agree for a <strong>Rematch</strong>!
                            </li>
                        </ul>
                    </div>
                </div>
            </Card>
        </CenterLayout>
    );
}
