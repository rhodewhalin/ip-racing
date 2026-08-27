// ============================================================
// 사운드 — Web Audio API 로 전부 실시간 합성한다.
//
// 왜 음원 파일을 안 쓰는가:
//  ① 다운로드할 에셋이 없다 (번들 크기 0, 로딩 없음)
//  ② 저작권 문제가 원천적으로 없다 — 특허정보원 프로젝트에서 중요한 부분
//  ③ 엔진음을 속도에 실시간으로 물릴 수 있다. 녹음 파일로는 이게 어렵다.
//
// 브라우저 정책상 AudioContext 는 사용자 클릭 이후에만 시작된다.
// 그래서 "준비 완료" 버튼에서 init() 을 호출한다.
// ============================================================

type Ctx = AudioContext;

export const audio = {
  ctx: null as Ctx | null,
  master: null as GainNode | null,
  musicGain: null as GainNode | null,
  sfxGain: null as GainNode | null,
  enabled: true,
  engineOn: true,   // 엔진음만 따로 끌 수 있다 (E 키)

  // 엔진 (지속음)
  engOsc: [] as OscillatorNode[],
  engGain: null as GainNode | null,
  engFilter: null as BiquadFilterNode | null,

  // 드리프트 스키드 (지속음)
  skidSrc: null as AudioBufferSourceNode | null,
  skidGain: null as GainNode | null,

  noiseBuf: null as AudioBuffer | null,
  musicTimer: 0 as any,
  musicStep: 0,

  /** 사용자 제스처 직후에 호출해야 한다. */
  init() {
    if (this.ctx) { this.resume(); return; }
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx: Ctx = new AC();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = this.enabled ? 0.9 : 0;
    this.master.connect(ctx.destination);

    this.sfxGain = ctx.createGain();
    this.sfxGain.gain.value = 1;
    this.sfxGain.connect(this.master);

    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = 0.30;  // 이전 0.16 은 너무 조용해 분위기가 안 살았다
    this.musicGain.connect(this.master);

    this.noiseBuf = this.makeNoise(ctx, 2);
    this.buildEngine(ctx);
    this.buildSkid(ctx);
  },

  resume() { if (this.ctx?.state === "suspended") this.ctx.resume(); },

  toggleEngine() { this.engineOn = !this.engineOn; return this.engineOn; },

  toggle() {
    this.enabled = !this.enabled;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.enabled ? 0.9 : 0, this.ctx.currentTime, 0.05);
    }
    return this.enabled;
  },

  // ---------- 기본 재료 ----------

  makeNoise(ctx: Ctx, seconds: number): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  },

  // ---------- 엔진 ----------

  buildEngine(ctx: Ctx) {
    this.engGain = ctx.createGain();
    this.engGain.gain.value = 0;

    this.engFilter = ctx.createBiquadFilter();
    this.engFilter.type = "lowpass";
    this.engFilter.frequency.value = 1600;
    this.engFilter.Q.value = 0.7;

    this.engGain.connect(this.engFilter);
    this.engFilter.connect(this.sfxGain!);

    // ⚠️ 이전엔 톱니파 3개를 겹쳐 "부우웅" 하는 저음 드론이 났다.
    //    레이싱 게임보다는 냉장고 소리에 가까웠다.
    //    삼각파를 기본으로 하고 톱니를 살짝만 섞어 밝고 가볍게 바꿨다.
    const shapes: Array<[OscillatorType, number, number]> = [
      ["triangle", 0, 1.0],
      ["triangle", 9, 0.55],
      ["sawtooth", -6, 0.22],   // 거친 질감은 아주 조금만
    ];
    for (const [type, detune, gain] of shapes) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = 120;
      o.detune.value = detune;
      g.gain.value = gain;
      o.connect(g); g.connect(this.engGain);
      o.start();
      this.engOsc.push(o);
    }

    // 아주 약한 흔들림(트레몰로). 기계적인 정지음이 아니라 "돌아가는" 느낌을 준다.
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 7;
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain);
    lfoGain.connect(this.engGain.gain);
    lfo.start();
  },

  /** 매 프레임 호출. 속도에 따라 음정과 밝기가 변한다. */
  updateEngine(speed: number, maxSpeed: number, opts: { drifting?: boolean; boost?: boolean; racing?: boolean } = {}) {
    if (!this.ctx || !this.engGain || !this.engFilter) return;
    const t = this.ctx.currentTime;
    const r = Math.min(Math.abs(speed) / Math.max(maxSpeed, 1), 1.6);

    // 기어가 바뀌는 느낌: 비율이 올라가다 특정 지점에서 음정이 살짝 떨어진다
    const gear = Math.floor(r * 3);
    const inGear = (r * 3) - gear;
    // 기본 음정을 올려 저음 드론 대신 가벼운 엔진음이 나게 한다
    const freq = 130 + inGear * 150 + gear * 34 + (opts.boost ? 60 : 0);

    for (const o of this.engOsc) o.frequency.setTargetAtTime(freq, t, 0.04);
    this.engFilter.frequency.setTargetAtTime(1200 + r * 3200 + (opts.boost ? 1400 : 0), t, 0.06);
    // 음량도 절반 이하로. 엔진은 배경이지 주인공이 아니다.
    const vol = this.engineOn ? (opts.racing ? 0.022 + r * 0.05 : 0) : 0;
    this.engGain.gain.setTargetAtTime(vol, t, 0.1);
  },

  // ---------- 드리프트 스키드 ----------

  buildSkid(ctx: Ctx) {
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf!;
    src.loop = true;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2400;
    bp.Q.value = 1.6;

    const g = ctx.createGain();
    g.gain.value = 0;

    src.connect(bp); bp.connect(g); g.connect(this.sfxGain!);
    src.start();

    this.skidSrc = src;
    this.skidGain = g;
  },

  setSkid(on: boolean, intensity = 1) {
    if (!this.ctx || !this.skidGain) return;
    this.skidGain.gain.setTargetAtTime(on ? 0.10 * intensity : 0, this.ctx.currentTime, 0.05);
  },

  // ---------- 단발 효과음 ----------

  /** 짧은 톤. 대부분의 UI 소리가 이걸로 만들어진다. */
  tone(freq: number, dur: number, type: OscillatorType = "square", vol = 0.2, slideTo?: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(slideTo, 1), t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.sfxGain!);
    o.start(t); o.stop(t + dur + 0.02);
  },

  /** 노이즈 버스트. 충돌·폭발·마찰음 재료. */
  noise(dur: number, freq: number, vol = 0.25, type: BiquadFilterType = "bandpass") {
    if (!this.ctx || !this.noiseBuf) return;
    const t = this.ctx.currentTime;
    const s = this.ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    const f = this.ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = 1.2;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.sfxGain!);
    s.start(t); s.stop(t + dur + 0.02);
  },

  // ---------- 게임 이벤트 ----------

  countdown(n: number) {
    if (n > 0) { this.tone(660, 0.16, "square", 0.3); this.tone(880, 0.12, "triangle", 0.14); }
    else {
      // GO! — 밝은 장3화음 팡파레
      [1046.5, 1318.5, 1568].forEach((f, i) =>
        setTimeout(() => this.tone(f, 0.45, "square", 0.3), i * 45));
    }
  },

  /** 드리프트 부스트. 단계가 올라갈수록 높고 길다. */
  boost(tier = 1) {
    const base = [420, 520, 640][Math.min(tier, 3) - 1] ?? 420;
    this.tone(base, 0.34, "sawtooth", 0.26, base * 2.4);
    this.noise(0.3, 1800 + tier * 500, 0.2, "highpass");
  },

  hit() {
    this.tone(150, 0.32, "square", 0.3, 55);
    this.noise(0.34, 500, 0.34, "lowpass");
  },

  wall() { this.noise(0.09, 1600, 0.12); },

  pickup() { this.tone(660, 0.09, "square", 0.2); setTimeout(() => this.tone(990, 0.12, "square", 0.2), 80); },

  correct() { [660, 880, 1170].forEach((f, i) => setTimeout(() => this.tone(f, 0.13, "triangle", 0.24), i * 75)); },
  wrong() { this.tone(300, 0.26, "sawtooth", 0.22, 150); },

  lap() { [880, 1108, 1318].forEach((f, i) => setTimeout(() => this.tone(f, 0.15, "square", 0.26), i * 70)); },

  shield() { this.tone(520, 0.22, "sine", 0.22, 880); },
  respawn() { this.tone(300, 0.3, "sine", 0.2, 620); },

  finish() {
    // 상승 팡파레 + 마지막에 화음
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => this.tone(f, 0.3, "square", 0.3), i * 110));
    setTimeout(() => [1047, 1318, 1568].forEach((f) => this.tone(f, 0.8, "triangle", 0.2)), 460);
  },

  // ---------- BGM ----------
  // 이전 버전은 A단조 아르페지오라 침울했다.
  // C장조 I–V–vi–IV 진행 + 킥/스네어/하이햇으로 밝고 빠르게 바꿨다.

  startMusic() {
    if (!this.ctx || this.musicTimer) return;

    // C - G - Am - F (한 마디 8스텝)
    const bass = [65.41, 65.41, 98.00, 98.00, 110.00, 110.00, 87.31, 87.31];
    const chords = [
      [523.25, 659.25, 783.99],  // C
      [493.88, 587.33, 783.99],  // G
      [523.25, 659.25, 880.00],  // Am
      [523.25, 698.46, 880.00],  // F
    ];
    // 밝은 리드 멜로디 (펜타토닉 위주 — 어떤 코드에도 어울린다)
    const lead = [
      783.99, 0, 880.00, 987.77, 0, 880.00, 783.99, 0,
      659.25, 0, 783.99, 880.00, 0, 783.99, 659.25, 0,
      587.33, 0, 659.25, 783.99, 0, 880.00, 987.77, 0,
      1046.50, 0, 987.77, 880.00, 0, 783.99, 659.25, 0,
    ];
    this.musicStep = 0;

    // 125ms = 16분음표 기준 약 120BPM. 이전 160ms보다 확실히 경쾌하다.
    this.musicTimer = setInterval(() => {
      if (!this.ctx || !this.enabled) return;
      const t = this.ctx.currentTime;
      const step = this.musicStep++;
      const bar = Math.floor(step / 8) % 4;

      // 베이스 (8분마다)
      if (step % 2 === 0) this.musicTone(bass[step % bass.length], 0.20, "square", 0.26, t);

      // 코드 스탭 (엇박에 짧게 — 리듬감의 핵심)
      if (step % 4 === 2) {
        for (const f of chords[bar]) this.musicTone(f, 0.11, "triangle", 0.075, t);
      }

      // 리드 멜로디
      const note = lead[step % lead.length];
      if (note) this.musicTone(note, 0.14, "square", 0.10, t);

      // 드럼
      if (step % 8 === 0 || step % 8 === 5) this.kick();      // 킥
      if (step % 8 === 4) this.snare();                        // 스네어
      if (step % 2 === 1) this.musicNoise(0.03, 9000, 0.055);  // 하이햇
    }, 125);
  },

  /** 킥: 빠르게 떨어지는 사인파 */
  kick() {
    if (!this.ctx || !this.musicGain) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.11);
    g.gain.setValueAtTime(0.42, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g); g.connect(this.musicGain);
    o.start(t); o.stop(t + 0.18);
  },

  /** 스네어: 노이즈 + 짧은 톤 */
  snare() {
    this.musicNoise(0.13, 1900, 0.20);
    if (!this.ctx || !this.musicGain) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(240, t);
    g.gain.setValueAtTime(0.14, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    o.connect(g); g.connect(this.musicGain);
    o.start(t); o.stop(t + 0.12);
  },

  stopMusic() {
    clearInterval(this.musicTimer);
    this.musicTimer = 0;
  },

  musicTone(freq: number, dur: number, type: OscillatorType, vol: number, t: number) {
    if (!this.ctx || !this.musicGain) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.musicGain);
    o.start(t); o.stop(t + dur + 0.02);
  },

  musicNoise(dur: number, freq: number, vol: number) {
    if (!this.ctx || !this.noiseBuf || !this.musicGain) return;
    const t = this.ctx.currentTime;
    const s = this.ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    const f = this.ctx.createBiquadFilter();
    f.type = "highpass"; f.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(this.musicGain);
    s.start(t); s.stop(t + dur + 0.02);
  },
};
