// ============================================================
// RaceRoom — 권위 서버 (Stage 2: 카트 주행)
//
// 이전 버전과의 핵심 차이:
//  · progress 스칼라 → (x, y, heading, speed) 2D 물리. 플레이어 입력이 들어간다.
//  · 퀴즈가 레이스를 멈추지 않는다. 플레이어별로 독립 출제.
//  · 2~4인. 순위 기반 아이템 배정도 인원수에 맞춰 스케일.
//
// 상태 머신: lobby → countdown → racing → finished
// ============================================================

import { Room, Client } from "colyseus";
import { RoomState, KartState, PickupState, HazardState } from "./schema";
import { CONFIG, ItemId, QuizKind } from "./gameConfig";
import { KART, KartInput, stepKart, driftTier, driftTierInfo, applyWall } from "./physics";
import {
  TRACK_POINTS, TRACK_WIDTH, buildTrack, project, pointAt, offsetPoint, TrackData,
} from "./track";
import { grantItem } from "./items";
import { QuestionDispenser } from "./dispenser";
import { BotDriver } from "./bot";
import { gateLabel, Question } from "./questions";

interface Pending {
  q: Question;
  kind: QuizKind;
  correctLabel: string;   // 섞은 뒤의 정답 라벨
  shuffled: string[];     // 실제로 보낸 보기 순서
  timer: any;
}

export class RaceRoom extends Room<RoomState> {
  maxClients = CONFIG.maxClients;

  private track!: TrackData;
  private inputs = new Map<string, KartInput>();
  private pending = new Map<string, Pending>();
  private lastQuizAt = new Map<string, number>();
  private prevS = new Map<string, number>();
  private wasDrifting = new Map<string, boolean>();
  private dispenser = new QuestionDispenser();
  private respawnAt = new Map<string, number>();
  private hazardArm = new Map<string, number>();
  private offMs = new Map<string, number>();      // 코스 이탈 지속 시간
  private lastGoodS = new Map<string, number>();  // 마지막으로 코스 위에 있던 지점
  private bots = new Map<string, BotDriver>();
  private lapStart = new Map<string, number>();
  private botItemAt = new Map<string, number>();
  private botSeq = 0;
  private stuckMs = new Map<string, number>();
  private wallFx = new Map<string, number>();
  private halfPassed = new Map<string, boolean>();  // 중간 체크포인트 통과 여부
  private raceStart = 0;
  private askedLog: { sessionId: string; qId: string; correct: boolean; kind: string }[] = [];

  onCreate() {
    this.setState(new RoomState());
    this.state.laps = CONFIG.laps;
    this.track = buildTrack(TRACK_POINTS, TRACK_WIDTH);

    const code = makeRoomCode();
    this.state.roomCode = code;
    this.setMetadata({ roomCode: code });

    this.spawnPickups();

    this.onMessage("set_ready", (client) => {
      const k = this.state.karts.get(client.sessionId);
      if (!k || this.state.phase !== "lobby") return;
      k.ready = true;
      this.maybeStart();
    });

    // 입력은 바뀔 때만 온다. 서버는 마지막 입력을 계속 적용.
    this.onMessage("input", (client, msg: any) => {
      const cur = this.inputs.get(client.sessionId);
      if (!cur) return;
      if (typeof msg?.throttle === "number") cur.throttle = clamp(msg.throttle, -1, 1);
      if (typeof msg?.steer === "number") cur.steer = clamp(msg.steer, -1, 1);
      if (typeof msg?.drift === "boolean") cur.drift = msg.drift;
    });

    this.onMessage("use_item", (client) => this.useItem(client.sessionId));

    // 재경기: 결과 화면에서 "다시 하기"
    this.onMessage("rematch", (client) => {
      if (this.state.phase !== "finished") return;
      const k = this.state.karts.get(client.sessionId);
      if (!k) return;
      this.resetForRematch();
    });

    this.onMessage("quiz_answer", (client, msg: { choice?: string }) => {
      this.resolveQuiz(client.sessionId, msg?.choice || "");
    });

    this.setSimulationInterval((dt) => this.update(dt), 1000 / CONFIG.tickHz);
  }

