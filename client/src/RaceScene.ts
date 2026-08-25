// ============================================================
// RaceScene — 탑다운 카트 레이싱 (Stage 2)
//
// 렌더링 구조:
//  · world 컨테이너를 카메라가 따라간다 (내 카트 중심)
//  · 내 카트는 로컬 예측(prediction)으로 즉시 반응하고, 서버 좌표로 부드럽게 보정
//    → 이게 없으면 방향키를 눌러도 100ms 뒤에 도는 느낌이 난다
//  · 남의 카트는 서버 좌표로 보간만
// ============================================================

import Phaser from "phaser";
import { net, InputState } from "./net";
import { KartBody, stepKart } from "./physics";
import { buildTrack, project, TrackData } from "./track";

const COLORS = [0x4da3ff, 0xff9f43, 0x37d67a, 0xc77dff];
const ITEM_EMOJI: Record<string, string> = {
  bomb: "💧", boost: "🔥", oil: "🛢", shield: "🛡", "": "",
};

export class RaceScene extends Phaser.Scene {
  private world!: Phaser.GameObjects.Container;
  private trackG!: Phaser.GameObjects.Graphics;
  private fxG!: Phaser.GameObjects.Graphics;
  private track: TrackData | null = null;

  private karts: Record<string, Phaser.GameObjects.Container> = {};
  private ghost: Record<string, { x: number; y: number; heading: number }> = {};
  private pickupG: Record<string, Phaser.GameObjects.Container> = {};
  private hazardG: Record<string, Phaser.GameObjects.Container> = {};

  private local: KartBody = { x: 0, y: 0, heading: 0, speed: 0, driftCharge: 0, drifting: false };
  private localReady = false;

  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  // ⚠️ Phaser Scene 은 이미 this.input(InputPlugin)을 쓴다. 이름을 겹치면 안 된다.
  private ctrl: InputState = { throttle: 0, steer: 0, drift: false };
  private camX = 0;
  private camY = 0;

  constructor() { super("race"); }

  create() {
    this.cameras.main.setBackgroundColor("#0b1220");

    this.world = this.add.container(0, 0);
    this.trackG = this.add.graphics();
    this.fxG = this.add.graphics();
    this.world.add(this.trackG);
    this.world.add(this.fxG);

    const kb = this.input.keyboard!;
    this.keys = {
      up: kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      drift: kb.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
      item: kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
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
    // 아스팔트: 두꺼운 닫힌 폴리라인
    this.trackG.lineStyle(w, 0x1b2740, 1);
    this.strokeLoop(this.trackG, pts);
    // 가장자리 라인
    this.trackG.lineStyle(w - 14, 0x233251, 1);
    this.strokeLoop(this.trackG, pts);
    // 중앙 파선
    this.trackG.lineStyle(3, 0x35496f, 0.8);
    this.strokeLoop(this.trackG, pts);

    // 코너 꼭짓점을 둥글게 메워 이음새를 감춘다
    this.trackG.fillStyle(0x233251, 1);
    pts.forEach((p) => this.trackG.fillCircle(p[0], p[1], (w - 14) / 2));

    // 출발선
    const a = pts[0], b = pts[1];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    this.trackG.lineStyle(8, 0xffffff, 0.85);
    this.trackG.lineBetween(
      a[0] - Math.sin(ang) * w / 2, a[1] + Math.cos(ang) * w / 2,
      a[0] + Math.sin(ang) * w / 2, a[1] - Math.cos(ang) * w / 2
    );
  }

  private strokeLoop(g: Phaser.GameObjects.Graphics, pts: number[][]) {
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
        this.local = {
          x: me.x, y: me.y, heading: me.heading, speed: me.speed,
          driftCharge: 0, drifting: false,
        };
        this.localReady = true;
      }
      if (racing && !me.finished) {
        const pr = project(this.track, this.local.x, this.local.y);
        stepKart(this.local, this.ctrl, dt, {
          offTrack: pr.offTrack,
          speedMul: me.speedMul,
          stunned: me.stunMs > 0,
        });
      }
      // 서버와 벌어지면 부드럽게 끌어당긴다. 많이 벌어지면 즉시 스냅.
      const drift = Math.hypot(me.x - this.local.x, me.y - this.local.y);
      if (drift > 260) {
        this.local.x = me.x; this.local.y = me.y;
        this.local.heading = me.heading; this.local.speed = me.speed;
      } else {
        this.local.x += (me.x - this.local.x) * 0.10;
        this.local.y += (me.y - this.local.y) * 0.10;
        this.local.heading += angleDiff(me.heading, this.local.heading) * 0.10;
      }
    }

