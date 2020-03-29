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
    this.changeLineColor = this.changeLineColor.bind(this);
    this.setImgBG = this.setImgBG.bind(this);
    this.reStroke = this.reStroke.bind(this);
    this.drawImg = this.drawImg.bind(this);
    this.persist = this.persist.bind(this);
    this.reDraw = this.reDraw.bind(this);
    this.paths = {};
    this.pathsCount = 0;
    this.pathPoints = {};
    this.currentLineColor = "black";
    this.currentLineWidth = "black";
    this.glowing = false;
    this.etchBG = "linear-gradient(135deg, #c9c6c6 0%,  #aaaaaa 100%)";
    this.etchBGImg = null;
    this.showImg = true;
    this.imgWidth = 0;
    this.imgHeight = 0;
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

    $('#color-picker').spectrum({
      type: "color",
      showAlpha: false,
      allowEmpty: false,
      containerClassName: 'color-picker-container',
      localStorageKey: "line-color-picker",
      change: (color) => { this.changeLineColor(color.toHexString()) }
    });

    $('#bg-color-picker').spectrum({
      type: "color",
      showAlpha: false,
      allowEmpty: false,
      containerClassName: 'color-picker-container',
      localStorageKey: "bg-color-picker",
      change: (color) => { 
        this.etchBG = color.toHexString();
        $(".etch-space").css("background", color);
        this.persist();
      }
    });

    $("#file").on("change", (event) => {
      this.setImgBG(event);
    });

    $(".toggle").on("click", () => {
      this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
      if (this.showImg) {
        this.showImg = false;
      } else {
        this.showImg = true;
        this.drawImg();
      }
      this.reStroke();
    });

    $("#redraw").on("click", this.reDraw);

    // $("#download-button").on("click", () => {
      // html2canvas(document.getElementsByClassName("etch-border")[0]).then(function (cvs) {
      //   let image = cvs.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
      //   let link = document.createElement('a');
      //   link.download = "my-image.png";
      //   link.href = image;
      //   link.click();
      // });
      // var mcvs = document.getElementById("image-merge");
      // var mctx = mcvs.getContext("2d");
      // var imageObj1 = new Image();
      // var imageObj2 = new Image();
      // imageObj1.src = "./images/frame.png";
      
      // imageObj1.onload = function () {
      //   imageObj1.setAttribute('crossorigin', 'anonymous');
      //   mctx.drawImage(imageObj1, 0, 0, imageObj1.width, imageObj1.height);
      //   imageObj2.src = canvas.toDataURL();
      //   // imageObj2.src = "./images/bird.png";
      //   imageObj2.crossOrigin = "anonymous";
      //   imageObj2.onload = function () {
      //     mctx.drawImage(imageObj2, 120, 120, canvas.width, canvas.height);
      //     // var img = mcvs.toDataURL("image/png");
      //     // document.write('<img src="' + img + '" width="' + imageObj1.width + '" height="' + imageObj1.height + '"/>');
         
      //       let image = mcvs.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
      //       // let link = document.createElement('a');
      //       // link.download = "my-image.png";
      //       // link.href = image;
      //       // link.click();
      //   }


      // };

    // });
  }
  //////////////////////////////////////////////////////////////////////////////

  reDraw() {
    this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
    let timeoutMultiplier = 0;
    let that = this;
    this.paths = {};
    
    for (let i = 0; i < Object.keys(this.pathPoints).length; i++) {
      const points = this.pathPoints[i].points;
      // let tempPath = new Path2D();
      this.pathsCount = i;
      this.currentLineColor = this.pathPoints[i].color;
      this.paths[this.pathsCount] = { path: new Path2D(), color: this.currentLineColor, lineWidth: this.currentLineWidth };

      for (let j = 0; j < points.length; j++) {
        setTimeout(() => {
          const coordinates = points[j];
          this.paths[i].path.lineTo(coordinates[0], coordinates[1]);
          this.paths[i].path.moveTo(coordinates[0], coordinates[1]);
          this.currentLineX = coordinates[0];
          this.currentLineY = coordinates[1];
          if ($("body").hasClass("body-glow")) {
            this.ctx.strokeStyle = "#03f111";
          } else {
            this.ctx.strokeStyle = this.pathPoints[i].color;
          }
          this.ctx.stroke(this.paths[i].path);

          if (points[j - 1] && coordinates[0] > points[j-1][0]) {
            that.leftKnobRotation += KNOBSPEED;
            $('.left-front').css("transform", "rotateZ(" + that.leftKnobRotation + "deg)");
          }
          if (points[j - 1] && coordinates[0] < points[j - 1][0]) {
            that.leftKnobRotation -= KNOBSPEED;
            $('.left-front').css("transform", "rotateZ(" + that.leftKnobRotation + "deg)");
          }
          if (points[j - 1] && coordinates[1] > points[j - 1][1]) {
            that.rightKnobRotation -= KNOBSPEED;
            $('.right-front').css("transform", "rotateZ(" + that.rightKnobRotation + "deg)");
          }
          if (points[j - 1] && coordinates[1] < points[j - 1][1]) {
            that.rightKnobRotation += KNOBSPEED;
            $('.right-front').css("transform", "rotateZ(" + that.rightKnobRotation + "deg)");
          }
        }, timeoutMultiplier*20);
        timeoutMultiplier += 1;
      }
    }
    
  }

  setImgBG(e) {
    const fileName = e.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = event => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        // img.width and img.height will contain the original dimensions
        this.etchBGImg = img;
        //set aspect ratio of image so it won't appear stretched or scrunched
        const canvasAspectRatio = this.dimensions.width / this.dimensions.height;
        const imgAspectRatio = img.width / img.height;
        if (imgAspectRatio >= canvasAspectRatio) {
          this.imgWidth = this.dimensions.width;
          this.imgHeight = img.height * (this.dimensions.width / img.width);
        } else {
          this.imgHeight = this.dimensions.height;
          this.imgWidth = img.width * (this.dimensions.height / img.height);
        }
        this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
        this.drawImg();
        this.ctx.canvas.toBlob((blob) => {
          const file = new File([blob], fileName, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
        }, 'image/jpeg', 1);
        this.reStroke();
        $(".toggle").addClass("toggle-show");
      },
        reader.onerror = error => console.log(error);
    };
    
    
  }

  drawImg() {
    this.ctx.globalAlpha = 0.5;
    //center and draw image based on aspect ratio
    if (this.imgWidth === this.dimensions.width) {
      this.ctx.drawImage(this.etchBGImg, 0, (this.dimensions.height - this.imgHeight) / 2, this.imgWidth, this.imgHeight);
    } else {
      this.ctx.drawImage(this.etchBGImg, (this.dimensions.width - this.imgWidth) / 2, 0, this.imgWidth, this.imgHeight);
    }
    this.ctx.globalAlpha = 1;
  }

  changeLineColor(color) {
      // this.ctx.lineWidth = 1;
      // this.ctx.beginPath();
      this.pathsCount += 1;
      this.currentLineColor = color;
      this.paths[this.pathsCount] = { path: new Path2D(), color: this.currentLineColor, lineWidth: this.currentLineWidth };
      this.pathPoints[this.pathsCount] = { 
        points: [[this.currentLineX, this.currentLineY]], 
        color: this.currentLineColor, 
        lineWidth: this.currentLineWidth 
      };
      this.persist();
      this.paths[this.pathsCount].path.moveTo(this.currentLineX, this.currentLineY);
      this.paths[this.pathsCount].path.lineTo(this.currentLineX, this.currentLineY);
      this.ctx.strokeStyle = color;
      this.ctx.stroke(this.paths[this.pathsCount].path);
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
    $(".sidebar").toggleClass("sidebar-glow");
    // $("canvas").toggleClass("canvas-glow");
    
    this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
    if (this.etchBGImg && this.showImg) this.drawImg();
    if ($("body").hasClass("body-glow")) {
      this.glowing = true;
      $(".etch-space").css("background", "linear-gradient(135deg, #131313 0%,  #000000 100%)");
      this.reStroke();
    } else {
      this.glowing = false;
      $(".etch-space").css("background", this.etchBG);
      this.reStroke();
    }
    this.persist();
  }

  reStroke() {
    if ($("body").hasClass("body-glow")) {
      for (let i = 0; i <= this.pathsCount; i++) {
        this.ctx.strokeStyle = "#03f111";
        //redraw the line 3 times so it isn't see through
        for (let j = 0; j < 3; j++) {
          this.ctx.stroke(this.paths[i].path);
        }
      }
    } else {
      for (let i = 0; i <= this.pathsCount; i++) {
        this.ctx.strokeStyle = this.paths[i].color;
        //redraw the line 3 times so it isn't see through
        for (let j = 0; j < 3; j++) {
          this.ctx.stroke(this.paths[i].path);
        }
      }
    }
  }

  turnLeftKnob(e) {
    if (this.leftKnobDraggable[0].rotation < this.leftKnobRotation) {
      this.currentLineX -= KEYSPEED/2;
      this.paths[this.pathsCount].path.lineTo(this.currentLineX, this.currentLineY);
      this.paths[this.pathsCount].path.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke(this.paths[this.pathsCount].path);
    } else if (this.leftKnobDraggable[0].rotation > this.leftKnobRotation) {
      this.currentLineX += KEYSPEED/2;
      this.paths[this.pathsCount].path.lineTo(this.currentLineX, this.currentLineY);
      this.paths[this.pathsCount].path.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke(this.paths[this.pathsCount].path);
    }
    this.leftKnobRotation = this.leftKnobDraggable[0].rotation;
    this.pathPoints[this.pathsCount].points.push([this.currentLineX, this.currentLineY]);
    this.persist();
  }

  turnRightKnob(e) {
    if (this.rightKnobDraggable[0].rotation < this.rightKnobRotation) {
      this.currentLineY += KEYSPEED / 2;
      this.paths[this.pathsCount].path.lineTo(this.currentLineX, this.currentLineY);
      this.paths[this.pathsCount].path.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke(this.paths[this.pathsCount].path);
    } else if (this.rightKnobDraggable[0].rotation > this.rightKnobRotation) {
      this.currentLineY -= KEYSPEED / 2;
      this.paths[this.pathsCount].path.lineTo(this.currentLineX, this.currentLineY);
      this.paths[this.pathsCount].path.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke(this.paths[this.pathsCount].path);
    }
    this.rightKnobRotation = this.rightKnobDraggable[0].rotation;
    this.pathPoints[this.pathsCount].points.push([this.currentLineX, this.currentLineY]);
    this.persist();
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
    // this.ctx.beginPath();
    // this.currentLineX = this.dimensions.width / 2;
    // this.currentLineY = this.dimensions.height / 2;
    this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
    //redraw an image if it has been uploaded
    if (this.etchBGImg && this.showImg) this.drawImg();
    this.paths = {};
    this.pathsCount = 0;
    this.pathPoints = {};
    this.pathPoints[this.pathsCount] = {
      points: [[this.currentLineX, this.currentLineY]],
      color: this.currentLineColor,
      lineWidth: this.currentLineWidth
    };
    this.persist();
    this.paths[this.pathsCount] = { path: new Path2D(), color: this.currentLineColor, lineWidth: this.currentLineWidth };
    this.paths[this.pathsCount].path.moveTo(this.currentLineX, this.currentLineY);
    // this.sketchArea.animate(this.ctx);
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
      this.paths[this.pathsCount].path.lineTo(this.currentLineX, this.currentLineY);
      this.paths[this.pathsCount].path.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke(this.paths[this.pathsCount].path);
    }

    if (direction === "right") {
      this.currentLineX += KEYSPEED;
      this.paths[this.pathsCount].path.lineTo(this.currentLineX, this.currentLineY);
      this.paths[this.pathsCount].path.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke(this.paths[this.pathsCount].path);
    }

    if (direction === "down") {
      this.currentLineY += KEYSPEED;
      this.paths[this.pathsCount].path.lineTo(this.currentLineX, this.currentLineY);
      this.paths[this.pathsCount].path.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke(this.paths[this.pathsCount].path);
    }

    if (direction === "up") {
      this.currentLineY -= KEYSPEED;
      this.paths[this.pathsCount].path.lineTo(this.currentLineX, this.currentLineY);
      this.paths[this.pathsCount].path.moveTo(this.currentLineX, this.currentLineY);
      this.ctx.stroke(this.paths[this.pathsCount].path);
    }

    this.pathPoints[this.pathsCount].points.push([this.currentLineX, this.currentLineY]);
    this.persist();
  }

  play() {
    this.running = true;
    this.animate();
  }

  persist() {
    localStorage.setItem("pathPoints", JSON.stringify(this.pathPoints));
    localStorage.setItem("etchBG", JSON.stringify(this.etchBG));
    localStorage.setItem("currentLineColor", JSON.stringify(this.currentLineColor));
    localStorage.setItem("glowing", JSON.stringify(this.glowing));
    // localStorage.setItem("paths", JSON.stringify(this.paths));
    // localStorage.setItem("pathsCount", JSON.stringify(this.pathsCount));
    // localStorage.setItem("background", JSON.stringify(this.etchBG));
    // localStorage.setItem("currentLineX", JSON.stringify(this.currentLineX));
    // localStorage.setItem("currentLineY", JSON.stringify(this.currentLineY));
  }

  restart() {
    this.running = false;
    this.sketchArea = new SketchArea(this.dimensions);
    
    this.animate();
    //set starting position
    // this.ctx.lineWidth = 1;
    // if (JSON.parse(localStorage.getItem("pathsCount")) > 10) {
    //   this.paths = JSON.parse(localStorage.getItem("paths"));
    //   this.pathsCount = JSON.parse(localStorage.getItem("pathsCount"));
    //   this.etchBG = JSON.parse(localStorage.getItem("background"));
    //   this.currentLineX = JSON.parse(localStorage.getItem("currentLineX"));
    //   this.currentLineY = JSON.parse(localStorage.getItem("currentLineY"));
    //   $(".etch-space").css("background", this.etchBG);
    //   this.reStroke();
    // } else {
      if (localStorage.getItem("pathPoints")) {
        this.pathPoints = JSON.parse(localStorage.getItem("pathPoints"));
        this.etchBG = JSON.parse(localStorage.getItem("etchBG"));
        this.currentLineColor = JSON.parse(localStorage.getItem("currentLineColor"));
        this.glowing = JSON.parse(localStorage.getItem("glowing"));
        $(".etch-space").css("background", this.etchBG);
        $("#color-picker").val(this.currentLineColor);
        //don't change the color picker display color if the user has never changed the background
        if (this.etchBG !== "linear-gradient(135deg, #c9c6c6 0%,  #aaaaaa 100%)") {
          $("#bg-color-picker").val(this.etchBG);
        }
        this.currentLineX = this.pathPoints[0].points[0][0];
        this.currentLineY = this.pathPoints[0].points[0][1];
        this.reDraw();
        if (this.glowing) {
          $("#glow-button input").prop('checked', true);
          this.activateGlowMode();
        }
      } else {
        this.paths[this.pathsCount] = {path: new Path2D(), color: this.currentLineColor, lineWidth: this.currentLineWidth};
        this.currentLineX = this.dimensions.width / 2;
        this.currentLineY = this.dimensions.height / 2;
        this.pathPoints[this.pathsCount] = {
          points: [[this.currentLineX, this.currentLineY]],
          color: this.currentLineColor,
          lineWidth: this.currentLineWidth
        };
        this.persist();
        this.paths[this.pathsCount].path.moveTo(this.currentLineX, this.currentLineY);
      }
    // }

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
