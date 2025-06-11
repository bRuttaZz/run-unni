import { ANIMATION_VARS } from "../engine/conf.js";
import { CHARACTER_VARS } from "./conf.js";

/**
 * Register space animation keybindings
 */
export function registerSpaceAnimationKeyBinds() {
  const paddle = document.querySelector(".paddle-move");
  const action = (set) => {
    ANIMATION_VARS.spaceAnimator.status = set;
  };

  self.window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") action(true);
  });
  self.window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") action(false);
  });
  paddle.addEventListener("touchstart", (e) => {
    action(true);
  });
  paddle.addEventListener("touchend", (e) => {
    action(false);
  });
}

export function registerCharacterJumpKeyBindings() {
  const paddle = document.querySelector(".paddle-jump");
  let setFlag = false;
  const action = (set) => {
    if (set && !setFlag) {
      setFlag = true;
      CHARACTER_VARS.jumping = set;
    } else if (!set) {
      setFlag = false;
      CHARACTER_VARS.jumping = set;
    }
  };

  self.window.addEventListener("keydown", (e) => {
    if (e.key === " ") action(true);
  });
  self.window.addEventListener("keyup", (e) => {
    if (e.key === " ") action(false);
  });
  paddle.addEventListener("touchstart", (e) => {
    action(true);
  });
  paddle.addEventListener("touchend", (e) => {
    action(false);
  });
}

export function waitForfirstJump(domElem) {
  return new Promise(resolve => {
    if (domElem)
      domElem.addEventListener("touchstart", resolve, { once: true })
    else
      self.window.addEventListener("keydown", (e) => { if (e.key === " ") resolve() }, { once: true })
  })
}
