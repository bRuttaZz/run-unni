import { SKETCHER_UNIT_DIVIDING_FACTOR, CANVAS_DIMENTIONS, MAX_FPS } from "./conf.js";
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
    this._drawCallbacks = () => { }; // executed on each canvas draw
    this._animator = () => { };

    this.FPS = MAX_FPS
    this.frameIntervel = 1000 / MAX_FPS;
    this._lastRefreshTime = 0;

    this.canvasBgImg = canvas.style.backgroundImage

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

  get drawCallbacks() {
    return this._drawCallbacks;
  }

  /**
   * set callbacks to be called on each canvas draw event
   * @param {CallableFunction} - callable
   */
  set drawCallbacks(callable) {
    return this._drawCallbacks = callable
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
    this._drawCallbacks();
    this.cntxt.clearRect(0, 0, this.width, this.height);
    for (const zIndex of this._zIndices) {
      const elems = this._gameItems[zIndex];
      // call custom animator
      this._animator(zIndex, elems);
      // draw elements
      this.cntxt.beginPath();
      elems.forEach((item) => {
        if (item.skin)
          this.cntxt.drawImage(
            item.skin,
            0,
            0,
            item.skin.width,
            item.skin.height,
            item.x - item.leftOffset,
            item.y - item.topOffset,
            item.width + item.leftOffset + item.rightOffset,
            item.height + item.topOffset + item.bottomOffset,
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
    item.zIndex = zindex;
    item.calcSpaceAnimVelocity();
    if (!this._gameItems[zindex]) this._gameItems[zindex] = [];
    this._gameItems[zindex].push(item);
  }

  /**
   * Start drawing
   */
  start() {
    this.canvas.style.backgroundImage = "none"
    this._zIndices = Object.keys(this._gameItems).sort();
    const _animator = (time) => {
      this._animationFrameKey = requestAnimationFrame(_animator);

      if (time - this._lastRefreshTime < this.frameIntervel)
        return
      this._lastRefreshTime = time;
      this._drawItems();
    };
    _animator();
  }

  /**
   * Stop drawing
   */
  stop() {
    cancelAnimationFrame(this._animationFrameKey);
  }

  /**
  * Reset sketcher
  */
  reset() {
    this._gameItems = {}
    this._drawCallbacks = () => { };
    this._animator = () => { };
    this.cntxt.clearRect(0, 0, this.width, this.height);
    this.canvas.style.backgroundImage = this.canvasBgImg;
  }
}
