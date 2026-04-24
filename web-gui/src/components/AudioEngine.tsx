import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

export const AudioEngine = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const rafRef = useRef<number>(null);

    const {
        fileId, isPlaying, currentTime,
        setIsPlaying, setCurrentTime, setDuration
    } = useSettingsStore();

    const updateProgress = () => {
        if (audioRef.current && isPlaying) {
            const time = audioRef.current.currentTime * 1000;
            setCurrentTime(time);
            rafRef.current = requestAnimationFrame(updateProgress);
        }
    };

    useEffect(() => {
        if (isPlaying) {
            rafRef.current = requestAnimationFrame(updateProgress);
        } else {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        }
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isPlaying]);

    useEffect(() => {
        if (fileId && audioRef.current) {
            audioRef.current.src = `http://localhost:8000/api/audio/${fileId}`;
            audioRef.current.load();
        }
    }, [fileId]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
        else audioRef.current.pause();
    }, [isPlaying]);

    useEffect(() => {
        if (!audioRef.current) return;
        const diff = Math.abs(audioRef.current.currentTime * 1000 - currentTime);
        if (diff > 200) {
            audioRef.current.currentTime = currentTime / 1000;
        }
    }, [currentTime]);

    const onLoadedMetadata = () => {
        if (audioRef.current) setDuration(audioRef.current.duration * 1000);
    };

    return (
        <audio
            ref={audioRef}
            onLoadedMetadata={onLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            preload="auto"
            className="hidden"
        />
    );
};