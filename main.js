import { Agent } from './agent.js';
import { Grid } from './grid.js'


const canvas = document.getElementById("pixelCanvas");

const gridSize = 512; 
const numAgents = 70; //70
const scale = 4;

canvas.width = gridSize;
canvas.height = gridSize;

const ctx = canvas.getContext("2d");

const grid = new Grid(gridSize, gridSize);

const homeX = gridSize / 2 // Math.random() * gridSize; 
const homeY = gridSize / 2 // Math.random() * gridSize; 

const agents = Array.from({ length: numAgents }, () => new Agent(homeX, homeY, 1500, grid));

function updateAgents() {
  agents.forEach(agent => agent.update());
}

function draw() {
  // Fade the screen
  ctx.fillStyle = "rgba(255, 255, 255, 0.01)"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

 // Draw the grid (pheromone / food)
  for (let y = 0; y < gridSize; y+= scale) {
    for (let x = 0; x < gridSize; x+= scale) {
      const cell = grid.getCell(x, y);
      const pheromones = cell.pheromones;

      if (pheromones.typeA > 0 ){
        const typeAOpacity = pheromones.typeA / 255;
        ctx.fillStyle = `rgba(230, 0, 0, ${typeAOpacity})`;
        ctx.fillRect(x, y, scale, scale);
      }

      if (pheromones.typeB > 0 ){
        const typeBOpacity = pheromones.typeB / 255;
        ctx.fillStyle = `rgba(0, 0, 230, ${typeBOpacity})`;
        ctx.fillRect(x, y, scale, scale);
      }
        // reduce the pheromone level per 'tick'
        // this is done here to prevent multiple iterations over the grid
        grid.reducePheromone(x, y, 'typeA', 0.2);
        grid.reducePheromone(x, y, 'typeB', 0.1);
      

      if (cell.food > 0) {
        ctx.fillStyle = `rgba(0, 255, 0, 0.8)`;
        ctx.fillRect(x, y, scale, scale);
      }
    }
  }
 
  // Draw the agents
  for (let i = 0; i < numAgents; i++) {
    ctx.fillStyle = agents[i].getColour();
    ctx.fillRect(agents[i].x, agents[i].y, 2, 2); 
  }
}

const fps = 60; 
const frameDuration = 1000 / fps; 
let lastFrameTime = 0;

function update(timestamp) {
  updateAgents();
  if (timestamp - lastFrameTime >= frameDuration) {
    lastFrameTime = timestamp;
    draw();
  }
  requestAnimationFrame(update);
}

draw();
update();