import useSound from "use-sound";

const SOUNDS = {
    pop: "/sounds/pop.mp3",
    win: "/sounds/win.mp3",
    lose: "/sounds/lose.mp3",
};

export function useGameSounds() {
    const [playPop] = useSound(SOUNDS.pop, { volume: 0.08 });
    const [playWin] = useSound(SOUNDS.win, { volume: 0.8 });
    const [playLose] = useSound(SOUNDS.lose, { volume: 0.5 });

    return {
        playPop,
        playWin,
        playLose,
    };
}
