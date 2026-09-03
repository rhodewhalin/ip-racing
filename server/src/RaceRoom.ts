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
import { RoomState, KartState, PickupState, HazardState, ProjectileState } from "./schema";
import { CONFIG, ItemId, QuizKind } from "./gameConfig";
import { KART, KartInput, stepKart, driftTier, driftTierInfo, applyWall, resolveBump } from "./physics";
import {
  TRACK_WIDTH, buildTrack, project, pointAt, offsetPoint, TrackData, getTrack, TRACKS,
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
  private projArm = new Map<string, number>();   // 발사체 자기 면역 만료 시각
  private projLife = new Map<string, number>();   // 발사체 소멸 시각
  private offMs = new Map<string, number>();      // 코스 이탈 지속 시간
  private lastGoodS = new Map<string, number>();  // 마지막으로 코스 위에 있던 지점
  private bots = new Map<string, BotDriver>();
  private lapStart = new Map<string, number>();
  private botItemAt = new Map<string, number>();
  private botSeq = 0;
  private stuckMs = new Map<string, number>();
  private wallFx = new Map<string, number>();
  private bumpFx = new Map<string, number>();
  private traveled = new Map<string, number>();  // 시작점부터 실제로 달린 누적 거리
  private wasStunned = new Map<string, boolean>();
  private lastAdvanceAt = new Map<string, number>();
  private raceStart = 0;
  private askedLog: { sessionId: string; qId: string; correct: boolean; kind: string }[] = [];

  private trackId = "city";

  onCreate(options: { trackId?: string } = {}) {
    this.setState(new RoomState());
    this.state.laps = CONFIG.laps;
    // 방을 만들 때 코스를 고를 수 있다
    const def = getTrack(options?.trackId ?? "city");
    this.trackId = def.id;
    this.state.trackId = def.id;
    this.state.trackName = def.name;
    this.track = buildTrack(def.points, TRACK_WIDTH);

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

    // ⚠️ onJoin 에서 보낸 "track" 메시지는 클라이언트가 핸들러를 등록하기 전에
    //    도착하면 그대로 버려진다. 그러면 3D 월드가 만들어지지 않아 화면이
    //    카운트다운에서 멈춘 것처럼 보인다. 클라이언트가 다시 달라고 할 수 있게 한다.
    this.onMessage("request_track", (client) => {
      client.send("track", { points: getTrack(this.trackId).points, width: TRACK_WIDTH, laps: CONFIG.laps, name: getTrack(this.trackId).name });
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
    const sp = this.gridSlot(this.state.karts.size);
    k.x = sp.x; k.y = sp.y; k.heading = sp.angle;

    this.state.karts.set(client.sessionId, k);
    this.inputs.set(client.sessionId, { throttle: 0, steer: 0, drift: false });
    this.prevS.set(client.sessionId, project(this.track, k.x, k.y).s);
    this.traveled.set(client.sessionId, 0);
    this.wasDrifting.set(client.sessionId, false);
    this.offMs.set(client.sessionId, 0);
    this.lastGoodS.set(client.sessionId, 0);
    this.stuckMs.set(client.sessionId, 0);
    this.lastAdvanceAt.set(client.sessionId, Date.now());

    // 트랙 지오메트리는 상태가 아니라 1회성 데이터 — 접속 시 한 번만 보낸다
    client.send("track", { points: getTrack(this.trackId).points, width: TRACK_WIDTH, laps: CONFIG.laps, name: getTrack(this.trackId).name });
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
    if (this.state.phase !== "lobby") return; // 준비 버튼 연타로 두 번 시작되는 것 방지
    this.state.phase = "countdown";
    this.lock();
    // 안전망: 카운트다운 시점에 한 번 더 보낸다
    this.broadcast("track", { points: getTrack(this.trackId).points, width: TRACK_WIDTH, laps: CONFIG.laps, name: getTrack(this.trackId).name });
    this.fillWithBots();
    this.state.countdown = Math.ceil(CONFIG.countdownMs / 1000);
    const iv = this.clock.setInterval(() => {
      this.state.countdown -= 1;
      if (this.state.countdown <= 0) {
        iv.clear();
        this.state.phase = "racing";
        this.raceStart = Date.now();
        for (const k of this.state.karts.values()) { this.lapStart.set(k.sessionId, this.raceStart); k.lapStartMs = 0; this.lastAdvanceAt.set(k.sessionId, this.raceStart); }
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

      const sp = this.gridSlot(idx);
      k.x = sp.x; k.y = sp.y; k.heading = sp.angle;

      this.state.karts.set(id, k);
      this.inputs.set(id, { throttle: 0, steer: 0, drift: false });
      this.prevS.set(id, project(this.track, k.x, k.y).s);
      this.traveled.set(id, 0);
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

  /**
   * 픽업을 **가로 한 줄**로 배치한다 (실제 카트 게임 방식).
   *
   * 이전에는 지점마다 박스 하나를 좌우 한쪽에 뒀는데, 주행 라인이 조금만
   * 달라도 그냥 지나쳐서 한 판에 2개밖에 못 먹었다.
   * 한 줄로 깔면 **지점 수는 적게(=정신없지 않게) 유지하면서 확실히 획득**된다.
   * 한 줄에서 하나를 먹으면 나머지는 quizActive 때문에 소모되지 않는다.
   */
  /**
   * 출발 그리드. **네 대를 같은 출발선 위에 한 줄**로 세운다.
   *
   * ⚠️ 예전엔 좌우 -96/-32/32/96 (간격 64) 한 줄이라 충돌거리 84에 겹쳐서
   *    엉켰고, 그 다음엔 2×2 계단식(앞뒤 150)으로 피했다. 이제 도로 폭이
   *    560(반폭 280)으로 넓어져 좌우 간격 120으로도 한 줄이 가능하다.
   *    -180/-60/60/180 → 인접 간격 120 > 충돌거리 84, 어느 쌍도 안 겹친다.
   *    바깥 카트도 180 + 카트 반폭(~40) = 220 < 벽(280)이라 여유가 있다.
   */
  private gridSlot(idx: number) {
    const cols = [-180, -60, 60, 180];    // 같은 선, 좌우로만 분산
    const col = cols[idx] ?? 0;
    const s = 120;                        // 출발선 바로 뒤, 전원 동일
    return offsetPoint(this.track, s, col);
  }

  private spawnPickups() {
    const row = (kind: "item" | "block", frac: number, gi: number, lats: number[]) => {
      lats.forEach((lat, j) => {
        const p = new PickupState();
        p.id = `${kind}-${gi}-${j}`;
        p.kind = kind;
        const pt = offsetPoint(this.track, frac * this.track.total, lat);
        p.x = pt.x; p.y = pt.y;
        p.active = true;
        this.state.pickups.push(p);
      });
    };
    CONFIG.itemBoxAt.forEach((f, i) => row("item", f, i, [-170, 0, 170]));
    CONFIG.ipBlockAt.forEach((f, i) => row("block", f, i, [-160, 0, 160]));
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
      if (k.finished) {
        // 골인 후에도 관성으로 굴러가게 둔다 (조작은 받지 않는다)
        const fb = {
          x: k.x, y: k.y, heading: k.heading, speed: k.speed,
          steerActual: 0, driftCharge: 0, drifting: false,
        };
        const fp = project(this.track, k.x, k.y);
        stepKart(fb, { throttle: 0, steer: 0, drift: false }, dt, {
          offTrack: false, speedMul: 1, stunned: false,
          trackAngle: pointAt(this.track, fp.s).angle,
        });
        applyWall(this.track, fb, { throttle: 0, steer: 0, drift: false });
        k.x = fb.x; k.y = fb.y; k.heading = fb.heading; k.speed = fb.speed;
        continue;
      }

      // 상태 효과 타이머
      const stunBefore = k.stunMs;
      k.stunMs = Math.max(0, k.stunMs - dtMs);

      // 스핀이 끝나는 순간 진행 방향을 코스 쪽으로 세워준다.
      // 이게 없으면 무작위 방향(심하면 정반대)을 보고 멈춰 서서, 그대로
      // 가속하면 역주행한다. 조향 보조도 57° 이상 어긋나면 꺼져서 도움이 안 된다.
      if (stunBefore > 0 && k.stunMs <= 0) {
        const at = project(this.track, k.x, k.y);
        k.heading = pointAt(this.track, at.s).angle;
        k.speed = Math.max(k.speed, 170);
        k.steer = 0;
        this.broadcast("fx", { type: "recover", id: k.sessionId });
      }
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

        // ⚠️ "가속하려는데 못 나아갈 때"만 끼임이다.
        //    브레이크(-1)나 무입력(0)까지 포함하면, 문제를 읽으려 세운 사람을
        //    1.6초마다 앞으로 순간이동시킨다. 실측으로 한 판에 36~58회였다.
        const th = this.inputs.get(k.sessionId)?.throttle ?? 0;
        const trying = CONFIG.stuckNeedsThrottle ? th > 0 : (Math.abs(k.speed) > 40 || th !== 0);
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

      // ---- 랩 계산: 누적 주행거리 방식 ----
      //
      // ⚠️ 이전에는 "s가 0.75T를 넘었다가 0.25T 아래로 떨어지면 한 바퀴"로 판정했다.
      //    그런데 결승선의 같은 지점이 s=total 과 s=0 두 값으로 표현될 수 있어,
      //    투영이 둘 사이를 오갈 때마다 전방통과·역주행통과가 번갈아 인식됐다.
      //    실측으로 결승선을 77번 지났는데 랩이 0인 경우가 나왔다.
      //
      //    이제는 매 틱의 이동량을 누적해서 (누적거리 / 트랙길이) 로 랩을 구한다.
      //    경계 표현이 흔들려도 이동량은 0에 가까우므로 영향이 없고,
      //    역주행도 자연스럽게 누적거리가 줄어드는 것으로 처리된다.
      const before = this.prevS.get(k.sessionId) ?? pr.s;
      let step = pr.s - before;
      if (step > this.track.total / 2) step -= this.track.total;
      if (step < -this.track.total / 2) step += this.track.total;

      const acc = (this.traveled.get(k.sessionId) ?? 0) + step;
      this.traveled.set(k.sessionId, acc);

      const newLap = Math.max(0, Math.floor(acc / this.track.total));
      if (newLap > k.lap) {
        k.lap = newLap;
        const started = this.lapStart.get(k.sessionId) ?? this.raceStart;
        k.lastLapMs = now - started;
        if (k.bestLapMs === 0 || k.lastLapMs < k.bestLapMs) k.bestLapMs = k.lastLapMs;
        this.lapStart.set(k.sessionId, now);
        k.lapStartMs = now - this.raceStart;
        this.broadcast("fx", { type: "lap", id: k.sessionId, lap: k.lap, lapMs: k.lastLapMs });
        if (k.lap >= CONFIG.laps) this.finishKart(k, now);
      } else if (newLap < k.lap) {
        k.lap = newLap; // 역주행 보정
      }

      // AFK 판정용: 실제로 앞으로 나아간 시각을 기록
      {
        let adv = pr.s - (this.prevS.get(k.sessionId) ?? pr.s);
        if (adv < -this.track.total / 2) adv += this.track.total;
        if (adv > this.track.total / 2) adv -= this.track.total;
        if (adv > 1) this.lastAdvanceAt.set(k.sessionId, now);
      }

      this.prevS.set(k.sessionId, pr.s);
      k.s = pr.s;
    }

    // 충돌 → 벽 → 충돌 순으로 두 번 푼다.
    // 한 번만 하면 충돌로 밀려난 카트를 벽이 다시 안쪽으로 밀어넣어 겹침이 남는다.
    this.resolveKartCollisions(karts);
    this.clampToWalls(karts);
    this.resolveKartCollisions(karts);

    this.checkPickups(karts, now);
    this.checkHazards(karts, now);
    this.advanceProjectiles(karts, dt, now);
    this.respawnPickups(now);
    this.recomputeRanks(karts);

    this.evaluateFinish(karts, now);
  }

  /**
   * 종료 판정.
   * 원칙: **사람이 달리고 있으면 기다린다.** 봇이 먼저 들어왔다고 끊지 않는다.
   */
  private evaluateFinish(karts: KartState[], now: number) {
    if (karts.length === 0) return;

    const humans = karts.filter((k) => !k.isBot);
    const allDone = karts.every((k) => k.finished);
    if (allDone) { this.state.endsInMs = 0; this.endRace(); return; }

    // ⚠️ 손 놓고 있는 사람 때문에 완주한 사람들이 무한정 기다리면 안 된다.
    //    일정 시간 전혀 나아가지 못한 사람은 '미참여'로 보고 계산에서 뺀다.
    const isIdle = (k: KartState) =>
      !k.finished && now - (this.lastAdvanceAt.get(k.sessionId) ?? this.raceStart) > CONFIG.idleHumanMs;

    const engaged = humans.filter((k) => !isIdle(k));
    const humansDone = engaged.length > 0 && engaged.every((k) => k.finished);

    const hardStop = this.raceStart + CONFIG.maxRaceMs;

    if (humansDone) {
      // 실제로 달린 사람은 다 들어왔다 → 짧게 기다렸다 결과
      const deadline = Math.min(
        Math.max(...engaged.map((k) => k.finishMs)) + CONFIG.humanGraceMs,
        hardStop
      );
      this.state.endsInMs = Math.max(0, deadline - now);
      if (now >= deadline) this.endRace();
      return;
    }

    // ⚠️ 사람이 달리는 중이면 시간으로 끊지 않는다.
    //    끊는 유일한 조건은 "모두가 전혀 나아가지 못하고 있을 때"(AFK)다.
    const running = engaged.filter((k) => !k.finished);
    const allStalled = running.length > 0 && running.every(
      (k) => now - (this.lastAdvanceAt.get(k.sessionId) ?? this.raceStart) > CONFIG.afkMs
    );

    if (allStalled || now >= hardStop) {
      this.state.endsInMs = 0;
      this.endRace();
      return;
    }

    // 진행이 멈춘 지 오래됐으면 남은 시간을 알려준다
    const worst = Math.max(...running.map((k) => this.lastAdvanceAt.get(k.sessionId) ?? this.raceStart));
    const left = worst + CONFIG.afkMs - now;
    this.state.endsInMs = left <= 30000 ? Math.max(0, left) : 0;
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
    // ⚠️ 예전엔 여기서 speed = 0 으로 급정거시켰다.
    //    골인하자마자 차가 그 자리에 딱 서서 "멈췄다"로 보였다.
    //    이제는 관성으로 굴러가다 자연스럽게 선다.
    k.item = "";
    k.quizActive = false;
    this.broadcast("fx", { type: "finish", id: k.sessionId });
  }

  /** 카트끼리 겹치면 서로 밀어낸다. 몸싸움이 가능해야 4인전이 산다. */
  private resolveKartCollisions(karts: KartState[]) {
    for (let i = 0; i < karts.length; i++) {
      for (let j = i + 1; j < karts.length; j++) {
        const a = karts[i], b = karts[j];
        if (a.finished || b.finished) continue;

        // 양쪽을 절반씩 밀어낸다 (share = 0.5)
        const ax = a.x, ay = a.y;
        const ab = { x: a.x, y: a.y, heading: a.heading, speed: a.speed,
                     steerActual: a.steer, driftCharge: 0, drifting: false };
        const bb = { x: b.x, y: b.y, heading: b.heading, speed: b.speed,
                     steerActual: b.steer, driftCharge: 0, drifting: false };

        const hitA = resolveBump(ab, b.x, b.y, 0.5);
        const hitB = resolveBump(bb, ax, ay, 0.5);
        if (!hitA && !hitB) continue;

        a.x = ab.x; a.y = ab.y; a.heading = ab.heading; a.speed = ab.speed;
        b.x = bb.x; b.y = bb.y; b.heading = bb.heading; b.speed = bb.speed;

        // 충돌 연출은 너무 자주 보내지 않는다
        const key = a.sessionId + "|" + b.sessionId;
        const n = (this.bumpFx.get(key) ?? 0) + 1;
        this.bumpFx.set(key, n);
        if (n % 6 === 1) {
          this.broadcast("fx", { type: "bump", id: a.sessionId, other: b.sessionId, x: a.x, y: a.y });
        }
      }
    }
  }

  /** 충돌로 밀려난 카트를 코스 안으로 되돌린다 */
  private clampToWalls(karts: KartState[]) {
    const noInput = { throttle: 0, steer: 0, drift: false };
    for (const k of karts) {
      if (k.finished) continue;
      const b = { x: k.x, y: k.y, heading: k.heading, speed: k.speed,
                  steerActual: k.steer, driftCharge: 0, drifting: false };
      if (applyWall(this.track, b, noInput)) {
        k.x = b.x; k.y = b.y; k.speed = b.speed;
      }
    }
  }

  private checkPickups(karts: KartState[], now: number) {
    for (const p of this.state.pickups) {
      if (!p.active) continue;
      for (const k of karts) {
        if (k.finished || k.stunMs > 0 || k.respawnMs > 0) continue;
        if (Math.hypot(k.x - p.x, k.y - p.y) > CONFIG.pickupRadius) continue;

        // ⚠️ 쿨다운·중복 때문에 문제가 안 뜰 상황이면 박스를 먹지 않고 남겨둔다.
        //    예전엔 박스만 사라지고 아무 일도 안 일어나 "먹었는데 아무것도 없다"가 됐다.
        const kind = p.kind === "item" ? "item" : "block";
        if (!this.canOpenQuiz(k, kind)) continue;

        p.active = false;
        this.respawnAt.set(
          p.id,
          now + (p.kind === "item" ? CONFIG.itemBoxRespawnMs : CONFIG.ipBlockRespawnMs)
        );
        this.broadcast("fx", { type: "pickup", id: k.sessionId, kind: p.kind, x: p.x, y: p.y });
        this.openQuiz(k, kind);
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

    // bomb: 물폭탄을 발사체로 던진다. 바로 앞 순위 1명을 약하게 유도하지만,
    // 이동시간이 있어 대상이 급회전하거나 실드로 회피할 수 있다(명중은 advanceProjectiles에서).
    const target = [...this.state.karts.values()]
      .filter((o) => o.sessionId !== k.sessionId && !o.finished && o.rank < k.rank)
      .sort((a, b) => b.rank - a.rank)[0];

    const now = Date.now();
    // 조준각: 대상이 있으면 그쪽, 없으면 진행 방향 직진
    const ang = target ? Math.atan2(target.y - k.y, target.x - k.x) : k.heading;
    const p = new ProjectileState();
    p.id = `bomb-${now}-${Math.floor(Math.random() * 1000)}`;
    p.owner = k.sessionId;
    p.target = target?.sessionId ?? "";
    p.x = k.x + Math.cos(k.heading) * 46;   // 카트 코앞에서 발사
    p.y = k.y + Math.sin(k.heading) * 46;
    p.vx = Math.cos(ang) * CONFIG.bombSpeed;
    p.vy = Math.sin(ang) * CONFIG.bombSpeed;
    this.state.projectiles.push(p);
    this.projArm.set(p.id, now + CONFIG.bombArmMs);
    this.projLife.set(p.id, now + CONFIG.bombLifeMs);
    this.broadcast("fx", { type: "throw", id: k.sessionId, x: p.x, y: p.y });
  }

  /** 물폭탄 발사체 전진·유도·명중 판정. */
  private advanceProjectiles(karts: KartState[], dt: number, now: number) {
    const angDiff = (a: number, b: number) => {
      let d = a - b;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      return d;
    };
    for (let i = this.state.projectiles.length - 1; i >= 0; i--) {
      const p = this.state.projectiles[i];
      if (!p) continue;
      const remove = () => {
        this.state.projectiles.splice(i, 1);
        this.projArm.delete(p.id); this.projLife.delete(p.id);
      };

      // 약한 유도 (급회전으로 뿌리칠 수 있는 수준)
      const tgt = p.target ? this.state.karts.get(p.target) : undefined;
      if (tgt && !tgt.finished) {
        const want = Math.atan2(tgt.y - p.y, tgt.x - p.x);
        const cur = Math.atan2(p.vy, p.vx);
        const maxTurn = CONFIG.bombHomingRate * dt;
        const turn = Math.max(-maxTurn, Math.min(maxTurn, angDiff(want, cur)));
        const na = cur + turn;
        p.vx = Math.cos(na) * CONFIG.bombSpeed;
        p.vy = Math.sin(na) * CONFIG.bombSpeed;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // 수명 초과 → 소멸(빗나감)
      if ((this.projLife.get(p.id) ?? 0) <= now) { remove(); continue; }

      // 명중 판정
      const armed = (this.projArm.get(p.id) ?? 0) <= now;
      let hit = false;
      for (const k of karts) {
        if (k.finished || k.respawnMs > 0) continue;
        if (!armed && k.sessionId === p.owner) continue;
        if (Math.hypot(k.x - p.x, k.y - p.y) > CONFIG.bombHitRadius) continue;

        if (k.shieldMs > 0) {
          k.shieldMs = 0;
          this.broadcast("fx", { type: "blocked", id: k.sessionId, from: p.owner });
        } else {
          k.stunMs = CONFIG.stunMs;
          this.broadcast("fx", { type: "bomb", id: k.sessionId, from: p.owner });
          this.openQuiz(k, "escape"); // 갇혔을 때 문제를 풀면 탈출
        }
        hit = true;
        break;
      }
      if (hit) remove();
    }
  }

  // ---------- 퀴즈 ----------

  /** 지금 이 카트에게 문제를 낼 수 있는가 (쿨다운·중복 검사) */
  private canOpenQuiz(k: KartState, kind: QuizKind): boolean {
    if (k.quizActive || k.finished) return false;
    if (kind === "escape") return true;
    return Date.now() - (this.lastQuizAt.get(k.sessionId) ?? 0) >= CONFIG.quizCooldownMs;
  }

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

    // escape 퀴즈는 스핀 시간보다 길 이유가 없다 (5초 카드가 2.2초 스핀보다 오래 떠 있었다)
    const windowMs = kind === "escape" ? Math.min(CONFIG.quizMs, CONFIG.stunMs) : CONFIG.quizMs;
    const timer = this.clock.setTimeout(() => this.resolveQuiz(k.sessionId, ""), windowMs);
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
      ms: windowMs,
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
      this.traveled.delete(id);
      this.botItemAt.delete(id);
    }
    this.bots.clear();
    this.botSeq = 0;          // 봇 이름·ID를 매 판 동일하게 (bot-1..3)
    this.wallFx.clear();
    this.bumpFx.clear();
    this.botItemAt.clear();
    this.lastAdvanceAt.clear();
    this.lapStart.clear();

    // 사람 카트 초기화
    let i = 0;
    for (const k of this.state.karts.values()) {
      const sp = this.gridSlot(i++);
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
      this.traveled.set(k.sessionId, 0);
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
    while (this.state.projectiles.length) this.state.projectiles.pop();
    this.projArm.clear();
    this.projLife.clear();

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

    this.reportScoresToHub(results);
    this.raceSeq++;
  }

  private raceSeq = 1; // 리매치마다 늘어나는 경기 번호 — 허브 sessionId 유니크 보장용

  /** 허브 전광판 브리지 — 사람 결과만 hub /api/scores/server로 전송 (fire-and-forget).
   *  HUB_SCORE_URL·KIPLAY_SERVICE_TOKEN 없는 독립 배포에선 조용히 건너뛴다. */
  private reportScoresToHub(results: Array<{ nickname: string; finalScore: number; isBot: boolean; rank: number }>) {
    const url = process.env.HUB_SCORE_URL;
    const token = process.env.KIPLAY_SERVICE_TOKEN;
    if (!url || !token) return;
    for (const r of results) {
      if (r.isBot) continue; // 전광판은 사람 순위만 — 봇 제외
      // 허브는 (gameId, sessionId) 중복을 409로 거절 — 레이스 단위가 아니라 (레이스, 플레이어) 단위로 고유하게 (SKY-HARBOR 브리지와 동일 규칙)
      const sessionId = `${this.roomId}:${this.raceSeq}:${r.rank}`;
      void fetch(`${url.replace(/\/+$/, "")}/api/scores/server`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ gameId: "ip-racing", sessionId, player: r.nickname.slice(0, 20), score: r.finalScore }),
      })
        .then((res) => {
          if (!res.ok) console.warn(`[bridge] 점수 전송 거부 ${res.status} (${r.nickname})`);
        })
        .catch((e: unknown) => console.warn(`[bridge] 점수 전송 오류: ${e instanceof Error ? e.message : e}`));
    }
  }
}

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

function makeRoomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}
