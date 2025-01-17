import { Agent } from './agent.js';
import { Grid, MAX_PHE } from './grid.js'


const canvas = document.getElementById("pixelCanvas");

const gridSize = 512; 
const numAgents = 20; //70

canvas.width = gridSize;
canvas.height = gridSize;

const ctx = canvas.getContext("2d");

const grid = new Grid(gridSize, gridSize);

const agents = Array.from({ length: numAgents }, () => new Agent(gridSize / 2, gridSize / 2, Math.random() * 360, 5000, grid));
console.log(agents)

// const imageData = ctx.createImageData(gridSize, gridSize);
// const data = imageData.data; // Access the pixel data array



function updateAgents() {
  agents.forEach(agent => agent.update());
  
}

function draw() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.01)"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);


 // Draw the grid (pheromone / obstacle)
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const pheromones = grid.getPheromones(x, y);
      
      if (pheromones.typeA > 0 || pheromones.typeB > 0) {
        const typeAIntensity = 255 - pheromones.typeA || 255;
        const typeBIntensity = 255 - pheromones.typeB || 255;
        
        //const opacity = Math.min((pheromones.typeA + pheromones.typeB) / MAX_PHE, 1);

        ctx.fillStyle = `rgba(${typeBIntensity}, 255, ${typeAIntensity}, 255)`;
        //ctx.fillStyle = `rgba(0, ${typeBIntensity}, ${typeAIntensity}, ${opacity})`;
        ctx.fillRect(x, y, 1, 1);

        // reduce the pheromone level per 'tick'
        // this is done here to prevent iterations over the grid
        grid.reducePheromone(x, y, 'typeA', 0.05);
        grid.reducePheromone(x, y, 'typeB', 0.05);
      }

      if (grid.getFood(x, y) > 0) {
        ctx.fillStyle = `rgba(255, 0, 0, 1`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }


 
  // ctx.fillStyle = "black";
  for (let i = 0; i < numAgents; i++) {
    ctx.fillStyle = agents[i].getColour();
    ctx.fillRect(agents[i].x, agents[i].y, 1, 1); 
  }
  
}

const fps = 60; 
const frameDuration = 1000 / fps; 
let lastFrameTime = 0;

function update(timestamp) {
  if (timestamp - lastFrameTime >= frameDuration) {
    lastFrameTime = timestamp;
    updateAgents();
    draw();
  }
  requestAnimationFrame(update);
}


draw();
update();



// --------------------------------------------------------------------

function clearImageData() {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255;     // R
    data[i + 1] = 255; // G
    data[i + 2] = 255; // B
    data[i + 3] = 10; // A
  }
}