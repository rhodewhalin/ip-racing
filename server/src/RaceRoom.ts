// ============================================================
// RaceRoom — 권위 서버 (Stage 1.5)
// 상태 머신: lobby → countdown → racing → (quiz_read → quiz_choose → resolving)*6 → finished
//
// [변경 1] 확신도 베팅: READ 중 safe/risk 선택 → resolveGate에서 결과가 갈린다.
// [변경 2] 이펙트 스택: 기존 applyEffect는 "마지막 타이머 승"이라 로켓 맞은 뒤
//          부스터를 쓰면 로켓 타이머가 부스터를 조기 종료시키는 버그가 있었다.
//          이제 효과를 배열로 쌓고 곱연산하며, 남은 시간은 racing 틱에서만 감소한다.
//          (= 퀴즈 정지 중에는 방패/부스터 시간이 흐르지 않는다. 이것도 기존 버그였다.)
// ============================================================

import { Room, Client } from "colyseus";
import { RoomState, PlayerState, GateOption, AnswerRecord } from "./schema";
import { CONFIG, ITEMS, ItemId, BetKind } from "./gameConfig";
import { pickMatchQuestions, gateLabel, Question } from "./questions";
import { grantItemByRank, randomDisplayItem } from "./items";

/** 남은 시간이 racing 틱에서만 감소하는 속도 효과. */
type Effect = { tag: string; multiplier: number; remainMs: number };

export class RaceRoom extends Room<RoomState> {
  maxClients = CONFIG.maxClients;

  private questions: Question[] = [];
  private correctIndexByGate: number[] = [];
  private pendingChoice = new Map<string, string>();
  private betLocked = false;
  private quizFrozen = false;

  /** sessionId -> 활성 효과 목록. 서버 전용(스키마 동기화 대상 아님). */
  private effects = new Map<string, Effect[]>();

  onCreate() {
    this.setState(new RoomState());
    this.questions = pickMatchQuestions(CONFIG.gateCount);
    this.correctIndexByGate = this.questions.map((q) => q.correctIndex);

    const code = makeRoomCode();
    this.state.roomCode = code;
    this.setMetadata({ roomCode: code });

    this.onMessage("set_ready", (client) => {
      const p = this.state.players.get(client.sessionId);
      if (!p || this.state.phase !== "lobby") return;
      p.ready = true;
      this.maybeStart();
    });

    // [신규] 베팅. READ 중에만 받고 choose_open 시점에 잠근다.
    this.onMessage("set_bet", (client, msg: { bet?: string }) => {
      if (!CONFIG.BET.enabled) return;
      if (this.state.phase !== "quiz_read") return;
      if (CONFIG.BET.lockOnChoose && this.betLocked) return;
      const p = this.state.players.get(client.sessionId);
      if (!p) return;
      const b = msg?.bet;
      if (b === "safe" || b === "risk") p.bet = b;
    });

    this.onMessage("submit_choice", (client, msg: { gate?: string }) => {
      if (this.state.phase !== "quiz_choose") return;
      const g = msg?.gate;
      if (g === "A" || g === "B" || g === "C") this.pendingChoice.set(client.sessionId, g);
    });

    this.onMessage("use_item", (client) => this.useItem(client));

    this.setSimulationInterval((dt) => this.update(dt), 1000 / CONFIG.simHz);
  }

  onJoin(client: Client, options: { nickname?: string } = {}) {
    const p = new PlayerState();
    p.sessionId = client.sessionId;
    p.nickname = (options.nickname || "Player").slice(0, 12);
    this.state.players.set(client.sessionId, p);
    this.effects.set(client.sessionId, []);
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    this.pendingChoice.delete(client.sessionId);
    this.effects.delete(client.sessionId);
  }

  // ---------- 흐름 ----------

