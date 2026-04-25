import React, { useRef, useMemo } from 'react';
import { useCanvasRenderer } from '../../hooks/useCanvasRenderer';
import { useResizeObserver } from '../../hooks/useResizeObserver';
import { OsuMath } from '../../utils/osuMath';

export const PreviewCanvas = React.memo(() => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const container = useResizeObserver(containerRef);

    const canvasSize = useMemo(() => {
        if (container.width === 0 || container.height === 0) return { w: 0, h: 0 };

        const padding = 40; // Небольшой отступ от краев
        const availableW = container.width - padding;
        const availableH = container.height - padding;

        let w, h;

        if (availableW / availableH > OsuMath.ASPECT_RATIO) {
            h = availableH;
            w = h * OsuMath.ASPECT_RATIO;
        } else {
            w = availableW;
            h = w / OsuMath.ASPECT_RATIO;
        }

        return { w: Math.floor(w), h: Math.floor(h) };
    }, [container.width, container.height]);

    useCanvasRenderer(canvasRef, canvasSize.w, canvasSize.h);

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-black/20">
            {canvasSize.w > 0 && (
                <div
                    className="relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-border bg-[#050505]"
                    style={{ width: canvasSize.w, height: canvasSize.h }}
                >
                    <canvas
                        ref={canvasRef}
                        width={canvasSize.w}
                        height={canvasSize.h}
                        className="block"
                    />

                    {/* Сетка (тоже 4x4) */}
                    <div className="absolute inset-0 pointer-events-none border border-white/5 grid grid-cols-4 grid-rows-4 opacity-20">
                        {[...Array(16)].map((_, i) => <div key={i} className="border border-white/10" />)}
                    </div>
                </div>
            )}
        </div>
    );
});