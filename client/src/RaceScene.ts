// ============================================================
// RaceScene — 진행도 기반 렌더링.
// 위치 = progress / trackLength. 서버 state 사이 구간은 부드럽게 보간.
// 아트 없이 사각형 + 텍스트로 코어 루프를 검증하는 스켈레톤.
// ============================================================

import Phaser from "phaser";
import { net } from "./net";

const TRACK_LENGTH = 6000; // 서버 CONFIG와 일치시킬 것
const GATE_POSITIONS = [800, 1700, 2700, 3700, 4700, 5600];
const MARGIN = 60;

const ITEM_EMOJI: Record<string, string> = { rocket: "🚀", shield: "🛡️", booster: "💨", "": "—" };

export class RaceScene extends Phaser.Scene {
  private cars: Record<string, Phaser.GameObjects.Container> = {};
  private hud!: Phaser.GameObjects.Text;
  private renderX: Record<string, number> = {}; // 보간용 현재 표시 x

  constructor() { super("race"); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.setBackgroundColor("#0a1020");

    // 트랙 라인
    const g = this.add.graphics();
    g.lineStyle(3, 0x2b3a57, 1);
    const laneY = [H * 0.42, H * 0.62];
    laneY.forEach((y) => g.lineBetween(MARGIN, y, W - MARGIN, y));

    // 게이트 마커
    GATE_POSITIONS.forEach((pos) => {
      const x = this.posToX(pos);
      g.lineStyle(2, 0x3a4a6a, 1).lineBetween(x, H * 0.34, x, H * 0.70);
    });
    // 결승선
    g.lineStyle(4, 0xffffff, 0.6).lineBetween(W - MARGIN, H * 0.30, W - MARGIN, H * 0.74);

    this.hud = this.add.text(16, 12, "", { fontSize: "14px", color: "#9fb0d0" });

    // 입력: 아이템 사용
    this.input.keyboard?.on("keydown-ONE", () => net.useItem());
    this.input.keyboard?.on("keydown-SPACE", () => net.useItem());
    // 게이트 선택 (quiz_choose 중에만 서버가 반영)
    this.input.keyboard?.on("keydown-LEFT", () => this.tryChoose("A"));
    this.input.keyboard?.on("keydown-DOWN", () => this.tryChoose("B"));
    this.input.keyboard?.on("keydown-RIGHT", () => this.tryChoose("C"));
  }

  private tryChoose(g: "A" | "B" | "C") {
    if (net.state?.phase === "quiz_choose") net.choose(g);
  }

  private posToX(pos: number) {
    const W = this.scale.width;
    return MARGIN + (pos / TRACK_LENGTH) * (W - 2 * MARGIN);
  }

  update() {
    const state = net.state;
    if (!state) return;
    const H = this.scale.height;
    const laneY = [H * 0.42, H * 0.62];

    const players: any[] = [...state.players.values()];
    players.forEach((p, i) => {
      if (!this.cars[p.sessionId]) this.cars[p.sessionId] = this.makeCar(p, i, laneY[i] ?? laneY[0]);
      const targetX = this.posToX(p.progress);
      // 보간: 현재 표시 x를 목표로 부드럽게
      this.renderX[p.sessionId] = Phaser.Math.Linear(this.renderX[p.sessionId] ?? targetX, targetX, 0.25);
      const car = this.cars[p.sessionId];
      car.x = this.renderX[p.sessionId];
      (car.getData("nick") as Phaser.GameObjects.Text).setText(
        `${p.nickname} ${ITEM_EMOJI[p.currentItem] ?? "—"}${p.shieldActive ? "🛡" : ""}`
      );
      (car.getData("body") as Phaser.GameObjects.Rectangle).setFillStyle(p.rank === 1 ? 0x4da3ff : 0xff9f43);
    });

    this.hud.setText(
      `phase: ${state.phase}   gate: ${state.currentGateIndex}/6` +
        (state.phase === "countdown" ? `   시작: ${state.countdown}` : "")
    );
  }

  private makeCar(p: any, i: number, y: number) {
    const body = this.add.rectangle(0, 0, 34, 20, 0x4da3ff).setStrokeStyle(2, 0xffffff, 0.5);
    const nick = this.add.text(-18, -30, p.nickname, { fontSize: "12px", color: "#e8eefc" });
    const c = this.add.container(this.posToX(p.progress), y, [body, nick]);
    c.setData("body", body);
    c.setData("nick", nick);
    this.renderX[p.sessionId] = this.posToX(p.progress);
    return c;
  }
}