  onJoin(client: Client, options: { nickname?: string } = {}) {
    const k = new KartState();
    k.sessionId = client.sessionId;
    k.nickname = (options.nickname || "Player").slice(0, 12);

    // 출발선: 중심선 s=0 에서 좌우로 벌려 세운다
    const idx = this.state.karts.size;
    const lat = [-96, -32, 32, 96][idx] ?? 0;
    // 출발선보다 살짝 앞에 세운다. 정확히 0에 두면 좌우로 벌린 카트가
    // 출발선 뒤쪽으로 투영돼 가짜 랩이 세어진다.
    const sp = offsetPoint(this.track, 80, lat);
    k.x = sp.x; k.y = sp.y; k.heading = sp.angle;

    this.state.karts.set(client.sessionId, k);
    this.inputs.set(client.sessionId, { throttle: 0, steer: 0, drift: false });
    this.prevS.set(client.sessionId, project(this.track, k.x, k.y).s);
    this.halfPassed.set(client.sessionId, false);
    this.wasDrifting.set(client.sessionId, false);
    this.offMs.set(client.sessionId, 0);
    this.lastGoodS.set(client.sessionId, 0);
    this.stuckMs.set(client.sessionId, 0);

    // 트랙 지오메트리는 상태가 아니라 1회성 데이터 — 접속 시 한 번만 보낸다
    client.send("track", { points: TRACK_POINTS, width: TRACK_WIDTH, laps: CONFIG.laps });
  }

  onLeave(client: Client) {
    const id = client.sessionId;
    this.state.karts.delete(id);
    this.inputs.delete(id);
    this.prevS.delete(id);
    this.wasDrifting.delete(id);
    this.offMs.delete(id);
    this.lastGoodS.delete(id);
    this.stuckMs.delete(id);
    const p = this.pending.get(id);
    if (p) { p.timer?.clear?.(); this.pending.delete(id); }
  }

  // ---------- 흐름 ----------

  private maybeStart() {
    const ks = [...this.state.karts.values()];
    // 봇이 켜져 있으면 혼자서도 시작할 수 있다. 테스트 속도가 완전히 달라진다.
    const need = CONFIG.bots.enabled ? 1 : CONFIG.minClients;
    if (ks.length >= need && ks.every((k) => k.ready)) this.startCountdown();
  }

  private startCountdown() {
    this.state.phase = "countdown";
    this.lock();
    this.fillWithBots();
    this.state.countdown = Math.ceil(CONFIG.countdownMs / 1000);
    const iv = this.clock.setInterval(() => {
      this.state.countdown -= 1;
      if (this.state.countdown <= 0) {
        iv.clear();
        this.state.phase = "racing";
        this.raceStart = Date.now();
        for (const k of this.state.karts.values()) { this.lapStart.set(k.sessionId, this.raceStart); k.lapStartMs = 0; }
        this.broadcast("race_start");
      }
    }, 1000);
  }

  /** 빈 자리를 봇으로 채운다. */
  private fillWithBots() {
    if (!CONFIG.bots.enabled) return;
    const cfg = CONFIG.bots;
    while (this.state.karts.size < cfg.fillTo) {
      const idx = this.state.karts.size;
      const id = `bot-${++this.botSeq}`;
      const k = new KartState();
      k.sessionId = id;
      k.nickname = cfg.names[(this.botSeq - 1) % cfg.names.length];
      k.isBot = true;
      k.ready = true;

      const lat = [-96, -32, 32, 96][idx] ?? 0;
      const sp = offsetPoint(this.track, 80, lat);
      k.x = sp.x; k.y = sp.y; k.heading = sp.angle;

      this.state.karts.set(id, k);
      this.inputs.set(id, { throttle: 0, steer: 0, drift: false });
      this.prevS.set(id, project(this.track, k.x, k.y).s);
      this.halfPassed.set(id, false);
      this.wasDrifting.set(id, false);
      this.offMs.set(id, 0);
      this.lastGoodS.set(id, 0);
      this.stuckMs.set(id, 0);

      const level = cfg.levels[cfg.defaultLevel] ?? cfg.levels[1];
      this.bots.set(id, new BotDriver(level as any, Math.random()));
    }
  }

