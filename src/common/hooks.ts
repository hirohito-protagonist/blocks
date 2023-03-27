import { useRef, useEffect } from 'react';

export const useGameLoop = (callback: (t: number) => void, deps: any[] = []) => {

  const requestRef = useRef<number>();

  const animate = (time: number) => {
    callback(time);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (typeof requestRef.current !== 'undefined') {
        cancelAnimationFrame(requestRef.current);
      }
    }
  }, deps);
};
