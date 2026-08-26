// ============================================================
// 클라이언트 엔트리 — 로비 → 3D 레이스 + HUD/퀴즈/결과 오버레이
// ============================================================

import { ui } from "./ui";
import { Race3D } from "./Race3D";

let game: Race3D | null = null;

function startGame() {
  if (game) return;
  const el = document.getElementById("game")!;
  game = new Race3D(el);
  game.start();
  ui.bindQuiz();
  ui.bindEnd();
}

ui.initLobby(startGame);