  /** 봇 입력 생성 + 아이템 자동 사용 */
  private driveBots(dt: number, now: number) {
    for (const [id, driver] of this.bots) {
      const k = this.state.karts.get(id);
      if (!k || k.finished) continue;

      if (k.stunMs > 0 || k.respawnMs > 0) {
        this.inputs.set(id, { throttle: 0, steer: 0, drift: false });
        continue;
      }
      this.inputs.set(id, driver.think(this.track, k, dt));

      // 아이템은 조금 뜸을 들였다가 쓴다 — 즉시 쓰면 기계 같다
      if (k.item) {
        let at = this.botItemAt.get(id);
        if (at === undefined) {
          const [lo, hi] = CONFIG.bots.itemUseDelayMs;
          at = now + lo + Math.random() * (hi - lo);
          this.botItemAt.set(id, at);
        }
        if (now >= at) { this.useItem(id); this.botItemAt.delete(id); }
      } else {
        this.botItemAt.delete(id);
      }
    }
  }

  private spawnPickups() {
    const mk = (kind: "item" | "block", frac: number, i: number) => {
      const p = new PickupState();
      p.id = `${kind}-${i}`;
      p.kind = kind;
      const lat = kind === "item" ? [-72, 0, 72][i % 3] : 0;
      const pt = offsetPoint(this.track, frac * this.track.total, lat);
      p.x = pt.x; p.y = pt.y;
      p.active = true;
      this.state.pickups.push(p);
    };
    CONFIG.itemBoxAt.forEach((f, i) => mk("item", f, i));
    CONFIG.ipBlockAt.forEach((f, i) => mk("block", f, i));
  }

  // ---------- 메인 루프 ----------

