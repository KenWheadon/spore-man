import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

export function useGameLoop() {
    const { dispatch } = useGame();
    const requestRef = useRef<number | undefined>(undefined);
    const previousTimeRef = useRef<number | undefined>(undefined);

    const animate = (time: number) => {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = (time - previousTimeRef.current) / 1000; // Convert to seconds

            // Dispatch TICK action
            dispatch({ type: 'TICK', payload: { deltaTime } });
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [dispatch]);
}
