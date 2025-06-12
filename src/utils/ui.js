import { DEBUG } from "../game/conf.js";
import { assetStatus } from "./asset-man.js";


const details = navigator.userAgent;
const regexpAndroid = /android/i;
const regexpMobile = /android|iphone|kindle|ipad/i;
export const isMobileDevice = regexpMobile.test(details);
export const isAndroid = regexpAndroid.test(details);
let wakeLock = null;
let isPlaying = false;


if (!DEBUG) {
  document.querySelector(".fps-indicator").style.display = "none"
}
if (isMobileDevice) {
  document.querySelectorAll(".demo-tap-to-jump").forEach(el => el.classList.remove("d-none"));
} else {
  document.querySelectorAll(".demo-space-to-jump").forEach(el => el.classList.remove("d-none"));
}

// remove inbetween screen size adjustments
self.window.addEventListener("resize", async () => {
  const type = screen.orientation.type
  if (isPlaying) {
    const setupBtn = document.querySelector(".setup-btn")
    document.querySelector(".exit-btn").click();
    setupBtn.classList.add("d-none");
    await askForScreenRotation();
    setupBtn.classList.remove("d-none");
  }
  if (type.split("-")[0].toLowerCase() === "portrait") {
    document.exitFullscreen?.().catch(() => { });
  }
})

function askForScreenRotation() {
  return new Promise((resolve) => {
    const orientation = screen.orientation.type;
    if (isAndroid && orientation.split("-")[0].toLowerCase() == "portrait") {
      // mobile but in portrait mode
      ModalMan.show(
        '<center style="font-size: 0.8rem"> ' +
        "Kindly rotate your device to continue.." +
        "</center>",
        "",
        {
          closeBtn: false,
          gameBtns: false,
          rotateScreenDemo: true,
        },
        // "Ignore"
      )
      const intervel = setInterval(() => {
        if (
          // ModalMan.closed ||
          screen.orientation.type.split("-")[0].toLowerCase() != "portrait"
        ) {
          ModalMan.close();
          clearInterval(intervel);
          return resolve()
        }
      }, 100)
    } else {
      return resolve();
    }
  })
}

/**
 * Get UI invocation to start the game!
 * @param {Function} interactiveCallbacks
 * @returns
 */
export async function getUIInvocation(interactiveCallbacks = async () => { }) {
  const setupBtn = document.querySelector(".setup-btn")
  const playBtns = document.querySelector(".play-btns")
  const roundLoader = document.querySelector(".round-loader")

  const paddleMove = document.querySelector(".paddle-move");
  const paddleJump = document.querySelector(".paddle-jump");
  const paddleStart = document.querySelector(".paddle-start");

  let setupBtnInAction = false;
  ModalMan.close();

  return new Promise(async (resolve, reject) => {
    await askForScreenRotation();
    setupBtn.classList.remove("d-none");
    setupBtn.addEventListener("click", async () => {
      if (setupBtnInAction) return
      setupBtnInAction = true;
      try {
        const gameArea = document.querySelector(".game-area");
        gameArea.classList.add(".fullscreen-fake");

        if (isAndroid) { // request full screen for android
          const type = screen.orientation.type
          if (type.split("-")[0].toLowerCase() != "portrait") {
            // if portrait then switch to full screen!
            try {
              await gameArea.requestFullscreen();
            } catch {
              console.warn?.("[FULLSCREEN API] Not supported!");
            }
          }
        }

        // ask for wakeLock
        if ("wakeLock" in navigator) {
          navigator.wakeLock.request("screen")
            .then(lock => {
              wakeLock = lock;
            })
            .catch(e => console.error("Error getting wakeLock", e));
        }

        roundLoader.classList.remove("d-none");
        await interactiveCallbacks();
        roundLoader.classList.add("d-none");
        setupBtn.classList.add("d-none");
        playBtns.classList.remove("d-none");

        paddleJump.style.width = paddleMove.style.width = "10%"
        paddleStart.style.width = "80%"

        return resolve();
      } catch (e) {
        console.error("Interactive UI Invocation Error: ", e);
        return reject(e);
      } finally {
        setupBtnInAction = false;
      }
    });
  });
}


