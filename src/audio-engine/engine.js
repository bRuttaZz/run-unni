export class AudioEngine {
  /**
   *
   * @param {Object<String, ArrayBuffer>} audioStore
   */
  constructor() {
    this.audioStore = {};
    this.context = null;
    this.bgPlayerNodes = [];
    this.isInitiated = false;
  }

  /**
   * Call upon a user interaction.
   * Necessary to initiate audio context
   */
  async init(audioStore) {
    if (!this.isInitiated) {
      this.context = new AudioContext({
        latencyHint: "interactive",
      });
      for (const key in audioStore) {
        this.audioStore[key] = await this.context.decodeAudioData(
          audioStore[key],
        );
      }
      this.isInitiated = true
    }
  }

  _playTest(name) {
    if (!this.audioStore[name] || !this.context) {
      console.error(
        "Invalid AudioEngine.play invocation! Store item or audio context not found!",
        name, this.audioStore[name], this.audioStore
      );
      throw "Invalid Invocation";
    }
  }

  /**
   * Play audio by keyname
   * @param {String} name
   * @param {Object} options - play options
   * @param {Number} volume - 0 to 1
   */
  play(name, options = null, volume = null) {
    if (!options) options = {}
    this._playTest(name);
    const audioNode = new AudioBufferSourceNode(this.context, {
      buffer: this.audioStore[name],
      loop: false,
      ...options
    });
    if (volume !== null) {
      const gainNode = this.context.createGain();
      audioNode.connect(gainNode)
      gainNode.connect(this.context.destination);
      gainNode.gain.setValueAtTime(volume, this.context.currentTime);
    } else {
      audioNode.connect(this.context.destination);
    }
    audioNode.start(0);
    return audioNode;
  }

  /**
   *  Play in loop in the background (In loop)
   */
  playInBg(name) {
    if (this.bgPlayerNodes[name]) {
      console.error("Audio already playing!");
      throw "Audio already playing!";
    }

    this._playTest(name);
    const audioNode = new AudioBufferSourceNode(this.context, {
      buffer: this.audioStore[name],
      loop: true,
    });
    audioNode.connect(this.context.destination);
    audioNode.start(0);
    return audioNode;
  }

  /**
   * Stop the one playing in BG
   */
  stopInBg(name) {
    this.bgPlayerNodes[name]?.stop();
  }
}

export const audioEngine = new AudioEngine();
