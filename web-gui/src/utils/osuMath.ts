export const OsuMath = {
    PLAYFIELD_WIDTH: 512,
    PLAYFIELD_HEIGHT: 384,
    ASPECT_RATIO: 512 / 384,

    getRadius: (cs: number) =>
        54.4 - 4.48 * cs,

    getPreempt: (ar: number) =>
        ar > 5
        ? 1200 - 750 * (ar - 5) / 5
        : 1200 + 600 * (5 - ar) / 5,

    getFadeIn: (ar: number) => {
        const preempt = OsuMath.getPreempt(ar);
        if (ar > 5) return 400 * (1200 / preempt);
        return 800 * (1200 / preempt);
    }
};