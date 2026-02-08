import { useEffect } from "react";
import { useGameStorage } from "./store/game";
import { LobbyScreen } from "./components/screens/LobbyScreen";
import { GameScreen } from "./components/screens/GameScreen";

function App() {
    const { connect, gameState } = useGameStorage();

    useEffect(() => {
        connect();
    }, [connect]);

    return <main className="antialiased">{gameState ? <GameScreen /> : <LobbyScreen />}</main>;
}

export default App;
