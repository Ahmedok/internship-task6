import { useState } from "react";
import { useGameStorage } from "../../store/game";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { CenterLayout } from "../layout/CenterLayout";

export function LobbyScreen() {
    const { joinGame, isConnecting, error, resetError } = useGameStorage();

    const [name, setName] = useState("");
    const [joinRoomId, setJoinRoomId] = useState("");

    const handleCreate = () => {
        if (!name.trim()) return;
        joinGame({ name }).catch((err: unknown) => {
            console.error("Failed to create game:", err);
        });
    };

    const handleJoin = () => {
        if (!name.trim() || !joinRoomId.trim()) return;
        joinGame({ name, roomId: joinRoomId }).catch((err: unknown) => {
            console.error("Failed to join game:", err);
        });
    };

    return (
        <CenterLayout>
            <Card title="Tic-Tac-Toe Online">
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (error) resetError();
                        }}
                    />
                    <Button onClick={handleCreate} disabled={!name.trim()} isLoading={isConnecting}>
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
                                setJoinRoomId(e.target.value);
                                if (error) resetError();
                            }}
                            className="font-mono text-center uppercase"
                        />
                        <Button
                            variant="secondary"
                            onClick={handleJoin}
                            disabled={!name.trim() || !joinRoomId.trim()}
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
                </div>
            </Card>
        </CenterLayout>
    );
}
