/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return EtchASketch; });\n/* harmony import */ var _sketch_area__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sketch_area */ \"./src/sketch_area.js\");\n\n\nconst KEYSPEED = 2;\nconst KNOBSPEED = 4;\nconst SHAKE_DISTANCE = 20;\nclass EtchASketch {\n  constructor(canvas) {\n    this.ctx = canvas.getContext(\"2d\");\n    this.dimensions = { width: canvas.width, height: canvas.height };\n    this.drawLine = this.drawLine.bind(this);\n    this.pressKey = this.pressKey.bind(this);\n    this.releaseKey = this.releaseKey.bind(this);\n    this.clearSketch = this.clearSketch.bind(this);\n    this.detectShake = this.detectShake.bind(this);\n    this.startShakeTimer = this.startShakeTimer.bind(this);\n    this.measureShake = this.measureShake.bind(this);\n    this.stopShakeTimer = this.stopShakeTimer.bind(this);\n    this.turnLeftKnob = this.turnLeftKnob.bind(this);\n    this.turnRightKnob = this.turnRightKnob.bind(this);\n    this.shakeCount = 0;\n    this.lastShakeDir = \"none\";\n    this.prevLeft = $(\".etch-border\").position().left;\n    this.prevTop = $(\".etch-border\").position().top;\n    this.keys = [];\n    this.leftKnobRotation = 0;\n    this.rightKnobRotation = 0;\n    this.restart();\n    $(document).on('keydown', this.pressKey);\n    $(document).on('keyup', this.releaseKey);\n\n    $(\".etch-border\").draggable({\n      revert: true,\n      revertDuration: 200,\n      scroll: false,\n      start: this.startShakeTimer,\n      drag: this.detectShake,\n      stop: this.stopShakeTimer,\n      \n    });\n    this.leftKnobDraggable = Draggable.create(\".left-front\", { \n      type: \"rotation\",\n      onPress: () => $(\".etch-border\").css(\"cursor\", \"grabbing\"),\n      onRelease: () => $(\".etch-border\").css(\"cursor\", \"grab\"),\n      onDrag: this.turnLeftKnob\n    });\n\n    this.rightKnobDraggable = Draggable.create(\".right-front\", {\n      type: \"rotation\",\n      onPress: () => $(\".etch-border\").css(\"cursor\", \"grabbing\"),\n      onRelease: () => $(\".etch-border\").css(\"cursor\", \"grab\"),\n      onDrag: this.turnRightKnob\n    });\n  }\n\n\n  turnLeftKnob(e) {\n    if (this.leftKnobDraggable[0].rotation < this.leftKnobRotation) {\n      this.currentLineX -= KEYSPEED/2;\n      this.ctx.lineTo(this.currentLineX, this.currentLineY);\n      this.ctx.moveTo(this.currentLineX, this.currentLineY);\n      this.ctx.stroke();\n    } else if (this.leftKnobDraggable[0].rotation > this.leftKnobRotation) {\n      this.currentLineX += KEYSPEED/2;\n      this.ctx.lineTo(this.currentLineX, this.currentLineY);\n      this.ctx.moveTo(this.currentLineX, this.currentLineY);\n      this.ctx.stroke();\n    }\n    this.leftKnobRotation = this.leftKnobDraggable[0].rotation;\n  }\n\n  turnRightKnob(e) {\n    if (this.rightKnobDraggable[0].rotation < this.rightKnobRotation) {\n      this.currentLineY += KEYSPEED / 2;\n      this.ctx.lineTo(this.currentLineX, this.currentLineY);\n      this.ctx.moveTo(this.currentLineX, this.currentLineY);\n      this.ctx.stroke();\n    } else if (this.rightKnobDraggable[0].rotation > this.rightKnobRotation) {\n      this.currentLineY -= KEYSPEED / 2;\n      this.ctx.lineTo(this.currentLineX, this.currentLineY);\n      this.ctx.moveTo(this.currentLineX, this.currentLineY);\n      this.ctx.stroke();\n    }\n    this.rightKnobRotation = this.rightKnobDraggable[0].rotation;\n  }\n\n  startShakeTimer() {\n    this.shakeTimer = setInterval(this.measureShake, 300);\n  }\n\n  stopShakeTimer() {\n    clearInterval(this.shakeTimer);\n    this.shakeCount = 0;\n  }\n\n  measureShake() {\n    if (this.shakeCount > 0) {\n      //decrease the shakecount so long breaks between shakes don't get counted\n      this.shakeCount -= 1;\n    }\n    let etchPos = $(\".etch-border\").position();\n    if (this.shakeCount > 3) {\n      this.clearSketch();\n      this.shakeCount = 0;\n    }\n    this.prevLeft = etchPos.left;\n    this.prevTop = etchPos.top;\n  }\n\n  detectShake() {\n    let etchPos = $(\".etch-border\").position();\n    let curShakeDir;\n    if (etchPos.top < this.prevTop && etchPos.left < this.prevLeft) {\n      curShakeDir = \"tl\";\n    } else if (etchPos.top < this.prevTop && etchPos.left > this.prevLeft) {\n      curShakeDir = \"tr\";\n    } else if (etchPos.top > this.prevTop && etchPos.left > this.prevLeft) {\n      curShakeDir = \"br\";\n    } else if (etchPos.top > this.prevTop && etchPos.left < this.prevLeft) {\n      curShakeDir = \"bl\";\n    }\n    //make sure the shakes are moving enough, and that they are in the opposite direction of the last move\n    if ((etchPos.top > this.prevTop + SHAKE_DISTANCE && this.lastShakeDir !== \"bl\" && this.lastShakeDir !== \"br\") ||\n      (etchPos.top < this.prevTop - SHAKE_DISTANCE && this.lastShakeDir !== \"tl\" && this.lastShakeDir !== \"tr\") ||\n      (etchPos.left > this.prevLeft + SHAKE_DISTANCE && this.lastShakeDir !== \"tr\" && this.lastShakeDir !== \"br\") ||\n      (etchPos.left < this.prevLeft - SHAKE_DISTANCE && this.lastShakeDir !== \"tl\" && this.lastShakeDir !== \"bl\")\n    ) {\n      this.shakeCount += 1;\n      this.prevLeft = etchPos.left;\n      this.prevTop = etchPos.top;\n    }\n    this.lastShakeDir = curShakeDir;\n\n  }\n\n\n\n  clearSketch() {\n    // this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);\n    this.ctx.beginPath();\n    // this.currentLineX = this.dimensions.width / 2;\n    // this.currentLineY = this.dimensions.height / 2;\n    this.ctx.moveTo(this.currentLineX, this.currentLineY);\n    this.sketchArea.animate(this.ctx);\n  }\n\n  pressKey(e) {\n    e.preventDefault();\n    this.keys[e.keyCode] = true;\n    const that = this;\n    if (this.keys[37] && this.currentLineX > 0) {\n      this.drawLine(\"left\");\n      that.leftKnobRotation -= KNOBSPEED;\n      $('.left-front').css(\"transform\", \"rotateZ(\" + that.leftKnobRotation + \"deg)\");\n    } \n    if (this.keys[38] && this.currentLineY > 0) {\n      this.drawLine(\"up\");\n      that.rightKnobRotation += KNOBSPEED;\n      $('.right-front').css(\"transform\", \"rotateZ(\" + that.rightKnobRotation + \"deg)\");\n    } \n    if (this.keys[39] && this.currentLineX < this.dimensions.width) {\n      this.drawLine(\"right\");\n      that.leftKnobRotation += KNOBSPEED;\n      $('.left-front').css(\"transform\", \"rotateZ(\" + that.leftKnobRotation + \"deg)\");\n    } \n    if (this.keys[40] && this.currentLineY < this.dimensions.height ) {\n      this.drawLine(\"down\");\n      that.rightKnobRotation -= KNOBSPEED;\n      $('.right-front').css(\"transform\", \"rotateZ(\" + that.rightKnobRotation + \"deg)\");\n    }\n    if (e.keyCode === 32) {\n      this.clearSketch();\n    }\n    \n  }\n\n  releaseKey(e) {\n    this.keys[e.keyCode] = false;\n  }\n\n\n  drawLine(direction) {\n    if (direction === \"left\") {\n      this.currentLineX -= KEYSPEED;\n      this.ctx.lineTo(this.currentLineX, this.currentLineY);\n      this.ctx.moveTo(this.currentLineX, this.currentLineY);\n      this.ctx.stroke();\n    }\n\n    if (direction === \"right\") {\n      this.currentLineX += KEYSPEED;\n      this.ctx.lineTo(this.currentLineX, this.currentLineY);\n      this.ctx.moveTo(this.currentLineX, this.currentLineY);\n      this.ctx.stroke();\n    }\n\n    if (direction === \"down\") {\n      this.currentLineY += KEYSPEED;\n      this.ctx.lineTo(this.currentLineX, this.currentLineY);\n      this.ctx.moveTo(this.currentLineX, this.currentLineY);\n      this.ctx.stroke();\n    }\n\n    if (direction === \"up\") {\n      this.currentLineY -= KEYSPEED;\n      this.ctx.lineTo(this.currentLineX, this.currentLineY);\n      this.ctx.moveTo(this.currentLineX, this.currentLineY);\n      this.ctx.stroke();\n    }\n  }\n\n  play() {\n    this.running = true;\n    this.animate();\n  }\n\n  restart() {\n    this.running = false;\n    this.sketchArea = new _sketch_area__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this.dimensions);\n    \n    this.animate();\n    //set starting position\n    this.ctx.lineWidth = 1;\n    this.ctx.beginPath();\n    this.currentLineX = this.dimensions.width / 2;\n    this.currentLineY = this.dimensions.height / 2;\n    this.ctx.moveTo(this.currentLineX, this.currentLineY);\n    // this.ctx.lineTo(140, 140);\n    // this.ctx.stroke();\n  }\n    \n  \n\n  //redraw\n  animate() {\n    this.sketchArea.animate(this.ctx);\n    \n    //don't animate if game not running\n    if (this.running) {\n      requestAnimationFrame(this.animate.bind(this));\n    }\n  }\n\n}\n\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./src/game.js\");\n\n\nconst canvas = document.getElementById('etch-space');\nnew _game__WEBPACK_IMPORTED_MODULE_0__[\"default\"](canvas);\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/sketch_area.js":
/*!****************************!*\
  !*** ./src/sketch_area.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SketchArea; });\nclass SketchArea {\n  constructor(dimensions) {\n    this.dimensions = dimensions;\n    \n    $(\".etch-border\").on('mousedown', (e) => {\n      $(\".etch-border\").css(\"cursor\", \"grabbing\");\n    });\n    $(\".etch-border\").on('mouseup', (e) => {\n      $(\".etch-border\").css(\"cursor\", \"grab\");\n    });\n  }\n\n  \n\n\n  animate(ctx) {\n    this.drawBackground(ctx);\n  }\n\n  drawBackground(ctx) {\n    const my_gradient = ctx.createLinearGradient(180, 180, 0, 0);\n    my_gradient.addColorStop(0, \"#aaaaaa\");\n    my_gradient.addColorStop(1, \"#c9c6c6\");\n    ctx.fillStyle = my_gradient;\n    ctx.fillRect(0, 0, this.dimensions.width, this.dimensions.height);\n  }\n}\n\n\n//# sourceURL=webpack:///./src/sketch_area.js?");

/***/ })

/******/ });