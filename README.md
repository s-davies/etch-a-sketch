![alt text](images/Header.png)

The Etch-A-Sketch has arrived for the next generation. Experience this new take on the classic drawing toy, and utilize novel functionality such as color choice and image tracing to bring your sketches to life.
Flip
[LIVE SITE](https://s-davies.github.io/etch-a-sketch/)

## Features

Turn knobs or use arrow keys to draw

![alt text](images/draw.gif)

Shake to clear sketch

![alt text](images/shake.gif)

Pick your line and background colors

![alt text](images/color.gif)

Draw all night with Glow Mode

![alt text](images/glow.gif)

Upload an image onto the sketch area to serve as a tracing guide

![alt text](images/upload.gif)

See your sketch come to life with Re-Draw

![alt text](images/redraw.gif)

## Technologies

- JavaScript
- jQuery
- jQuery UI

## Code Snippets

One of the available features is the ability to watch a sketch be redrawn 
the same way it was originally sketched. 

First, the canvas sketch area is cleared, and if the user has a background image
uploaded on the canvas for tracing purposes, this image is redrawn as well. A 
timeoutMultiplier variable for controlling animation speed is set, as well as a
paths property object that will hold all paths to be animated.

```javascript
reDraw() {
  this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
  if (this.showImg && this.etchBGImg) this.drawImg();

  let timeoutMultiplier = 0;
  this.paths = {};
  //for loops below...
}
```

Next, an array of previously persisted canvas Path2D objects is iterated through.
The points of a path and the path's color are both stored in variables. A new
Path2D object is stored in the paths object for use in the reanimation.

```javascript
for (let i = 0; i < Object.keys(this.pathPoints).length; i++) {
  const points = this.pathPoints[i].points;
  this.pathsCount = i;
  this.currentLineColor = this.pathPoints[i].color;
  this.paths[this.pathsCount] = { path: new Path2D(), color: this.currentLineColor};
  //inner for loop below...
}
```

In the inner for loop, each point of a path is drawn. If glow mode is active,
the line color is set to the glow default color. The left and right knobs are
animated to turn based on a point's position relative to the previous point. All
of the drawing code occurs within a setTimeout whose delay length is determined
by the timeoutMultiplier multiplied by a constant. Since the multiplier is increased by one after every inner loop
iteration, the path points are drawn with even time between them, thus giving the appearance of a
line being smoothly drawn.

```javascript
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
      this.leftKnobRotation += KNOBSPEED;
      $('.left-front').css("transform", "rotateZ(" + this.leftKnobRotation + "deg)");
    }
    if (points[j - 1] && coordinates[0] < points[j - 1][0]) {
      this.leftKnobRotation -= KNOBSPEED;
      $('.left-front').css("transform", "rotateZ(" + this.leftKnobRotation + "deg)");
    }
    if (points[j - 1] && coordinates[1] > points[j - 1][1]) {
      this.rightKnobRotation -= KNOBSPEED;
      $('.right-front').css("transform", "rotateZ(" + this.rightKnobRotation + "deg)");
    }
    if (points[j - 1] && coordinates[1] < points[j - 1][1]) {
      this.rightKnobRotation += KNOBSPEED;
      $('.right-front').css("transform", "rotateZ(" + this.rightKnobRotation + "deg)");
    }
  }, timeoutMultiplier*20);
  timeoutMultiplier += 1;
}
```