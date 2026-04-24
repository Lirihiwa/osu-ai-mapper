import { useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { shallow } from 'zustand/shallow';
import {formatTime} from "../utils/time.ts";

export const useTimelineSync = (
    playHeadRef: React.RefObject<HTMLDivElement | null>,
    timeTextRef: React.RefObject<HTMLSpanElement | null>
) => {
    useEffect(() => {
        const unsubscribe = useSettingsStore.subscribe(
            (state) => ({ currentTime: state.currentTime, duration: state.duration }),
            (val) => {
                if (val.duration === 0) return;
                if (playHeadRef.current) {
                    const pos = (val.currentTime / val.duration) * 100;
                    playHeadRef.current.style.left = `${pos}%`;
                }
                if (timeTextRef.current) {
                    timeTextRef.current.innerText = formatTime(val.currentTime);
                }
            },
            { equalityFn: shallow }
        );
        return () => unsubscribe();
    }, [playHeadRef, timeTextRef]);
};