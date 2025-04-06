import {
  MAIN_CHARACTER_OBJ_NAME,
  JUMP_VELOCITY,
  CHARACTER_VARS,
} from "./conf.js";

/**
 * Game specific animations
 * @param {Number} zindex
 * @param {Array<GameObject>} items
 */
export function gameAnimator(zindex, items) {
  items.forEach((item) => {
    _characterJumpObjectAnimator(zindex, item);
    _oscillationAnimator(zindex, item);
  });
}

/**
 * Character jump animation
 * @param {Number} _zindex
 * @param {GameObject} item
 */
function _characterJumpObjectAnimator(_zindex, item) {
  if (
    item.name == MAIN_CHARACTER_OBJ_NAME &&
    item.isHorizontalCollided &&
    CHARACTER_VARS.jumping
  ) {
    item.yVelocityVector = JUMP_VELOCITY;
    setTimeout(() => {
      if (CHARACTER_VARS.jumping) {
        item.yVelocityVector += JUMP_VELOCITY / 2;
      }
      CHARACTER_VARS.jumping = false;
    }, 250);
  }
}

/**
 * Animator for oscillation motions.
 * as of now handling only vertical oscillations
 * set the approprite values for perfect oscillation (prefereably gravity should be zero)
 * @param {Number} _zindex
 * @param {GameObject} item
 */
function _oscillationAnimator(_zindex, item) {
  if (
    !item.oscillation || // boolean
    !item.oscillationVelocityMax || // maximum oscillation velocity
    !item.oscillationAccilertaion // oscillation damping accileration
  )
    return;
  if (item._oscillationVelocity == undefined) {
    item._oscillationVelocity = item.oscillationVelocityMax;
    item._oscillationDirection = -1;
  }

  if (item._oscillationVelocity <= -item.oscillationVelocityMax) {
    item._oscillationDirection = 1;
  } else if (item._oscillationVelocity >= item.oscillationVelocityMax) {
    item._oscillationDirection = -1;
  }
  item._oscillationVelocity +=
    item._oscillationDirection * item.oscillationAccilertaion;

  item.yVelocityVector = item._oscillationVelocity;
}
