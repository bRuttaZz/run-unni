// create random yet possible paths
import {
  CANVAS_DIMENTIONS,
  ANIMATION_VARS,
} from "../engine/conf.js";
import {
  JUMP_VELOCITY,
  CHARACTER_ZINDEX,
  PLATFORM_DIMENTIONS,
  scoreBoard
} from "./conf.js";
import { GameObject } from "../engine/game-object.js";
import { assetStore } from "../utils/asset-man.js";
import { audioEngine } from "../audio-engine/engine.js"


/**
* Randomly create new gems on top of paths
* @param {GameObject} path - path gameobject
* @param {Sketcher} sketcher - sketcher object
*/
function spawnRandomCoins(path, sketcher) {
  if (Math.random() < 0.5) return // avoid drawing in 50 % of times
  // oscillating particle
  const particleWidth = 200
  const gem = new GameObject(`magestic-gem-${path.name}`, {
    x: path.x + path.width / 2 - particleWidth / 2,
    y: path.y - 300 - 300 * Math.random(),
    width: particleWidth - 160,
    height: particleWidth - 100,
    zIndex: CHARACTER_ZINDEX,
    gravity: false,
    disappearOnCollision: true,
    collitionVelocityDampingFactor: 0,
    deleteOnOffscreen: true,
    skin: assetStore.img.gem[0],
    leftOffset: 80,
    rightOffset: 80,
    topOffset: 50,
    bottomOffset: 50,
  });
  gem.oscillation = true;
  gem.oscillationVelocityMax = 2;
  gem.oscillationAccilertaion = 0.1;

  gem.addEventListener("deleted", () => {
    if (gem.deleted) {
      scoreBoard.magesticGem++;
      audioEngine.play("coin")
    }
  })

  sketcher.addItem(CHARACTER_ZINDEX, gem);
}

/**
 * create new platform image
 * @param {Number} type - type of platfom (either 1 or 2)
 * @param {Number} widthBolcks - number of intermediate blocks to be added
 * @param {HTMLImageElement} - image block of path
 */
function createPlatformImage(type, widthBolcks = 1) {
  const platformCategory = `platform${type}`;
  if (!assetStore.img[platformCategory])
    throw `Platoform type '${type}' not found!`;
  const canvas = document.createElement("canvas");
  const cntxt = canvas.getContext("2d");
  canvas.width = cntxt.width =
    PLATFORM_DIMENTIONS.blockWidth * (2 + widthBolcks);
  canvas.height = cntxt.width = PLATFORM_DIMENTIONS.blockHeight;

  let sx = 0;
  cntxt.drawImage(
    assetStore.img[platformCategory][0],
    0,
    0,
    PLATFORM_DIMENTIONS.blockWidth,
    PLATFORM_DIMENTIONS.blockHeight,
    sx,
    0,
    PLATFORM_DIMENTIONS.blockWidth,
    PLATFORM_DIMENTIONS.blockHeight,
  );
  sx += PLATFORM_DIMENTIONS.blockWidth;
  while (widthBolcks > 0) {
    cntxt.drawImage(
      assetStore.img[platformCategory][1],
      0,
      0,
      PLATFORM_DIMENTIONS.blockWidth,
      PLATFORM_DIMENTIONS.blockHeight,
      sx,
      0,
      PLATFORM_DIMENTIONS.blockWidth,
      PLATFORM_DIMENTIONS.blockHeight,
    );
    sx += PLATFORM_DIMENTIONS.blockWidth;
    widthBolcks--;
  }
  cntxt.drawImage(
    assetStore.img[platformCategory][2],
    0,
    0,
    PLATFORM_DIMENTIONS.blockWidth,
    PLATFORM_DIMENTIONS.blockHeight,
    sx,
    0,
    PLATFORM_DIMENTIONS.blockWidth,
    PLATFORM_DIMENTIONS.blockHeight,
  );
  const image = new Image();
  image.src = canvas.toDataURL();
  return image;
}

export class Wayfinder {
  /**
   * Wayfinder : create path
   * @param {Sketcher} sketcher - sketcher object being used
   */
  constructor(sketcher) {
    this.sketcher = sketcher;

    this.xNextPath = 0; // initial path x pos
    this.yNextPath = CANVAS_DIMENTIONS.height - 90; // initial path height
    this.maxGap = 300;
    this.minGap = 200;
    this.maxY = CANVAS_DIMENTIONS.height - 80;
    this.minY = CANVAS_DIMENTIONS.height - 250;

    this.maxPathWidthBlocks = 4;
    this.minHeightDiff = 20;
    this.maxHeightDiff = JUMP_VELOCITY * 6;

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

    let _pathMidblocks;
    if (this.pathCounter == 1) _pathMidblocks = 6;
    else _pathMidblocks = 1 + parseInt(Math.random() * this.maxPathWidthBlocks);
    let _pathWidth = (2 + _pathMidblocks) * PLATFORM_DIMENTIONS.drawWidth;
    const _platformImg = createPlatformImage(
      1 + Math.floor(Math.random() * 2),
      _pathMidblocks,
    );

    const path = new GameObject(`path-${this.pathCounter}`, {
      skin: _platformImg,
      x: this.xNextPath,
      y: this.yNextPath,
      width: _pathWidth,
      height: PLATFORM_DIMENTIONS.drawHeight,
      zIndex: CHARACTER_ZINDEX,
      gravity: false,
      deleteOnOffscreen: true,
      exceptSpaceAnimation: false,
      collitionVelocityDampingFactor: 0.2, // collision damping caused by path,
      leftOffset: 35,
      rightOffset: 35,
      topOffset: 2,
      preventDelete: true,
    });
    spawnRandomCoins(path, this.sketcher);
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
      this.xNextPath += this.spaceAnimVelocity * ANIMATION_VARS.animationSpeed;
    }
    // create new path items if not already there
    while (this.xNextPath < CANVAS_DIMENTIONS.width) this._buildNewPath();
  }
}
