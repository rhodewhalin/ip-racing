// ============================================================
// RaceRoom — 권위 서버. 명세 4장 이벤트/상태 그대로.
// 상태 머신: lobby → countdown → racing → (quiz_read → quiz_choose → resolving)*6 → finished
// 진행도(progress)는 서버가 적분하고 state로 자동 동기화. 클라이언트는 보간만.
// ============================================================

import { Room, Client } from "colyseus";
import { RoomState, PlayerState, GateOption, AnswerRecord } from "./schema";
import { CONFIG, ITEMS, ItemId } from "./gameConfig";
import { pickMatchQuestions, gateLabel, Question } from "./questions";
import { grantItemByRank, randomDisplayItem } from "./items";

export class RaceRoom extends Room<RoomState> {
  maxClients = CONFIG.maxClients;

  private questions: Question[] = [];
  private correctIndexByGate: number[] = []; // 서버 전용: 게이트별 정답 인덱스
  private pendingChoice = new Map<string, string>(); // sessionId -> "A"|"B"|"C" (transient)
  private quizFrozen = false; // 퀴즈 중 진행도 정지

  onCreate() {
    this.setState(new RoomState());
    this.questions = pickMatchQuestions(CONFIG.gateCount);
    this.correctIndexByGate = this.questions.map((q) => q.correctIndex);

    // PRD 4장: 사람이 옮겨 적기 쉬운 6자리 방 코드 (헷갈리는 0/O/1/I 제외).
    // metadata에 넣어두면 클라이언트가 이 코드로 방을 찾을 수 있다.
    const code = makeRoomCode();
    this.state.roomCode = code;
    this.setMetadata({ roomCode: code });

    this.onMessage("set_ready", (client) => {
      const p = this.state.players.get(client.sessionId);
      if (!p || this.state.phase !== "lobby") return;
      p.ready = true;
      this.maybeStart();
    });

    this.onMessage("submit_choice", (client, msg: { gate?: string }) => {
      if (this.state.phase !== "quiz_choose") return;
      const g = msg?.gate;
      if (g === "A" || g === "B" || g === "C") this.pendingChoice.set(client.sessionId, g);
    });

    this.onMessage("use_item", (client) => this.useItem(client));

    // 10Hz 시뮬레이션. dt(ms)가 인자로 온다.
    this.setSimulationInterval((dt) => this.update(dt), 1000 / CONFIG.simHz);
  }

  onJoin(client: Client, options: { nickname?: string } = {}) {
    const p = new PlayerState();
    p.sessionId = client.sessionId;
    p.nickname = (options.nickname || "Player").slice(0, 12);
    this.state.players.set(client.sessionId, p);
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    this.pendingChoice.delete(client.sessionId);
  }

  // ---------- 흐름 ----------

  private maybeStart() {
    const players = [...this.state.players.values()];
    if (players.length >= 2 && players.every((p) => p.ready)) {
      this.startCountdown();
    }
  }

  private startCountdown() {
    this.state.phase = "countdown";
    this.lock(); // 시작 후 추가 입장 차단
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
      p.progress = Math.min(
        CONFIG.trackLength,
        p.progress + CONFIG.baseSpeed * p.speedMultiplier * dt
      );
    }
    this.recomputeRanks();

    const maxProgress = Math.max(...[...this.state.players.values()].map((p) => p.progress));

