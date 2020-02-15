import { useRef, useEffect } from 'react';

export const useGameLoop = (callback: (t: number) => void, deps: any[] = []) => {

  const requestRef = useRef<number>();

  const animate = (time) => {
    callback(time);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, deps);
};
