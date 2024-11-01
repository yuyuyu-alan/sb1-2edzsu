export class Renderer {
  constructor(canvas, tileSize, offsetX, offsetY) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.tileSize = tileSize
    this.offsetX = offsetX
    this.offsetY = offsetY
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawBackground() {
    // 绘制游戏背景
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    this.ctx.fillRect(
      this.offsetX - 10,
      this.offsetY - 10,
      this.tileSize * 8 + 20,
      this.tileSize * 8 + 20
    )
  }

  drawTile(tile, selected = false) {
    const x = this.offsetX + tile.x * this.tileSize
    const y = this.offsetY + tile.y * this.tileSize

    // 绘制方块背景
    this.ctx.fillStyle = '#fff'
    this.ctx.fillRect(
      x + 1,
      y + 1,
      this.tileSize - 2,
      this.tileSize - 2
    )

    // 绘制方块
    this.ctx.fillStyle = tile.color
    const padding = this.tileSize * 0.1
    this.ctx.fillRect(
      x + padding,
      y + padding,
      this.tileSize - padding * 2,
      this.tileSize - padding * 2
    )

    // 绘制选中效果
    if (selected) {
      this.ctx.strokeStyle = '#fff'
      this.ctx.lineWidth = 3
      this.ctx.strokeRect(
        x + padding - 2,
        y + padding - 2,
        this.tileSize - padding * 2 + 4,
        this.tileSize - padding * 2 + 4
      )
    }
  }

  drawScore(score) {
    const highScore = wx.getStorageSync('highScore') || 0
    
    this.ctx.fillStyle = '#000'
    this.ctx.font = 'bold 20px Arial'
    this.ctx.textAlign = 'center'
    
    // 绘制当前分数
    this.ctx.fillText(
      `分数: ${score}`,
      this.canvas.width / 2,
      this.offsetY - 30
    )
    
    // 绘制最高分
    this.ctx.fillText(
      `最高分: ${highScore}`,
      this.canvas.width / 2,
      this.offsetY - 60
    )
  }
}