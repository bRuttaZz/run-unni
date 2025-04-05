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
        item.yVelocityVector += JUMP_VELOCITY / 3;
      }
      CHARACTER_VARS.jumping = false;
    }, 200);
  }
}