/**
* bind menu buttons for game
* @param {Game} game - game object
*/
export function bindUIBtns(game) {
  const startBtn = document.querySelectorAll(".start-btn");
  const restartBtn = document.querySelectorAll(".restart-btn");
  const exitBtn = document.querySelectorAll(".exit-btn")
  const pauseBtn = document.querySelector(".pause-btn");
  const setupBtn = document.querySelector(".setup-btn");
  const startWithStoryBtn = document.querySelector(".start-with-story");

  const paddleMove = document.querySelector(".paddle-move");
  const paddleJump = document.querySelector(".paddle-jump");
  const paddleStart = document.querySelector(".paddle-start");

  const menuPanel = document.querySelector(".indicator-pane");
  const fullCover = document.querySelector(".play-btns");

  const btnsInAction = {
    pauseBtn: false,
  }

  game.addEventListener("play", () => {
    menuPanel.classList.remove("d-none");
  })

  const startBtnHandler = (event) => {
    game.play(event.target.classList.contains('start-with-story'));
    fullCover.classList.add("d-none");

    restartBtn.forEach(btn => btn.classList.remove("d-none"));
    exitBtn.forEach(btn => btn.classList.remove("d-none"));
    ModalMan.close();
    startWithStoryBtn.classList.add("d-none");
    paddleJump.style.width = paddleMove.style.width = paddleStart.style.width = "33.33%";
    btnsInAction.pauseBtn = false;
    isPlaying = true;
  }
  startBtn.forEach(btn => btn.addEventListener("click", startBtnHandler))
  startWithStoryBtn.addEventListener("click", startBtnHandler)

  restartBtn.forEach(btn => btn.addEventListener("click", () => {
    game.reset();
    game.play();
    fullCover.classList.add("d-none");
    startWithStoryBtn.classList.add("d-none");
    paddleJump.style.width = paddleMove.style.width = paddleStart.style.width = "33.33%"
    ModalMan.close();
    btnsInAction.pauseBtn = false;
    isPlaying = true;
  }))

  exitBtn.forEach(btn => btn.addEventListener("click", () => {
    game.pause()
    game.reset();
    fullCover.classList.add("d-none");
    restartBtn.forEach(btn => btn.classList.add("d-none"));
    exitBtn.forEach(btn => btn.classList.add("d-none"));
    startWithStoryBtn.classList.add("d-none");
    menuPanel.classList.add("d-none");
    if (isMobileDevice) {
      document.exitFullscreen?.().catch(() => { });
    }
    if (wakeLock) {
      wakeLock.release?.()
        .then(() => { wakeLock = null; })
        .catch((e) => console.error("Error releasing wakeLock", e))
    }
    setupBtn.classList.remove("d-none");
    paddleJump.style.width = paddleMove.style.width = paddleStart.style.width = "33.33%"
    ModalMan.close();
    btnsInAction.pauseBtn = false;
    isPlaying = false;
  }))

  pauseBtn.addEventListener("click", () => {
    if (btnsInAction.pauseBtn) return
    btnsInAction.pauseBtn = true;

    paddleJump.style.width = paddleMove.style.width = "10%"
    paddleStart.style.width = "80%"
    game.pause();
    fullCover.classList.remove("d-none");
    isPlaying = true;
  })

}

export function showRetartBtn() {
  document.querySelector(".start-with-story").classList.remove("d-none");
}

export function hideMenu() {
  const menuPanel = document.querySelector(".indicator-pane");
  menuPanel.classList.add("d-none");
}

/**
* Bind basic ui events
*/
export function bindUIBasics() {
  const loadingProgresBar = document.querySelector(".loading-progress-bar");
  assetStatus.events.addEventListener("progress", () => {
    loadingProgresBar.style.width = `${(assetStatus.loadedAssets / assetStatus.totalAssets) * 100}%`
  })
}


export const ModalMan = {
  logo: document.querySelector(".modal-logo"),
  header: document.querySelector(".modal-heder"),
  body: document.querySelector(".modal-body"),
  progress: document.querySelector(".modal-progress"),
  gameBtns: document.querySelector(".modal-play-btns"),
  closeBtn: document.querySelector(".modal-close-btn"),
  rotateScreenDemo: document.querySelector(".rotate-demo-instruct"),
  modal: document.querySelector(".canvas-modal"),

  closed: false,

  init: function () {
    this.closeBtn.addEventListener("click", () => {
      this.closed = true;
    })
  },

  show: function (msg, heading = "", options, btnText = "Close") {
    options = {
      logo: false,
      progress: false,
      gameBtns: true,
      closeBtn: false,
      rotateScreenDemo: false,
      bg: false,
      ...options
    }
    if (msg.length) this.body.innerHTML = msg
    else this.body.classList.add("d-none");

    if (heading.length) {
      this.header.innerHTML = heading
      this.header.classList.remove("d-none");
    }
    else this.header.classList.add("d-none");

    if (options.bg)
      this.modal.classList.add("canvas-bg");
    else
      this.modal.classList.remove("canvas-bg");
    delete options.bg;

    for (const key in options) {
      if (options[key]) this[key].classList.remove("d-none")
      else this[key].classList.add("d-none")
    }

    this.closeBtn.innerHTML = btnText;

    this.closed = false
    this.modal.classList.remove("d-none")
    document.querySelector(".play-btns").classList.add("d-none");
  },

  close: function () {
    this.closed = true
    this.modal.classList.add("d-none")
  }
}
ModalMan.init()
