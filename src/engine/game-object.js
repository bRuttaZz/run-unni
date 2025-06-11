import { GRAVITY, CANVAS_DIMENTIONS, ANIMATION_VARS } from "./conf.js";

let globalGameObjectCounter = 0;

export class GameObject extends EventTarget {
  /**
   * Game Object. (on deleteion will emit 'deleted' event)
   * @param {String} name - name of the object
   * @param {Object} options - additional parameters
   * @param {HTMLImageElement} options.skin - object skin
   * @param {Number} options.x - x cordinate (in sketcher unit)
   * @param {Number} options.y - y cordinate (in sketcher unit)
   * @param {Number} options.width - width (in sketcher unit)
   * @param {Number} options.height - height (in sketcher unit)
   * @param {Number} options.zIndex - z-index // only elements in same z index interact
   * @param {Boolean} options.gravity - gravity to be applied on the object
   * @param {Boolean} options.deleteOnOffscreen - to delete if object went off-screen
   * @param {Number} options.collitionVelocityDampingFactor - damping factor
   * @param {Boolean} options.exceptSpaceAnimation - except space animation
   * @param {Boolean} options.disappearOnCollision - disappear on collision
   * @param {Number} options.leftOffset - left offset to draw skin (in sketcher unit)
   * @param {Number} options.rightOffset - right offset to draw skin (in sketcher unit)
   * @param {Number} options.topOffset - top offset to draw skin (in sketcher unit)
   * @param {Number} options.bottomOffset - bottom offset to draw skin (in sketcher unit)
   * @param {Boolean} options.preventDelete - prevent collition deleteions
   */
  constructor(name, options = {}) {
    super();
    const _options = {
      skin: null,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      zIndex: 0, // objects with negative zindex will not have collition
      gravity: false,
      deleteOnOffscreen: false,
      collitionVelocityDampingFactor: 1,
      exceptSpaceAnimation: false,
      disappearOnCollision: false,
      leftOffset: 0,
      rightOffset: 0,
      topOffset: 0,
      bottomOffset: 0,
      preventDelete: false,
      ...options,
    };
    this.id = ++globalGameObjectCounter;
    this.name = name;
    this.skin = _options.skin;
    this.x = _options.x;
    this.y = _options.y;
    this.width = _options.width;
    this.height = _options.height;
    this.fill = "green";
    this.zIndex = _options.zIndex;
    this.disappearOnCollision = _options.disappearOnCollision;
    this.leftOffset = _options.leftOffset;
    this.rightOffset = _options.rightOffset;
    this.topOffset = _options.topOffset;
    this.bottomOffset = _options.bottomOffset;
    this.preventDelete = _options.preventDelete;

    this.baseY = 0; // to handle motion with oscillation

    this.xVelocityVector = 0;
    this.yVelocityVector = 0;

    this.gravity = _options.gravity ? GRAVITY : 0;

    this.offScreen = false;
    this.deleteOnOffscreen = _options.deleteOnOffscreen;

    this.deleted = false;

    // anyway this collition not obay natural collition principles
    // (as it might get more complicated), now the try is to mimic that effect

    // value range from 0 to 1. 0 means completely damp all kinetic energy
    // 1 means perfect elastic collition.
    // in collition both objects damp factors are multiplied
    this.collitionVelocityDampingFactor =
      _options.collitionVelocityDampingFactor;

    this.spaceAnimation = !_options.exceptSpaceAnimation;

    // collition and animation handling
    this._newX = 0;
    this._newY = 0;
    // collition status are only valid for primary object (the one calculated first)
    this.isHorizontalCollided = false;
    this.isVerticalCollided = false;
    this.isCollided = false;

    this._spaceAnimationHzntlSpeed = 0;
    this._spaceAnimationVrtclSpeed = 0;
  }

  /**
  * Calculate space animation vectors
  */
  calcSpaceAnimVelocity() {
    const velocities = [];
    for (const velocity of [
      ANIMATION_VARS.spaceAnimator.hzntlSpeed,
      ANIMATION_VARS.spaceAnimator.vrtclSpeed,
    ])
      if (typeof velocity === "object") {
        let lastIndex = null;
        for (const _indx of Object.keys(velocity).sort()) {
          lastIndex = _indx;
          if (this.zIndex <= _indx) {
            velocities.push(velocity[_indx]);
            lastIndex = null;
            break;
          }
        }
        if (lastIndex !== null) velocities.push(velocity[lastIndex]);
      } else velocities.push(velocity);

    this._spaceAnimationHzntlSpeed = velocities[0]
    this._spaceAnimationVrtclSpeed = velocities[1]
  }

