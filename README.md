# Ant Simulation with Pheromones

A JavaScript-based simulation of agents (ants) navigating a grid using pheromone trails. Agents locate and collect food clumps distributed on the grid, and carry them back home. Agents have a finite amount of energy, and out of bounds agents are "respawned".

There are two types of pheromone Type A from seeking agents, Type B from agents returning with food. Seeking agents will turn towards food, or follow Type B (food) trails. Returning agents will turn towards home, or follow Type A (home) trails.

## Implementation

Written in JavaScript, rendered using HTML5 Canvas. 

## Usage

Hosted on [GitHub Pages](https://tolmdyn.github.io/ants/)