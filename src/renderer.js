export class Renderer {
  constructor(canvas, tileSize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.tileSize = tileSize;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawTile(tile, selected = false) {
    const x = tile.x * this.tileSize;
    const y = tile.y * this.tileSize;

    // Draw tile
    this.ctx.fillStyle = tile.color;
    this.ctx.fillRect(x, y, this.tileSize - 2, this.tileSize - 2);

    // Draw selection
    if (selected) {
      this.ctx.strokeStyle = '#FFF';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(
        x + 2,
        y + 2,
        this.tileSize - 6,
        this.tileSize - 6
      );
    }
  }

  drawScore(score) {
    this.ctx.fillStyle = '#000';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${score}`, 10, this.canvas.height - 10);
  }
}