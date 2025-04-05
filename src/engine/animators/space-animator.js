import { ANIMATION_VARS } from "../conf.js";

/**
 * Space animator! give motion to all objects
 * @param {Number} zindex
 * @param {Array<GameObject>} items
 */
export function spaceAnimator(zindex, items) {
  const velocities = [];
  for (const velocity of [
    ANIMATION_VARS.spaceAnimator.hzntlSpeed,
    ANIMATION_VARS.spaceAnimator.vrtclSpeed,
  ])
    if (typeof velocity === "object") {
      for (const _indx in Object.keys(velocity).sort())
        if (zindex <= _indx) {
          velocities.push(velocity[_indx]);
          break;
        }
    } else velocities.push(velocity);
  items.forEach((item) => {
    if (item.spaceAnimation)
      item.applyDisplacement(velocities[0], velocities[1]);
  });
}
