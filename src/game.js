import SketchArea from "./sketch_area";

const KEYSPEED = 2;
const KNOBSPEED = 4;
const SHAKE_DISTANCE = 20;
export default class EtchASketch {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.dimensions = { width: canvas.width, height: canvas.height };
    this.drawLine = this.drawLine.bind(this);
    this.pressKey = this.pressKey.bind(this);
    this.releaseKey = this.releaseKey.bind(this);
    this.clearSketch = this.clearSketch.bind(this);
    this.detectShake = this.detectShake.bind(this);
    this.startShakeTimer = this.startShakeTimer.bind(this);
    this.measureShake = this.measureShake.bind(this);
    this.stopShakeTimer = this.stopShakeTimer.bind(this);
    this.turnLeftKnob = this.turnLeftKnob.bind(this);
    this.turnRightKnob = this.turnRightKnob.bind(this);
    this.shakeCount = 0;
    this.lastShakeDir = "none";
    this.prevLeft = $(".etch-border").position().left;
    this.prevTop = $(".etch-border").position().top;
    this.keys = [];
    this.leftKnobRotation = 0;
    this.rightKnobRotation = 0;
    this.restart();
    $(document).on('keydown', this.pressKey);
    $(document).on('keyup', this.releaseKey);

    $(".etch-border").draggable({
      revert: true,
      revertDuration: 200,
      scroll: false,
      start: this.startShakeTimer,
      drag: this.detectShake,
      stop: this.stopShakeTimer,
      
    });
    this.leftKnobDraggable = Draggable.create(".left-front", { 
      type: "rotation",
      onPress: () => $(".etch-border").css("cursor", "grabbing"),
      onRelease: () => $(".etch-border").css("cursor", "grab"),
      onDrag: this.turnLeftKnob
    });

    this.rightKnobDraggable = Draggable.create(".right-front", {
      type: "rotation",
      onPress: () => $(".etch-border").css("cursor", "grabbing"),
      onRelease: () => $(".etch-border").css("cursor", "grab"),
      onDrag: this.turnRightKnob
    });
    this.activateGlowMode = this.activateGlowMode.bind(this);
    $("#glow-button").on('click', this.activateGlowMode);
  }

  activateGlowMode() {
    $("body").toggleClass("body-glow");
    $(".etch-border").toggleClass("etch-border-glow");
    $(".etch-space").toggleClass("etch-space-glow");
    $(".knob").toggleClass("knob-glow");
    $(".knob-back").toggleClass("knob-back-glow");
    $(".title").toggleClass("title-glow");
    $(".fas").toggleClass("fas-glow");
    $(".instructions").toggleClass("instructions-glow");
    $(".knob-inner").toggleClass("knob-inner-glow");

    if ($("body").hasClass("body-glow")) {
      this.sketchArea.drawBackground(this.ctx);
      this.ctx.strokeStyle = "#03f111";
      //redraw the line 3 times so it isn't see through
      for (let i = 0; i < 3; i++) {
        this.ctx.lineTo(this.currentLineX, this.currentLineY);
        this.ctx.moveTo(this.currentLineX, this.currentLineY);
        this.ctx.stroke();
      }
    } else {
      this.sketchArea.drawBackground(this.ctx);
      this.ctx.strokeStyle = "black";
      //redraw the line 3 times so it isn't see through
      for (let i = 0; i < 3; i++) {
        this.ctx.lineTo(this.currentLineX, this.currentLineY);
        this.ctx.moveTo(this.currentLineX, this.currentLineY);
        this.ctx.stroke();
      }
    }
  }

  turnLeftKnob(e) {
    if (this.leftKnobDraggable[0].rotation < this.leftKnobRotation) {
      this.currentLineX -= KEYSPEED/2;
      this.ctx.lineTo(this.currentLineX, this.currentLineY);
      this.ctx.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke();
    } else if (this.leftKnobDraggable[0].rotation > this.leftKnobRotation) {
      this.currentLineX += KEYSPEED/2;
      this.ctx.lineTo(this.currentLineX, this.currentLineY);
      this.ctx.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke();
    }
    this.leftKnobRotation = this.leftKnobDraggable[0].rotation;
  }

  turnRightKnob(e) {
    if (this.rightKnobDraggable[0].rotation < this.rightKnobRotation) {
      this.currentLineY += KEYSPEED / 2;
      this.ctx.lineTo(this.currentLineX, this.currentLineY);
      this.ctx.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke();
    } else if (this.rightKnobDraggable[0].rotation > this.rightKnobRotation) {
      this.currentLineY -= KEYSPEED / 2;
      this.ctx.lineTo(this.currentLineX, this.currentLineY);
      this.ctx.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke();
    }
    this.rightKnobRotation = this.rightKnobDraggable[0].rotation;
  }

  startShakeTimer() {
    this.shakeTimer = setInterval(this.measureShake, 300);
  }

  stopShakeTimer() {
    clearInterval(this.shakeTimer);
    this.shakeCount = 0;
  }

  measureShake() {
    if (this.shakeCount > 0) {
      //decrease the shakecount so long breaks between shakes don't get counted
      this.shakeCount -= 1;
    }
    let etchPos = $(".etch-border").position();
    if (this.shakeCount > 3) {
      this.clearSketch();
      this.shakeCount = 0;
    }
    this.prevLeft = etchPos.left;
    this.prevTop = etchPos.top;
  }

  detectShake() {
    let etchPos = $(".etch-border").position();
    let curShakeDir;
    if (etchPos.top < this.prevTop && etchPos.left < this.prevLeft) {
      curShakeDir = "tl";
    } else if (etchPos.top < this.prevTop && etchPos.left > this.prevLeft) {
      curShakeDir = "tr";
    } else if (etchPos.top > this.prevTop && etchPos.left > this.prevLeft) {
      curShakeDir = "br";
    } else if (etchPos.top > this.prevTop && etchPos.left < this.prevLeft) {
      curShakeDir = "bl";
    }
    //make sure the shakes are moving enough, and that they are in the opposite direction of the last move
    if ((etchPos.top > this.prevTop + SHAKE_DISTANCE && this.lastShakeDir !== "bl" && this.lastShakeDir !== "br") ||
      (etchPos.top < this.prevTop - SHAKE_DISTANCE && this.lastShakeDir !== "tl" && this.lastShakeDir !== "tr") ||
      (etchPos.left > this.prevLeft + SHAKE_DISTANCE && this.lastShakeDir !== "tr" && this.lastShakeDir !== "br") ||
      (etchPos.left < this.prevLeft - SHAKE_DISTANCE && this.lastShakeDir !== "tl" && this.lastShakeDir !== "bl")
    ) {
      this.shakeCount += 1;
      this.prevLeft = etchPos.left;
      this.prevTop = etchPos.top;
    }
    this.lastShakeDir = curShakeDir;

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
    if (e.keyCode === 32) {
      this.clearSketch();
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