    // 카트 렌더
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
        g.x += (k.x - g.x) * 0.25;
        g.y += (k.y - g.y) * 0.25;
        g.heading += angleDiff(k.heading, g.heading) * 0.25;
        px = g.x; py = g.y; ph = g.heading;
      }

      c.x = px; c.y = py;
      c.rotation = ph;

      const body = c.getData("body") as Phaser.GameObjects.Rectangle;
      body.setAlpha(k.stunMs > 0 ? 0.5 : 1);
      (c.getData("shield") as Phaser.GameObjects.Arc).setVisible(k.shieldMs > 0);

      const label = c.getData("label") as Phaser.GameObjects.Text;
      label.setText(k.nickname + (k.quizActive ? " ❓" : ""));
      label.setRotation(-ph); // 이름표는 항상 수평

      // 드리프트 스파크 / 부스트 불꽃
      if ((k.drifting && k.driftCharge > 0.5) || k.boostMs > 0) {
        this.spark(px, py, ph, k.boostMs > 0 ? 0xffd166 : 0x8ea3c8);
      }
      if (k.offTrack && Math.abs(k.speed) > 60) this.spark(px, py, ph, 0x6b5b3a);
    });

    // 픽업
    for (const p of state.pickups as any[]) {
      let g = this.pickupG[p.id];
      if (!g) g = this.pickupG[p.id] = this.makePickup(p);
      g.setVisible(p.active);
      g.rotation += dt * (p.kind === "item" ? 1.6 : 0.6);
    }

    // 기름
    const liveIds = new Set<string>();
    for (const h of state.hazards as any[]) {
      liveIds.add(h.id);
      if (!this.hazardG[h.id]) this.hazardG[h.id] = this.makeHazard(h);
    }
    for (const id of Object.keys(this.hazardG)) {
      if (!liveIds.has(id)) { this.hazardG[id].destroy(); delete this.hazardG[id]; }
    }

    // 카메라: 내 카트를 화면 중앙에. 속도가 빠를수록 살짝 앞을 본다.
    const target = me ? this.local : { x: 0, y: 0, heading: 0, speed: 0 };
    const lead = Math.min(Math.abs((me?.speed ?? 0)) * 0.35, 220);
    const tx = target.x + Math.cos(target.heading) * lead;
    const ty = target.y + Math.sin(target.heading) * lead;
    this.camX += (tx - this.camX) * 0.12;
    this.camY += (ty - this.camY) * 0.12;

    const zoom = 0.62;
    this.world.setScale(zoom);
    this.world.x = this.scale.width / 2 - this.camX * zoom;
    this.world.y = this.scale.height / 2 - this.camY * zoom;
  }

  // ---------- 오브젝트 ----------

  private makeKart(k: any, i: number) {
    const color = COLORS[i % COLORS.length];
    const body = this.add.rectangle(0, 0, 62, 34, color).setStrokeStyle(3, 0xffffff, 0.55);
    const nose = this.add.triangle(34, 0, 0, -12, 0, 12, 16, 0, 0xffffff, 0.7);
    const shield = this.add.circle(0, 0, 46, 0x4da3ff, 0.18).setStrokeStyle(2, 0x4da3ff, 0.8);
    const label = this.add.text(0, -46, k.nickname, {
      fontSize: "15px", color: "#e8eefc", fontStyle: "bold",
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
    const box = isItem
      ? this.add.rectangle(0, 0, 46, 46, 0x2f6fd0, 0.9).setStrokeStyle(3, 0x8fc4ff, 1)
      : this.add.rectangle(0, 0, 52, 52, 0x8a5a2b, 0.9).setStrokeStyle(3, 0xffc78f, 1);
    const mark = this.add.text(0, 0, isItem ? "?" : "IP", {
      fontSize: isItem ? "26px" : "20px", color: "#ffffff", fontStyle: "bold",
    }).setOrigin(0.5);
    const c = this.add.container(p.x, p.y, [box, mark]).setDepth(8);
    this.world.add(c);
    return c;
  }

  private makeHazard(h: any) {
    const pool = this.add.ellipse(0, 0, 74, 52, 0x2a2015, 0.92).setStrokeStyle(2, 0x6b5b3a, 1);
    const c = this.add.container(h.x, h.y, [pool]).setDepth(6);
    this.world.add(c);
    return c;
  }

  // ---------- 연출 ----------

  private spark(x: number, y: number, heading: number, color: number) {
    const bx = x - Math.cos(heading) * 34 + Phaser.Math.Between(-8, 8);
    const by = y - Math.sin(heading) * 34 + Phaser.Math.Between(-8, 8);
    const s = this.add.circle(bx, by, Phaser.Math.Between(3, 7), color, 0.85).setDepth(15);
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
        if (c) this.pop(c, "🔥", "#ffd166");
        break;
      case "bomb":
      case "spin":
        if (isMe) this.cameras.main.shake(380, 0.011);
        if (c) this.pop(c, "💧", "#4da3ff");
        break;
      case "blocked":
        if (c) this.pop(c, "BLOCK", "#4da3ff");
        break;
      case "shield":
        if (c) this.pop(c, "🛡", "#4da3ff");
        break;
      case "pickup":
        if (c) this.pop(c, d.kind === "item" ? "?" : "IP", "#ffffff");
        break;
      case "lap":
        if (isMe) this.pop(c, `LAP ${d.lap + 1}`, "#37d67a");
        break;
      case "finish":
        if (isMe) this.cameras.main.flash(400, 255, 255, 255);
        break;
    }
  }

  private pop(c: Phaser.GameObjects.Container | undefined, text: string, color: string) {
    if (!c) return;
    const t = this.add.text(c.x, c.y - 60, text, {
      fontSize: "22px", color, fontStyle: "bold",
    }).setOrigin(0.5).setDepth(50);
    this.world.add(t);
    this.tweens.add({
      targets: t, y: t.y - 40, alpha: 0, duration: 750, ease: "Quad.easeOut",
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
