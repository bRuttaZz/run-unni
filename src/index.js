import { Sketcher } from "./engine/sketcher.js";
import { GameObject } from "./engine/game-object.js";
import { physicsAnimator } from "./engine/physics.js";
import { CANVAS_DIMENTIONS } from "./engine/conf.js";

function main() {
  const canvas = document.querySelector(".game-canvas");
  const sketcher = new Sketcher(canvas);
  // const game1 = new GameObject("test-item", {
  //   x: 10,
  //   y: 99,
  //   gravity: true,
  //   deleteOnOffscreen: true,
  // });

  const game = new GameObject("test-item", {
    x: 10,
    y: 300,
    gravity: true,
    deleteOnOffscreen: true,
  });
  const plate = new GameObject("test-item-plate", {
    x: 5,
    y: CANVAS_DIMENTIONS.height - 10,
    width: 110,
    height: 10,
    // gravity: true,
    deleteOnOffscreen: true,
    collitionVelocityDampingFactor: 0.6,
  });

  sketcher.addItem(1, game);
  // sketcher.addItem(1, game1);
  sketcher.addItem(1, plate);
  sketcher.fpsIndicator = document.querySelector(".fps-value");
  sketcher.animator = (zindex, items) => {
    physicsAnimator(zindex, items);
  };
  sketcher.start();
}

main();
