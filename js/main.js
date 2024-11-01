import { Grid } from './grid'
import { Renderer } from './renderer'

export class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    
    // 获取设备信息以适配不同屏幕
    const { windowWidth, windowHeight } = wx.getSystemInfoSync()
    this.canvas.width = windowWidth
    this.canvas.height = windowHeight
    
    this.gridSize = 8
    this.tileSize = Math.floor(windowWidth / 10) // 动态计算方块大小
    this.score = 0
    this.selected = null
    
    // 计算网格的起始位置，使其居中
    this.offsetX = (windowWidth - this.gridSize * this.tileSize) / 2
    this.offsetY = (windowHeight - this.gridSize * this.tileSize) / 2
    
    this.grid = new Grid(this.gridSize)
    this.renderer = new Renderer(canvas, this.tileSize, this.offsetX, this.offsetY)
    
    this.bindEvents()
    this.draw()
  }

  bindEvents() {
    wx.onTouchStart((e) => {
      const touch = e.touches[0]
      // 将触摸坐标转换为网格坐标
      const x = Math.floor((touch.clientX - this.offsetX) / this.tileSize)
      const y = Math.floor((touch.clientY - this.offsetY) / this.tileSize)
      
      if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
        this.handleClick(x, y)
      }
    })
  }

  handleClick(x, y) {
    if (!this.selected) {
      this.selected = { x, y }
      // 添加触感反馈
      wx.vibrateShort({
        type: 'light'
      })
    } else {
      if (this.isAdjacent(this.selected, { x, y })) {
        this.grid.swapTiles(this.selected, { x, y })
        
        const matches = this.grid.findMatches()
        if (matches.size > 0) {
          // 播放消除音效
          const audio = wx.createInnerAudioContext()
          audio.src = 'audio/match.mp3'
          audio.play()
          
          this.score += this.grid.removeMatches(matches) * 10
          this.grid.fillGaps()
          
          setTimeout(() => this.checkCascadingMatches(), 300)
        } else {
          this.grid.swapTiles(this.selected, { x, y })
          // 播放错误音效
          const audio = wx.createInnerAudioContext()
          audio.src = 'audio/error.mp3'
          audio.play()
        }
      }
      this.selected = null
    }
    this.draw()
  }

  checkCascadingMatches() {
    const matches = this.grid.findMatches()
    if (matches.size > 0) {
      this.score += this.grid.removeMatches(matches) * 10
      this.grid.fillGaps()
      this.draw()
      
      // 更新最高分
      const highScore = wx.getStorageSync('highScore') || 0
      if (this.score > highScore) {
        wx.setStorageSync('highScore', this.score)
      }
      
      setTimeout(() => this.checkCascadingMatches(), 300)
    }
  }

  isAdjacent(pos1, pos2) {
    const dx = Math.abs(pos1.x - pos2.x)
    const dy = Math.abs(pos1.y - pos2.y)
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1)
  }

  draw() {
    this.renderer.clear()
    
    // 绘制背景
    this.renderer.drawBackground()
    
    // 绘制网格
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        const tile = this.grid.getTile(x, y)
        const isSelected = this.selected && 
                          this.selected.x === x && 
                          this.selected.y === y
        this.renderer.drawTile(tile, isSelected)
      }
    }
    
    this.renderer.drawScore(this.score)
  }
}