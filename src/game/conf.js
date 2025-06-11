export const DEBUG = false;

export const MAIN_CHARACTER_OBJ_NAME = "unni";
export const GHOST_CHARACTER_OBJ_NAME = "pretham";
export const JUMP_VELOCITY = -50;

export const CHARACTER_ZINDEX = 20;

export const CHARACTER_VARS = {
  jumping: false,
};

export const PLATFORM_DIMENTIONS = {
  blockWidth: 426,
  blockHeight: 390,
  drawWidth: 200,
  drawHeight: 183,
};

export const scoreBoard = {
  magesticGem: 0,
  respect: 0,
}

if (!DEBUG) {
  console.log("Hello World :)");
  console.debug = () => { };
  console.log = () => { };
}
