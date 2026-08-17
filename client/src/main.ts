// ============================================================
// 클라이언트 엔트리. 로비 → (매치 시작) → Phaser 레이스 + 퀴즈/결과 오버레이.
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
    height: 480,
    backgroundColor: "#0a1020",
    scene: [RaceScene],
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_HORIZONTALLY },
  });
  // 퀴즈/종료 이벤트 바인딩(방 연결 이후이므로 여기서)
  ui.bindQuiz();
  ui.bindEnd();
}

ui.initLobby(startGame);
