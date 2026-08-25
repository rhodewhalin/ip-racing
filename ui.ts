// ============================================================
// DOM 오버레이 제어 (로비 / 퀴즈 / 결과·리뷰)
//
// [변경] ① 퀴즈가 전체화면을 덮지 않는다 → 하단 패널.
//          레이스와 퀴즈가 한 화면에 공존해야 두 재미가 서로를 죽이지 않는다.
//        ② READ 단계에 확신도 베팅 UI 추가 (클릭 또는 Space).
// ============================================================

import { net } from "./net";

const $ = (id: string) => document.getElementById(id)!;
const ITEM_EMOJI: Record<string, string> = { rocket: "🚀", shield: "🛡️", booster: "💨" };

export const ui = {
  show(id: string) { $(id).classList.remove("hidden"); },
  hide(id: string) { $(id).classList.add("hidden"); },

  // ---------- 로비 ----------
  initLobby(onStart: () => void) {
    const nick = $("nick") as HTMLInputElement;
    const code = $("code") as HTMLInputElement;

    $("btnCreate").addEventListener("click", async () => {
      if (!nick.value.trim()) return this.lobbyMsg("닉네임을 입력하세요.");
      try {
        await net.create(nick.value.trim());
        this.enterWaiting();
        this.attachRoomState();
      } catch (e) { this.lobbyMsg("방 생성 실패: 서버가 켜져 있나요?"); }
    });

    $("btnJoin").addEventListener("click", () => {
      $("joinbox").classList.toggle("hidden");
      ($("code") as HTMLInputElement).focus();
    });

    const doJoin = async () => {
      if (!nick.value.trim()) return this.lobbyMsg("닉네임을 입력하세요.");
      const c = code.value.trim();
      if (!c) return this.lobbyMsg("방 코드를 입력하세요.");
      this.lobbyMsg("입장 중…");
      try {
        await net.join(c, nick.value.trim());
        this.enterWaiting();
        this.attachRoomState();
        this.lobbyMsg("");
      } catch (e: any) {
        this.lobbyMsg(e?.message ? `입장 실패: ${e.message}` : "입장 실패: 코드를 확인하세요.");
      }
    };
    $("btnJoinGo").addEventListener("click", doJoin);
    $("code").addEventListener("keydown", (ev) => { if ((ev as KeyboardEvent).key === "Enter") doJoin(); });

    $("btnReady").addEventListener("click", () => { net.ready(); this.lobbyMsg("준비 완료. 상대를 기다립니다…"); });

    this._onStart = onStart;
  },

  _onStart: (() => {}) as () => void,

  attachRoomState() {
    net.onState((s: any) => {
      $("roomcode").textContent = s.roomCode || "…";
      if (s.phase === "countdown") this.hide("lobby");
      if (s.phase !== "lobby" && s.phase !== "countdown") { this.hide("lobby"); this._onStart(); }
      this.syncBetUI();
    });
    if (net.state?.roomCode) $("roomcode").textContent = net.state.roomCode;
  },

  enterWaiting() {
    $("btnCreate").parentElement!.classList.add("hidden");
    $("joinbox").classList.add("hidden");
    this.show("waiting");
    $("roomcode").textContent = net.roomCode() || "…";
  },
  lobbyMsg(m: string) { $("lobbyMsg").textContent = m; },

  // ---------- 퀴즈 ----------
  bindQuiz() {
    net.on("question_start", (q: any) => this.renderQuizRead(q));
    net.on("choose_open", () => this.openChoose());
    net.on("gate_resolved", (d: any) => this.onResolved(d));

    $("betSafe").addEventListener("click", () => net.setBet("safe"));
    $("betRisk").addEventListener("click", () => net.setBet("risk"));
  },

  renderQuizRead(q: any) {
    this.show("quiz");
    const panel = $("quiz");
    panel.classList.remove("choose", "locked");
    $("qmeta").textContent = `Q${q.gateIndex + 1} / 6`;
    $("qtext").textContent = q.text;

    const gates = $("gates");
    gates.innerHTML = "";
    q.options.forEach((o: any) => {
      const el = document.createElement("div");
      el.className = "gate";
      el.dataset.label = o.label;
      el.innerHTML =
        `<div class="item">${ITEM_EMOJI[o.item] ?? ""}</div>` +
        `<div class="concept">${o.text}</div>` +
        `<div class="key">${o.label === "A" ? "←" : o.label === "B" ? "↓" : "→"}</div>`;
      el.addEventListener("click", () => this.pick(o.label));
      gates.appendChild(el);
    });

    // 베팅 UI 노출 + 기본값(안전)
    if (q.betEnabled) this.show("betbox"); else this.hide("betbox");
    this.syncBetUI();

    const fill = $("timerfill");
    fill.style.transition = "none";
    fill.style.width = "100%";
    fill.style.background = "var(--accent)";
  },

  /** 내 베팅 상태를 버튼에 반영 (서버 state가 진실이다) */
  syncBetUI() {
    const bet = net.me()?.bet ?? "safe";
    $("betSafe").classList.toggle("on", bet === "safe");
    $("betRisk").classList.toggle("on", bet === "risk");

    // 상대 베팅 표시 — 심리전의 재료
    const opp = [...(net.state?.players?.values?.() ?? [])]
      .find((p: any) => p.sessionId !== net.selfId) as any;
    $("oppbet").textContent =
      opp && net.state?.phase === "quiz_read"
        ? `${opp.nickname}: ${opp.bet === "risk" ? "🔥 승부" : "🛡 안전"}`
        : "";
  },

  openChoose() {
    const panel = $("quiz");
    panel.classList.add("choose", "locked"); // locked = 베팅 잠금(회색 처리)

    const fill = $("timerfill");
    const dur = net.state?.chooseMs ?? 3000;
    fill.style.transition = "none";
    fill.style.width = "100%";
    void fill.offsetWidth;
    fill.style.transition = `width ${dur}ms linear`;
    fill.style.width = "0%";
    setTimeout(() => (fill.style.background = "var(--bad)"), Math.max(0, dur - 1000));
  },

  /** 결과를 0.9초 보여준 뒤 닫는다. 즉시 사라지면 피드백이 안 읽힌다. */
  onResolved(d: any) {
    const mine = d?.perPlayer?.[net.selfId];
    const panel = $("quiz");
    if (mine) {
      panel.classList.add(mine.passed ? "ok" : "no");
      $("qmeta").textContent = mine.passed
        ? (mine.bet === "risk" ? "🔥 승부 성공 — 부스트!" : "✅ 정답")
        : (mine.bet === "risk" ? "💥 승부 실패 — 스핀아웃" : "❌ 오답");
    }
    setTimeout(() => {
      this.hide("quiz");
      panel.classList.remove("ok", "no", "choose", "locked");
    }, 900);
  },

  pick(label: string) {
    if (net.state?.phase !== "quiz_choose") return;
    net.choose(label as "A" | "B" | "C");
    document.querySelectorAll("#gates .gate").forEach((g) => {
      (g as HTMLElement).classList.toggle("picked", (g as HTMLElement).dataset.label === label);
    });
  },

  // ---------- 결과 / 리뷰 ----------
  bindEnd() {
    net.on("match_end", (data: any) => this.renderResult(data));
  },

  renderResult(data: any) {
    this.hide("quiz");
    this.show("result");
    const scores = $("scores");
    scores.innerHTML = data.results
      .map(
        (r: any) =>
          `<div class="score"><span>${r.raceRank}위 · <b>${r.nickname}</b></span>` +
          `<span>Race ${r.raceScore} · IP ${r.ipScore}${r.riskWins ? ` (승부 ${r.riskWins})` : ""} · <b>Final ${r.finalScore}</b></span></div>`
      )
      .join("");

    const list = $("reviewlist");
    list.innerHTML = data.review
      .map((q: any) => {
        const mine = q.chosenByPlayer.find((c: any) => c.sessionId === net.selfId);
        const correct = mine?.correct;
        const chosen = mine?.chosen || "미선택";
        const bet = mine?.bet === "risk" ? "🔥승부" : "🛡안전";
        return (
          `<div class="q ${correct ? "" : "wrong"}">` +
          `<div class="tag">Q${q.gateIndex + 1} · ${correct ? '<span class="badge ok">정답</span>' : '<span class="badge no">오답</span>'} · ${bet}</div>` +
          `<div><b>${q.text}</b></div>` +
          `<div class="tag">내 선택: ${chosen} · 정답: ${q.correctLabel}</div>` +
          `<div>💡 ${q.explanation}</div>` +
          `<div class="tag">출처: ${q.sourceName}</div>` +
          `</div>`
        );
      })
      .join("");
  },
};
