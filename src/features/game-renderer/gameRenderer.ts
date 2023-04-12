type Configuration = {
  width: number;
  height: number;
  blockSize: number;
};

export class GameRenderer {
  private constructor(
    private ctx: CanvasRenderingContext2D,
    private configuration: Configuration
  ) {}

  gameOver() {
    if (this.ctx !== null) {
      this.ctx.fillStyle = '#711673';
      this.ctx.fillRect(1, 3, 8, 1.2);
      this.ctx.font = '1px Arial';
      this.ctx.fillStyle = 'white';
      this.ctx.fillText('GAME OVER', 1.8, 4);
    }
  }

  static forCanvas(
    ctx: CanvasRenderingContext2D,
    configuration: Configuration
  ): GameRenderer {
    return new GameRenderer(ctx, configuration);
  }
}
