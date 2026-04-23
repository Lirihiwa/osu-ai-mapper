import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

export const HitSoundEngine = () => {
    const { hitObjects, currentTime, isPlaying } = useSettingsStore();

    // Web Audio API ресурсы
    const audioCtxRef = useRef<AudioContext | null>(null);
    const hitBufferRef = useRef<AudioBuffer | null>(null);
    const lastPlayedIndexRef = useRef<number>(-1);

    // 1. Загружаем hit.wav в память при старте
    useEffect(() => {
        const initAudio = async () => {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

            try {
                const response = await fetch('/hit.wav');
                const arrayBuffer = await response.arrayBuffer();
                hitBufferRef.current = await audioCtxRef.current.decodeAudioData(arrayBuffer);
                console.log("Hitsound loaded successfully");
            } catch (err) {
                console.error("Failed to load hitsound:", err);
            }
        };

        initAudio();
        return () => { audioCtxRef.current?.close(); };
    }, []);

    // 2. Функция воспроизведения
    const playHit = () => {
        if (!audioCtxRef.current || !hitBufferRef.current) return;

        // Создаем источник звука (нужно создавать каждый раз новый)
        const source = audioCtxRef.current.createBufferSource();
        source.buffer = hitBufferRef.current;

        // Узел громкости (чтобы не было слишком громко)
        const gainNode = audioCtxRef.current.createGain();
        gainNode.gain.value = 0.5; // Громкость 50%

        source.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);

        source.start(0);
    };

    // 3. Следим за временем и "кликаем" в нужный момент
    useEffect(() => {
        if (!isPlaying || !hitObjects.length) {
            // Если остановили музыку, сбрасываем индекс, чтобы при старте начать заново
            if (!isPlaying) {
                // Находим ближайший индекс к текущему времени, чтобы не играть старые звуки при перемотке
                const index = hitObjects.findIndex(obj => obj.time >= currentTime);
                lastPlayedIndexRef.current = index - 1;
            }
            return;
        }

        // Проверяем объекты, начиная с последнего проигранного
        for (let i = lastPlayedIndexRef.current + 1; i < hitObjects.length; i++) {
            const obj = hitObjects[i];

            // Если время объекта настало (или мы его чуть-чуть проскочили из-за лага)
            if (currentTime >= obj.time) {
                playHit();
                lastPlayedIndexRef.current = i;
            } else {
                // Поскольку объекты отсортированы, дальше можно не смотреть
                break;
            }
        }
    }, [currentTime, isPlaying, hitObjects]);

    return null; // Компонент ничего не рендерит
};