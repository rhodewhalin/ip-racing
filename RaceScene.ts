// ============================================================
// RaceScene — 진행도 기반 렌더링 + 타격감 레이어 (Stage 1.5)
//
// 추가된 연출:
//  ① 히트스톱  : 정답 순간 60ms 시간 정지 → 화면 플래시 → 스쿼시&스트레치
//  ② 스피드감  : 차선 대시 스크롤 + 배수>1일 때 스피드라인 + 잔상
//  ③ 카메라    : 정답/오답/피격이 서로 다른 흔들림 패턴
//  ④ 결승선    : 슬로모션 진입
//
// 파티클 100개보다 히트스톱 3줄이 체감이 크다. 순서대로 넣을 것.
// ============================================================

import Phaser from "phaser";
import { net } from "./net";

const TRACK_LENGTH = 6000; // 서버 CONFIG와 일치시킬 것
const GATE_POSITIONS = [700, 1550, 2450, 3350, 4250, 5200];
const MARGIN = 60;

const ITEM_EMOJI: Record<string, string> = { rocket: "🚀", shield: "🛡️", booster: "💨", "": "—" };
const COLOR = { self: 0x4da3ff, rival: 0xff9f43, good: 0x37d67a, bad: 0xff5d6c };

export class RaceScene extends Phaser.Scene {
  private cars: Record<string, Phaser.GameObjects.Container> = {};
  private renderX: Record<string, number> = {};
  private laneOf: Record<string, number> = {};
  private hud!: Phaser.GameObjects.Text;
  private flash!: Phaser.GameObjects.Rectangle;
  private dashG!: Phaser.GameObjects.Graphics;
  private dashOffset = 0;
  private trailTimer = 0;
  private finished = false;

  constructor() { super("race"); }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.setBackgroundColor("#0a1020");

    // --- 정적 트랙 ---
    const g = this.add.graphics();
    g.lineStyle(3, 0x2b3a57, 1);
    const laneY = this.laneY();
    laneY.forEach((y) => g.lineBetween(MARGIN, y, W - MARGIN, y));

    GATE_POSITIONS.forEach((pos, i) => {
      const x = this.posToX(pos);
      g.lineStyle(2, 0x3a4a6a, 1).lineBetween(x, H * 0.32, x, H * 0.72);
      this.add.text(x - 6, H * 0.26, `${i + 1}`, { fontSize: "11px", color: "#5a6d92" });
    });
    g.lineStyle(4, 0xffffff, 0.6).lineBetween(W - MARGIN, H * 0.28, W - MARGIN, H * 0.76);

    // --- 스크롤 대시(속도감) ---
    this.dashG = this.add.graphics();

    this.hud = this.add.text(16, 12, "", { fontSize: "14px", color: "#9fb0d0" });

    // --- 화면 플래시 오버레이 ---
    this.flash = this.add.rectangle(W / 2, H / 2, W, H, 0xffffff, 0).setDepth(999);

    // --- 입력 ---
    this.input.keyboard?.on("keydown-ONE", () => net.useItem());
    this.input.keyboard?.on("keydown-SPACE", () => this.onSpace());
    this.input.keyboard?.on("keydown-LEFT", () => this.tryChoose("A"));
    this.input.keyboard?.on("keydown-DOWN", () => this.tryChoose("B"));
    this.input.keyboard?.on("keydown-RIGHT", () => this.tryChoose("C"));

