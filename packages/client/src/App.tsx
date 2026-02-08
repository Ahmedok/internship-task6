import { useEffect } from "react";
import { useGameStorage } from "./store/game";

function App() {
    const { connect, isConnected, playerId } = useGameStorage();

    useEffect(() => {
        connect();
    }, [connect]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Client debug</h1>
            <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
            <p>My ID: {playerId}</p>
        </div>
    );
}

export default App;