  private update(dtMs: number) {
    if (this.state.phase !== "racing") return;
    const dt = dtMs / 1000;
    const now = Date.now();
    this.state.raceMs = now - this.raceStart;

    const karts = [...this.state.karts.values()];
    this.driveBots(dt, now);

    for (const k of karts) {
      if (k.finished) continue;

      // 상태 효과 타이머
      k.stunMs = Math.max(0, k.stunMs - dtMs);
      k.shieldMs = Math.max(0, k.shieldMs - dtMs);
      k.boostMs = Math.max(0, k.boostMs - dtMs);
      k.speedMul = k.boostMs > 0 ? k.speedMul : 1;

      const input = this.inputs.get(k.sessionId)!;
      const body = {
        x: k.x, y: k.y, heading: k.heading, speed: k.speed,
        steerActual: k.steer, driftCharge: k.driftCharge, drifting: k.drifting,
      };

      // 조향 보조를 위해 현재 위치의 코스 방향을 넘긴다.
      // ⚠️ 앞을 내다보게 하면(s + 120) 보조가 코너까지 대신 돌아줘서
      //    조향을 전혀 안 해도 완주가 된다. 현재 지점의 방향만 쓴다.
      const here = project(this.track, k.x, k.y);
      const guide = pointAt(this.track, here.s);

      stepKart(body, input, dt, {
        offTrack: k.offTrack,
        speedMul: k.speedMul,
        stunned: k.stunMs > 0,
        trackAngle: guide.angle,
      });

      // 드리프트를 놓는 순간, 충전 단계에 따라 부스트가 터진다
      const was = this.wasDrifting.get(k.sessionId) || false;
      if (was && !body.drifting) {
        const tier = driftTier(k.driftCharge);
        const info = driftTierInfo(tier);
        if (info) {
          k.speedMul = info.mul;
          k.boostMs = info.ms;
          k.boostTier = tier;
          this.broadcast("fx", { type: "drift_boost", id: k.sessionId, tier });
        }
      }
      this.wasDrifting.set(k.sessionId, body.drifting);

      k.x = body.x; k.y = body.y; k.heading = body.heading;
      k.speed = body.speed;
      k.steer = body.steerActual;
      k.drifting = body.drifting;
      k.driftCharge = body.drifting ? body.driftCharge : 0;
      k.driftTier = body.drifting ? driftTier(k.driftCharge) : 0;
      if (k.boostMs <= 0) k.boostTier = 0;

      // 코스 판정
      let pr = project(this.track, k.x, k.y);
      k.respawnMs = Math.max(0, k.respawnMs - dtMs);

      // --- 벽 (physics.applyWall — 클라이언트 예측과 동일한 함수) ---
      if (CONFIG.wall.enabled) {
        const body2 = {
          x: k.x, y: k.y, heading: k.heading, speed: k.speed,
          steerActual: k.steer, driftCharge: k.driftCharge, drifting: k.drifting,
        };
        const hit = applyWall(this.track, body2, input);
        if (hit) {
          k.x = body2.x; k.y = body2.y;
          k.heading = body2.heading; k.speed = body2.speed;

          // fx 는 매 틱 보내면 초당 30개 × 인원수가 된다. 4틱에 한 번만.
          const n = this.wallFx.get(k.sessionId) ?? 0;
          if (n % 4 === 0) this.broadcast("fx", { type: "wall", id: k.sessionId, x: k.x, y: k.y });
          this.wallFx.set(k.sessionId, n + 1);
          pr = project(this.track, k.x, k.y);
        } else {
          this.wallFx.set(k.sessionId, 0);
        }
        k.offTrack = false;
        this.lastGoodS.set(k.sessionId, pr.s);
      } else {
        k.offTrack = pr.offTrack;
        if (!pr.offTrack) {
          this.offMs.set(k.sessionId, 0);
          this.lastGoodS.set(k.sessionId, pr.s);
        } else {
          const acc = (this.offMs.get(k.sessionId) ?? 0) + dtMs;
          this.offMs.set(k.sessionId, acc);
          if (acc > CONFIG.respawnAfterMs) { this.respawn(k, this.lastGoodS.get(k.sessionId) ?? pr.s); continue; }
        }
      }

      // --- 끼임 감지 ---
      // ⚠️ 속도로 판단하면 안 된다. 벽에 박혀 제자리를 돌 때도 속도는 230이 나온다.
      //    실제로 코스를 따라 얼마나 나아갔는지(Δs)로 판단해야 한다.
      if (k.stunMs <= 0 && k.respawnMs <= 0) {
        const before = this.prevS.get(k.sessionId) ?? pr.s;
        let ds = pr.s - before;
        if (ds < -this.track.total / 2) ds += this.track.total;  // 결승선 통과 보정
        if (ds > this.track.total / 2) ds -= this.track.total;

        // 그냥 서 있는 사람까지 잡으면 안 된다 — 가속하려는데 못 나아갈 때만 끼임이다
        const trying = Math.abs(k.speed) > 40 || (this.inputs.get(k.sessionId)?.throttle ?? 0) !== 0;
        const acc = (ds < CONFIG.stuckProgress && trying) ? (this.stuckMs.get(k.sessionId) ?? 0) + dtMs : 0;
        this.stuckMs.set(k.sessionId, acc);
        if (acc > CONFIG.stuckMs) {
          this.stuckMs.set(k.sessionId, 0);
          this.respawn(k, pr.s + 140);
          continue;
        }
      } else {
        this.stuckMs.set(k.sessionId, 0);
      }

      // 코스 중간을 지났는지 기록. 이게 없으면 출발선 근처에서 왔다 갔다 하는 것만으로
      // 랩이 올라간다. 실제로 출발 직후 가짜 랩이 세어지고 있었다.
      if (pr.s > this.track.total * 0.45 && pr.s < this.track.total * 0.6) {
        this.halfPassed.set(k.sessionId, true);
      }

      // 랩: 뒤쪽 1/4 에서 앞쪽 1/4 로 넘어가되, 중간 체크포인트를 지났어야 인정
      const prev = this.prevS.get(k.sessionId) ?? pr.s;
      const crossed = prev > this.track.total * 0.75 && pr.s < this.track.total * 0.25;
      if (crossed && !this.halfPassed.get(k.sessionId)) {
        // 지름길/출발선 뒤에서 시작한 경우 — 랩으로 세지 않는다
        this.prevS.set(k.sessionId, pr.s);
        k.s = pr.s;
        continue;
      }
      if (crossed) {
        this.halfPassed.set(k.sessionId, false);
        k.lap += 1;
        const started = this.lapStart.get(k.sessionId) ?? this.raceStart;
        k.lastLapMs = now - started;
        if (k.bestLapMs === 0 || k.lastLapMs < k.bestLapMs) k.bestLapMs = k.lastLapMs;
        this.lapStart.set(k.sessionId, now);
        k.lapStartMs = now - this.raceStart;
        this.broadcast("fx", { type: "lap", id: k.sessionId, lap: k.lap, lapMs: k.lastLapMs });
        if (k.lap >= CONFIG.laps) this.finishKart(k, now);
      } else if (prev < this.track.total * 0.25 && pr.s > this.track.total * 0.75) {
        k.lap = Math.max(0, k.lap - 1); // 역주행 보정
        this.halfPassed.set(k.sessionId, true);
      }
      this.prevS.set(k.sessionId, pr.s);
      k.s = pr.s;
    }

    this.resolveKartCollisions(karts);
    this.checkPickups(karts, now);
    this.checkHazards(karts, now);
    this.respawnPickups(now);
    this.recomputeRanks(karts);

    // 종료 판정
    const active = karts.filter((k) => !k.finished);
    const firstDone = karts.find((k) => k.finished);
    if (active.length === 0 || (firstDone && now - firstDone.finishMs > CONFIG.finishGraceMs)) {
      this.endRace();
    }
  }