  /**
   *
   * @param {Boolean} calcX - whether to calc x velocity or not
   * @param {Boolean} calcY - whether to calc y velocity or not
   */
  calcMotion(calcX = true, calcY = true) {
    if (calcX) this._newX = this.x + this.xVelocityVector * ANIMATION_VARS.animationSpeed;
    if (calcY) {
      this.yVelocityVector += this.gravity;
      if (this.baseY) {
        this.y = this.baseY;
        this._newY = this.baseY + this.yVelocityVector * ANIMATION_VARS.animationSpeed;
        // console.log(this.baseY, this._newY, this.yVelocityVector);
      }
      else
        this._newY = this.y + this.yVelocityVector * ANIMATION_VARS.animationSpeed;
    }
  }

  /**
   * Apply custom displacement (collition properties may not work proper here)
   * @param {Number} xDisplaceMent - in sketcher units
   * @param {Number} yDisplaceMent - in sketcher units
   */
  applyDisplacement(xDisplaceMent, yDisplaceMent) {
    this.x += xDisplaceMent;
    this.y += yDisplaceMent;
  }

  /**
   * Calculate collition with other object
   * @param {GameObject} object - object to be calculate collition with
   */
  calcCollition(object) {
    if (this.deleted) return;
    if (
      this._newX <= object.x + object.width &&
      this._newX + this.width >= object.x &&
      this._newY <= object.y + object.height &&
      this._newY + this.height >= object.y
    ) {
      // this collided with object
      if (object.disappearOnCollision) {
        object.deleted = true
        return
      }
      if (this.disappearOnCollision) {
        this.deleted = true
        return
      }

      const right_ = Math.max(this._newX + this.width, object.x + object.width);
      const left_ = Math.min(this._newX, object.x);
      const hrzntlIntercept = -(right_ - left_ - this.width - object.width);

      const down_ = Math.max(
        this._newY + this.height,
        object.y + object.height,
      );
      const up_ = Math.min(this._newY, object.y);
      const vrtclIntercept = -(down_ - up_ - this.height - object.height);

      if (hrzntlIntercept > vrtclIntercept) {
        // collition happened horizontally
        if (this._newY + this.height > object.y + object.height / 2) {
          // this under other object
          this._newY = object.y + object.height;
        } else {
          // this above other object
          this._newY = object.y - this.height;
        }

        // avoid calculating zero scenario
        if (this.gravity)
          this.yVelocityVector =
            -this.yVelocityVector * object.collitionVelocityDampingFactor;
        if (object.gravity)
          object.yVelocityVector =
            -object.yVelocityVector * this.collitionVelocityDampingFactor;

        this.isHorizontalCollided = true;
        this.isVerticalCollided = false;

      } else {
        // collision happened vrtically
        if (this._newX + this.width > object.x + object.width / 2) {
          // this right to the other object
          this._newX = object.x + object.width;
        } else {
          // this left to the other object
          this._newX = object.x - this.width;
        }

        // avoid calculating zero scenario
        if (this.gravity)
          this.xVelocityVector =
            -this.xVelocityVector * object.collitionVelocityDampingFactor;
        if (object.gravity)
          object.xVelocityVector =
            -object.xVelocityVector * this.collitionVelocityDampingFactor;

        this.isHorizontalCollided = false;
        this.isVerticalCollided = true;
      }
      this.isCollided = true;
    }
  }

  /**
   * wrap object animation calculations
   */
  wrap() {
    if (this.deleted && !this.preventDelete) return false;
    this.x = this._newX;
    this.y = this._newY;
    if (
      this.x + this.width < 0 ||
      // this.y + this.height < 0 || // forgive objects going to top (they may come back ;)
      // this.x > CANVAS_DIMENTIONS.width ||  // forgive objects in the right direction
      this.y > CANVAS_DIMENTIONS.height
    ) {
      this.offScreen = true;
      return !this.deleteOnOffscreen;
    }
    return true;
  }
}
