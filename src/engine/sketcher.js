import { SKETCHER_UNIT_DIVIDING_FACTOR, CANVAS_DIMENTIONS } from "./conf.js";
// draw canvas items

export class Sketcher {
  /**
   *
   * @param {HTMLCanvasElement} canvas - canvas element
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.cntxt = this.canvas.getContext("2d");
    this._width = 0;
    this._height = 0;
    this._gameItems = {}; // Array of gameobjects within same zindex
    this._animationFrameKey = null;
    this._fps = 0;
    this._fpsCounter = 0;
    this.fpsIndicator = null;
    this._animator = () => {};

    this._setSketcherUnits();
    self.window.addEventListener("resize", this._setSketcherUnits.bind(this));
    // initiate the fps monitor
    setInterval(this._fpsSetter.bind(this), 1000);
  }

  /**
   * canvas width
   */
  get width() {
    return this._width;
  }

  /**
   * canvas height
   */
  get height() {
    return this._height;
  }

  get fps() {
    return this._fps;
  }

  get gameItems() {
    return this._gameItems;
  }

  get animator() {
    return this._animator;
  }

  /**
   * set animatior to be called in between each graphics drawing
   * @param {CallableFunction} - callable
   */
  set animator(callable) {
    this._animator = callable;
  }

  _setSketcherUnits() {
    const dimentions = this.canvas.getBoundingClientRect();
    const sketcherUnitH = dimentions.height / dimentions.width;
    CANVAS_DIMENTIONS.width =
      this._width =
      this.canvas.width =
        SKETCHER_UNIT_DIVIDING_FACTOR;
    CANVAS_DIMENTIONS.height =
      this._height =
      this.canvas.height =
        SKETCHER_UNIT_DIVIDING_FACTOR * sketcherUnitH;
  }

  _drawItems() {
    // draw in order
    const zIndices = Object.keys(this._gameItems).sort();
    for (const zIndex of zIndices) {
      const elems = this._gameItems[zIndex];
      // call custom animator
      this._animator(zIndex, elems);
      // draw elements
      this.cntxt.beginPath();
      this.cntxt.clearRect(0, 0, this.width, this.height);
      elems.forEach((item) => {
        if (item.skin)
          this.cntxt.drawImage(
            item.skin,
            0,
            0,
            item.skin.width,
            item.skin.height,
            item.x,
            item.y,
            item.width,
            item.height,
          );
        else {
          this.cntxt.fillStyle = item.fill;
          this.cntxt.fillRect(item.x, item.y, item.width, item.height);
        }
      });
    }
    this._fpsCounter++;
  }

  _fpsSetter() {
    this._fps = this._fpsCounter;
    this._fpsCounter = 0;
    if (this.fpsIndicator) this.fpsIndicator.innerText = this.fps;
  }

  /**
   * Add item to sketch scene
   * @param {BigInteger} zindex - z-index of item
   * @param {GameObject} item - game item to be drawn
   */
  addItem(zindex, item) {
    if (!this._gameItems[zindex]) this._gameItems[zindex] = [];
    this._gameItems[zindex].push(item);
  }

  /**
   * Start drawing
   */
  start() {
    const _animator = () => {
      this._drawItems();
      this._animationFrameKey = requestAnimationFrame(_animator);
    };
    _animator();
  }

  /**
   * Stop drawing
   */
  stop() {
    cancelAnimationFrame(this._animationFrameKey);
  }
}
