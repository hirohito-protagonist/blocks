import { ReactElement, useEffect, useRef, useState } from 'react';
import { GameRenderer } from './gameRenderer';

export const GameCanvasRenderer = ({
  width,
  height,
  blockSize,
  initialized,
}: {
  width: number;
  height: number;
  blockSize: number;
  initialized: (
    renderer: GameRenderer,
    ctx: CanvasRenderingContext2D
  ) => ReactElement;
}) => {
  const [ready, setReady] = useState(false);
  const canvasCntext = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<GameRenderer>(null);

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: HTMLCanvasElement = canvasCntext.current as HTMLCanvasElement;
    return canvas.getContext('2d') as CanvasRenderingContext2D;
  };

  useEffect(() => {
    if (canvasCntext.current !== null && renderer.current === null) {
      renderer.current = GameRenderer.forCanvas(getContext(), {
        width,
        height,
        blockSize,
      });
      setReady(true);
    }
  }, [canvasCntext.current, renderer.current]);

  return (
    <>
      <canvas ref={canvasCntext} />
      {ready === true && initialized(renderer.current, getContext())}
    </>
  );
};
