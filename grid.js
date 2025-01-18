// Class to represent and handle the pheromone grid.
export const MAX_PHE = 128;

const PheromoneType = {
  TypeA: 'typeA',
  TypeB: 'typeB',
}

const scale = 4;

export class Grid {
  constructor(width, height) {
    this.width = Math.ceil(width / scale);
    this.height = Math.ceil(height / scale);
    this.actualWidth = width;
    this.actualHeight = height;

    this.foodTotal = 0;
    this.foodCollected = 0;
    
    this.grid = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => new Cell())
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
          this.grid[y][x].food += foodAmount;
          this.foodTotal += foodAmount;
        }
      }
    }
  }

  getCell(x, y) {
    const gx = Math.floor(x/scale);
    const gy = Math.floor(y/scale);

    return this.grid[gy]?.[gx] || null;
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
      cell.addFood(amount);
    }
  }

  removeFood(x, y, amount) {
    const cell = this.getCell(x, y);
    if (cell) {
      cell.removeFood(amount);
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

  getPheromone(x, y, type) {
    const cell = this.getCell(x, y);
    if (cell) {
      return cell.getPheromone(type);
    }
  }

  reducePheromone(x, y, type, amount) {
    const cell = this.getCell(x, y);
    if (cell) {
      cell.reducePheromone(type, amount);
    }
  }

  updateFoodCollected(amount) {
    this.foodCollected += amount;
  }

  getFoodCollected() {
    return this.foodCollected;
  }
}

class Cell {
  constructor() {
    this.isBlocked = false;
    this.food = 0;
    this.pheromones = { typeA: 0, typeB: 0 }
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

  getPheromone(type) {
    if (this.pheromones[type] !== undefined) {
      return this.pheromones[type];
    }
  }

  hasFood() {
    return this.food > 0;
  }

  getFood() {
    return this.food;
  }

  addFood(amount) {
    this.food += amount;
  }

  removeFood(amount) {
    this.food = Math.max(0, this.food - amount);
  }
}