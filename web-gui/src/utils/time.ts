export const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const remainingMs = Math.floor(ms % 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${remainingMs.toString().padStart(3, '0')}`;
};