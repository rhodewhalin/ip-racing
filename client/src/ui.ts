// ============================================================
// DOM 오버레이 제어 (로비 / 퀴즈 / 결과·리뷰).
// 텍스트 중심 UI는 Phaser 캔버스보다 DOM이 다루기 쉽고 접근성도 좋다.
// 레이스 연출만 Phaser, 나머지는 DOM — 의도된 분업.
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
        const roomId = await net.create(nick.value.trim());
        this.enterWaiting(roomId);
      } catch (e) { this.lobbyMsg("방 생성 실패: 서버가 켜져 있나요?"); }
    });

    $("btnJoin").addEventListener("click", () => code.classList.toggle("hidden"));

    $("code").addEventListener("keydown", async (ev) => {
      if ((ev as KeyboardEvent).key !== "Enter") return;
      if (!nick.value.trim()) return this.lobbyMsg("닉네임을 입력하세요.");
      try {
        const roomId = await net.join(code.value.trim(), nick.value.trim());
        this.enterWaiting(roomId);
      } catch (e) { this.lobbyMsg("입장 실패: 코드를 확인하세요."); }
    });

    $("btnReady").addEventListener("click", () => { net.ready(); this.lobbyMsg("준비 완료. 상대를 기다립니다…"); });

    // 게임 시작 신호
    net.onState((s: any) => {
      $("roomcode").textContent = (net.room as any)?.roomId ?? "";
      if (s.phase !== "lobby" && s.phase !== "countdown") { this.hide("lobby"); onStart(); }
      if (s.phase === "countdown") this.hide("lobby");
    });
  },

  enterWaiting(roomId: string) {
    $("roomcode").textContent = roomId;
    $("btnCreate").parentElement!.classList.add("hidden");
    ($("code") as HTMLElement).classList.add("hidden");
    this.show("waiting");
  },
  lobbyMsg(m: string) { $("lobbyMsg").textContent = m; },

  // ---------- 퀴즈 ----------
  bindQuiz() {
    net.on("question_start", (q: any) => this.renderQuizRead(q));
    net.on("choose_open", () => this.openChoose());
    net.on("gate_resolved", () => this.hide("quiz"));
  },

  renderQuizRead(q: any) {
    this.show("quiz");
    const panel = $("quiz");
    panel.classList.remove("choose");
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
    // READ: 타이머 가득
    const fill = $("timerfill");
    fill.style.transition = "none";
    fill.style.width = "100%";
  },

  openChoose() {
    $("quiz").classList.add("choose");
    // 3초 카운트다운 애니메이션
    const fill = $("timerfill");
    const dur = net.state?.chooseMs ?? 3000;
    fill.style.transition = "none";
    fill.style.width = "100%";
    // 강제 리플로우 후 트랜지션 시작
    void fill.offsetWidth;
    fill.style.transition = `width ${dur}ms linear`;
    fill.style.width = "0%";
    // 마지막 구간 색 경고
    setTimeout(() => (fill.style.background = "var(--bad)"), Math.max(0, dur - 1000));
    setTimeout(() => (fill.style.background = "var(--accent)"), dur);
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
          `<span>Race ${r.raceScore} · IP ${r.ipScore} · <b>Final ${r.finalScore}</b></span></div>`
      )
      .join("");

    const list = $("reviewlist");
    list.innerHTML = data.review
      .map((q: any) => {
        const mine = q.chosenByPlayer.find((c: any) => c.sessionId === net.selfId);
        const correct = mine?.correct;
        const chosen = mine?.chosen || "미선택";
        return (
          `<div class="q ${correct ? "" : "wrong"}">` +
          `<div class="tag">Q${q.gateIndex + 1} · ${correct ? '<span class="badge ok">정답</span>' : '<span class="badge no">오답</span>'}</div>` +
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
