export const SKETCHER_UNIT_DIVIDING_FACTOR = 2000;
export const CANVAS_DIMENTIONS = {
  width: SKETCHER_UNIT_DIVIDING_FACTOR,
  height: SKETCHER_UNIT_DIVIDING_FACTOR,
};

export const MAX_FPS = 70;

export const GRAVITY = 2;
export const BASE_ANIMATION_SPEED = 0.6 // between 0 and 1

export const ANIMATION_VARS = {
  animationSpeed: BASE_ANIMATION_SPEED,
  spaceAnimator: {
    status: false, // running status (set true to apply)
    // speeds can either be a generic one or zindex based range of speed.
    hzntlSpeed: { 0: -2, 20: -10 } || -1,
    vrtclSpeed: 0,
  },
};
