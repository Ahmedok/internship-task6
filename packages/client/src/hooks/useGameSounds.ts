import useSound from "use-sound";

const SOUNDS = {
    pop: "/sounds/pop.mp3",
    win: "/sounds/win.mp3",
    lose: "/sounds/lose.mp3",
    draw: "/sounds/draw.mp3",
};

export function useGameSounds() {
    const [playPop] = useSound(SOUNDS.pop, { volume: 0.08 });
    const [playOpponentPop] = useSound(SOUNDS.pop, { volume: 0.08, playbackRate: 0.75 });

    const [playWin] = useSound(SOUNDS.win, { volume: 0.8 });
    const [playLose] = useSound(SOUNDS.lose, { volume: 0.5 });
    const [playDraw] = useSound(SOUNDS.draw, { volume: 0.4 });

    return {
        playPop,
        playOpponentPop,
        playWin,
        playLose,
        playDraw,
    };
}
