import { assetStore } from "../utils/asset-man.js"
import { GameObject } from "../engine/game-object.js"
import { CANVAS_DIMENTIONS, ANIMATION_VARS } from "../engine/conf.js"
import { CHARACTER_ZINDEX } from "./conf.js"

export class BGMaker {
  /**
  *
  * @param {Sketcher} sketcher - sketcher object
  */
  constructor(sketcher) {
    this.sketcher = sketcher
    this.sketcherZindices = [CHARACTER_ZINDEX - 7, CHARACTER_ZINDEX - 5, CHARACTER_ZINDEX - 3, CHARACTER_ZINDEX - 1]
    this.spaceAnimation = [-1, -2, -3, -4]
    this.layerXNow = [0, 0, 0, 0]
    this.layers = assetStore.img.bg;
    this.garbageCounter = 0

    const sampleBg = assetStore.img.bg[0]
    this.imgWidth = CANVAS_DIMENTIONS.height * sampleBg.width / sampleBg.height

    this.sketcherZindices.forEach((zi, i) => {
      ANIMATION_VARS.spaceAnimator.hzntlSpeed[zi] = this.spaceAnimation[i]
    })
    this.init();
  }

  _createNewBG(layerIndex) {
    this.garbageCounter++;
    const layer = new GameObject(`bg-layer-${layerIndex}-${this.garbageCounter}`, {
      skin: this.layers[layerIndex],
      x: this.layerXNow[layerIndex] + this.spaceAnimation[layerIndex] - 10, // adding a salt as well
      y: 0,
      width: this.imgWidth,
      height: CANVAS_DIMENTIONS.height,
      zIndex: this.sketcherZindices[layerIndex],
      gravity: false,
      deleteOnOffscreen: true,
      collitionVelocityDampingFactor: -1,
      exceptSpaceAnimation: false,
      disappearOnCollision: false
    })
    this.sketcher.addItem(this.sketcherZindices[layerIndex], layer)
    this.layerXNow[layerIndex] += this.imgWidth;
    console.debug("new bg created")
  }

  /**
   * Calculate and create new bg layers
   * @param {Number} zindex
   * @param {Array<GameObject>} _items
   * @returns
   */
  animator(zindex, _items) {
    const layerIndex = this.sketcherZindices.indexOf(parseInt(zindex));
    if (layerIndex < 0)
      return
    if (ANIMATION_VARS.spaceAnimator.status) {
      this.layerXNow[layerIndex] += this.spaceAnimation[layerIndex] * ANIMATION_VARS.animationSpeed;
    }
    while (this.layerXNow[layerIndex] < CANVAS_DIMENTIONS.width) this._createNewBG(layerIndex);
  }

  /**
  * Create initial bg layers
  */
  init() {
    [0, 1, 2, 3].forEach(index => this._createNewBG(index))
  }
}
