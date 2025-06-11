import { Sketcher } from "./engine/sketcher.js";
import { Wayfinder } from "./game/wayfinder.js";
import { BGMaker } from "./game/bg.js";
import { spawnUnni, spawnPretham } from "./game/chars.js";
import { CHARACTER_ZINDEX } from "./game/conf.js";
import { gameInitAnimatorCallback, gameAnimator, drawCallbacks } from "./game/animators.js";
import { spaceAnimator } from "./engine/animators/space-animator.js";
import { physicsAnimator } from "./engine/animators/physics-animator.js";
import { bindAudioEvents, bindGameAudioEvents } from "./game/audio-binds.js";
import { registerCharacterJumpKeyBindings, waitForfirstJump } from "./game/keybindings.js"
import { scoreBoard } from "./game/conf.js"
import { ModalMan, hideMenu, isMobileDevice } from "./utils/ui.js"
import { Story } from "./story.js"
import { ANIMATION_VARS, BASE_ANIMATION_SPEED } from "./engine/conf.js";


export class Game extends EventTarget {
  events = {
    play: new Event("play"),
    pause: new Event("pause"),
    reset: new Event("reset"),
    over: new Event("over"),
    setup: new Event("setup"),
  }

  constructor() {
    super();
    this.canvas = document.querySelector(".game-canvas");
    // this.randomSoundEfx = new RandomSoundEfx();

    // registerSpaceAnimationKeyBinds();
    registerCharacterJumpKeyBindings();
    bindGameAudioEvents(this);
    this.levelPassed = 1;
  }

  phaseAnimator(wayfinder) {
    // making it in layman terms just for in level customisations
    if (this.levelPassed === 4 && scoreBoard.respect > 1000) {
      // level 5
      this.levelPassed = 5;
      ANIMATION_VARS.animationSpeed += 0.1;
      wayfinder.minGap += wayfinder.minGap * 0.1;
      wayfinder.maxGap += wayfinder.maxGap * 0.1;
    }
    else if (this.levelPassed === 3 && scoreBoard.respect > 800) {
      // level 4
      this.levelPassed = 4;
      ANIMATION_VARS.animationSpeed += 0.1;
      wayfinder.minGap += wayfinder.minGap * 0.1;
      wayfinder.maxGap += wayfinder.maxGap * 0.1;
    }
    else if (this.levelPassed === 2 && scoreBoard.respect > 500) {
      // level 3
      this.levelPassed = 3;
      ANIMATION_VARS.animationSpeed += 0.1;
      wayfinder.minGap += wayfinder.minGap * 0.1;
      wayfinder.maxGap += wayfinder.maxGap * 0.1;
    }
    else if (this.levelPassed === 1 && scoreBoard.respect > 300) {
      // level 2
      this.levelPassed = 2;
      ANIMATION_VARS.animationSpeed += 0.1;
      wayfinder.minGap += wayfinder.minGap * 0.1;
      wayfinder.maxGap += wayfinder.maxGap * 0.1;
    }

  }

  setup() {
    // create characters
    this.sketcher = new Sketcher(this.canvas);
    this.story = new Story(this.sketcher);
    this.demoMode = this.story.storyTold ? false : true;
    const wayfinder = new Wayfinder(this.sketcher);
    const bgMaker = new BGMaker(this.sketcher);
    const mainCharacter = spawnUnni();
    const pretham = spawnPretham();

    mainCharacter.addEventListener("deleted", () => {
      setTimeout(() => {
        this.pause();
        const score = parseInt(scoreBoard.respect)
        const gems = parseInt(scoreBoard.magesticGem)
        let highScore = parseInt(self.localStorage.getItem("highScore")) || 0
        if (highScore < score) {
          highScore = score
          self.localStorage.setItem("highScore", score);
        }

        this.reset();
        hideMenu();
        ModalMan.show(
          `<center> ${highScore > score ? "<b>Thats a shame! You did well before..</b>" : "<b>Great! New record</b>"}` +
          `<p>Scored <b><span class="scored">${score}</span> respects</b> & <b><span class="scored">${gems}</span> magestic gems</b>!</p>` +
          `<p>High Score: <b>${highScore} respects</b> </center>`,
          "GAME OVER!",
          {
            gameBtns: true,
            bg: true,
          }
        )
        this.dispatchEvent(this.events.over)
      }, 800);
    });

    this.sketcher.addItem(CHARACTER_ZINDEX + 1, pretham);
    this.sketcher.addItem(CHARACTER_ZINDEX, mainCharacter); // always on top (for better collision calcs)
    this.sketcher.fpsIndicator = document.querySelector(".fps-value");
    this.sketcher.drawCallbacks = drawCallbacks
    this.sketcher.animator = (zindex, items) => {
      bgMaker.animator(zindex, items);
      wayfinder.animator(zindex, items);
      this.phaseAnimator(wayfinder);
      gameAnimator(zindex, items);
      spaceAnimator(zindex, items);
      physicsAnimator(zindex, items);
    };

    bindAudioEvents(this.sketcher);
    this.dispatchEvent(this.events.setup);
    gameInitAnimatorCallback();
  }

  _spaceAnimation(set = true) {
    ANIMATION_VARS.spaceAnimator.status = set;
    if (set && this.demoMode) {
      setTimeout(async () => {
        const demoLayer = document.querySelector(".paddle-jump-intstruct");
        demoLayer.classList.remove("d-none");
        ANIMATION_VARS.spaceAnimator.status = false;
        await waitForfirstJump(
          isMobileDevice ? demoLayer : null
        );
        ANIMATION_VARS.spaceAnimator.status = true
        demoLayer.classList.add("d-none");
      }, 1500);
    }
  }

  reset() {
    this._spaceAnimation(false);
    scoreBoard.magesticGem = 0
    scoreBoard.respect = 0
    this.story.delete()
    this.sketcher.reset()
    delete this.story
    delete this.sketcher
    this.setup()
    this.dispatchEvent(this.events.reset);
    ANIMATION_VARS.animationSpeed = BASE_ANIMATION_SPEED;
  }

  pause() {
    // this.randomSoundEfx.stop();
    this._spaceAnimation(false);
    this.sketcher.stop();

    // make the canvas dull
    const oldFillStyle = this.sketcher.cntxt.fillStyle
    this.sketcher.cntxt.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.sketcher.cntxt.fillRect(0, 0, this.sketcher.canvas.width, this.sketcher.canvas.height)
    this.sketcher.cntxt.fillStyle = oldFillStyle

    this.dispatchEvent(this.events.pause);
  }

  async play(withStory = false) {
    if (!this.story.storyTold || withStory)
      await this.story.tellStory()
    this.sketcher.start();
    this._spaceAnimation(true);
    // this.randomSoundEfx.start();
    this.dispatchEvent(this.events.play);
  }
}
