import SketchArea from "./sketch_area";

const KEYSPEED = 2;
const KNOBSPEED = 4;
export default class EtchASketch {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.dimensions = { width: canvas.width, height: canvas.height };
    this.drawLine = this.drawLine.bind(this);
    this.pressKey = this.pressKey.bind(this);
    this.releaseKey = this.releaseKey.bind(this);
    this.clearSketch = this.clearSketch.bind(this);
    this.keys = [];
    this.leftKnobRotation = 0;
    this.rightKnobRotation = 0;
    this.restart();
    $(document).on('keydown', this.pressKey);
    $(document).on('keyup', this.releaseKey);

    $(".etch-border").draggable({
      revert: true,
      revertDuration: 200,
      start: this.clearSketch
    });
  }

  clearSketch() {
    // this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
    this.ctx.beginPath();
    // this.currentLineX = this.dimensions.width / 2;
    // this.currentLineY = this.dimensions.height / 2;
    this.ctx.moveTo(this.currentLineX, this.currentLineY);
    this.sketchArea.animate(this.ctx);
  }

  pressKey(e) {
    e.preventDefault();
    this.keys[e.keyCode] = true;
    const that = this;
    if (this.keys[37] && this.currentLineX > 0) {
      this.drawLine("left");
      that.leftKnobRotation -= KNOBSPEED;
      $('.left-front').css("transform", "rotateZ(" + that.leftKnobRotation + "deg)");
    } 
    if (this.keys[38] && this.currentLineY > 0) {
      this.drawLine("up");
      that.rightKnobRotation += KNOBSPEED;
      $('.right-front').css("transform", "rotateZ(" + that.rightKnobRotation + "deg)");
    } 
    if (this.keys[39] && this.currentLineX < this.dimensions.width) {
      this.drawLine("right");
      that.leftKnobRotation += KNOBSPEED;
      $('.left-front').css("transform", "rotateZ(" + that.leftKnobRotation + "deg)");
    } 
    if (this.keys[40] && this.currentLineY < this.dimensions.height ) {
      this.drawLine("down");
      that.rightKnobRotation -= KNOBSPEED;
      $('.right-front').css("transform", "rotateZ(" + that.rightKnobRotation + "deg)");
    }
    
  }

  releaseKey(e) {
    this.keys[e.keyCode] = false;
  }

  drawLine(direction) {
    if (direction === "left") {
      this.currentLineX -= KEYSPEED;
      this.ctx.lineTo(this.currentLineX, this.currentLineY);
      this.ctx.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke();
    }

    if (direction === "right") {
      this.currentLineX += KEYSPEED;
      this.ctx.lineTo(this.currentLineX, this.currentLineY);
      this.ctx.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke();
    }

    if (direction === "down") {
      this.currentLineY += KEYSPEED;
      this.ctx.lineTo(this.currentLineX, this.currentLineY);
      this.ctx.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke();
    }

    if (direction === "up") {
      this.currentLineY -= KEYSPEED;
      this.ctx.lineTo(this.currentLineX, this.currentLineY);
      this.ctx.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke();
    }
  }

  play() {
    this.running = true;
    this.animate();
  }

  restart() {
    this.running = false;
    this.sketchArea = new SketchArea(this.dimensions);
    
    this.animate();
    //set starting position
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.currentLineX = this.dimensions.width / 2;
    this.currentLineY = this.dimensions.height / 2;
    this.ctx.moveTo(this.currentLineX, this.currentLineY);
    // this.ctx.lineTo(140, 140);
    // this.ctx.stroke();
  }
    
  

  //redraw
  animate() {
    this.sketchArea.animate(this.ctx);
    
    //don't animate if game not running
    if (this.running) {
      requestAnimationFrame(this.animate.bind(this));
    }
  }

}
