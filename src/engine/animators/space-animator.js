import { ANIMATION_VARS } from "../conf.js";

/**
 * Space animator! give motion to all objects
 * @param {Number} _zindex
 * @param {Array<GameObject>} items
 */
export function spaceAnimator(_zindex, items) {
  // only if the space is moving
  if (!ANIMATION_VARS.spaceAnimator.status) return;

  items.forEach((item) => {
    if (item.spaceAnimation)
      item.applyDisplacement(
        item._spaceAnimationHzntlSpeed * ANIMATION_VARS.animationSpeed,
        item._spaceAnimationVrtclSpeed * ANIMATION_VARS.animationSpeed,
      );
  });
}
