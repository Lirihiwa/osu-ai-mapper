import React, { useRef, memo } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import {useTimelineSync} from "../../hooks/useTimelineSync.ts";
import {formatTime} from "../../utils/time.ts";
import {useTranslation} from "react-i18next";

const RhythmMarkers = memo(({ onsets, duration }: { onsets: number[] | null, duration: number }) => {
    if (!onsets || duration === 0) return null;
    return (
        <>
            {onsets.map((timeSec, index) => {
                const position = (timeSec * 1000 / duration) * 100;
                if (position > 100) return null;
                return (
                    <div
                        key={index}
                        className="absolute top-0 bottom-0 w-[1px] bg-accent/20 pointer-events-none"
                        style={{ left: `${position}%` }}
                    />
                );
            })}
        </>
    );
});

export const Timeline = () => {
    const { onsets, duration, isPlaying, setIsPlaying, setCurrentTime } = useSettingsStore();
    const {t} = useTranslation();

    const containerRef = useRef<HTMLDivElement>(null);

    const playHeadRef = useRef<HTMLDivElement>(null);
    const timeTextRef = useRef<HTMLSpanElement>(null);

    useTimelineSync(playHeadRef, timeTextRef);

    const handleTimelineClick = (e: React.MouseEvent) => {
        if (!containerRef.current || duration === 0) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        setCurrentTime(percentage * duration);
    };

    return (
        <div className="h-full w-full bg-sidebar flex flex-col select-none">
            <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-studio/30">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-accent text-2xl hover:scale-110 transition-transform cursor-pointer"
                    >
                        {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                    </button>
                    <div className="font-mono text-sm tracking-tighter">
                        <span ref={timeTextRef} className="text-foreground">00:00:000</span>
                        <span className="text-foreground-muted mx-2">/</span>
                        <span className="text-foreground-muted">{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="text-[10px] uppercase font-bold text-foreground-muted tracking-widest">
                    {onsets ? `${t("timeline.rhythm")} (${onsets.length})` : t("timeline.no_data")}
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden p-4">
                <div
                    ref={containerRef}
                    onClick={handleTimelineClick}
                    className="w-full h-full bg-studio border border-border relative cursor-crosshair group overflow-hidden"
                >
                    <RhythmMarkers onsets={onsets} duration={duration} />

                    <div
                        ref={playHeadRef}
                        className="absolute top-0 bottom-0 z-20 shadow-[0_0_10px_rgba(255,0,102,0.8)] pointer-events-none"
                        style={{
                            left: '0%',
                            width: '2px',
                            backgroundColor: 'var(--color-accent)',
                        }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rotate-45 -mt-1.5" />
                    </div>

                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                </div>
            </div>
        </div>
    );
};