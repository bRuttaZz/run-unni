// This page gonna be different. Currently spin up a basic game
import { DEBUG } from "./game/conf.js"
import { Game } from "./game.js"
import { getUIInvocation, bindUIBtns, bindUIBasics, ModalMan } from "./utils/ui.js";
import { audioEngine } from "./audio-engine/engine.js"
import {
  loadAllAssets,
  assetStore,
} from "./utils/asset-man.js";

async function main() {
  bindUIBasics();


  try {
    await loadAllAssets();
  } catch (e) {
    // handling error
    console.error("ERROR loading assets :", e);
    ModalMan.show(
      "<center><span class=\"err\">Error loading assets</span>" +
      "<br>Please <a href=\"#\" onclick=\"location.reload(); return false;\">try again</a></center>",
      "", { progress: true, logo: true, gameBtns: false })
    return;
  }

  const game = new Game();
  bindUIBtns(game);

  // wait for first ui invocation
  await getUIInvocation(async () => {
    await audioEngine.init(assetStore.audio);
    game.setup()
  });

}

main();
