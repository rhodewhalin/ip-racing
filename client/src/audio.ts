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
    this.musicGain.gain.value = 0.16;
    this.musicGain.connect(this.master);

    this.noiseBuf = this.makeNoise(ctx, 2);
    this.buildEngine(ctx);
    this.buildSkid(ctx);
  },

  resume() { if (this.ctx?.state === "suspended") this.ctx.resume(); },

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
    this.engFilter.frequency.value = 900;
    this.engFilter.Q.value = 1.1;

    this.engGain.connect(this.engFilter);
    this.engFilter.connect(this.sfxGain!);

    // 톱니 두 개를 살짝 어긋나게 겹쳐야 "웅웅" 하는 두께가 생긴다.
    // 하나만 쓰면 삐- 하는 전자음이 된다.
    for (const detune of [0, 11, -7]) {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = 70;
      o.detune.value = detune;
      o.connect(this.engGain);
      o.start();
      this.engOsc.push(o);
    }
  },

  /** 매 프레임 호출. 속도에 따라 음정과 밝기가 변한다. */
  updateEngine(speed: number, maxSpeed: number, opts: { drifting?: boolean; boost?: boolean; racing?: boolean } = {}) {
    if (!this.ctx || !this.engGain || !this.engFilter) return;
    const t = this.ctx.currentTime;
    const r = Math.min(Math.abs(speed) / Math.max(maxSpeed, 1), 1.6);

    // 기어가 바뀌는 느낌: 비율이 올라가다 특정 지점에서 음정이 살짝 떨어진다
    const gear = Math.floor(r * 3);
    const inGear = (r * 3) - gear;
    const freq = 62 + inGear * 78 + gear * 16 + (opts.boost ? 26 : 0);

    for (const o of this.engOsc) o.frequency.setTargetAtTime(freq, t, 0.045);
    this.engFilter.frequency.setTargetAtTime(600 + r * 2600 + (opts.boost ? 900 : 0), t, 0.06);
    // 레이스 중이 아니면 완전히 끈다 (로비에서 엔진이 웅웅거리면 거슬린다)
    this.engGain.gain.setTargetAtTime(opts.racing ? 0.05 + r * 0.10 : 0, t, 0.1);
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
    if (n > 0) this.tone(520, 0.18, "square", 0.28);
    else { this.tone(880, 0.5, "square", 0.32); this.tone(1320, 0.5, "triangle", 0.18); }
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

  lap() { this.tone(880, 0.14, "triangle", 0.24); setTimeout(() => this.tone(1320, 0.2, "triangle", 0.22), 120); },

  shield() { this.tone(520, 0.22, "sine", 0.22, 880); },
  respawn() { this.tone(300, 0.3, "sine", 0.2, 620); },

  finish() {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => this.tone(f, 0.34, "triangle", 0.3), i * 130));
  },

  // ---------- BGM ----------
  // 짧은 베이스 + 아르페지오 루프. 파일 없이 스텝 시퀀서로 돌린다.

  startMusic() {
    if (!this.ctx || this.musicTimer) return;
    const bass = [55, 55, 73.4, 65.4];
    const arp = [220, 277, 330, 277, 247, 330, 415, 330];
    this.musicStep = 0;

    this.musicTimer = setInterval(() => {
      if (!this.ctx || !this.enabled) return;
      const t = this.ctx.currentTime;
      const step = this.musicStep++;

      if (step % 2 === 0) {
        const b = bass[Math.floor(step / 8) % bass.length];
        this.musicTone(b, 0.24, "square", 0.3, t);
      }
      this.musicTone(arp[step % arp.length], 0.16, "triangle", 0.14, t);
      if (step % 4 === 0) this.musicNoise(0.05, 6000, 0.1);
    }, 160);
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
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
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
