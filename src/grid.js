import { createTile } from './utils.js';

export class Grid {
  constructor(size) {
    this.size = size;
    this.tiles = [];
    this.init();
  }

  init() {
    for (let i = 0; i < this.size; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.tiles[i][j] = createTile(i, j);
      }
    }
  }

  getTile(x, y) {
    return this.tiles[x][y];
  }

  swapTiles(pos1, pos2) {
    const temp = this.tiles[pos1.x][pos1.y];
    this.tiles[pos1.x][pos1.y] = this.tiles[pos2.x][pos2.y];
    this.tiles[pos2.x][pos2.y] = temp;

    // Update positions
    this.tiles[pos1.x][pos1.y].x = pos1.x;
    this.tiles[pos1.x][pos1.y].y = pos1.y;
    this.tiles[pos2.x][pos2.y].x = pos2.x;
    this.tiles[pos2.x][pos2.y].y = pos2.y;
  }

  findMatches() {
    let matches = new Set();

    // Check horizontal matches
    for (let y = 0; y < this.size; y++) {
      let matchCount = 1;
      let currentColor = null;
      let matchStart = 0;

      for (let x = 0; x < this.size; x++) {
        const tile = this.tiles[x][y];
        
        if (tile.color === currentColor) {
          matchCount++;
        } else {
          if (matchCount >= 3) {
            // Add all tiles in the match to the set
            for (let i = matchStart; i < x; i++) {
              matches.add(this.tiles[i][y]);
            }
          }
          matchCount = 1;
          currentColor = tile.color;
          matchStart = x;
        }
      }
      
      // Check for match at the end of row
      if (matchCount >= 3) {
        for (let i = matchStart; i < this.size; i++) {
          matches.add(this.tiles[i][y]);
        }
      }
    }

    // Check vertical matches
    for (let x = 0; x < this.size; x++) {
      let matchCount = 1;
      let currentColor = null;
      let matchStart = 0;

      for (let y = 0; y < this.size; y++) {
        const tile = this.tiles[x][y];
        
        if (tile.color === currentColor) {
          matchCount++;
        } else {
          if (matchCount >= 3) {
            // Add all tiles in the match to the set
            for (let i = matchStart; i < y; i++) {
              matches.add(this.tiles[x][i]);
            }
          }
          matchCount = 1;
          currentColor = tile.color;
          matchStart = y;
        }
      }
      
      // Check for match at the end of column
      if (matchCount >= 3) {
        for (let i = matchStart; i < this.size; i++) {
          matches.add(this.tiles[x][i]);
        }
      }
    }

    return matches;
  }

  removeMatches(matches) {
    matches.forEach(tile => {
      tile.color = null;
      tile.matched = true;
    });
    return matches.size;
  }

  fillGaps() {
    // Move tiles down
    for (let x = 0; x < this.size; x++) {
      let bottom = this.size - 1;
      for (let y = this.size - 1; y >= 0; y--) {
        if (this.tiles[x][y].color !== null) {
          if (bottom !== y) {
            this.tiles[x][bottom].color = this.tiles[x][y].color;
            this.tiles[x][y].color = null;
          }
          bottom--;
        }
      }
    }
    
    // Fill empty spaces with new tiles
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.tiles[x][y].color === null) {
          this.tiles[x][y] = createTile(x, y);
        }
      }
    }
  }
}