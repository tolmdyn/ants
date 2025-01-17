// "Vehicle" based agent with momentum and angle.


const State = {
  Seeking: 'Seeking',
  Returning: 'Returning',
}

// This shouldnt be here
export let foodCollected = 0;

let idCount = 0;

export class Agent {
  constructor(x, y, angle, energy, grid) {
    this.id = idCount++;
    this.x = x; // default 0
    this.y = y; // default 0

    this.angle = angle;
    this.velocity = 0.5;

    this.vx = 0;
    this.vy = 0;

    this.visionDistance = 80;

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

  move() {
    const rad = (this.angle * Math.PI) / 180;

    this.vx = Math.sin(rad) * this.velocity;
    this.vy = Math.cos(rad) * this.velocity;

    this.x += this.vx;
    this.y += this.vy;

    this.turn();

    this.energy -= 1;
  }

  moveReturning() {

  }

  turn() {
    // add some randomness to the direction
    this.angle += ((Math.random() * 5) - 2.5);

    // if food is detected on the right side, then veer right
    // or if food is detected on the left side, then veer left
    // we do this by imagining a circle of vision around the agent. 
    // Everything behind it (more than 90 degrees away from the direction it is facing) 
    // is ignored. THen the remain space is partition so that everything from 0 to -90 
    // degrees is left and 0 to 90 degrees is right. Then we check all the coordinated 
    // in these spaces to see if food is present.
    const rad = (this.angle * Math.PI) / 180;
    const visionPoints = [];

    for (let d = 1; d <= this.visionDistance; d++) {
      // scan a 90-degree arc in front (left and right)
      // const offset = 90 / 2;
      for (let offset = -85; offset <= 85; offset += 5) {
        const scanAngle = rad + (offset * Math.PI) / 180;
        const scanX = Math.round(this.x + Math.sin(scanAngle) * d);
        const scanY = Math.round(this.y + Math.cos(scanAngle) * d);

        visionPoints.push({ x: scanX, y: scanY, angleOffset: offset });
      }
    }

    if (this.state == State.Seeking) {
      this.turnTowardsFood(visionPoints);
    } else {
      this.turnTowardsHome(visionPoints);
    }

    // Stop angle from going out of bounds
    if (this.angle >= 360) {
      this.angle -= 360;
    } else if (this.angle < 0) {
      this.angle += 360;
    }
  }

  turnTowardsFood(visionPoints) {
    // Determine if food in vision field
    let leftFood = 0;
    let rightFood = 0;

    for (const point of visionPoints) {
      if (this.grid.getFood(point.x, point.y) > 0) {
        if (point.angleOffset < 0) {
          leftFood += 1;
        } else if (point.angleOffset > 0) {
          rightFood += 1;
        }
      }
    }

    // Adjust angle based on detected food quantity
    if (leftFood > rightFood) {
      this.angle -= 5;
    } else if (rightFood > leftFood) {
      this.angle += 5;
    }
  }

  turnTowardsHome(visionPoints) {
    // Check if home is within vision
    for (const point of visionPoints) {
      if (
        Math.abs(point.x - this.homeX) < 1 &&
        Math.abs(point.y - this.homeY) < 1
      ) {
        this.angle += point.angleOffset > 0 ? 5 : -5; // Turn toward home
        break;
      }
    }
  }

  // If the cell at which the agent is has food, take that food and return home
  checkFood() {
    // does cell have food
    // console.log(`Agent position: (${this.x}, ${this.y})`);
    const gridX = Math.round(this.x);
    const gridY = Math.round(this.y);

    if (this.grid.getFood(gridX, gridY) > 0) {
      console.log("Food collected at:", gridX, gridY, "by", this.id)
      // reduce food (take it)
      this.grid.removeFood(gridX, gridY, 10);
      // change state to returning
      this.state = State.Returning;
      this.angle += 180;
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
      this.angle += 180;
    }
  }

  getColour() {
    if (this.state === State.Returning)
      return "blue"
    else
      return "black"
  }
}