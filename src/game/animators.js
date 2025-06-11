import {
  MAIN_CHARACTER_OBJ_NAME,
  GHOST_CHARACTER_OBJ_NAME,
  JUMP_VELOCITY,
  CHARACTER_VARS,
  scoreBoard,
  GHOST_CHARACTER_OBJ_NAME,
} from "./conf.js";
import { ANIMATION_VARS, CANVAS_DIMENTIONS } from "../engine/conf.js";


const GEM_INDICATOR = document.querySelector(".gems-value")
const RESPECT_INDICATOR = document.querySelector(".respect-value")

let characterYTrack = []  // delayed jump for the character

export function gameInitAnimatorCallback() {
  characterYTrack = Array(15).fill(CANVAS_DIMENTIONS.height - 370);
}

/**
* canvas draw time callbacks
*/
export function drawCallbacks() {
  // calc respect
  if (ANIMATION_VARS.spaceAnimator.status) scoreBoard.respect += 0.1

  // draw indicators
  GEM_INDICATOR.innerText = scoreBoard.magesticGem;
  RESPECT_INDICATOR.innerText = parseInt(scoreBoard.respect);
}

/**
 * Game specific animations
 * @param {Number} zindex
 * @param {Array<GameObject>} items
 */
export function gameAnimator(zindex, items) {
  items.forEach((item) => {
    _oscillationAnimator(zindex, item);
    _characterJumpObjectAnimator(zindex, item);
    _skinAnimator(zindex, item);
  });
}

/**
 * Character jump animation
 * @param {Number} _zindex
 * @param {GameObject} item
 */
function _characterJumpObjectAnimator(_zindex, item) {
  if (
    item.name == MAIN_CHARACTER_OBJ_NAME
  ) {
    characterYTrack.push(item.y)
    characterYTrack.shift()

    if (
      item.isHorizontalCollided &&
      CHARACTER_VARS.jumping
    ) {
      item.dispatchEvent(new Event("jump"));
      item.yVelocityVector = JUMP_VELOCITY;
      setTimeout(() => {
        if (CHARACTER_VARS.jumping) {
          item.yVelocityVector += JUMP_VELOCITY / 3;
        }
        CHARACTER_VARS.jumping = false;
      }, 350);
    }
  }
  else if (item.name == GHOST_CHARACTER_OBJ_NAME) {
    const newY = characterYTrack[0] - 100;
    if (newY !== item.baseY) {
      item.yVelocityVector = 0;
      item._oscillationVelocity = undefined;
    }
    item.baseY = newY
    // console.log(characterYTrack[0], CANVAS_DIMENTIONS.height)
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
    item._oscillationVelocity = 0;
    item._oscillationDirection = -1;
  }

  if (item._oscillationVelocity <= -item.oscillationVelocityMax) {
    item._oscillationDirection = 1;
  } else if (item._oscillationVelocity >= item.oscillationVelocityMax) {
    item._oscillationDirection = -1;
  }
  item._oscillationVelocity +=
    item._oscillationDirection * item.oscillationAccilertaion;

  item.yVelocityVector = -item._oscillationVelocity;
}

/**
 * Skin animators
 * @param {Number} _zindex
 * @param {GameObject} item
 */
function _skinAnimator(_zindex, item) {
  if (item.name == MAIN_CHARACTER_OBJ_NAME) {
    if (ANIMATION_VARS.spaceAnimator.status) {
      if (item.isHorizontalCollided) {
        // running state
        item.skinArrayRunIndex = item.skinArrayRunIndex + 0.2;
        const indx =
          parseInt(item.skinArrayRunIndex) % item.skinArrayRunIndexMax;
        item.skin = item.skinArray.run[indx];
        // I know, I could ve used a simple % opertator! But there is a glitch using that
      } else {
        // jumping state
        item.skinArrayRunIndex = 2; // ensure run from starting frame
        if (item.yVelocityVector < 0) item.skin = item.skinArray.jump[0];
        else item.skin = item.skinArray.jump[1];
      }
    } else {
      // static (without horizontal velocity)
      item.skinArrayRunIndex = 0; // ensure run from starting frame
      item.skin = item.skinArray.stand[0];
    }
  }
  else if (item.name == GHOST_CHARACTER_OBJ_NAME) {
    item.skinArrayIndex = item.skinArrayIndex + 0.2;
    const indx = parseInt(item.skinArrayIndex) % item.skinArrayIndexMax;
    item.skin = item.skinArray[indx];
  }
}
