export const SKETCHER_UNIT_DIVIDING_FACTOR = 1000;
export const CANVAS_DIMENTIONS = {
  width: SKETCHER_UNIT_DIVIDING_FACTOR,
  height: SKETCHER_UNIT_DIVIDING_FACTOR,
};

export const GRAVITY = 1;
export const ANIMATION_SPEED = 0.3; // between 0 and 1

export const ANIMATION_VARS = {
  spaceAnimator: {
    status: false, // running status (set true to apply)
    // speeds can either be a generic one or zindex based range of speed.
    hzntlSpeed: { "-1": -0.1, 0: -0.2, 1: -0.3 } || -0.5,
    vrtclSpeed: 0,
  },
};
