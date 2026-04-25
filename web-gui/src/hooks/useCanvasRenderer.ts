import React, { useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import {OsuMath} from "../utils/osuMath.ts";

export const useCanvasRenderer = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    width: number,
    height: number,
) => {
    const lastIndexRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || width === 0) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let rafId: number;

        const render = () => {
            const { hitObjects, currentTime, ar, cs } = useSettingsStore.getState();

            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, width, height);

            if (!hitObjects?.length) {
                rafId = requestAnimationFrame(render);
                return;
            }

            const scale = width / OsuMath.PLAYFIELD_WIDTH;
            const radius = OsuMath.getRadius(cs) * scale;
            const preempt = OsuMath.getPreempt(ar);
            const fadeIn = OsuMath.getFadeIn(ar);

            let startIndex = 0;
            for (let i = lastIndexRef.current; i >= 0; i--) {
                if (hitObjects[i]?.time < currentTime - 300) {
                    startIndex = i + 1;
                    break;
                }
            }
            lastIndexRef.current = startIndex;

            for (let i = startIndex; i < hitObjects.length; i++) {
                const obj = hitObjects[i];
                const timeDiff = obj.time - currentTime;

                if (timeDiff > preempt) break;
                if (timeDiff < -300) continue;

                const x = obj.x * scale;
                const y = obj.y * scale;

                let opacity = 1;
                if (timeDiff > preempt - fadeIn) {
                    opacity = 1 - (timeDiff - (preempt - fadeIn)) / fadeIn;
                } else if (timeDiff < 0) {
                    opacity = 1 + (timeDiff / 300);
                }

                ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = obj.new_combo ? 'rgba(255, 204, 0, 0.3)' : 'rgba(255, 0, 102, 0.3)';
                ctx.fill();

                if (timeDiff > 0) {
                    const approachScale = 1 + (timeDiff / preempt) * 2;
                    ctx.beginPath();
                    ctx.arc(x, y, radius * approachScale, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }

            ctx.globalAlpha = 1.0;
            rafId = requestAnimationFrame(render);
        };

        rafId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(rafId);
    }, [canvasRef, width, height]);
};