import React, { useRef, useEffect } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';

const OSU_WIDTH = 512;
// const OSU_HEIGHT = 384;

export const PreviewCanvas = React.memo(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Используем Ref для хранения индекса, чтобы не искать с начала массива каждый раз
    const lastIndexRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false }); // Отключаем альфа-канал для фона для скорости
        if (!ctx) return;

        let rafId: number;

        const render = () => {
            const state = useSettingsStore.getState();
            const { hitObjects, currentTime, ar, cs } = state;

            // 1. Очистка (заливка черным быстрее, чем clearRect)
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (!hitObjects || hitObjects.length === 0) {
                rafId = requestAnimationFrame(render);
                return;
            }

            const scale = canvas.width / OSU_WIDTH;
            const radius = (54.4 - 4.48 * cs) * scale;
            const preempt = ar > 5 ? 1200 - 750 * (ar - 5) / 5 : 1200 + 600 * (5 - ar) / 5;
            const fadeIn = 400;

            // 2. Оптимизированный поиск видимых объектов
            // Поскольку hitObjects отсортированы по времени, нам не нужен .filter()
            // Находим первый объект, который еще может быть виден
            let startIndex = 0;
            for (let i = lastIndexRef.current; i >= 0; i--) {
                if (hitObjects[i]?.time < currentTime - 300) {
                    startIndex = i + 1;
                    break;
                }
            }
            lastIndexRef.current = startIndex;

            // 3. Отрисовка
            for (let i = startIndex; i < hitObjects.length; i++) {
                const obj = hitObjects[i];
                const timeDiff = obj.time - currentTime;

                // Если объект слишком далеко в будущем — прекращаем цикл
                if (timeDiff > preempt) break;
                // Если объект уже давно прошел — пропускаем
                if (timeDiff < -300) continue;

                const x = obj.x * scale;
                const y = obj.y * scale;

                // Расчет прозрачности
                let opacity = 1;
                if (timeDiff > preempt - fadeIn) {
                    opacity = 1 - (timeDiff - (preempt - fadeIn)) / fadeIn;
                } else if (timeDiff < 0) {
                    opacity = 1 + (timeDiff / 300);
                }

                ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

                // Основной круг
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = obj.new_combo ? 'rgba(255, 204, 0, 0.3)' : 'rgba(255, 0, 102, 0.3)';
                ctx.fill();

                // Approach Circle
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
    }, []);

    return (
        <div className="relative w-[800px] h-[600px] bg-[#050505] border border-border shadow-2xl overflow-hidden select-none">
            <canvas ref={canvasRef} width={800} height={600} className="w-full h-full" />
            <div className="absolute inset-0 pointer-events-none border border-white/5 grid grid-cols-4 grid-rows-4 opacity-20">
                {[...Array(16)].map((_, i) => <div key={i} className="border border-white/10" />)}
            </div>
        </div>
    );
});