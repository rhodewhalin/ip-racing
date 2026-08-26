// ============================================================
// RaceScene v2 — 탑다운 카트 레이싱, 카메라 회전 방식
//
// v1의 가장 큰 문제: 카메라가 카트를 따라 회전하지 않았다.
//   그래서 왼쪽으로 달릴 때 ← 를 누르면 화면상 아래로 꺾였다.
//   "↑ = 화면 위 = 내 앞" 이라는 감각이 깨지면 조작은 절대 손에 안 붙는다.
//
// v2: world 컨테이너 전체를 회전시켜 **내 카트가 항상 화면 위쪽을 향하게** 한다.
//   화면 하단 1/3 지점에 카트를 두어 앞이 더 많이 보이게 했다.
//
//   변환식: screen = R(θ)·zoom·(world − pivot) + anchor
//   컨테이너로 표현하면 rotation=θ, scale=zoom, 위치는 아래 updateCamera() 참고.
// ============================================================

import Phaser from "phaser";
import { net, InputState } from "./net";
import { KartBody, stepKart, KART } from "./physics";
import { buildTrack, project, TrackData } from "./track";

const COLORS = [0x4da3ff, 0xff9f43, 0x37d67a, 0xc77dff];

export class RaceScene extends Phaser.Scene {
  private world!: Phaser.GameObjects.Container;
  private trackG!: Phaser.GameObjects.Graphics;
  private track: TrackData | null = null;

  private karts: Record<string, Phaser.GameObjects.Container> = {};
  private ghost: Record<string, { x: number; y: number; heading: number }> = {};
  private pickupG: Record<string, Phaser.GameObjects.Container> = {};
  private hazardG: Record<string, Phaser.GameObjects.Container> = {};
  private floating: Phaser.GameObjects.Text[] = [];

  private local: KartBody = {
    x: 0, y: 0, heading: 0, speed: 0, steerActual: 0, driftCharge: 0, drifting: false,
  };
  private localReady = false;

  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  // ⚠️ Phaser Scene 은 이미 this.input(InputPlugin)을 쓴다. 이름을 겹치면 안 된다.
  private ctrl: InputState = { throttle: 0, steer: 0, drift: false };

  private camRot = 0;
  private camX = 0;
  private camY = 0;
  private zoom = 0.58;

  // 미니맵: world 컨테이너에 넣지 않는다. 화면에 고정되어야 하고 회전해서도 안 된다.
  private mapG!: Phaser.GameObjects.Graphics;
  private mapBox = { x: 1020, y: 20, w: 240, h: 160 };
  private mapT = { sx: 1, sy: 1, ox: 0, oy: 0 };

  constructor() { super("race"); }

  create() {
    this.cameras.main.setBackgroundColor("#0b1220");

    this.world = this.add.container(0, 0);
    this.trackG = this.add.graphics();
    this.world.add(this.trackG);

    // 미니맵은 씬에 직접 붙인다 (world 컨테이너 밖 = 회전/이동 영향 없음)
    this.mapG = this.add.graphics().setDepth(200);

    const kb = this.input.keyboard!;
    this.keys = {
      up: kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      drift: kb.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
    };
    kb.on("keydown-SPACE", () => net.useItem());

    net.on("fx", (d: any) => this.onFx(d));
    if (net.track) this.buildTrackGraphics();
    else net.on("track", () => this.buildTrackGraphics());
  }

  // ---------- 트랙 ----------

