import React, { useRef } from 'react';
import {useCanvasRenderer} from "../../hooks/useCanvasRenderer.ts";

export const PreviewCanvas = React.memo(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useCanvasRenderer(canvasRef);

    return (
        <div className="relative w-[800px] h-[600px] bg-[#050505] border border-border shadow-2xl overflow-hidden select-none">
            <canvas ref={canvasRef} width={800} height={600} className="w-full h-full" />
            <div className="absolute inset-0 pointer-events-none border border-white/5 grid grid-cols-4 grid-rows-4 opacity-20">
                {[...Array(16)].map((_, i) => <div key={i} className="border border-white/10" />)}
            </div>
        </div>
    );
});