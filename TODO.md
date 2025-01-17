Changes:

 - ~~rewrite agent to be more of a vehicle with a direction velocity and turning radius (e.g. rocket), rather than a randomly wiggling pixel. ~~


 - ~~fix /remove the broken weighted choice. maybe agent direction is determined less randomly and is drawn towards food. ~~

- ~~implement this in a new branch (baitenberg), "A Braitenberg vehicle is an agent that can autonomously move around based on its sensor inputs. It has primitive sensors that measure some stimulus at a point, and wheels (each driven by its own motor) that function as actuators or effectors." ~~

- ~~ sensor inputs include food and pheromone? ~~

---

- ~~rebuild the pheromone grid to have a variable gridsize, so each 'square' of the pheromone grid is a few pixels wide. Calculate dispersion separately~~

- add tools to add pheromene and watch it disperse? to test

---


- add better debugging support, and pause/slomo?

- consider tracking progress of project in a write-up (.e.g what happened and decisions)