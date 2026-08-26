// ============================================================
// DOM 오버레이 (로비 / HUD / 퀴즈 / 결과)
//
// 설계 원칙: 퀴즈는 레이스를 가리지 않는다.
//   화면 우하단 카드로 뜨고, 그동안에도 카트는 계속 달린다.
//   그래서 "문제를 푸는 동안 벽에 박는" 상황이 생긴다 — 이게 이 게임의 긴장이다.
// ============================================================

import { net } from "./net";
import { audio } from "./audio";

const $ = (id: string) => document.getElementById(id)!;
const ITEM_LABEL: Record<string, string> = {
  bomb: "💧 물폭탄", boost: "🔥 부스터", oil: "🛢 기름", shield: "🛡 방어막", "": "—",
};
const KIND_LABEL: Record<string, string> = {
  item: "아이템 획득", block: "IP 블록", escape: "탈출!",
};

export const ui = {
  show(id: string) { $(id).classList.remove("hidden"); },
  hide(id: string) { $(id).classList.add("hidden"); },

  _onStart: (() => {}) as () => void,
  _quizTimer: 0 as any,
  _lastCount: -1 as number,

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
      } catch { this.lobbyMsg("방 생성 실패: 서버가 켜져 있나요?"); }
    });

    $("btnJoin").addEventListener("click", () => {
      $("joinbox").classList.toggle("hidden");
      code.focus();
    });

    const doJoin = async () => {
      if (!nick.value.trim()) return this.lobbyMsg("닉네임을 입력하세요.");
      if (!code.value.trim()) return this.lobbyMsg("방 코드를 입력하세요.");
      this.lobbyMsg("입장 중…");
      try {
        await net.join(code.value.trim(), nick.value.trim());
        this.enterWaiting();
        this.attachRoomState();
        this.lobbyMsg("");
      } catch (e: any) {
        this.lobbyMsg(e?.message ?? "입장 실패");
      }
    };
    $("btnJoinGo").addEventListener("click", doJoin);
    code.addEventListener("keydown", (ev) => { if ((ev as KeyboardEvent).key === "Enter") doJoin(); });

    $("btnReady").addEventListener("click", () => {
      audio.init();   // 브라우저 정책상 클릭 이후에만 소리를 켤 수 있다
      audio.startMusic();
      net.ready();
      this.lobbyMsg("준비 완료. 혼자여도 AI가 자리를 채웁니다.");
    });

    $("btnMute").addEventListener("click", () => this.toggleSound());
    window.addEventListener("keydown", (ev) => {
      if ((ev as KeyboardEvent).key === "m" || (ev as KeyboardEvent).key === "M") this.toggleSound();
    });

    this._onStart = onStart;
  },

  toggleSound() {
    audio.init();
    const on = audio.toggle();
    $("btnMute").textContent = on ? "🔊" : "🔇";
  },

  attachRoomState() {
    net.onState((s: any) => {
      $("roomcode").textContent = s.roomCode || "…";
      this.renderPlayerList(s);
      if (s.phase !== "lobby") { this.hide("lobby"); this._onStart(); }
      if (s.phase === "countdown") {
        this.show("countdown");
        $("countnum").textContent = String(s.countdown || "GO!");
        if (s.countdown !== this._lastCount) {
          this._lastCount = s.countdown;
          audio.countdown(s.countdown);
        }
      } else { this.hide("countdown"); this._lastCount = -1; }
      if (s.phase === "racing" || s.phase === "finished") this.renderHud(s);
    });
  },

  renderPlayerList(s: any) {
    const list = [...s.karts.values()] as any[];
    $("players").innerHTML = list
      .map((k) => `<div class="prow"><span>${k.nickname}</span><span>${k.ready ? "✅ 준비" : "⏳ 대기"}</span></div>`)
      .join("");
  },

  enterWaiting() {
    $("startrow").classList.add("hidden");
    $("joinbox").classList.add("hidden");
    this.show("waiting");
    $("roomcode").textContent = net.roomCode() || "…";
  },
  lobbyMsg(m: string) { $("lobbyMsg").textContent = m; },

  // ---------- HUD ----------
  renderHud(s: any) {
    this.show("hud");
    this.show("standings");
    this.show("minimap");
    this.drawMinimap(s);
    const me = net.me();
    if (!me) return;

    $("hudRank").textContent = `${me.rank} / ${s.karts.size}`;
    $("hudLap").textContent = `${Math.min(me.lap + 1, s.laps)} / ${s.laps}`;
    $("hudItem").textContent = ITEM_LABEL[me.item] ?? "—";
    $("hudSpeed").textContent = String(Math.round(Math.abs(me.speed)));
    $("hudItem").classList.toggle("ready", !!me.item);

    // 랩타임: 현재 랩 경과 + 베스트
    const cur = Math.max(0, (s.raceMs ?? 0) - (me.lapStartMs ?? 0));
    $("hudLapTime").textContent = fmt(cur);
    $("hudBest").textContent = me.bestLapMs > 0 ? fmt(me.bestLapMs) : "—";

    // 드리프트 단계 — 몇 단인지 보여야 물고 놓는 판단이 된다
    const tier = me.driftTier || me.boostTier || 0;
    const el = $("hudDrift");
    el.textContent = tier > 0 ? `${tier}단` : "—";
    el.className = "v" + (tier > 0 ? ` t${tier}` : "");

    $("hud").classList.toggle("offtrack", me.offTrack && Math.abs(me.speed) > 60);

    // 순위표
    const list = ([...s.karts.values()] as any[]).sort((a, b) => a.rank - b.rank);
    $("standings").innerHTML = list.map((k) => {
      const cls = k.sessionId === net.selfId ? "me" : k.isBot ? "bot" : "";
      const tag = k.isBot ? " 🤖" : "";
      const lap = k.finished ? "🏁" : `${Math.min(k.lap + 1, s.laps)}랩`;
      return `<div class="srow ${cls}"><span>${k.rank}. ${k.nickname}${tag}</span><span>${lap}</span></div>`;
    }).join("");
  },

  // ---------- 퀴즈 (레이스를 멈추지 않는다) ----------
  bindQuiz() {
    net.on("quiz_open", (q: any) => this.openQuiz(q));
    net.on("quiz_result", (r: any) => this.showQuizResult(r));

    // 숫자키 1/2/3 으로도 답할 수 있어야 한다 — 운전 중에 마우스는 무리다
    window.addEventListener("keydown", (ev) => {
      if ($("quiz").classList.contains("hidden")) return;
      const map: Record<string, string> = { "1": "A", "2": "B", "3": "C" };
      const label = map[ev.key];
      if (label) { ev.preventDefault(); this.answer(label); }
    });
  },

  openQuiz(q: any) {
    this.show("quiz");
    const panel = $("quiz");
    panel.className = `quiz-card ${q.kind}`;
    $("qkind").textContent = KIND_LABEL[q.kind] ?? "";
    $("qtext").textContent = q.text;

    $("qopts").innerHTML = q.options
      .map((o: any, i: number) =>
        `<button class="qopt" data-label="${o.label}"><b>${i + 1}</b> ${o.text}</button>`)
      .join("");
    $("qopts").querySelectorAll(".qopt").forEach((b) =>
      b.addEventListener("click", () => this.answer((b as HTMLElement).dataset.label!)));

    const fill = $("qfill");
    fill.style.transition = "none";
    fill.style.width = "100%";
    void fill.offsetWidth;
    fill.style.transition = `width ${q.ms}ms linear`;
    fill.style.width = "0%";
  },

  answer(label: string) {
    net.answer(label);
    $("qopts").querySelectorAll(".qopt").forEach((b) => {
      (b as HTMLButtonElement).disabled = true;
      b.classList.toggle("picked", (b as HTMLElement).dataset.label === label);
    });
  },

  showQuizResult(r: any) {
    if (r.correct) audio.correct(); else audio.wrong();
    const panel = $("quiz");
    panel.classList.add(r.correct ? "ok" : "no");
    $("qkind").textContent = r.correct ? `✅ ${r.effect}` : `❌ ${r.effect}`;
    $("qtext").textContent = r.explanation;
    $("qopts").innerHTML = "";
    clearTimeout(this._quizTimer);
    this._quizTimer = setTimeout(() => this.hide("quiz"), 1800);
  },

  /** 미니맵 — 3D 추격 시점에서는 전체 코스가 안 보인다. 이게 유일한 조망이다. */
  _mapT: null as null | { sc: number; ox: number; oy: number },

  drawMinimap(s: any) {
    const cv = $("minimap") as HTMLCanvasElement;
    const g = cv.getContext("2d");
    if (!g || !net.track) return;

    const pts = net.track.points;
    if (!this._mapT) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const p of pts) {
        if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0];
        if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1];
      }
      const pad = 14;
      const sc = Math.min((cv.width - pad * 2) / (maxX - minX), (cv.height - pad * 2) / (maxY - minY));
      this._mapT = { sc, ox: pad - minX * sc, oy: pad - minY * sc };
    }
    const T = this._mapT;
    const mx = (x: number) => x * T.sc + T.ox;
    const my = (y: number) => y * T.sc + T.oy;

    g.clearRect(0, 0, cv.width, cv.height);
    g.strokeStyle = "#33456b";
    g.lineWidth = 5;
    g.lineJoin = "round";
    g.beginPath();
    g.moveTo(mx(pts[0][0]), my(pts[0][1]));
    for (let i = 1; i < pts.length; i++) g.lineTo(mx(pts[i][0]), my(pts[i][1]));
    g.closePath();
    g.stroke();

    const colors = ["#4da3ff", "#ff9f43", "#37d67a", "#c77dff"];
    ([...s.karts.values()] as any[]).forEach((k, i) => {
      const self = k.sessionId === net.selfId;
      g.fillStyle = colors[i % colors.length];
      g.beginPath();
      g.arc(mx(k.x), my(k.y), self ? 6 : 4.5, 0, Math.PI * 2);
      g.fill();
      if (self) {
        g.strokeStyle = "#fff"; g.lineWidth = 2;
        g.beginPath(); g.arc(mx(k.x), my(k.y), 9, 0, Math.PI * 2); g.stroke();
      }
    });
  },

  // ---------- 결과 ----------
  bindEnd() {
    net.on("race_end", (d: any) => this.renderResult(d));

    // 재경기: 서버가 방을 초기화하면 로비 대기 화면으로 돌아간다
    net.on("rematch", () => {
      this.hide("result");
      this.hide("hud");
      this.hide("standings");
      this.hide("minimap");
      this.hide("quiz");
      this.show("lobby");
      this.show("waiting");
      $("startrow").classList.add("hidden");
      $("joinbox").classList.add("hidden");
      this.lobbyMsg("새 판입니다. 준비 완료를 눌러주세요.");
    });

    $("btnRematch").addEventListener("click", () => {
      net.rematch();
      $("btnRematch").textContent = "초기화 중…";
    });
    $("btnQuit").addEventListener("click", () => location.reload());
  },

  renderResult(data: any) {
    audio.stopMusic();
    $("btnRematch").textContent = "🔁 다시 하기";
    this.hide("quiz");
    this.hide("hud");
    this.hide("standings");
    this.hide("minimap");
    this.show("result");

    $("scores").innerHTML = data.results
      .map((r: any) => {
        const time = r.finished ? `${(r.timeMs / 1000).toFixed(1)}초` : "미완주";
        const best = r.bestLapMs > 0 ? ` · 베스트랩 ${(r.bestLapMs / 1000).toFixed(1)}초` : "";
        const bot = r.isBot ? " 🤖" : "";
        return `<div class="score"><span>${r.rank}위 · <b>${r.nickname}</b>${bot}</span>` +
          `<span>${time}${best} · IP ${r.correctCount}/${r.answerCount} · <b>${r.finalScore}</b></span></div>`;
      })
      .join("");

    $("reviewlist").innerHTML = data.review
      .map((q: any) => {
        const mine = q.perPlayer.filter((p: any) => p.sessionId === net.selfId);
        const got = mine.some((m: any) => m.correct);
        const seen = mine.length > 0;
        const badge = !seen
          ? '<span class="badge">안 나옴</span>'
          : got ? '<span class="badge ok">정답</span>' : '<span class="badge no">오답</span>';
        return `<div class="q ${seen && !got ? "wrong" : ""}">` +
          `<div class="tag">${badge}</div>` +
          `<div><b>${q.text}</b></div>` +
          `<div class="tag">정답: ${q.correctLabel} · ${q.options.find((o: any) => o.label === q.correctLabel)?.text ?? ""}</div>` +
          `<div>💡 ${q.explanation}</div>` +
          `<div class="tag">출처: ${q.sourceName}</div>` +
          `</div>`;
      })
      .join("");
  },
};

/** ms → 초.소수1자리 */
function fmt(ms: number) {
  return (ms / 1000).toFixed(1);
}
