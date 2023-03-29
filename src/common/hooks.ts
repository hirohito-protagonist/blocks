import { useRef, useEffect, useState } from 'react';

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


export const useKeyboard = (keyTarget: string): boolean => {
  const [keyPressed, setKeyPressed] = useState(false);
  const downHandler = ({ key }: KeyboardEvent) => {
    if (key === keyTarget) {
      setKeyPressed(true);
    }
  }
  
  const upHandler = ({ key }: KeyboardEvent) => {
    if (key === keyTarget) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);
  return keyPressed;
};