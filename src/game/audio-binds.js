import { Sketcher } from "../engine/sketcher.js";
import { audioEngine } from "../audio-engine/engine.js";
import { MAIN_CHARACTER_OBJ_NAME } from "./conf.js";

let bgm = null;
let forestBgm = null;

export class RandomSoundEfx {
  constructor() {
    this._timeout = null;
    this.minIntervel = 10000
    this.variableInervel = 10000
  }

  start() {
    this._timeout = setTimeout(() => {
      audioEngine.play("storyLaughEvil");
      this.start();
    }, this.minIntervel + this.variableInervel * Math.random());
  }

  stop() {
    clearTimeout(this._timeout);
  }
}


/**
 * Bind audio events to game objects
 * @param {Sketcher} sketcher
 */
export function bindAudioEvents(sketcher) {
  for (const index in sketcher._gameItems) {
    const elems = sketcher._gameItems[index];
    elems.forEach((elem) => {
      if (elem.name == MAIN_CHARACTER_OBJ_NAME) {
        elem.addEventListener(
          "jump",
          audioEngine.play.bind(audioEngine, "unniJump"),
        );
        elem.addEventListener(
          "deleted",
          audioEngine.play.bind(audioEngine, "storyCry"),
        );
      }
    });
  }
}

/**
*
* @param {Game} game - game object
*/
export function bindGameAudioEvents(game) {
  game.addEventListener(
    "setup", () => {
      if (forestBgm) forestBgm.stop()
      forestBgm = audioEngine.play("forestBgm", { loop: true }, 0.1)
    }
  )
  game.addEventListener(
    "play", () => {
      if (forestBgm) forestBgm.stop()
      if (bgm) bgm.stop()
      bgm = audioEngine.play("unniBgm", { loop: true })
    }
  )
  game.addEventListener(
    "over",
    () => {
      setTimeout(audioEngine.play.bind(audioEngine, "storyLaughEvil"), 400)
      if (forestBgm) forestBgm.stop()
      setTimeout(() => { forestBgm = audioEngine.play("forestBgm", { loop: true }, 0.1) }, 3000);
    }
  )
  game.addEventListener(
    "reset",
    () => {
      if (bgm) bgm.stop()
      if (forestBgm) forestBgm.stop()
    }
  )
}
