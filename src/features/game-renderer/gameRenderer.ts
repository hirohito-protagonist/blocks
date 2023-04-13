type Configuration = {
  width: number;
  height: number;
  blockSize: number;
};

export class GameRenderer {
  private constructor(
    private ctx: CanvasRenderingContext2D,
    private configuration: Configuration
  ) {
    this.ctx.canvas.width = configuration.width;
    this.ctx.canvas.height = configuration.height;
    this.ctx.scale(configuration.blockSize, configuration.blockSize);
  }

  fillBlocksInBoard(board: number[][]) {
    board.forEach((row: number[], y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = '#711673';
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  gameOver() {
    this.ctx.fillStyle = '#711673';
    this.ctx.fillRect(1, 3, 8, 1.2);
    this.ctx.font = '1px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('GAME OVER', 1.8, 4);
  }

  static forCanvas(
    ctx: CanvasRenderingContext2D,
    configuration: Configuration
  ): GameRenderer {
    return new GameRenderer(ctx, configuration);
  }
}
