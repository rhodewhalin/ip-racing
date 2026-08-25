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
import { KART, KartInput, stepKart, driftReleaseBoost } from "./physics";
import {
  TRACK_POINTS, TRACK_WIDTH, buildTrack, project, offsetPoint, TrackData,
} from "./track";
import { grantItem } from "./items";
import { QuestionDispenser } from "./dispenser";
import { gateLabel, Question } from "./questions";

interface Pending {
  q: Question;
  kind: QuizKind;
  correctLabel: string;
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
    const sp = offsetPoint(this.track, 0, lat);
    k.x = sp.x; k.y = sp.y; k.heading = sp.angle;

    this.state.karts.set(client.sessionId, k);
    this.inputs.set(client.sessionId, { throttle: 0, steer: 0, drift: false });
    this.prevS.set(client.sessionId, 0);
    this.wasDrifting.set(client.sessionId, false);

    // 트랙 지오메트리는 상태가 아니라 1회성 데이터 — 접속 시 한 번만 보낸다
    client.send("track", { points: TRACK_POINTS, width: TRACK_WIDTH, laps: CONFIG.laps });
  }

  onLeave(client: Client) {
    const id = client.sessionId;
    this.state.karts.delete(id);
    this.inputs.delete(id);
    this.prevS.delete(id);
    this.wasDrifting.delete(id);
    const p = this.pending.get(id);
    if (p) { p.timer?.clear?.(); this.pending.delete(id); }
  }

  // ---------- 흐름 ----------

  private maybeStart() {
    const ks = [...this.state.karts.values()];
    if (ks.length >= CONFIG.minClients && ks.every((k) => k.ready)) this.startCountdown();
  }

  private startCountdown() {
    this.state.phase = "countdown";
    this.lock();
    this.state.countdown = Math.ceil(CONFIG.countdownMs / 1000);
    const iv = this.clock.setInterval(() => {
      this.state.countdown -= 1;
      if (this.state.countdown <= 0) {
        iv.clear();
        this.state.phase = "racing";
        this.raceStart = Date.now();
        this.broadcast("race_start");
      }
    }, 1000);
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
        driftCharge: k.driftCharge, drifting: k.drifting,
      };

      stepKart(body, input, dt, {
        offTrack: k.offTrack,
        speedMul: k.speedMul,
        stunned: k.stunMs > 0,
      });

      // 드리프트를 놓는 순간 부스트
      const was = this.wasDrifting.get(k.sessionId) || false;
      if (was && !body.drifting && driftReleaseBoost(k.driftCharge)) {
        k.speedMul = KART.driftBoostMul;
        k.boostMs = KART.driftBoostMs;
        this.broadcast("fx", { type: "drift_boost", id: k.sessionId });
      }
      this.wasDrifting.set(k.sessionId, body.drifting);

      k.x = body.x; k.y = body.y; k.heading = body.heading;
      k.speed = body.speed;
      k.drifting = body.drifting;
      k.driftCharge = body.drifting ? body.driftCharge : 0;

      // 코스 판정
      const pr = project(this.track, k.x, k.y);
      k.offTrack = pr.offTrack;

      // 랩: 뒤쪽 1/4 에서 앞쪽 1/4 로 넘어가면 한 바퀴
      const prev = this.prevS.get(k.sessionId) ?? pr.s;
      if (prev > this.track.total * 0.75 && pr.s < this.track.total * 0.25) {
        k.lap += 1;
        this.broadcast("fx", { type: "lap", id: k.sessionId, lap: k.lap });
        if (k.lap >= CONFIG.laps) this.finishKart(k, now);
      } else if (prev < this.track.total * 0.25 && pr.s > this.track.total * 0.75) {
        k.lap = Math.max(0, k.lap - 1); // 역주행 보정
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
        if (k.finished || k.stunMs > 0) continue;
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
        if (k.finished || k.stunMs > 0) continue;
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
    k.quizActive = true;
    k.quizKind = kind;
    this.lastQuizAt.set(k.sessionId, now);

    const timer = this.clock.setTimeout(() => this.resolveQuiz(k.sessionId, ""), CONFIG.quizMs);
    this.pending.set(k.sessionId, {
      q, kind, correctLabel: gateLabel(q.correctIndex), timer,
    });

    // 정답은 보내지 않는다
    const client = this.clients.find((c) => c.sessionId === k.sessionId);
    client?.send("quiz_open", {
      kind,
      qId: q.id,
      text: q.text,
      options: q.options.map((t, i) => ({ label: gateLabel(i), text: t })),
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

    const client = this.clients.find((c) => c.sessionId === sessionId);
    client?.send("quiz_result", {
      correct,
      correctLabel: pend.correctLabel,
      explanation: pend.q.explanation,
      sourceName: pend.q.sourceName,
      kind: pend.kind,
      effect,
    });
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
