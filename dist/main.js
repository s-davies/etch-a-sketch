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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return EtchASketch; });\n/* harmony import */ var _sketch_area__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sketch_area */ \"./src/sketch_area.js\");\n\n\nconst KEYSPEED = 2;\nconst KNOBSPEED = 4;\nclass EtchASketch {\n  constructor(canvas) {\n    this.ctx = canvas.getContext(\"2d\");\n    this.dimensions = { width: canvas.width, height: canvas.height };\n    this.drawLine = this.drawLine.bind(this);\n    this.pressKey = this.pressKey.bind(this);\n    this.releaseKey = this.releaseKey.bind(this);\n    this.clearSketch = this.clearSketch.bind(this);\n    this.keys = [];\n    this.leftKnobRotation = 0;\n    this.rightKnobRotation = 0;\n    this.restart();\n    $(document).on('keydown', this.pressKey);\n    $(document).on('keyup', this.releaseKey);\n\n    $(\".etch-border\").draggable({\n      revert: true,\n      revertDuration: 200,\n      start: this.clearSketch\n    });\n  }\n\n  clearSketch() {\n    // this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);\n    this.ctx.beginPath();\n    // this.currentLineX = this.dimensions.width / 2;\n    // this.currentLineY = this.dimensions.height / 2;\n    this.ctx.moveTo(this.currentLineX, this.currentLineY);\n    this.sketchArea.animate(this.ctx);\n  }\n\n  pressKey(e) {\n    e.preventDefault();\n    this.keys[e.keyCode] = true;\n    const that = this;\n    if (this.keys[37] && this.currentLineX > 0) {\n      this.drawLine(\"left\");\n      that.leftKnobRotation -= KNOBSPEED;\n      $('.left-front').css(\"transform\", \"rotateZ(\" + that.leftKnobRotation + \"deg)\");\n    } \n    if (this.keys[38] && this.currentLineY > 0) {\n      this.drawLine(\"up\");\n      that.rightKnobRotation += KNOBSPEED;\n      $('.right-front').css(\"transform\", \"rotateZ(\" + that.rightKnobRotation + \"deg)\");\n    } \n    if (this.keys[39] && this.currentLineX < this.dimensions.width) {\n      this.drawLine(\"right\");\n      that.leftKnobRotation += KNOBSPEED;\n      $('.left-front').css(\"transform\", \"rotateZ(\" + that.leftKnobRotation + \"deg)\");\n    } \n    if (this.keys[40] && this.currentLineY < this.dimensions.height ) {\n      this.drawLine(\"down\");\n      that.rightKnobRotation -= KNOBSPEED;\n      $('.right-front').css(\"transform\", \"rotateZ(\" + that.rightKnobRotation + \"deg)\");\n    }\n    \n  }\n\n  releaseKey(e) {\n    this.keys[e.keyCode] = false;\n  }\n\n  drawLine(direction) {\n    if (direction === \"left\") {\n      this.currentLineX -= KEYSPEED;\n      this.ctx.lineTo(this.currentLineX, this.currentLineY);\n      this.ctx.moveTo(this.currentLineX, this.currentLineY);\n      this.ctx.stroke();\n    }\n\n    if (direction === \"right\") {\n      this.currentLineX += KEYSPEED;\n      this.ctx.lineTo(this.currentLineX, this.currentLineY);\n      this.ctx.moveTo(this.currentLineX, this.currentLineY);\n      this.ctx.stroke();\n    }\n\n    if (direction === \"down\") {\n      this.currentLineY += KEYSPEED;\n      this.ctx.lineTo(this.currentLineX, this.currentLineY);\n      this.ctx.moveTo(this.currentLineX, this.currentLineY);\n      this.ctx.stroke();\n    }\n\n    if (direction === \"up\") {\n      this.currentLineY -= KEYSPEED;\n      this.ctx.lineTo(this.currentLineX, this.currentLineY);\n      this.ctx.moveTo(this.currentLineX, this.currentLineY);\n      this.ctx.stroke();\n    }\n  }\n\n  play() {\n    this.running = true;\n    this.animate();\n  }\n\n  restart() {\n    this.running = false;\n    this.sketchArea = new _sketch_area__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this.dimensions);\n    \n    this.animate();\n    //set starting position\n    this.ctx.lineWidth = 1;\n    this.ctx.beginPath();\n    this.currentLineX = this.dimensions.width / 2;\n    this.currentLineY = this.dimensions.height / 2;\n    this.ctx.moveTo(this.currentLineX, this.currentLineY);\n    // this.ctx.lineTo(140, 140);\n    // this.ctx.stroke();\n  }\n    \n  \n\n  //redraw\n  animate() {\n    this.sketchArea.animate(this.ctx);\n    \n    //don't animate if game not running\n    if (this.running) {\n      requestAnimationFrame(this.animate.bind(this));\n    }\n  }\n\n}\n\n\n//# sourceURL=webpack:///./src/game.js?");

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