    // 결승선
    if (maxProgress >= CONFIG.trackLength) {
      this.endMatch();
      return;
    }
    // 게이트 트리거: 선두가 다음 게이트 지점을 넘으면 전원 동시 퀴즈
    const idx = this.state.currentGateIndex;
    if (idx < CONFIG.gateCount && maxProgress >= CONFIG.gatePositions[idx]) {
      this.startRead();
    }
  }

  private recomputeRanks() {
    const sorted = [...this.state.players.values()].sort((a, b) => b.progress - a.progress);
    sorted.forEach((p, i) => (p.rank = i + 1));
  }

  // ---------- 퀴즈 ----------

  private startRead() {
    const idx = this.state.currentGateIndex;
    const q = this.questions[idx];
    this.quizFrozen = true;
    this.state.phase = "quiz_read";

    // 게이트/보기 구성 (연출용 아이템은 랜덤)
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

    // question_start 이벤트도 명세대로 방송(정답 미포함)
    this.broadcast("question_start", {
      qId: q.id,
      gateIndex: idx,
      text: q.text,
      options: q.options.map((t, i) => ({ label: gateLabel(i), text: t, item: displayItems[i] })),
      readMs,
      chooseMs: CONFIG.chooseMs,
    });

    this.clock.setTimeout(() => this.startChoose(), readMs);
  }

  private startChoose() {
    this.state.phase = "quiz_choose";
    this.broadcast("choose_open");
    this.clock.setTimeout(() => this.resolveGate(), CONFIG.chooseMs);
  }

  private resolveGate() {
    const idx = this.state.currentGateIndex;
    const correctIdx = this.correctIndexByGate[idx];
    const correctLabel = gateLabel(correctIdx);
    this.state.phase = "resolving";

    const players = [...this.state.players.values()];
    const perPlayer: Record<string, any> = {};

    for (const p of players) {
      const chosen = this.pendingChoice.get(p.sessionId) || ""; // 미선택 = 오답
      const correct = chosen === correctLabel;

      const rec = new AnswerRecord();
      rec.gateIndex = idx;
      rec.chosen = chosen;
      rec.correct = correct;
      p.answers.push(rec);

      let itemGranted = "";
      if (correct) {
        // 정답: 순위 기반 아이템 보상, 패널티 없음
        const opponentAhead = players.some((o) => o !== p && o.progress > p.progress);
        const item = grantItemByRank(p.rank > 1, opponentAhead);
        p.currentItem = item;
        itemGranted = item;
      } else {
        // 오답: 아이템 없음 + 다음 racing 구간 감속
        this.applyEffect(p, CONFIG.wrongPenaltyMultiplier, CONFIG.wrongPenaltyDurationMs);
      }
      perPlayer[p.sessionId] = { passed: correct, itemGranted, rank: p.rank };
    }

    this.broadcast("gate_resolved", { gateIndex: idx, perPlayer });

    this.state.currentGateIndex = idx + 1;
    // 다음 racing으로 복귀
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
      this.applyEffect(p, ITEMS.booster.multiplier!, ITEMS.booster.durationMs);
      this.broadcast("item_used", { item, source: p.sessionId, target: p.sessionId, blocked: false });
      return;
    }

    if (item === "shield") {
      p.shieldActive = true;
      this.clock.setTimeout(() => (p.shieldActive = false), ITEMS.shield.durationMs);
      this.broadcast("item_used", { item, source: p.sessionId, target: p.sessionId, blocked: false });
      return;
    }

    // rocket: 앞선 상대 자동 타겟
    const target = [...this.state.players.values()]
      .filter((o) => o !== p && o.progress > p.progress)
      .sort((a, b) => a.progress - b.progress)[0]; // 바로 앞
    if (!target) return; // 앞에 아무도 없음(정상적으론 로켓 미지급)

    if (target.shieldActive) {
      target.shieldActive = false; // 방패 소모, 효과 무효
      this.broadcast("item_used", { item, source: p.sessionId, target: target.sessionId, blocked: true });
    } else {
      this.applyEffect(target, ITEMS.rocket.multiplier!, ITEMS.rocket.durationMs);
      this.broadcast("item_used", { item, source: p.sessionId, target: target.sessionId, blocked: false });
    }
  }

  /** 속도 배수를 duration 동안 적용 후 1.0으로 복귀.
   *  (겹치는 효과는 마지막 복귀가 우선 — 1단계 단순화) */
  private applyEffect(p: PlayerState, multiplier: number, durationMs: number) {
    p.speedMultiplier = multiplier;
    this.clock.setTimeout(() => (p.speedMultiplier = 1), durationMs);
  }

  // ---------- 종료 ----------

  private endMatch() {
    this.state.phase = "finished";

    const players = [...this.state.players.values()].sort((a, b) => b.progress - a.progress);

    // Race score: 1위 100 / 2위 60 (2인)
    const raceScoreByRank = [100, 60];

    const results = players.map((p, i) => {
      const correctCount = p.answers.filter((a) => a.correct).length;
      const ipScore = Math.round((correctCount / CONFIG.gateCount) * 100);
      const raceScore = raceScoreByRank[i] ?? 40;
      const finalScore = Math.round(raceScore * 0.5 + ipScore * 0.5);
      return { sessionId: p.sessionId, nickname: p.nickname, raceRank: i + 1, raceScore, ipScore, finalScore };
    });

    // IP Review: 정답/설명/출처를 이 시점에만 공개
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
