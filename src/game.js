// import Bird from "./bird";
import Level from "./level";

export default class FlappyBird {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.dimensions = { width: canvas.width, height: canvas.height };
    this.restart();
  }

  play() {
    this.running = true;
    this.animate();
  }

  restart() {
    this.running = false;
    this.level = new Level(this.dimensions);

    this.animate();
  }

  //redraw
  animate() {
    this.level.animate(this.ctx);
    //don't animate if game not running
    if (this.running) {
      requestAnimationFrame(this.animate.bind(this));
    }
  }

}
