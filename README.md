This is a p5 implementation of the project that I first saw <a href="https://www.youtube.com/watch?v=Yu7sF9rcVJY">here</a>. 

The project is called "Screaming Insects" by Simulife Hub with the original code that was apparently written in <a href="https://processing.org/">processing</a>. I wanted to try to reproduce and since I'm more familiar with <a href="https://p5js.org/">p5</a>, this code is the result.

A speed-limiting routine in my original version had to do with detecting a collision between a drone and a resource, and then announcing a stepCount to other drones. To help overcome this, I implemented a QuadTree search algorithm. Documentation of the quadtree project is available <a href="https://github.com/ehymel/quadtree">here</a>.

Enjoy, and I appreciate all feedback.