    // --- 서버 이벤트 → 연출 ---
    net.on("gate_resolved", (d: any) => this.onGateResolved(d));
    net.on("item_used", (d: any) => this.onItemUsed(d));
    net.on("match_end", () => this.onMatchEnd());
  }

  /** Space는 맥락에 따라 다르게 동작한다: 레이스 중엔 아이템, READ 중엔 승부 토글. */
  private onSpace() {
    const phase = net.state?.phase;
    if (phase === "racing") return net.useItem();
    if (phase === "quiz_read") {
      const cur = net.me()?.bet === "risk" ? "safe" : "risk";
      net.setBet(cur);
    }
  }

  private tryChoose(g: "A" | "B" | "C") {
    if (net.state?.phase === "quiz_choose") net.choose(g);
  }

  private laneY() { const H = this.scale.height; return [H * 0.42, H * 0.62]; }

  private posToX(pos: number) {
    const W = this.scale.width;
    return MARGIN + (pos / TRACK_LENGTH) * (W - 2 * MARGIN);
  }

  // ---------- 연출 ----------

  /** ① 히트스톱: 짧은 시간 정지가 "맞았다"는 감각의 핵심이다. */
  private hitStop(ms = 60) {
    this.time.timeScale = 0.001;
    this.tweens.timeScale = 0.001;
    this.time.delayedCall(ms, () => {
      this.time.timeScale = 1;
      this.tweens.timeScale = 1;
    }, [], this);
    // delayedCall 자체도 timeScale 영향을 받으므로 실시간 타이머로 복구를 보장
    window.setTimeout(() => { this.time.timeScale = 1; this.tweens.timeScale = 1; }, ms);
  }

  private screenFlash(color: number, alpha = 0.35, ms = 180) {
    this.flash.setFillStyle(color, 1);
    this.flash.setAlpha(alpha);
    this.tweens.add({ targets: this.flash, alpha: 0, duration: ms, ease: "Quad.easeOut" });
  }

  /** 스쿼시&스트레치. 선형 트윈이면 싸구려로 보인다 — Back.easeOut 필수. */
  private squash(car: Phaser.GameObjects.Container, sx: number, sy: number) {
    car.setScale(sx, sy);
    this.tweens.add({ targets: car, scaleX: 1, scaleY: 1, duration: 260, ease: "Back.easeOut" });
  }

  private popText(car: Phaser.GameObjects.Container, text: string, color: string) {
    const t = this.add.text(car.x - 14, car.y - 46, text, {
      fontSize: "16px", color, fontStyle: "bold",
    }).setDepth(500);
    this.tweens.add({
      targets: t, y: t.y - 28, alpha: 0, duration: 700, ease: "Quad.easeOut",
      onComplete: () => t.destroy(),
    });
  }

  private onGateResolved(d: any) {
    const mine = d?.perPlayer?.[net.selfId];
    if (!mine) return;
    const car = this.cars[net.selfId];

    if (mine.passed) {
      this.hitStop(mine.bet === "risk" ? 90 : 55);
      this.screenFlash(mine.bet === "risk" ? 0xffe066 : 0x37d67a, mine.bet === "risk" ? 0.5 : 0.3);
      this.cameras.main.shake(120, 0.004);
      if (car) {
        this.squash(car, 1.35, 0.7);
        this.popText(car, mine.bet === "risk" ? "승부 성공!" : "정답", "#37d67a");
        if (mine.streak >= 2) this.popText(car, `${mine.streak} COMBO`, "#ffe066");
      }
    } else {
      // 오답은 진폭이 크고 느린 다른 패턴 — 피드백이 구분되어야 한다.
      this.cameras.main.shake(mine.bet === "risk" ? 420 : 220, mine.bet === "risk" ? 0.012 : 0.006);
      this.screenFlash(0xff5d6c, 0.28, 260);
      if (car) {
        this.squash(car, 0.7, 1.3);
        this.popText(car, mine.bet === "risk" ? "스핀아웃!" : "오답", "#ff5d6c");
        if (mine.bet === "risk") {
          this.tweens.add({ targets: car, angle: 360, duration: 500, ease: "Quad.easeOut",
            onComplete: () => car.setAngle(0) });
        }
      }
    }
  }

  private onItemUsed(d: any) {
    const car = this.cars[d?.target];
    if (!car) return;
    if (d.blocked) {
      this.popText(car, "BLOCKED", "#4da3ff");
      this.screenFlash(0x4da3ff, 0.2, 140);
      return;
    }
    if (d.item === "rocket") {
      this.cameras.main.shake(260, 0.008);
      this.squash(car, 0.75, 1.25);
      this.popText(car, "🚀", "#ff5d6c");
    } else if (d.item === "booster") {
      this.squash(car, 1.3, 0.8);
      this.popText(car, "💨", "#37d67a");
    } else if (d.item === "shield") {
      this.popText(car, "🛡️", "#4da3ff");
    }
  }

  private onMatchEnd() {
    if (this.finished) return;
    this.finished = true;
    // 마지막 인상이 게임 평가를 결정한다 — 슬로모션으로 마무리.
    this.tweens.addCounter({
      from: 1, to: 0.25, duration: 700, ease: "Quad.easeOut",
      onUpdate: (tw) => { this.time.timeScale = tw.getValue() ?? 1; },
    });
    this.screenFlash(0xffffff, 0.5, 500);
  }

  /** ② 잔상: 부스트 중일 때만 남긴다. 항상 남기면 속도 대비가 사라진다. */
  private emitTrail(car: Phaser.GameObjects.Container, color: number) {
    const r = this.add.rectangle(car.x, car.y, 34, 20, color, 0.45).setDepth(1);
    this.tweens.add({
      targets: r, alpha: 0, scaleX: 0.6, x: r.x - 26, duration: 320, ease: "Quad.easeOut",
      onComplete: () => r.destroy(),
    });
  }

  private emitSpeedLine(car: Phaser.GameObjects.Container) {
    const y = car.y + Phaser.Math.Between(-14, 14);
    const l = this.add.rectangle(car.x - 24, y, Phaser.Math.Between(18, 40), 2, 0xbcd6ff, 0.7).setDepth(1);
    this.tweens.add({
      targets: l, x: l.x - 140, alpha: 0, duration: 260, ease: "Quad.easeIn",
      onComplete: () => l.destroy(),
    });
  }

  // ---------- 루프 ----------

  update(_t: number, dt: number) {
    const state = net.state;
    if (!state) return;
    const W = this.scale.width, H = this.scale.height;
    const laneY = this.laneY();

    const players: any[] = [...state.players.values()];

    // 내가 항상 위 레인. 자기 차를 찾기 쉬워야 한다.
    const ordered = [...players].sort((a, b) =>
      (a.sessionId === net.selfId ? -1 : 0) - (b.sessionId === net.selfId ? -1 : 0));

    let leaderSpeed = 1;

    ordered.forEach((p, i) => {
      if (!this.cars[p.sessionId]) {
        this.laneOf[p.sessionId] = i;
        this.cars[p.sessionId] = this.makeCar(p, laneY[i] ?? laneY[0]);
      }
      const targetX = this.posToX(p.progress);
      this.renderX[p.sessionId] = Phaser.Math.Linear(this.renderX[p.sessionId] ?? targetX, targetX, 0.25);
      const car = this.cars[p.sessionId];
      car.x = this.renderX[p.sessionId];

      const isSelf = p.sessionId === net.selfId;
      leaderSpeed = Math.max(leaderSpeed, p.speedMultiplier);

      (car.getData("nick") as Phaser.GameObjects.Text).setText(
        `${p.nickname} ${ITEM_EMOJI[p.currentItem] ?? "—"}${p.shieldActive ? "🛡" : ""}` +
        (state.phase === "quiz_read" && p.bet === "risk" ? " 🔥승부" : "")
      );

      const body = car.getData("body") as Phaser.GameObjects.Rectangle;
      body.setFillStyle(isSelf ? COLOR.self : COLOR.rival);
      // 감속 중엔 어둡게, 가속 중엔 밝게 — 상태가 색으로 읽혀야 한다.
      body.setAlpha(p.speedMultiplier < 1 ? 0.55 : 1);

      // 부스트 중 잔상 + 스피드라인
      if (p.speedMultiplier > 1.05 && state.phase === "racing") {
        this.trailTimer += dt;
        if (this.trailTimer > 45) {
          this.trailTimer = 0;
          this.emitTrail(car, isSelf ? COLOR.self : COLOR.rival);
          this.emitSpeedLine(car);
        }
      }
    });

    // ③ 차선 대시 스크롤 — 2D에서 "속도"는 차가 아니라 배경이 만든다.
    if (state.phase === "racing") this.dashOffset -= leaderSpeed * dt * 0.35;
    this.dashG.clear();
    this.dashG.lineStyle(2, 0x22304c, 1);
    for (const y of laneY) {
      for (let x = MARGIN; x < W - MARGIN; x += 40) {
        const dx = ((x + this.dashOffset) % 40 + 40) % 40 + MARGIN;
        if (dx > W - MARGIN - 16) continue;
        this.dashG.lineBetween(dx, y + 16, dx + 16, y + 16);
      }
    }

    const me = net.me();
    this.hud.setText(
      `phase: ${state.phase}   gate: ${state.currentGateIndex}/6` +
      (me ? `   speed: ×${me.speedMultiplier.toFixed(2)}   streak: ${me.streak}` : "") +
      (state.phase === "countdown" ? `   시작: ${state.countdown}` : "")
    );
  }

  private makeCar(p: any, y: number) {
    const body = this.add.rectangle(0, 0, 34, 20, COLOR.self).setStrokeStyle(2, 0xffffff, 0.5);
    const nick = this.add.text(-18, -30, p.nickname, { fontSize: "12px", color: "#e8eefc" });
    const c = this.add.container(this.posToX(p.progress), y, [body, nick]).setDepth(10);
    c.setData("body", body);
    c.setData("nick", nick);
    this.renderX[p.sessionId] = this.posToX(p.progress);
    return c;
  }
}
