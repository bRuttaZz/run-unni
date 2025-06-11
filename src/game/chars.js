// Chars -> Characters here
import { CANVAS_DIMENTIONS } from "../engine/conf.js";
import { assetStore } from "../utils/asset-man.js";
import { GameObject } from "../engine/game-object.js";
import { CHARACTER_ZINDEX, MAIN_CHARACTER_OBJ_NAME, GHOST_CHARACTER_OBJ_NAME } from "./conf.js";

/**
 * You know spawn new unni
 */
export function spawnUnni() {
  const unni = new GameObject(MAIN_CHARACTER_OBJ_NAME, {
    x: 500,
    y: CANVAS_DIMENTIONS.height - 370,
    width: 100,
    height: 280,
    gravity: true,
    deleteOnOffscreen: true,
    exceptSpaceAnimation: true,
    skin: assetStore.img.characterPoseRun[0],
    leftOffset: 100,
    rightOffset: 100,
    bottomOffset: 0,
    topOffset: 20,
    collitionVelocityDampingFactor: 0.5, // collision damping caused by this character
    preventDelete: true,
    zIndex: CHARACTER_ZINDEX,
  });
  unni.skinArray = {
    run: assetStore.img.characterPoseRun,
    jump: assetStore.img.characterPoseJump,
    stand: assetStore.img.characterPoseStand,
  };
  unni.skinArrayRunIndex = 0;
  unni.skinArrayRunIndexMax = assetStore.img.characterPoseRun.length;

  return unni;
}

/*
 * Spawn pretham
 */
export function spawnPretham() {
  const pretham = new GameObject(GHOST_CHARACTER_OBJ_NAME, {
    x: 90,
    y: CANVAS_DIMENTIONS.height - 470,
    skin: assetStore.img.pretham[0],
    width: 250,
    height: 250,
    gravity: false,
    disappearOnCollision: false,
    collitionVelocityDampingFactor: -1,
    exceptSpaceAnimation: true,
    deleteOnOffscreen: true,
    zIndex: CHARACTER_ZINDEX,
    preventDelete: true,
  });
  pretham.oscillation = true;
  pretham.oscillationVelocityMax = 50;
  pretham.oscillationAccilertaion = 4;
  pretham.fill = "black";

  pretham.skinArray = assetStore.img.pretham;
  pretham.skinArrayIndex = 0;
  pretham.skinArrayIndexMax = pretham.skinArray.length;

  return pretham;
}
