import { GRAVITY, CANVAS_DIMENTIONS, ANIMATION_SPEED } from "./conf.js";

export class GameObject {
  /**
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
   */
  constructor(name, options = {}) {
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
      ...options,
    };
    this.name = name;
    this.skin = _options.skin;
    this.x = _options.x;
    this.y = _options.y;
    this.width = _options.width;
    this.height = _options.height;
    this.fill = "green";
    this.zIndex = _options.zIndex;

    this.xVelocityVector = 0;
    this.yVelocityVector = 0;

    this.gravity = _options.gravity ? GRAVITY : 0;

    this.offScreen = false;
    this.deleteOnOffscreen = _options.deleteOnOffscreen;

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
  }

  /**
   *
   * @param {Boolean} calcX - whether to calc x velocity or not
   * @param {Boolean} calcY - whether to calc y velocity or not
   */
  calcMotion(calcX = true, calcY = true) {
    if (calcX) this._newX = this.x + this.xVelocityVector * ANIMATION_SPEED;
    if (calcY) {
      this.yVelocityVector += this.gravity;
      this._newY = this.y + this.yVelocityVector * ANIMATION_SPEED;
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
    if (
      this._newX <= object.x + object.width &&
      this._newX + this.width >= object.x &&
      this._newY <= object.y + object.height &&
      this._newY + this.height >= object.y
    ) {
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
        if (this._newY > this.y)
          // object moved down
          this._newY = object.y - this.height;
        else
          // object moved up
          this._newY = object.y + object.height;
        if (this.gravity)
          this.yVelocityVector =
            -this.yVelocityVector * object.collitionVelocityDampingFactor;
        if (object.gravity)
          object.yVelocityVector =
            -this.yVelocityVector * object.collitionVelocityDampingFactor;
      } else {
        if (this._newX > this.x)
          // object moved to right
          this._newX = object.x - this.width;
        else
          // object moved to left
          this._newX = object.x + object.width;
        if (this.gravity)
          this.xVelocityVector =
            -this.xVelocityVector * object.collitionVelocityDampingFactor;
        if (object.gravity)
          object.xVelocityVector =
            -this.xVelocityVector * object.collitionVelocityDampingFactor;
      }
    }
  }

  /**
   * wrap object animation calculations
   */
  wrap() {
    this.x = this._newX;
    this.y = this._newY;
    if (
      this.x + this.width < 0 ||
      this.y + this.height < 0 ||
      this.x > CANVAS_DIMENTIONS.width ||
      this.y > CANVAS_DIMENTIONS.height
    ) {
      this.offScreen = true;
      return !this.deleteOnOffscreen;
    }
    return true;
  }
}
