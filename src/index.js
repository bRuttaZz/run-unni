import { Sketcher } from "./engine/sketcher.js";
import { GameObject } from "./engine/game-object.js";
import { physicsAnimator } from "./engine/animators/physics-animator.js";
import { spaceAnimator } from "./engine/animators/space-animator.js";
import { CANVAS_DIMENTIONS } from "./engine/conf.js";
import { gameAnimator } from "./game/animators.js";
import {
  registerSpaceAnimationKeyBinds,
  registerCharacterJumpKeyBindings,
} from "./game/keybindings.js";
import { MAIN_CHARACTER_OBJ_NAME } from "./game/conf.js";

function main() {
  const canvas = document.querySelector(".game-canvas");
  const sketcher = new Sketcher(canvas);

  // oscillating particle
  const accileratingParticle = new GameObject("test-coin", {
    x: 500,
    y: 300,
    width: 50,
    height: 50,
    gravity: false,
  });
  accileratingParticle.oscillation = true;
  accileratingParticle.oscillationVelocityMax = 1;
  accileratingParticle.oscillationAccilertaion = 0.05;
  accileratingParticle.fill = "red";

  const game = new GameObject(MAIN_CHARACTER_OBJ_NAME, {
    x: 60,
    y: 300,
    width: 50,
    height: 100,
    gravity: true,
    deleteOnOffscreen: false,
    exceptSpaceAnimation: true,
  });
  const plate = new GameObject("test-item-plate", {
    x: 55,
    y: CANVAS_DIMENTIONS.height - 20,
    width: 110,
    height: 10,
    // gravity: true,
    deleteOnOffscreen: true,
    collitionVelocityDampingFactor: 0.6,
  });

  sketcher.addItem(2, accileratingParticle);
  sketcher.addItem(2, game);
  sketcher.addItem(2, plate);
  sketcher.fpsIndicator = document.querySelector(".fps-value");
  sketcher.animator = (zindex, items) => {
    gameAnimator(zindex, items);
    spaceAnimator(zindex, items);
    physicsAnimator(zindex, items);
  };

  registerSpaceAnimationKeyBinds();
  registerCharacterJumpKeyBindings();
  sketcher.start();
}

main();
