import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

export const HitSoundEngine = () => {
    const { hitObjects, currentTime, isPlaying } = useSettingsStore();

    const audioCtxRef = useRef<AudioContext | null>(null);
    const hitBufferRef = useRef<AudioBuffer | null>(null);
    const lastPlayedIndexRef = useRef<number>(-1);

    const lastTimeRef = useRef<number>(0);

    useEffect(() => {
        const initAudio = async () => {
            const Context = window.AudioContext || (window as any).webkitAudioContext;
            audioCtxRef.current = new Context({
                latencyHint: 'interactive',
            });

            try {
                const response = await fetch('/hit.wav');
                const arrayBuffer = await response.arrayBuffer();
                hitBufferRef.current = await audioCtxRef.current.decodeAudioData(arrayBuffer);
            } catch (err) {
                console.error("Hitsound error:", err);
            }
        };

        initAudio();
        return () => { audioCtxRef.current?.close(); };
    }, []);

    const playHit = async (timeDelay: number = 0) => {
        const ctx = audioCtxRef.current;
        if (!ctx || !hitBufferRef.current || ctx.state === 'closed') return;
        if (ctx.state === 'suspended') await ctx.resume();

        const source = ctx.createBufferSource();
        source.buffer = hitBufferRef.current;
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(1.5, ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(ctx.currentTime + timeDelay);
        source.onended = () => {
            source.disconnect();
            gainNode.disconnect();
        };
    };

    useEffect(() => {
        if (!hitObjects.length) return;

        const timeDiff = Math.abs(currentTime - lastTimeRef.current);

        if (timeDiff > 100) {
            const newIndex = hitObjects.findIndex(obj => obj.time >= currentTime);

            if (newIndex === -1) {
                lastPlayedIndexRef.current = hitObjects.length;
            } else {
                lastPlayedIndexRef.current = newIndex - 1;
            }

            // console.log("Seek detected, syncing index...");
        }

        lastTimeRef.current = currentTime;

        if (!isPlaying) return;

        const lookAhead = 16;

        for (let i = lastPlayedIndexRef.current + 1; i < hitObjects.length; i++) {
            const obj = hitObjects[i];

            if (!obj) continue;

            const timeUntilHit = obj.time - currentTime;

            if (timeUntilHit <= lookAhead && timeUntilHit > -50) {
                const delay = Math.max(0, timeUntilHit / 1000);
                playHit(delay);
                lastPlayedIndexRef.current = i;
            } else if (timeUntilHit > lookAhead) {
                break;
            } else if (timeUntilHit <= -50) {
                lastPlayedIndexRef.current = i;
            }
        }
    }, [currentTime, isPlaying, hitObjects]);

    return null;
};