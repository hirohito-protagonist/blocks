import { GameRenderer } from './gameRenderer';

describe('GameRenderer', () => {
  const createRenderContext = (): Partial<CanvasRenderingContext2D> => {
    return {
      canvas: {
        width: 0,
        height: 0,
      } as unknown,
      fillStyle: '',
      fillRect: jest.fn(),
      font: '',
      fillText: jest.fn(),
      scale: jest.fn(),
    } as Partial<CanvasRenderingContext2D>;
  };

  it('should setup canvas from configuration', () => {
    // Given
    const ctx = createRenderContext();

    // When
    GameRenderer.forCanvas(ctx as CanvasRenderingContext2D, {
      width: 200,
      height: 100,
      blockSize: 10,
    });

    // Then
    expect(ctx.canvas.width).toEqual(200);
    expect(ctx.canvas.height).toEqual(100);
    expect(ctx.scale).toHaveBeenCalled();
    expect(ctx.scale).toHaveBeenCalledWith(10, 10);
  });

  it('should render game over', () => {
    // Given
    const ctx = createRenderContext();
    const renderer = GameRenderer.forCanvas(ctx as CanvasRenderingContext2D, {
      width: 0,
      height: 0,
      blockSize: 0,
    });

    // When
    renderer.gameOver();

    // Then
    expect(ctx.fillRect).toHaveBeenCalled();
    expect(ctx.fillText).toHaveBeenCalled();
  });

  it('should render block in board', () => {
    // Given
    const ctx = createRenderContext();
    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 1, 1],
    ];
    const renderer = GameRenderer.forCanvas(ctx as CanvasRenderingContext2D, {
      width: 0,
      height: 0,
      blockSize: 0,
    });

    // When
    renderer.fillBlocksInBoard(board);

    // Then
    expect(ctx.fillRect).toHaveBeenCalledTimes(6);
  });
});
