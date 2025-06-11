import { audioEngine } from "./audio-engine/engine.js";
import { Sketcher } from "./engine/sketcher";
import { assetStore } from "./utils/asset-man.js";
import { showRetartBtn } from "./utils/ui.js";


export class Story {
  /**
  *
  * @param {Sketcher} canvas
  */
  constructor(sketcher) {
    this.frames = assetStore.img.storyFrames
    this.bg = {
      noise: assetStore.audio.storyNoise,
      shutter: assetStore.audio.storyShutter,
    }

    this.sketcher = sketcher;
    this.canvas = sketcher.canvas;
    this.context = sketcher.cntxt;
    this.width = sketcher.width;
    this.height = sketcher.height;

    this.originalBg = this.canvas.style.backgroundImage;

    this.grainCanvas = document.createElement('canvas');
    this.grainCanvas.width = this.canvas.width;
    this.grainCanvas.height = this.canvas.height;
    this.grainCtx = this.grainCanvas.getContext('2d');

    this.storyToldStorageVar = "storyTold"
    this.storyTold = self.localStorage.getItem(this.storyToldStorageVar);
    if (this.storyTold) showRetartBtn();
  }

  delete() {
    this.canvas.style.backgroundImage = this.originalBg;
    this.context.clearRect(0, 0, this.width, this.height);

    this.sketcher = null;
    this.canvas = null;
    this.context = null;
    this.width = null;
    this.height = null;

    this.originalBg = null;
    this.grainCtx.closePath();
    this.grainCanvas = null;
    this.grainCtx = null
  }

  drawFrame(index) {
    this.canvas.style.backgroundImage = `url("${this.frames[index].src}")`;
  }

  sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time))
  }

  async tellStory() {
    this.context.fillColor = "#eee";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    await this.sleep(1000);

    const intervel = setInterval(this._addGrain.bind(this, 0.6), 100);
    const audiobg1 = audioEngine.play("storyNoise", { loop: true })

    audioEngine.play("storyShutter");
    this.drawFrame(0);
    await this.sleep(2000);

    audioEngine.play("storyShutter");
    this.drawFrame(1);
    await this.sleep(2000);

    audioEngine.play("storyShutter");
    // shu shu
    this.drawFrame(2);
    await this.sleep(2000);

    audioEngine.play("storyShutter");
    this.drawFrame(3);
    // audioEngine.play("storyTalk1");
    await this.sleep(2000);

    audioEngine.play("storyShutter");
    this.drawFrame(4);
    // audioEngine.play("storyTalk2");
    await this.sleep(2000);

    audioEngine.play("storyShutter");
    this.drawFrame(5);
    await this.sleep(100);
    audioEngine.play("storyLaugh1");
    await this.sleep(1800);

    audioEngine.play("storyShutter");
    this.drawFrame(6);
    audioEngine.play("storyLaugh2");
    await this.sleep(200);
    audioEngine.play("storyLaugh1");
    await this.sleep(1700);

    audioEngine.play("transition");
    await this.sleep(100);
    // audioEngine.play("storyShutter");
    this.drawFrame(7);
    await this.sleep(2000);

    audioEngine.play("storyShutter");
    this.drawFrame(8);
    // audioEngine.play("storyLaughEvil");
    audioEngine.play("storyEeh");
    await this.sleep(2000);

    audioEngine.play("storyShutter");
    this.drawFrame(9);
    audioEngine.play("storyCry");
    await this.sleep(2000);

    audioEngine.play("storyShutter");
    this.drawFrame(10);
    // audioEngine.play("storyCry");
    audioEngine.play("storyLaughEvil");
    await this.sleep(2000);

    audiobg1.stop();
    clearInterval(intervel);
    this.canvas.style.backgroundImage = this.originalBg;

    this.storyTold = "true";
    self.localStorage.setItem(this.storyToldStorageVar, this.storyTold)
  }

  _addGrain(intensity = 0.2) {
    const imageData = this.grainCtx.createImageData(this.grainCanvas.width, this.grainCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const val = 128 + (Math.random() - 0.5) * 255 * intensity;
      data[i] = data[i + 1] = data[i + 2] = val; // grayscale
      data[i + 3] = 50; // Alpha: 0 (transparent) to 255 (opaque)
    }

    this.grainCtx.putImageData(imageData, 0, 0);
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.drawImage(this.grainCanvas, 0, 0);
  }

}
