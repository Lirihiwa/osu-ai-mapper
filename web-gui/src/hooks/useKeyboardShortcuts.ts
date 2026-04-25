import { useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

export const useKeyboardShortcuts = () => {
    const isPlaying = useSettingsStore((s) => s.isPlaying);
    const setIsPlaying = useSettingsStore((s) => s.setIsPlaying);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeElement = document.activeElement;
            const isTyping =
                activeElement instanceof HTMLInputElement ||
                activeElement instanceof HTMLTextAreaElement;

            if (isTyping) return;

            if (e.code === 'Space') {
                e.preventDefault();
                setIsPlaying(!isPlaying);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, setIsPlaying]);
};