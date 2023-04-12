import { GameRenderer } from './gameRenderer';

describe('GameRenderer', () => {
  const createRenderContext = (): Partial<CanvasRenderingContext2D> => {
    return {
      fillStyle: '',
      fillRect: jest.fn(),
      font: '',
      fillText: jest.fn(),
    } as Partial<CanvasRenderingContext2D>;
  };

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
});
