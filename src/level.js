export default class Level {
  constructor(dimensions) {
    this.dimensions = dimensions;
    
  }

  animate(ctx) {
    this.drawBackground(ctx);
  }

  drawBackground(ctx) {
    const my_gradient = ctx.createLinearGradient(180, 180, 0, 0);
    my_gradient.addColorStop(0, "#aaaaaa");
    my_gradient.addColorStop(1, "#c9c6c6");
    ctx.fillStyle = my_gradient;
    ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);
  }
}
