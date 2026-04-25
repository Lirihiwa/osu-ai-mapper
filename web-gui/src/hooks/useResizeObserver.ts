import { useState, useEffect, type RefObject } from 'react';

export const useResizeObserver = (ref: RefObject<HTMLElement | null>) => {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setSize({ width, height });
        });

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref]);

    return size;
};