// create random yet possible paths
import {
  CANVAS_DIMENTIONS,
  ANIMATION_VARS,
  ANIMATION_SPEED,
} from "../engine/conf.js";
import { JUMP_VELOCITY, CHARACTER_ZINDEX } from "./conf.js";
import { GameObject } from "../engine/game-object.js";

export class Wayfinder {
  /**
   * Wayfinder : create path
   * @param {Sketcher} sketcher - sketcher object being used
   */
  constructor(sketcher) {
    this.sketcher = sketcher;

    this.xNextPath = 0; // initial path x pos
    this.yNextPath = CANVAS_DIMENTIONS.height - 20; // initial path height
    this.maxGap = 150;
    this.minGap = 100;
    this.maxY = CANVAS_DIMENTIONS.height - 30;
    this.minY = CANVAS_DIMENTIONS.height - 500;
    this.maxWidth = 200;
    this.minWidth = 50;
    this.minHeightDiff = 10;
    this.maxHeightDiff = JUMP_VELOCITY * 3;

    this.pathThickness = 10;
    this.pathCounter = 0;

    let spaceAnimVelocity = ANIMATION_VARS.spaceAnimator.hzntlSpeed;
    if (typeof spaceAnimVelocity == "object") {
      let lastIndex = null;
      for (const index of Object.keys(spaceAnimVelocity).sort()) {
        lastIndex = index;
        if (CHARACTER_ZINDEX <= index) {
          spaceAnimVelocity = spaceAnimVelocity[index];
          lastIndex = null;
          break;
        }
      }
      if (lastIndex !== null) spaceAnimVelocity = spaceAnimVelocity[lastIndex];
    }
    this.spaceAnimVelocity = spaceAnimVelocity;
  }

  // TODO: update x and y according to space animation
  _buildNewPath() {
    this.pathCounter++;

    let _pathWidth;
    if (this.pathCounter == 1) _pathWidth = 200;
    else
      _pathWidth =
        this.minWidth + Math.random() * (this.maxWidth - this.minWidth);

    const path = new GameObject(`path-${this.pathCounter}`, {
      skin: null,
      x: this.xNextPath,
      y: this.yNextPath,
      width: _pathWidth,
      height: this.pathThickness,
      zIndex: CHARACTER_ZINDEX,
      gravity: false,
      deleteOnOffscreen: true,
      exceptSpaceAnimation: false,
      collitionVelocityDampingFactor: 0.6,
    });
    this.sketcher.addItem(CHARACTER_ZINDEX, path);

    // calc next path x and y
    this.xNextPath +=
      _pathWidth + this.minGap + Math.random() * (this.maxGap - this.minGap);

    const y_ =
      this.yNextPath +
      (Math.random() <= 0.5 ? -1 : 1) *
        (this.minHeightDiff +
          Math.random() * (this.maxHeightDiff - this.minHeightDiff));
    if (y_ > this.maxY) this.yNextPath = this.maxY;
    else if (y_ < this.minY) this.yNextPath = this.minY;
    else this.yNextPath = y_;
    console.debug("path-created", path.name);
  }

  /**
   * Calculate and create new path items
   * @param {Number} zindex
   * @param {Array<GameObject>} _items
   * @returns
   */
  animator(zindex, _items) {
    if (zindex != CHARACTER_ZINDEX) return; // avoid duplicates
    // update x and y
    if (ANIMATION_VARS.spaceAnimator.status) {
      this.xNextPath += this.spaceAnimVelocity * ANIMATION_SPEED;
    }
    // create new path items if not already there
    while (this.xNextPath < CANVAS_DIMENTIONS.width) this._buildNewPath();
  }
}
