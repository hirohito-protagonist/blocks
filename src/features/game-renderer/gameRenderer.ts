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

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawBoard(board: number[][]) {
    this.fillBlocksInBoard(board);
    this.addOutlinesToBoard(board);
  }

  drawBlock(block: { shape: number[][]; color: string; x: number; y: number }) {
    block.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = block.color;
          const currentX = block.x + x;
          const currentY = block.y + y;
          this.ctx.fillRect(currentX, currentY, 1, 1);
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

  private fillBlocksInBoard(board: number[][]) {
    board.forEach((row: number[], y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = '#711673';
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  private addOutlinesToBoard(board: number[][]) {
    const columns = board[0]?.length ?? 0;
    const rows = board.length;
    for (let i = 0; i < columns; i++) {
      this.ctx.fillStyle = '#511159';
      this.ctx.fillRect(i, 0, 0.025, this.ctx.canvas.height);
    }
    for (let i = 0; i < rows; i++) {
      this.ctx.fillStyle = '#511159';
      this.ctx.fillRect(0, i, this.ctx.canvas.width, 0.025);
    }
  }

  static forCanvas(
    ctx: CanvasRenderingContext2D,
    configuration: Configuration
  ): GameRenderer {
    return new GameRenderer(ctx, configuration);
  }
}
