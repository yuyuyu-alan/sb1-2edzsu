import { Grid } from './grid.js';
import { Renderer } from './renderer.js';

export class Game {
  constructor(canvas) {
    this.gridSize = 8;
    this.tileSize = 40;
    this.score = 0;
    this.selected = null;
    
    this.grid = new Grid(this.gridSize);
    this.renderer = new Renderer(canvas, this.tileSize);
    
    this.bindEvents(canvas);
    this.draw();
  }

  bindEvents(canvas) {
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / this.tileSize);
      const y = Math.floor((e.clientY - rect.top) / this.tileSize);
      
      if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
        this.handleClick(x, y);
      }
    });
  }

  handleClick(x, y) {
    if (!this.selected) {
      this.selected = { x, y };
    } else {
      if (this.isAdjacent(this.selected, { x, y })) {
        this.grid.swapTiles(this.selected, { x, y });
        
        const matches = this.grid.findMatches();
        if (matches.size > 0) {
          this.score += this.grid.removeMatches(matches) * 10;
          this.grid.fillGaps();
          
          // Check for cascading matches
          setTimeout(() => this.checkCascadingMatches(), 300);
        } else {
          // Swap back if no matches
          this.grid.swapTiles(this.selected, { x, y });
        }
      }
      this.selected = null;
    }
    this.draw();
  }

  checkCascadingMatches() {
    const matches = this.grid.findMatches();
    if (matches.size > 0) {
      this.score += this.grid.removeMatches(matches) * 10;
      this.grid.fillGaps();
      this.draw();
      
      // Continue checking for cascading matches
      setTimeout(() => this.checkCascadingMatches(), 300);
    }
  }

  isAdjacent(pos1, pos2) {
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }

  draw() {
    this.renderer.clear();
    
    // Draw grid
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        const tile = this.grid.getTile(x, y);
        const isSelected = this.selected && 
                          this.selected.x === x && 
                          this.selected.y === y;
        this.renderer.drawTile(tile, isSelected);
      }
    }
    
    this.renderer.drawScore(this.score);
  }
}