  /** 코스로 되돌린다. 마지막으로 코스 위에 있던 지점의 중심선. */
  private respawn(k: KartState, s: number) {
    const p = offsetPoint(this.track, s, 0);
    k.x = p.x; k.y = p.y;
    k.heading = p.angle;
    k.speed = Math.min(Math.abs(k.speed), CONFIG.respawnSpeed);
    k.steer = 0;
    k.drifting = false;
    k.driftCharge = 0;
    k.offTrack = false;
    k.respawnMs = CONFIG.respawnBlinkMs;
    this.offMs.set(k.sessionId, 0);
    this.inputs.get(k.sessionId)!.drift = false;
    this.broadcast("fx", { type: "respawn", id: k.sessionId, x: p.x, y: p.y });
  }

  private finishKart(k: KartState, now: number) {
    k.finished = true;
    k.finishMs = now;
    k.speed = 0;
    this.broadcast("fx", { type: "finish", id: k.sessionId });
  }

  /** 카트끼리 겹치면 서로 밀어낸다. 몸싸움이 가능해야 4인전이 산다. */
  private resolveKartCollisions(karts: KartState[]) {
    for (let i = 0; i < karts.length; i++) {
      for (let j = i + 1; j < karts.length; j++) {
        const a = karts[i], b = karts[j];
        if (a.finished || b.finished) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy);
        const min = KART.radius * 2;
        if (d === 0 || d >= min) continue;
        const push = (min - d) / 2;
        const nx = dx / d, ny = dy / d;
        a.x -= nx * push; a.y -= ny * push;
        b.x += nx * push; b.y += ny * push;
        // 속도도 조금 깎는다 — 부딪히면 손해여야 한다
        a.speed *= 0.94; b.speed *= 0.94;
      }
    }
  }

  private checkPickups(karts: KartState[], now: number) {
    for (const p of this.state.pickups) {
      if (!p.active) continue;
      for (const k of karts) {
        if (k.finished || k.stunMs > 0 || k.respawnMs > 0) continue;
        if (Math.hypot(k.x - p.x, k.y - p.y) > CONFIG.pickupRadius) continue;

        p.active = false;
        this.respawnAt.set(
          p.id,
          now + (p.kind === "item" ? CONFIG.itemBoxRespawnMs : CONFIG.ipBlockRespawnMs)
        );
        this.broadcast("fx", { type: "pickup", id: k.sessionId, kind: p.kind, x: p.x, y: p.y });
        this.openQuiz(k, p.kind === "item" ? "item" : "block");
        break;
      }
    }
  }

  private respawnPickups(now: number) {
    for (const p of this.state.pickups) {
      if (p.active) continue;
      const at = this.respawnAt.get(p.id);
      if (at !== undefined && now >= at) {
        p.active = true;
        this.respawnAt.delete(p.id);
      }
    }
  }

  private checkHazards(karts: KartState[], now: number) {
    for (let i = this.state.hazards.length - 1; i >= 0; i--) {
      const h = this.state.hazards[i];
      if (!h) continue;
      const armed = (this.hazardArm.get(h.id) ?? 0) <= now;
      for (const k of karts) {
        if (k.finished || k.stunMs > 0 || k.respawnMs > 0) continue;
        if (!armed && k.sessionId === h.owner) continue;
        if (Math.hypot(k.x - h.x, k.y - h.y) > 58) continue;

        if (k.shieldMs > 0) {
          k.shieldMs = 0;
          this.broadcast("fx", { type: "blocked", id: k.sessionId });
        } else {
          k.stunMs = CONFIG.oilSpinMs;
          this.broadcast("fx", { type: "spin", id: k.sessionId });
          this.openQuiz(k, "escape");
        }
        this.state.hazards.splice(i, 1);
        this.hazardArm.delete(h.id);
        break;
      }
    }
  }

  private recomputeRanks(karts: KartState[]) {
    const sorted = [...karts].sort((a, b) => {
      if (a.finished && b.finished) return a.finishMs - b.finishMs;
      if (a.finished) return -1;
      if (b.finished) return 1;
      return (b.lap * this.track.total + b.s) - (a.lap * this.track.total + a.s);
    });
    sorted.forEach((k, i) => (k.rank = i + 1));
  }

  // ---------- 아이템 ----------

  private useItem(sessionId: string) {
    if (this.state.phase !== "racing") return;
    const k = this.state.karts.get(sessionId);
    if (!k || !k.item || k.finished || k.stunMs > 0) return;

    const item = k.item as ItemId;
    k.item = "";

    if (item === "boost") {
      k.speedMul = CONFIG.boostMul;
      k.boostMs = CONFIG.boostMs;
      this.broadcast("fx", { type: "boost", id: k.sessionId });
      return;
    }

    if (item === "shield") {
      k.shieldMs = CONFIG.shieldMs;
      this.broadcast("fx", { type: "shield", id: k.sessionId });
      return;
    }

    if (item === "oil") {
      const h = new HazardState();
      h.id = `oil-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      h.owner = k.sessionId;
      h.x = k.x - Math.cos(k.heading) * 70;
      h.y = k.y - Math.sin(k.heading) * 70;
      this.state.hazards.push(h);
      this.hazardArm.set(h.id, Date.now() + CONFIG.oilArmMs);
      this.broadcast("fx", { type: "oil", id: k.sessionId, x: h.x, y: h.y });
      return;
    }

    // bomb: 바로 앞 순위 1명
    const target = [...this.state.karts.values()]
      .filter((o) => o.sessionId !== k.sessionId && !o.finished && o.rank < k.rank)
      .sort((a, b) => b.rank - a.rank)[0];
    if (!target) return;

    if (target.shieldMs > 0) {
      target.shieldMs = 0;
      this.broadcast("fx", { type: "blocked", id: target.sessionId, from: k.sessionId });
    } else {
      target.stunMs = CONFIG.stunMs;
      this.broadcast("fx", { type: "bomb", id: target.sessionId, from: k.sessionId });
      this.openQuiz(target, "escape"); // 갇혔을 때 문제를 풀면 탈출
    }
  }

  // ---------- 퀴즈 ----------

  private openQuiz(k: KartState, kind: QuizKind) {
    if (k.quizActive || k.finished) return;
    const now = Date.now();
    // escape 퀴즈는 쿨다운을 무시한다 — 갇혔는데 문제가 안 나오면 답이 없다
    if (kind !== "escape" && now - (this.lastQuizAt.get(k.sessionId) ?? 0) < CONFIG.quizCooldownMs) return;

    const q = this.dispenser.next();

    // ⚠️ 보기 순서를 매 출제마다 섞는다.
    //    DB의 correctIndex가 한쪽으로 쏠려 있어서 "정답은 늘 1번" 패턴이 보였다.
    //    문항을 늘리는 것만으로는 해결되지 않는다 — 위치 자체를 무작위화해야 한다.
    const order = [0, 1, 2];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const shuffled = order.map((i) => q.options[i]);
    const correctLabel = gateLabel(order.indexOf(q.correctIndex));

    k.quizActive = true;
    k.quizKind = kind;
    this.lastQuizAt.set(k.sessionId, now);

    const timer = this.clock.setTimeout(() => this.resolveQuiz(k.sessionId, ""), CONFIG.quizMs);
    this.pending.set(k.sessionId, { q, kind, correctLabel, shuffled, timer });

    // 봇은 메시지를 못 받으니 내부에서 스스로 답한다
    if (k.isBot) {
      const [lo, hi] = CONFIG.bots.quizDelayMs;
      const delay = Math.min(lo + Math.random() * (hi - lo), CONFIG.quizMs - 200);
      this.clock.setTimeout(() => {
        const right = Math.random() < CONFIG.bots.quizAccuracy;
        const wrong = ["A", "B", "C"].filter((l) => l !== correctLabel);
        this.resolveQuiz(
          k.sessionId,
          right ? correctLabel : wrong[Math.floor(Math.random() * wrong.length)]
        );
      }, delay);
      return;
    }

    // 정답은 보내지 않는다
    const client = this.clients.find((c) => c.sessionId === k.sessionId);
    client?.send("quiz_open", {
      kind,
      qId: q.id,
      text: q.text,
      options: shuffled.map((t, i) => ({ label: gateLabel(i), text: t })),
      ms: kind === "escape" ? Math.min(CONFIG.quizMs, CONFIG.stunMs) : CONFIG.quizMs,
    });
  }

  private resolveQuiz(sessionId: string, choice: string) {
    const pend = this.pending.get(sessionId);
    const k = this.state.karts.get(sessionId);
    if (!pend || !k) return;

    pend.timer?.clear?.();
    this.pending.delete(sessionId);

    const correct = choice !== "" && choice === pend.correctLabel;
    k.quizActive = false;
    k.quizKind = "";
    k.answerCount += 1;
    if (correct) k.correctCount += 1;

    this.askedLog.push({ sessionId, qId: pend.q.id, correct, kind: pend.kind });

    let effect = "";
    if (pend.kind === "item") {
      if (correct) {
        const others = [...this.state.karts.values()].filter((o) => o.sessionId !== sessionId);
        const hasTarget = others.some((o) => o.rank < k.rank && !o.finished);
        k.item = grantItem(k.rank, this.state.karts.size, hasTarget);
        effect = `아이템 획득: ${k.item}`;
      } else {
        effect = "아이템 놓침";
      }
    } else if (pend.kind === "block") {
      if (correct) {
        k.speedMul = CONFIG.blockCorrectBoost;
        k.boostMs = CONFIG.blockCorrectMs;
        effect = "부스트!";
      } else {
        k.speedMul = CONFIG.blockWrongMul;
        k.boostMs = CONFIG.blockWrongMs;
        effect = "감속";
      }
    } else {
      // escape
      if (correct) {
        k.stunMs = 0;
        effect = "탈출!";
      } else {
        effect = "탈출 실패";
      }
    }

    if (k.isBot) return;
    const client = this.clients.find((c) => c.sessionId === sessionId);
    client?.send("quiz_result", {
      correct,
      correctLabel: pend.correctLabel,
      correctText: pend.shuffled[["A", "B", "C"].indexOf(pend.correctLabel)] ?? "",
      explanation: pend.q.explanation,
      sourceName: pend.q.sourceName,
      kind: pend.kind,
      effect,
    });
  }

  /**
   * 같은 방에서 다시 한 판. 방 코드와 참가자를 유지한 채 상태만 초기화한다.
   * 봇은 제거했다가 다음 카운트다운에서 새로 채운다 (인원이 바뀌었을 수 있으므로).
   */
  private resetForRematch() {
    // 봇 제거
    for (const id of [...this.bots.keys()]) {
      this.state.karts.delete(id);
      this.inputs.delete(id);
      this.prevS.delete(id);
      this.wasDrifting.delete(id);
      this.offMs.delete(id);
      this.lastGoodS.delete(id);
      this.stuckMs.delete(id);
      this.halfPassed.delete(id);
      this.botItemAt.delete(id);
    }
    this.bots.clear();

    // 사람 카트 초기화
    let i = 0;
    for (const k of this.state.karts.values()) {
      const lat = [-96, -32, 32, 96][i++] ?? 0;
      const sp = offsetPoint(this.track, 80, lat);
      k.x = sp.x; k.y = sp.y; k.heading = sp.angle;
      k.speed = 0; k.steer = 0; k.drifting = false; k.driftCharge = 0;
      k.driftTier = 0; k.boostTier = 0;
      k.lap = 0; k.s = 0; k.rank = 1; k.offTrack = false;
      k.finished = false; k.finishMs = 0;
      k.stunMs = 0; k.shieldMs = 0; k.boostMs = 0; k.speedMul = 1; k.respawnMs = 0;
      k.item = ""; k.quizActive = false; k.quizKind = "";
      k.correctCount = 0; k.answerCount = 0;
      k.lastLapMs = 0; k.bestLapMs = 0; k.lapStartMs = 0;
      k.ready = false;

      this.inputs.set(k.sessionId, { throttle: 0, steer: 0, drift: false });
      this.prevS.set(k.sessionId, project(this.track, k.x, k.y).s);
      this.halfPassed.set(k.sessionId, false);
      this.wasDrifting.set(k.sessionId, false);
      this.offMs.set(k.sessionId, 0);
      this.lastGoodS.set(k.sessionId, 0);
      this.stuckMs.set(k.sessionId, 0);
    }

    // 진행 중이던 퀴즈 정리
    for (const [id, p] of this.pending) { p.timer?.clear?.(); }
    this.pending.clear();
    this.lastQuizAt.clear();
    this.askedLog = [];

    // 픽업/기름 초기화
    for (const p of this.state.pickups) p.active = true;
    this.respawnAt.clear();
    while (this.state.hazards.length) this.state.hazards.pop();
    this.hazardArm.clear();

    // 문제 순서를 새로 섞는다
    this.dispenser = new QuestionDispenser();

    this.state.raceMs = 0;
    this.state.countdown = 0;
    this.state.phase = "lobby";
    this.unlock();

    this.broadcast("rematch");
  }

  // ---------- 종료 ----------

  private endRace() {
    if (this.state.phase === "finished") return;
    this.state.phase = "finished";

    const karts = [...this.state.karts.values()].sort((a, b) => a.rank - b.rank);
    const n = karts.length;

    const results = karts.map((k, i) => {
      const raceScore = Math.round(100 - (i / Math.max(1, n - 1)) * 40); // 1위 100 ~ 꼴찌 60
      const ipScore = k.answerCount > 0
        ? Math.round((k.correctCount / k.answerCount) * 100)
        : 0;
      return {
        sessionId: k.sessionId,
        nickname: k.nickname,
        rank: i + 1,
        lap: k.lap,
        finished: k.finished,
        timeMs: k.finished ? k.finishMs - this.raceStart : 0,
        raceScore,
        ipScore,
        isBot: k.isBot,
        bestLapMs: k.bestLapMs,
        correctCount: k.correctCount,
        answerCount: k.answerCount,
        finalScore: Math.round(raceScore * 0.5 + ipScore * 0.5),
      };
    });

    // IP Review: 이 판에 실제로 나온 문제만, 정답·해설과 함께 이 시점에 공개
    const seen = new Set<string>();
    const review = this.askedLog
      .filter((a) => {
        const key = a.qId;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((a) => {
        const q = require("./questions").QUESTIONS.find((x: Question) => x.id === a.qId)!;
        return {
          qId: q.id,
          text: q.text,
          options: q.options.map((t: string, i: number) => ({ label: gateLabel(i), text: t })),
          correctLabel: gateLabel(q.correctIndex),
          correctText: q.options[q.correctIndex],
          explanation: q.explanation,
          sourceName: q.sourceName,
          sourceUrl: q.sourceUrl,
          perPlayer: this.askedLog
            .filter((x) => x.qId === q.id)
            .map((x) => ({ sessionId: x.sessionId, correct: x.correct, kind: x.kind })),
        };
      });

    this.broadcast("race_end", { results, review });
  }
}

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

function makeRoomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}
