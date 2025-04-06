// This page gonna be different. Currently spin up a basic game

import { Sketcher } from "./engine/sketcher.js";
import { GameObject } from "./engine/game-object.js";
import { physicsAnimator } from "./engine/animators/physics-animator.js";
import { spaceAnimator } from "./engine/animators/space-animator.js";
import { gameAnimator } from "./game/animators.js";
import {
  registerSpaceAnimationKeyBinds,
  registerCharacterJumpKeyBindings,
} from "./game/keybindings.js";
import { MAIN_CHARACTER_OBJ_NAME, CHARACTER_ZINDEX } from "./game/conf.js";
import { Wayfinder } from "./game/wayfinder.js";

function main() {
  const canvas = document.querySelector(".game-canvas");
  const sketcher = new Sketcher(canvas);
  const wayfinder = new Wayfinder(sketcher);

  // oscillating particle
  const accileratingParticle = new GameObject("test-coin", {
    x: 500,
    y: 300,
    width: 50,
    height: 50,
    gravity: false,
    disappearOnCollision: true,
  });
  accileratingParticle.oscillation = true;
  accileratingParticle.oscillationVelocityMax = 1;
  accileratingParticle.oscillationAccilertaion = 0.05;
  accileratingParticle.fill = "red";

  const mainCharacter = new GameObject(MAIN_CHARACTER_OBJ_NAME, {
    x: 60,
    y: 300,
    width: 50,
    height: 100,
    gravity: true,
    deleteOnOffscreen: true,
    exceptSpaceAnimation: true,
  });
  mainCharacter.fill = "blue";
  mainCharacter.addEventListener("deleted", () => {
    console.log("Game Over");
    sketcher.stop();
    alert("Game Over!");
    self.window.location.reload();
  });

  sketcher.addItem(CHARACTER_ZINDEX, mainCharacter); // always on top (for better collision calcs)
  sketcher.addItem(CHARACTER_ZINDEX, accileratingParticle);
  // sketcher.addItem(CHARACTER_ZINDEX, plate);
  sketcher.fpsIndicator = document.querySelector(".fps-value");
  sketcher.animator = (zindex, items) => {
    wayfinder.animator(zindex, items);
    gameAnimator(zindex, items);
    spaceAnimator(zindex, items);
    physicsAnimator(zindex, items);
  };

  registerSpaceAnimationKeyBinds();
  registerCharacterJumpKeyBindings();
  sketcher.start();
}

main();
