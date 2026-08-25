// ============================================================
// 클라이언트 엔트리. 로비 → 카트 레이스 + HUD/퀴즈/결과 오버레이.
// ============================================================

import Phaser from "phaser";
import { net } from "./net";
import { ui } from "./ui";
import { RaceScene } from "./RaceScene";

let game: Phaser.Game | null = null;

function startGame() {
  if (game) return;
  game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game",
    width: 1280,
    height: 720,
    backgroundColor: "#0b1220",
    scene: [RaceScene],
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  });
  ui.bindQuiz();
  ui.bindEnd();
}

ui.initLobby(startGame);
