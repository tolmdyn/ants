export const MAX_PHE = 128;

export class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Cell())
    );

    this.addFoodClumps(3, 50, 10, 10);
  }

  addFoodClumps(numClumps, clumpSize, clumpSpread, foodAmount) {
    for (let i = 0; i < numClumps; i++) {
      
      const centerX = Math.floor(Math.random() * this.width);
      const centerY = Math.floor(Math.random() * this.height);
  
      
      for (let j = 0; j < clumpSize; j++) {
        const offsetX = Math.floor(Math.random() * (2 * clumpSpread + 1)) - clumpSpread;
        const offsetY = Math.floor(Math.random() * (2 * clumpSpread + 1)) - clumpSpread;
  
        const x = centerX + offsetX;
        const y = centerY + offsetY;
  
        
        if (this.isInBounds(x, y)) {
          this.addFood(x, y, foodAmount );
        }
      }
    }
  }

  getCell(x, y) {
    return this.grid[y]?.[x] || null;
  }

  isPassable(x, y) {
    const cell = this.getCell(x, y);
    return cell ? !cell.isBlocked : false;
  }

  isInBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getFood(x, y) {
    const cell = this.getCell(x, y);
    if (cell) {
      return cell.food;
    } 
  }

  addFood(x, y, amount) {
    const cell = this.getCell(x, y);
    if (cell) {
      cell.food += amount;
    }
  }

  removeFood(x, y, amount) {
    const cell = this.getCell(x, y);
    if (cell) {
      cell.food = Math.max(0, cell.food - amount);
    }
  }

  addPheromone(x, y, type, amount) {
    const cell = this.getCell(x, y);
    if (cell) {
      cell.addPheromone(type, amount);
    }
  }

  getPheromones(x, y) {
    const cell = this.getCell(x, y);
    if (cell) {
      return cell.pheromones;
    }
  }

  reducePheromone(x, y, type, amount) {
    const cell = this.getCell(x, y);
    if (cell) {
      cell.reducePheromone(type, amount);
    }
  }
}

class Cell {
  constructor() {
    this.isBlocked = false;
    this.food = 0;
    this.pheromones = { typeA: 0, typeB: 0 } //typeA = visited(seeking), typeB = foodFound(returning) 
  }

  addPheromone(type, amount) {
    if (this.pheromones[type] !== undefined) {
      this.pheromones[type] = Math.min(MAX_PHE, this.pheromones[type] + amount);
    }
  }

  reducePheromone(type, amount) {
    if (this.pheromones[type] !== undefined) {
      this.pheromones[type] = Math.max(0, this.pheromones[type] - amount);
    }
  }

  hasFood() {
    return this.food > 0;
  }

  // addFood(amount) {
  //   this.food = amount;
  // }

  // reduceFood() {
  //   this.food = Math.max(0, this.food - 1);
  // }

}