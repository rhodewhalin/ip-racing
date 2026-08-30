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
  _shownLap: -1 as number,
  _trackId: "city",
  _helpShown: false,

  // ---------- 로비 ----------
  initLobby(onStart: () => void) {
    const nick = $("nick") as HTMLInputElement;
    const code = $("code") as HTMLInputElement;

    document.querySelectorAll("#trackpick .trk").forEach((b) => {
      b.addEventListener("click", () => {
        this._trackId = (b as HTMLElement).dataset.track || "city";
        document.querySelectorAll("#trackpick .trk").forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
      });
    });

    $("btnCreate").addEventListener("click", async () => {
      if (!nick.value.trim()) return this.lobbyMsg("닉네임을 입력하세요.");
      try {
        await net.create(nick.value.trim(), this._trackId);
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
    $("btnFull").addEventListener("click", () => this.toggleFullscreen());
    window.addEventListener("keydown", (ev) => {
      const key = (ev as KeyboardEvent).key;
      if (key === "m" || key === "M") this.toggleSound();
      if (key === "f" || key === "F") this.toggleFullscreen();
      if (key === "d" || key === "D") this.toggleDiag();
      if (key === "e" || key === "E") {
        const on = audio.toggleEngine();
        this.lobbyMsg(on ? "엔진음 켜짐" : "엔진음 꺼짐");
      }
    });

    this._onStart = onStart;
  },

  /** 진단 오버레이 (D 키). 멈춤이 발생하면 이 화면을 캡처해 주세요. */
  _diagOn: false,
  _diagTimer: 0 as any,

  toggleDiag() {
    this._diagOn = !this._diagOn;
    $("diag").classList.toggle("hidden", !this._diagOn);
    clearInterval(this._diagTimer);
    if (this._diagOn) {
      this._diagTimer = setInterval(() => {
        const d = (window as any).__ipr;
        if (!d) { $("diag").textContent = "진단 정보 없음 (레이스 시작 전)"; return; }
        $("diag").innerHTML =
          `<b>진단</b> (D로 끄기)<br>` +
          `phase: ${d.phase}<br>` +
          `내 속도(예측): ${d.speed} / 서버: ${d.serverSpeed}<br>` +
          `예측-서버 오차: ${d.gap}<br>` +
          `스핀: ${d.stunMs}ms · 복귀: ${d.respawnMs}ms · 퀴즈: ${d.quizActive}<br>` +
          `입력: ↑${d.keys.throttle} ←→${d.keys.steer} drift=${d.keys.drift}<br>` +
          `<span style="color:${d.stallMs > 800 ? "#ff5d6c" : "#8ea3c8"}">멈춤 지속: ${d.stallMs}ms</span><br>` +
          `서버 갱신 경과: ${d.serverAgeMs}ms<br>` +
          `프레임 오류: ${d.frameErrors} · 자동복구 ${d.recoveries ?? 0}회` +
          (d.lastError ? `<br><span style="color:#ffb020">${d.lastError}</span>` : "");
      }, 250);
    }
  },

  toggleFullscreen() {
    const el = document.documentElement;
    if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
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
      // 레이스 시작 직후 조작 안내를 잠깐 띄운다 (10초 뒤 사라짐)
      if (s.phase === "racing" && !this._helpShown) {
        this._helpShown = true;
        this.show("ingameHelp");
        setTimeout(() => $("ingameHelp").classList.add("fade"), 9000);
        setTimeout(() => this.hide("ingameHelp"), 9800);
      }
      if ($("tracklabel")) $("tracklabel").textContent = s.trackName || "";

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
    this.show("touchctrl"); // 터치 기기에서만 CSS로 실제 노출된다
    this.drawMinimap(s);
    const me = net.me();
    if (!me) return;

    $("hudRank").textContent = `${me.rank} / ${s.karts.size}`;
    $("hudLap").textContent = `${Math.min(me.lap + 1, s.laps)} / ${s.laps}`;
    $("hudItem").textContent = ITEM_LABEL[me.item] ?? "—";

    // 아이템 슬롯 — "쓸 시간이 없다"는 피드백. 크게 띄우고 키를 명시한다.
    this.show("itemslot");
    const slot = $("itemslot");
    const has = !!me.item;
    slot.classList.toggle("has", has);
    $("itemicon").textContent = has ? (ITEM_LABEL[me.item] ?? "").split(" ")[0] : "—";
    $("itemname").textContent = has ? (ITEM_LABEL[me.item] ?? "").split(" ")[1] ?? "" : "아이템 없음";
    $("itemkey").textContent = has ? "SPACE 로 사용" : "SPACE";
    $("tItem").classList.toggle("has", has); // 터치 아이템 버튼 강조
    $("hudSpeed").textContent = String(Math.round(Math.abs(me.speed)));
    $("hudItem").classList.toggle("ready", !!me.item);

    // 오른쪽 큰 랩 표시 (HUD 숫자는 눈에 안 들어온다는 피드백)
    this.show("lapbanner");
    const curLap = Math.min(me.lap + 1, s.laps);
    $("lapnum").textContent = `${curLap} / ${s.laps}`;
    $("lapbanner").classList.toggle("final", curLap === s.laps);
    if (curLap !== this._shownLap) {
      this._shownLap = curLap;
      const el = $("lapbanner");
      el.classList.add("pop");
      setTimeout(() => el.classList.remove("pop"), 220);
    }
    $("laptime").textContent = me.bestLapMs > 0 ? `BEST ${fmt(me.bestLapMs)}s` : "";

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

    // 완주 배너 — 골인 후 결과까지 기다리는 시간을 명시한다.
    // 예전에는 골인하면 차가 멈춘 채 아무 안내 없이 최대 12초를 기다렸다.
    if (me.finished) {
      $("spinbanner").classList.remove("hidden");
      $("spinbanner").style.background = "rgba(55,214,122,.92)";
      const left = s.endsInMs > 0 ? ` (${Math.ceil(s.endsInMs / 1000)}초)` : "";
      $("spintext").textContent = `🏁 완주! 다른 주자를 기다리는 중${left}`;
      return;
    }
    $("spinbanner").style.background = "";

    // 피격 배너 — 스핀을 "게임이 멈춘 것"으로 오해하지 않도록 명확히 알린다
    const spinning = me.stunMs > 0;
    $("spinbanner").classList.toggle("hidden", !spinning);
    if (spinning) {
      $("spintext").textContent = me.quizActive
        ? `💧 스핀아웃! 문제를 맞히면 즉시 탈출 (${(me.stunMs / 1000).toFixed(1)}초)`
        : `💧 스핀아웃 — ${(me.stunMs / 1000).toFixed(1)}초`;
    }

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
    // ⚠️ 직전 결과 카드의 '닫기' 타이머를 반드시 취소한다.
    //    안 그러면 결과 표시 후 1.8초 안에 새 문제가 뜰 때
    //    그 타이머가 **새로 뜬 문제를 닫아버린다.** ("문제가 켜지자마자 사라짐")
    clearTimeout(this._quizTimer);
    this._quizTimer = 0;

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
    $("qtext").textContent = (r.correct ? "" : `정답: ${r.correctText || r.correctLabel} — `) + r.explanation;
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
      this.hide("lapbanner");
      this.hide("quiz");
      this.hide("touchctrl");
      this.show("lobby");
      this.show("waiting");
      $("startrow").classList.add("hidden");
      $("joinbox").classList.add("hidden");
      this._shownLap = -1;
      this._lastCount = -1;
      this._mapT = null;
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
    this.hide("lapbanner");
    this.hide("itemslot");
    this.hide("touchctrl");
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
          `<div class="tag">정답: ${q.correctText ?? ""}</div>` +
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
