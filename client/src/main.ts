// ============================================================
// 클라이언트 엔트리 — 로비 → 3D 레이스 + HUD/퀴즈/결과 오버레이
// ============================================================

import { ui } from "./ui";
import { Race3D } from "./Race3D";

// 터치 기기 감지 — <body>.touch 로 표시하면 CSS가 터치 컨트롤과
// 세로 회전 안내를 켠다. (데스크톱/키보드에는 아무 영향 없음)
const IS_TOUCH =
  (typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches) ||
  (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);
if (IS_TOUCH) document.body.classList.add("touch");

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
