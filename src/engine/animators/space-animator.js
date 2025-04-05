import { ANIMATION_VARS, ANIMATION_SPEED } from "../conf.js";

/**
 * Space animator! give motion to all objects
 * @param {Number} zindex
 * @param {Array<GameObject>} items
 */
export function spaceAnimator(zindex, items) {
  // only if the space is moving
  if (!ANIMATION_VARS.spaceAnimator.status) return;

  const velocities = [];
  for (const velocity of [
    ANIMATION_VARS.spaceAnimator.hzntlSpeed,
    ANIMATION_VARS.spaceAnimator.vrtclSpeed,
  ])
    if (typeof velocity === "object") {
      let lastIndex = null;
      for (const _indx of Object.keys(velocity).sort()) {
        lastIndex = _indx;
        if (zindex <= _indx) {
          velocities.push(velocity[_indx]);
          lastIndex = null;
          break;
        }
      }
      if (lastIndex !== null) velocities.push(velocity[lastIndex]);
    } else velocities.push(velocity);
  items.forEach((item) => {
    if (item.spaceAnimation)
      item.applyDisplacement(
        velocities[0] * ANIMATION_SPEED,
        velocities[1] * ANIMATION_SPEED,
      );
  });
}
