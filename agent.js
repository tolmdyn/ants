const State = {
  Seeking: 'Seeking',
  Returning: 'Returning',
}

export let foodCollected = 0;

export class Agent {
  constructor(x, y, energy, grid) {
    this.x = x; // default 0
    this.y = y; // default 0
    this.homeX = x;
    this.homeY = y;
    this.energy = energy; // default to 500
    this.grid = grid;

    this.state = State.Seeking;
  }

  update() {
    if (this.energy != 0) {
      this.move();

      if (this.state === State.Returning) {
        // this.moveReturning();
        this.checkHome()
      } else {
        // this.moveSeeking();
        this.checkFood();
      }
    }
  }


  // move() {
  //   // Store prev x and y
  //   this.px = this.x;
  //   this.py = this.y;

  //   // Randomly choose a direction: -1, 0, or 1
  //   const dx = Math.floor(Math.random() * 3) - 1;
  //   const dy = Math.floor(Math.random() * 3) - 1;

  //   const newX = this.x + dx;
  //   const newY = this.y + dy;

  //   // Update position while keeping it within bounds
  //   if (this.grid.isPassable(newX, newY)){
  //     this.grid.addPheromone(this.x, this.y, 'typeA', 20);

  //     this.x = Math.max(0, Math.min(newX, 255)); 
  //     this.y = Math.max(0, Math.min(newY, 255)); 
  //   }

  //   // Reduce energy
  //   // this.energy -= 1;
  // }

  // Move once in a random direction, but not outside of bounds
  // Prefer cells with typeB pheromone, then cells without typeA pheromone
  move() {
    // Store prev x and y
    // this.px = this.x;
    // this.py = this.y;

    const directions = [
      // { dx: 0, dy: 0 },  // Stay in place
      { dx: -1, dy: 0 }, // Left
      { dx: 1, dy: 0 },  // Right
      { dx: 0, dy: -1 }, // Up
      { dx: 0, dy: 1 },  // Down
      { dx: -1, dy: -1 }, // Top-left
      { dx: 1, dy: -1 }, // Top-right
      { dx: -1, dy: 1 }, // Bottom-left
      { dx: 1, dy: 1 },  // Bottom-right
    ];

    const neighbours = directions.map(({ dx, dy }) => {
      const nx = this.x + dx;
      const ny = this.y + dy;

      if (this.grid.isInBounds(nx, ny) && this.grid.isPassable(nx, ny)) {
        const pheromones = this.grid.getPheromones(nx, ny);
        const typeB = pheromones?.typeB || 0;
        const typeA = pheromones?.typeA || 0;

        let weight = null;

        if (this.state === State.Seeking) {
          weight = (typeB * 2 + 1) / (typeA / 2 + 1);
        } else if (this.state === State.Returning) {
          const distanceToHome = Math.sqrt(
            Math.pow(nx - this.homeX, 2) + Math.pow(ny - this.homeY, 2)
          );
          weight = (typeA + 1) / (typeB * 2 + 1) + 3 / (distanceToHome + 1);
          //weight = distanceToHome;
          
        }

        return { nx, ny, weight };
      }

      return null; // ignore impassable cells
    })
      .filter(cell => cell !== null);

    if (neighbours.length > 0) {
      const totalWeight = neighbours.reduce((sum, cell) => sum + cell.weight, 0);
      const probabilities = neighbours.map(cell => cell.weight / totalWeight);

      const selectedCell = this.weightedRandomChoice(neighbours, probabilities);

      if (this.state === State.Seeking) {
        this.grid.addPheromone(this.x, this.y, 'typeA', 20); 
      } else if (this.state === State.Returning) {
        this.grid.addPheromone(this.x, this.y, 'typeB', 50);
      }
      this.x = selectedCell.nx;
      this.y = selectedCell.ny;
    }


    // this.energy -= 1;
  }

  moveReturning() {

  }

  weightedRandomChoice(options, probabilities) {
    const rand = Math.random();

    let cumulative = 0;

    for (let i = 0; i < options.length; i++) {
      cumulative += probabilities[i];
      if (rand <= cumulative) {
        return options[i];
      }
    }

    return options[options.length - 1]; // fallback?
  }

  // If the cell at which the agent is has food, take that food and return home
  checkFood() {
    // does cell have food
    if (this.grid.getFood(this.x, this.y) > 0) {
      console.log("FOOD", this.x, this.y)
      // reduce food (take it)
      this.grid.removeFood(this.x, this.y, 10);
      // change state to returning
      this.state = State.Returning;
    }
  }

  checkHome() {
    // if (this.x == this.homeX && this.y == this.homeY) {
      const distanceToHome = Math.sqrt(
        Math.pow(this.x - this.homeX, 2) + Math.pow(this.y - this.homeY, 2)
      );

      if (distanceToHome < 5) {
        foodCollected += 10;
        console.log(`HOME: ${foodCollected}`);
        this.state = State.Seeking;
    }
  }

  getColour() {
    if (this.state === State.Returning)
      return "blue"
    else
      return "black"
  }
}