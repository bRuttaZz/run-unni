export const assetStore = {
  img: {
    // Object<String, Array<HTMLImageElement>>
    characterPoseRun: null,
    characterPoseJump: null,
    characterPoseStand: null,
    platform1: null,
    platform2: null,
    gem: null,
    bg: null,
    pretham: null,
    storyFrames: null,
  },
  audio: {
    // Object<String, ArrayBuffer>
    unniJump: null,
    coin: null,
    unniBgm: null,
    forestBgm: null,

    storyNoise: null,
    storyShutter: null,
    storyTalk1: null,
    storyTalk2: null,
    storyLaugh1: null,
    storyLaugh2: null,
    storyLaughEvil: null,
    storyCry: null,
    storyEeh: null,
    transition: null,
  },
};

export const assetStatus = {
  events: new EventTarget(),
  totalAssets: 0,
  loadedAssets: 0,
}

const imgAssetSrc = {
  characterPoseRun: [
    new URL("../../assets/game/unni/run1.png", import.meta.url),
    new URL("../../assets/game/unni/run2.png", import.meta.url),
    new URL("../../assets/game/unni/run3.png", import.meta.url),
    new URL("../../assets/game/unni/run4.png", import.meta.url),
    new URL("../../assets/game/unni/run5.png", import.meta.url),
    new URL("../../assets/game/unni/run6.png", import.meta.url),
    new URL("../../assets/game/unni/run7.png", import.meta.url),
    new URL("../../assets/game/unni/run8.png", import.meta.url),
  ],
  characterPoseJump: [
    new URL("../../assets/game/unni/run2.png", import.meta.url),
    new URL("../../assets/game/unni/jump3.png", import.meta.url),
  ],
  characterPoseStand: [
    new URL("../../assets/game/unni/stand.png", import.meta.url),
  ],
  platform1: [
    new URL("../../assets/game/props/wood-1-1.png", import.meta.url),
    new URL("../../assets/game/props/wood-1-2.png", import.meta.url),
    new URL("../../assets/game/props/wood-1-3.png", import.meta.url),
  ],
  platform2: [
    new URL("../../assets/game/props/wood-2-1.png", import.meta.url),
    new URL("../../assets/game/props/wood-2-2.png", import.meta.url),
    new URL("../../assets/game/props/wood-2-3.png", import.meta.url),
  ],
  gem: [
    new URL("../../assets/game/props/magestic-gem.png", import.meta.url),
  ],
  bg: [
    new URL("../../assets/game/bg/layer-1.png", import.meta.url),
    new URL("../../assets/game/bg/layer-2.png", import.meta.url),
    new URL("../../assets/game/bg/layer-3.png", import.meta.url),
    new URL("../../assets/game/bg/layer-4.png", import.meta.url),
  ],
  pretham: [
    new URL("../../assets/game/pretham/fire1.png", import.meta.url),
    new URL("../../assets/game/pretham/fire2.png", import.meta.url),
    new URL("../../assets/game/pretham/fire3.png", import.meta.url),
  ],
  storyFrames: [
    new URL("../../assets/game/story/frames/1.jpg", import.meta.url),
    new URL("../../assets/game/story/frames/2.jpg", import.meta.url),
    new URL("../../assets/game/story/frames/3.jpg", import.meta.url),
    new URL("../../assets/game/story/frames/4.jpg", import.meta.url),
    new URL("../../assets/game/story/frames/5.jpg", import.meta.url),
    new URL("../../assets/game/story/frames/6.jpg", import.meta.url),
    new URL("../../assets/game/story/frames/7.jpg", import.meta.url),
    new URL("../../assets/game/story/frames/8.jpg", import.meta.url),
    new URL("../../assets/game/story/frames/9.jpg", import.meta.url),
    new URL("../../assets/game/story/frames/10.jpg", import.meta.url),
    new URL("../../assets/game/story/frames/11.jpg", import.meta.url),
  ]
};

const audioAssetSrc = {
  unniJump: new URL("../../assets/game/audio/jump.wav", import.meta.url),
  coin: new URL("../../assets/game/audio/coin.mp3", import.meta.url),
  forestBgm: new URL("../../assets/game/audio/forest-bgm.mp3", import.meta.url),
  unniBgm: new URL("../../assets/game/audio/unni-bgm.mp3", import.meta.url),

  storyNoise: new URL("../../assets/game/story/noise.mp3", import.meta.url),
  storyShutter: new URL("../../assets/game/story/shutter.wav", import.meta.url),
  storyTalk1: new URL("../../assets/game/story/carrot-carrot.wav", import.meta.url),
  storyTalk2: new URL("../../assets/game/story/krima-kuruma.wav", import.meta.url),
  storyLaugh1: new URL("../../assets/game/story/chiri1.wav", import.meta.url),
  storyLaugh2: new URL("../../assets/game/story/chiri2.wav", import.meta.url),
  storyLaughEvil: new URL("../../assets/game/story/evil-chiri.wav", import.meta.url),
  storyCry: new URL("../../assets/game/story/ammaa.wav", import.meta.url),
  storyEeh: new URL("../../assets/game/story/eeh.wav", import.meta.url),
  transition: new URL("../../assets/game/story/transition.mp3", import.meta.url),

};

/**
 * Load all image assets
 * @returns {Promise} - resolves on loading all assets into mem
 */
export function loadImgAssets() {
  return new Promise((resolve, reject) => {
    let assetCounter = 0;
    for (const item in imgAssetSrc) {
      assetCounter += imgAssetSrc[item].length;
    }
    assetStatus.totalAssets += assetCounter;
    console.debug(`[assetstore][img] loading ${assetCounter} items!`);

    const setupImg = (srcInfo) => {
      const item = new Image();
      item.onload = () => {
        assetStatus.loadedAssets++;
        assetStatus.events.dispatchEvent(new Event("progress"));
        assetCounter--;
        console.debug(
          `[assetstore][img][bal:${assetCounter}] item loaded :`,
          srcInfo.href,
        );
        if (assetCounter == 0) return resolve();
      };
      item.onerror = (err) => {
        console.error("[assetstore][img] error loading item : ", err);
        return reject(err);
      };
      item.src = srcInfo;
      return item;
    };
    for (const category in imgAssetSrc) {
      assetStore.img[category] = [];
      for (const srcInfo of imgAssetSrc[category]) {
        assetStore.img[category].push(setupImg(srcInfo));
      }
    }
  });
}

/**
 * Load all audio assets
 * @returns {Promise} - resolves on loading all sources
 */
export function loadAudioAssets() {
  const load = (url, key) => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((resp) => resp.arrayBuffer())
        .then((buffer) => {
          assetStore.audio[key] = buffer;
          console.debug(`[assetStore][audio] loaded audio :`, url.href);
          assetStatus.loadedAssets++;
          assetStatus.events.dispatchEvent(new Event("progress"));
          resolve();
        })
        .catch((err) => {
          console.error(`[assetStore][audio] error loading audio :`, err);
          reject(err);
        });
    });
  };
  const promises = [];
  for (const key in audioAssetSrc) {
    promises.push(load(audioAssetSrc[key], key));
  }
  assetStatus.totalAssets += promises.length;
  return Promise.all(promises);
}

/**
* Load all assets
*/
export async function loadAllAssets() {
  await Promise.all([loadImgAssets(), loadAudioAssets()]);
  assetStatus.events.dispatchEvent(new Event("load"));
}
