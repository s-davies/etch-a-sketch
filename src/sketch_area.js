export default class SketchArea {
  constructor(dimensions) {
    this.dimensions = dimensions;
    
    $(".etch-border").on('mousedown', (e) => {
      $(".etch-border").css("cursor", "grabbing");
    });
    $(".etch-border").on('mouseup', (e) => {
      $(".etch-border").css("cursor", "grab");
    });
    
  }

  


  animate(ctx) {
    this.drawBackground(ctx);
  }

  drawBackground(ctx) {
    // const my_gradient = ctx.createLinearGradient(180, 180, 0, 0);
    // if ($("body").hasClass("body-glow")) {
    //   my_gradient.addColorStop(0, "#0f0f0f");
    //   my_gradient.addColorStop(1, "#505050");
    // } else {
    //   my_gradient.addColorStop(0, "#aaaaaa");
    //   my_gradient.addColorStop(1, "#c9c6c6");
    // }
    // ctx.fillStyle = my_gradient;
    // ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);
  }
}