  private maybeStart() {
    const players = [...this.state.players.values()];
    if (players.length >= 2 && players.every((p) => p.ready)) this.startCountdown();
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
        this.broadcast("match_start");
      }
    }, 1000);
  }

  private update(dtMs: number) {
    if (this.state.phase !== "racing" || this.quizFrozen) return;
    const dt = dtMs / 1000;

    for (const p of this.state.players.values()) {
      this.tickEffects(p, dtMs);
      p.progress = Math.min(
        CONFIG.trackLength,
        p.progress + CONFIG.baseSpeed * p.speedMultiplier * dt
      );
    }
    this.recomputeRanks();

    const maxProgress = Math.max(...[...this.state.players.values()].map((p) => p.progress));

    if (maxProgress >= CONFIG.trackLength) {
      this.endMatch();
      return;
    }
    const idx = this.state.currentGateIndex;
    if (idx < CONFIG.gateCount && maxProgress >= CONFIG.gatePositions[idx]) {
      this.startRead();
    }
  }

  private recomputeRanks() {
    const sorted = [...this.state.players.values()].sort((a, b) => b.progress - a.progress);
    sorted.forEach((p, i) => (p.rank = i + 1));
  }

  // ---------- 이펙트 스택 ----------

  /** racing 틱에서만 호출. 만료된 효과를 걷어내고 배수를 곱연산으로 재계산한다. */
  private tickEffects(p: PlayerState, dtMs: number) {
    const list = this.effects.get(p.sessionId);
    if (!list) return;

    let write = 0;
    for (let i = 0; i < list.length; i++) {
      list[i].remainMs -= dtMs;
      if (list[i].remainMs > 0) list[write++] = list[i];
    }
    list.length = write;

    // 곱연산: 로켓(0.4) × 부스터(1.5) = 0.6. 부스터가 로켓을 부분 상쇄한다.
    let m = 1;
    for (const e of list) m *= e.multiplier;
    p.speedMultiplier = Math.round(m * 1000) / 1000;
    p.shieldActive = list.some((e) => e.tag === "shield");
  }

  private addEffect(p: PlayerState, tag: string, multiplier: number, durationMs: number) {
    const list = this.effects.get(p.sessionId);
    if (!list) return;
    // 같은 tag는 갱신(중첩 방지). 다른 tag끼리는 곱해서 공존.
    const found = list.find((e) => e.tag === tag);
    if (found) {
      found.multiplier = multiplier;
      found.remainMs = Math.max(found.remainMs, durationMs);
    } else {
      list.push({ tag, multiplier, remainMs: durationMs });
    }
  }

  private removeEffect(p: PlayerState, tag: string) {
    const list = this.effects.get(p.sessionId);
    if (!list) return;
    const i = list.findIndex((e) => e.tag === tag);
    if (i >= 0) list.splice(i, 1);
  }

  // ---------- 퀴즈 ----------

  private startRead() {
    const idx = this.state.currentGateIndex;
    const q = this.questions[idx];
    this.quizFrozen = true;
    this.betLocked = false;
    this.state.phase = "quiz_read";

    // 베팅 초기화: 아무것도 안 하면 "안전"이 기본.
    for (const p of this.state.players.values()) p.bet = "safe";

    const displayItems: string[] = [];
    this.state.options.clear();
    q.options.forEach((text, i) => {
      const item = randomDisplayItem();
      displayItems.push(item);
      const go = new GateOption();
      go.label = gateLabel(i);
      go.text = text;
      go.item = item;
      this.state.options.push(go);
    });

    this.state.questionId = q.id;
    this.state.questionText = q.text;
    const readMs = Math.min(
      CONFIG.readMsMax,
      Math.max(CONFIG.readMsMin, CONFIG.readMsBase + CONFIG.readMsPerChar * q.text.length)
    );
    this.state.readMs = readMs;
    this.state.chooseMs = CONFIG.chooseMs;
    this.pendingChoice.clear();

    this.broadcast("question_start", {
      qId: q.id,
      gateIndex: idx,
      text: q.text,
      options: q.options.map((t, i) => ({ label: gateLabel(i), text: t, item: displayItems[i] })),
      readMs,
      chooseMs: CONFIG.chooseMs,
      betEnabled: CONFIG.BET.enabled,
    });

    this.clock.setTimeout(() => this.startChoose(), readMs);
  }

  private startChoose() {
    this.state.phase = "quiz_choose";
    this.betLocked = true;
    this.broadcast("choose_open");
    this.clock.setTimeout(() => this.resolveGate(), CONFIG.chooseMs);
  }

  private resolveGate() {
    const idx = this.state.currentGateIndex;
    const correctLabel = gateLabel(this.correctIndexByGate[idx]);
    this.state.phase = "resolving";

    const players = [...this.state.players.values()];
    const perPlayer: Record<string, any> = {};

    for (const p of players) {
      const chosen = this.pendingChoice.get(p.sessionId) || ""; // 미선택 = 오답
      const correct = chosen === correctLabel;
      const bet = (p.bet === "risk" ? "risk" : "safe") as BetKind;
      const rule = CONFIG.BET[bet];

      const rec = new AnswerRecord();
      rec.gateIndex = idx;
      rec.chosen = chosen;
      rec.correct = correct;
      rec.bet = bet;
      p.answers.push(rec);

      let itemGranted = "";
      let boosted = false;

      if (correct) {
        p.streak += 1;
        const opponentAhead = players.some((o) => o !== p && o.progress > p.progress);
        const item = grantItemByRank(p.rank > 1, opponentAhead);
        p.currentItem = item;
        itemGranted = item;

        // 승부 성공 → 즉시 부스트. 안전 성공 → 아이템만.
        if (rule.correctBoost > 0) {
          this.addEffect(p, "bet", rule.correctBoost, rule.correctMs);
          boosted = true;
        }
      } else {
        p.streak = 0;
        // 승부 실패 → 스핀아웃급 감속. 안전 실패 → 가벼운 감속.
        this.addEffect(p, "bet", rule.wrongMultiplier, rule.wrongMs);
      }

      perPlayer[p.sessionId] = {
        passed: correct,
        itemGranted,
        rank: p.rank,
        bet,
        boosted,
        streak: p.streak,
      };
    }

    this.broadcast("gate_resolved", { gateIndex: idx, perPlayer });

    this.state.currentGateIndex = idx + 1;
    this.state.questionId = "";
    this.state.questionText = "";
    this.state.options.clear();
    this.quizFrozen = false;
    this.state.phase = "racing";
  }

  // ---------- 아이템 ----------

  private useItem(client: Client) {
    if (this.state.phase !== "racing") return;
    const p = this.state.players.get(client.sessionId);
    if (!p || !p.currentItem) return;

    const item = p.currentItem as ItemId;
    p.currentItem = "";

    if (item === "booster") {
      this.addEffect(p, "booster", ITEMS.booster.multiplier!, ITEMS.booster.durationMs);
      this.broadcast("item_used", { item, source: p.sessionId, target: p.sessionId, blocked: false });
      return;
    }

    if (item === "shield") {
      this.addEffect(p, "shield", 1, ITEMS.shield.durationMs);
      this.broadcast("item_used", { item, source: p.sessionId, target: p.sessionId, blocked: false });
      return;
    }

    // rocket: 바로 앞 상대 자동 타겟
    const target = [...this.state.players.values()]
      .filter((o) => o !== p && o.progress > p.progress)
      .sort((a, b) => a.progress - b.progress)[0];
    if (!target) return;

    if (target.shieldActive) {
      this.removeEffect(target, "shield"); // 방패 소모
      target.shieldActive = false;
      this.broadcast("item_used", { item, source: p.sessionId, target: target.sessionId, blocked: true });
    } else {
      this.addEffect(target, "rocket", ITEMS.rocket.multiplier!, ITEMS.rocket.durationMs);
      this.broadcast("item_used", { item, source: p.sessionId, target: target.sessionId, blocked: false });
    }
  }

  // ---------- 종료 ----------

  private endMatch() {
    this.state.phase = "finished";

    const players = [...this.state.players.values()].sort((a, b) => b.progress - a.progress);
    const raceScoreByRank = [100, 60];

    const results = players.map((p, i) => {
      const correctCount = p.answers.filter((a) => a.correct).length;
      // [신규] 승부를 걸어 맞힌 문제는 IP 점수에 가산. 아는 걸 아는 것도 실력.
      const riskWins = p.answers.filter((a) => a.correct && a.bet === "risk").length;
      const ipScore = Math.min(
        100,
        Math.round((correctCount / CONFIG.gateCount) * 100 + riskWins * 3)
      );
      const raceScore = raceScoreByRank[i] ?? 40;
      const finalScore = Math.round(raceScore * 0.5 + ipScore * 0.5);
      return {
        sessionId: p.sessionId,
        nickname: p.nickname,
        raceRank: i + 1,
        raceScore,
        ipScore,
        finalScore,
        riskWins,
      };
    });

    const review = this.questions.map((q, gi) => ({
      gateIndex: gi,
      qId: q.id,
      text: q.text,
      options: q.options.map((t, i) => ({ label: gateLabel(i), text: t })),
      correctLabel: gateLabel(q.correctIndex),
      explanation: q.explanation,
      sourceName: q.sourceName,
      sourceUrl: q.sourceUrl,
      chosenByPlayer: players.map((p) => ({
        sessionId: p.sessionId,
        chosen: p.answers[gi]?.chosen || "",
        correct: p.answers[gi]?.correct || false,
        bet: p.answers[gi]?.bet || "safe",
      })),
    }));

    this.broadcast("match_end", { results, review });
  }
}

/** 사람이 읽기 쉬운 6자리 방 코드. 0/O/1/I 제외. */
function makeRoomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}