  private buildTrackGraphics() {
    if (!net.track || this.track) return;
    this.track = buildTrack(net.track.points, net.track.width);
    const pts = this.track.points;
    const w = this.track.width;

    this.trackG.clear();
    // 잔디 경계(넓게) → 아스팔트 → 중앙선 순으로 겹쳐 그린다
    this.trackG.lineStyle(w + 36, 0x14301f, 1);
    this.strokeLoop(pts);
    this.trackG.lineStyle(w, 0x243350, 1);
    this.strokeLoop(pts);
    this.trackG.lineStyle(w - 16, 0x2b3c5e, 1);
    this.strokeLoop(pts);
    this.trackG.lineStyle(4, 0x46608f, 0.55);
    this.strokeLoop(pts);

    // 미니맵 좌표 변환 계산
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of pts) {
      if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0];
      if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1];
    }
    const pad = 14;
    const sx = (this.mapBox.w - pad * 2) / (maxX - minX);
    const sy = (this.mapBox.h - pad * 2) / (maxY - minY);
    const sc = Math.min(sx, sy);
    this.mapT = {
      sx: sc, sy: sc,
      ox: this.mapBox.x + pad - minX * sc,
      oy: this.mapBox.y + pad - minY * sc,
    };

    // 출발선
    const a = pts[0], b = pts[1];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    this.trackG.lineStyle(10, 0xffffff, 0.9);
    this.trackG.lineBetween(
      a[0] - Math.sin(ang) * w / 2, a[1] + Math.cos(ang) * w / 2,
      a[0] + Math.sin(ang) * w / 2, a[1] - Math.cos(ang) * w / 2
    );
  }

  private strokeLoop(pts: number[][]) {
    const g = this.trackG;
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath();
    g.strokePath();
  }

  // ---------- 입력 ----------

  private readInput() {
    const k = this.keys;
    this.ctrl.throttle = k.up.isDown ? 1 : k.down.isDown ? -1 : 0;
    this.ctrl.steer = k.left.isDown ? -1 : k.right.isDown ? 1 : 0;
    this.ctrl.drift = k.drift.isDown;
    net.sendInput(this.ctrl);
  }

  // ---------- 루프 ----------

  update(_t: number, dtMs: number) {
    const state = net.state;
    if (!state || !this.track) return;
    const dt = Math.min(dtMs, 50) / 1000;

    const racing = state.phase === "racing";
    if (racing) this.readInput();

    const me = net.me();

    // 내 카트: 로컬 예측 + 서버 보정
    if (me) {
      if (!this.localReady) {
        this.syncLocal(me);
        this.camRot = -me.heading - Math.PI / 2;
        this.localReady = true;
      }
      if (racing && !me.finished) {
        const pr = project(this.track, this.local.x, this.local.y);
        stepKart(this.local, this.ctrl, dt, {
          offTrack: pr.offTrack, speedMul: me.speedMul, stunned: me.stunMs > 0,
        });
      }
      // 리스폰 등으로 크게 벌어지면 즉시 스냅, 아니면 부드럽게 끌어당긴다
      const gap = Math.hypot(me.x - this.local.x, me.y - this.local.y);
      if (gap > 240) this.syncLocal(me);
      else {
        this.local.x += (me.x - this.local.x) * 0.10;
        this.local.y += (me.y - this.local.y) * 0.10;
        this.local.heading += angleDiff(me.heading, this.local.heading) * 0.10;
      }
    }

    this.updateCamera(me, dt);
    this.renderKarts(state, dt);
    this.renderProps(state, dt);
    this.renderMinimap(state);
  }

  private syncLocal(me: any) {
    this.local.x = me.x; this.local.y = me.y;
    this.local.heading = me.heading; this.local.speed = me.speed;
    this.local.steerActual = me.steer ?? 0;
    this.local.driftCharge = 0; this.local.drifting = false;
  }

  /** 내 카트가 항상 화면 위를 향하도록 월드 전체를 회전시킨다. */
  private updateCamera(me: any, dt: number) {
    const px = me ? this.local.x : 0;
    const py = me ? this.local.y : 0;
    const targetRot = -(me ? this.local.heading : 0) - Math.PI / 2;

    // 회전은 부드럽게 따라간다. 즉시 맞추면 화면이 홱홱 돌아 멀미가 난다.
    this.camRot += angleDiff(targetRot, this.camRot) * Math.min(1, dt * 7);
    this.camX += (px - this.camX) * Math.min(1, dt * 14);
    this.camY += (py - this.camY) * Math.min(1, dt * 14);

    // 속도가 빠를수록 살짝 줌아웃 — 속도감과 시야를 동시에
    const sp = Math.abs(me?.speed ?? 0);
    const targetZoom = 0.62 - Math.min(sp / 560, 1) * 0.09;
    this.zoom += (targetZoom - this.zoom) * Math.min(1, dt * 3);

    // 카트를 화면 하단 1/3 에 두어 앞을 더 많이 보이게 한다
    const ax = this.scale.width / 2;
    const ay = this.scale.height * 0.66;

    const c = Math.cos(this.camRot), s = Math.sin(this.camRot);
    this.world.setRotation(this.camRot);
    this.world.setScale(this.zoom);
    this.world.x = ax - this.zoom * (c * this.camX - s * this.camY);
    this.world.y = ay - this.zoom * (s * this.camX + c * this.camY);
  }

  private renderKarts(state: any, dt: number) {
    const karts: any[] = [...state.karts.values()];

    karts.forEach((k, i) => {
      if (!this.karts[k.sessionId]) this.karts[k.sessionId] = this.makeKart(k, i);
      const c = this.karts[k.sessionId];
      const isSelf = k.sessionId === net.selfId;

      let px: number, py: number, ph: number;
      if (isSelf) {
        px = this.local.x; py = this.local.y; ph = this.local.heading;
      } else {
        const g = this.ghost[k.sessionId] ??= { x: k.x, y: k.y, heading: k.heading };
        if (Math.hypot(k.x - g.x, k.y - g.y) > 240) { g.x = k.x; g.y = k.y; g.heading = k.heading; }
        g.x += (k.x - g.x) * 0.25;
        g.y += (k.y - g.y) * 0.25;
        g.heading += angleDiff(k.heading, g.heading) * 0.25;
        px = g.x; py = g.y; ph = g.heading;
      }

      c.x = px; c.y = py; c.rotation = ph;

      // 리스폰 직후 깜빡임
      const blink = k.respawnMs > 0 && Math.floor(k.respawnMs / 110) % 2 === 0;
      c.setAlpha(blink ? 0.35 : 1);

      (c.getData("body") as Phaser.GameObjects.Rectangle).setAlpha(k.stunMs > 0 ? 0.5 : 1);
      (c.getData("shield") as Phaser.GameObjects.Arc).setVisible(k.shieldMs > 0);

      // 이름표는 화면상 항상 수평 (컨테이너 회전 + 카메라 회전을 상쇄)
      const label = c.getData("label") as Phaser.GameObjects.Text;
      label.setText(k.nickname + (k.quizActive ? " ❓" : ""));
      label.setRotation(-ph - this.camRot);

      // 드리프트 스파크는 충전 단계에 따라 색이 바뀐다.
      // "지금 몇 단인지"가 눈으로 보여야 물고 놓는 판단이 가능하다.
      if (k.drifting) {
        const info = KART.driftTiers[k.driftTier - 1];
        this.spark(px, py, ph, info ? info.color : 0x9fb4d8);
      } else if (k.boostMs > 0) {
        const info = KART.driftTiers[k.boostTier - 1];
        this.spark(px, py, ph, info ? info.color : 0xffd166);
      }
      if (k.offTrack && Math.abs(k.speed) > 60) this.spark(px, py, ph, 0x4a6b3a);
    });

    // 떠다니는 텍스트도 화면 수평 유지
    this.floating = this.floating.filter((t) => t.active);
    this.floating.forEach((t) => t.setRotation(-this.camRot));
  }

  private renderProps(state: any, dt: number) {
    for (const p of state.pickups as any[]) {
      let g = this.pickupG[p.id];
      if (!g) g = this.pickupG[p.id] = this.makePickup(p);
      g.setVisible(p.active);
      g.rotation += dt * (p.kind === "item" ? 1.6 : 0.6);
    }

    const live = new Set<string>();
    for (const h of state.hazards as any[]) {
      live.add(h.id);
      if (!this.hazardG[h.id]) this.hazardG[h.id] = this.makeHazard(h);
    }
    for (const id of Object.keys(this.hazardG)) {
      if (!live.has(id)) { this.hazardG[id].destroy(); delete this.hazardG[id]; }
    }
  }

  /** 미니맵 — 카메라가 회전하니 남들 위치를 알 방법이 이것뿐이다. */
  private renderMinimap(state: any) {
    if (!this.track) return;
    const g = this.mapG;
    const T = this.mapT;
    const mx = (x: number) => x * T.sx + T.ox;
    const my = (y: number) => y * T.sy + T.oy;

    g.clear();
    g.fillStyle(0x0a1020, 0.72);
    g.fillRoundedRect(this.mapBox.x, this.mapBox.y, this.mapBox.w, this.mapBox.h, 10);
    g.lineStyle(1, 0x2b3a57, 1);
    g.strokeRoundedRect(this.mapBox.x, this.mapBox.y, this.mapBox.w, this.mapBox.h, 10);

    const pts = this.track.points;
    g.lineStyle(5, 0x33456b, 1);
    g.beginPath();
    g.moveTo(mx(pts[0][0]), my(pts[0][1]));
    for (let i = 1; i < pts.length; i++) g.lineTo(mx(pts[i][0]), my(pts[i][1]));
    g.closePath();
    g.strokePath();

    const karts: any[] = [...state.karts.values()];
    karts.forEach((k, i) => {
      const isSelf = k.sessionId === net.selfId;
      const x = isSelf ? this.local.x : k.x;
      const y = isSelf ? this.local.y : k.y;
      g.fillStyle(COLORS[i % COLORS.length], 1);
      g.fillCircle(mx(x), my(y), isSelf ? 6 : 4.5);
      if (isSelf) {
        g.lineStyle(2, 0xffffff, 0.9);
        g.strokeCircle(mx(x), my(y), 8);
      }
    });
  }

  // ---------- 오브젝트 ----------

  private makeKart(k: any, i: number) {
    const color = COLORS[i % COLORS.length];
    const body = this.add.rectangle(0, 0, 64, 36, color).setStrokeStyle(3, 0xffffff, 0.6);
    const nose = this.add.triangle(36, 0, 0, -13, 0, 13, 18, 0, 0xffffff, 0.75);
    const shield = this.add.circle(0, 0, 48, 0x4da3ff, 0.18).setStrokeStyle(2, 0x4da3ff, 0.85);
    const label = this.add.text(0, -52, k.nickname, {
      fontSize: "16px", color: "#e8eefc", fontStyle: "bold",
    }).setOrigin(0.5);

    const c = this.add.container(k.x, k.y, [shield, body, nose, label]).setDepth(20);
    c.setData("body", body);
    c.setData("shield", shield);
    c.setData("label", label);
    this.world.add(c);
    return c;
  }

  private makePickup(p: any) {
    const isItem = p.kind === "item";
    const box = this.add.rectangle(0, 0, isItem ? 50 : 56, isItem ? 50 : 56,
      isItem ? 0x2f6fd0 : 0x8a5a2b, 0.92)
      .setStrokeStyle(3, isItem ? 0x8fc4ff : 0xffc78f, 1);
    const mark = this.add.text(0, 0, isItem ? "?" : "IP", {
      fontSize: isItem ? "28px" : "21px", color: "#ffffff", fontStyle: "bold",
    }).setOrigin(0.5);
    const c = this.add.container(p.x, p.y, [box, mark]).setDepth(8);
    this.world.add(c);
    return c;
  }

  private makeHazard(h: any) {
    const pool = this.add.ellipse(0, 0, 78, 56, 0x2a2015, 0.92).setStrokeStyle(2, 0x6b5b3a, 1);
    const c = this.add.container(h.x, h.y, [pool]).setDepth(6);
    this.world.add(c);
    return c;
  }

  // ---------- 연출 ----------

  private spark(x: number, y: number, heading: number, color: number) {
    const bx = x - Math.cos(heading) * 36 + Phaser.Math.Between(-9, 9);
    const by = y - Math.sin(heading) * 36 + Phaser.Math.Between(-9, 9);
    const s = this.add.circle(bx, by, Phaser.Math.Between(3, 8), color, 0.85).setDepth(15);
    this.world.add(s);
    this.tweens.add({
      targets: s, alpha: 0, scale: 0.3, duration: 300, ease: "Quad.easeOut",
      onComplete: () => s.destroy(),
    });
  }

  private onFx(d: any) {
    const c = this.karts[d.id];
    const isMe = d.id === net.selfId;

    switch (d.type) {
      case "drift_boost":
      case "boost":
        if (isMe) this.cameras.main.shake(160, 0.004);
        this.pop(c, "🔥", "#ffd166"); break;
      case "bomb":
      case "spin":
        if (isMe) this.cameras.main.shake(380, 0.011);
        this.pop(c, "💧", "#4da3ff"); break;
      case "respawn":
        this.pop(c, "복귀", "#ffb020");
        if (isMe) this.cameras.main.flash(200, 255, 176, 32); break;
      case "blocked": this.pop(c, "BLOCK", "#4da3ff"); break;
      case "shield": this.pop(c, "🛡", "#4da3ff"); break;
      case "pickup": this.pop(c, d.kind === "item" ? "?" : "IP", "#ffffff"); break;
      case "lap": if (isMe) this.pop(c, `LAP ${d.lap + 1}`, "#37d67a"); break;
      case "finish": if (isMe) this.cameras.main.flash(400, 255, 255, 255); break;
    }
  }

  private pop(c: Phaser.GameObjects.Container | undefined, text: string, color: string) {
    if (!c) return;
    const t = this.add.text(c.x, c.y - 66, text, {
      fontSize: "24px", color, fontStyle: "bold",
    }).setOrigin(0.5).setDepth(50).setRotation(-this.camRot);
    this.world.add(t);
    this.floating.push(t);
    this.tweens.add({
      targets: t, y: t.y - 44, alpha: 0, duration: 780, ease: "Quad.easeOut",
      onComplete: () => t.destroy(),
    });
  }
}

/** 각도 차이를 -π..π 로 정규화 */
function angleDiff(target: number, current: number) {
  let d = target - current;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}
