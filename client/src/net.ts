// ============================================================
// 네트워크 레이어 (colyseus.js)
// 이벤트는 내부 배열로 팬아웃한다 — RaceScene과 ui가 같은 이벤트를 함께 구독한다.
// ============================================================

import { Client, Room } from "colyseus.js";

const ENDPOINT = (import.meta as any).env?.VITE_SERVER_URL || `ws://${location.hostname}:2567`;

export type Phase = "lobby" | "countdown" | "racing" | "finished";

export interface InputState { throttle: number; steer: number; drift: boolean }

export const net = {
  client: new Client(ENDPOINT),
  room: null as Room | null,
  state: null as any,
  selfId: "",

  track: null as { points: number[][]; width: number; laps: number } | null,

  _handlers: {} as Record<string, ((p: any) => void)[]>,
  _bound: {} as Record<string, boolean>,
  _lastSent: { throttle: 0, steer: 0, drift: false } as InputState,
  lastStateAt: 0,

  async create(nickname: string) {
    this.room = await this.client.create("race", { nickname });
    this._wire();
    await this._waitFirstState();
    return (this.room as any).roomId as string;
  },

  async join(code: string, nickname: string) {
    const wanted = code.trim().toUpperCase();
    if (wanted.length !== 6) throw new Error("방 코드는 6자리입니다.");
    const rooms = await this.client.getAvailableRooms("race");
    const match = rooms.find((r: any) => r.metadata?.roomCode === wanted);
    if (!match) throw new Error("그 코드의 방을 찾을 수 없어요. 코드를 확인하거나, 방이 이미 시작되지 않았는지 보세요.");
    if (match.clients >= match.maxClients) throw new Error("방이 가득 찼어요.");
    this.room = await this.client.joinById(match.roomId, { nickname });
    this._wire();
    await this._waitFirstState();
    return (this.room as any).roomId as string;
  },

  _waitFirstState(): Promise<void> {
    return new Promise((resolve) => {
      if (this.state?.roomCode) return resolve();
      const t = setTimeout(resolve, 3000);
      this.room?.onStateChange.once(() => { clearTimeout(t); resolve(); });
    });
  },

  roomCode(): string { return this.state?.roomCode || ""; },
  ready() { this.room?.send("set_ready"); },
  useItem() { this.room?.send("use_item"); },
  answer(choice: string) { this.room?.send("quiz_answer", { choice }); },
  rematch() { this.room?.send("rematch"); },
  requestTrack() { this.room?.send("request_track"); },

  /**
   * 트랙 좌표가 올 때까지 재요청한다.
   * onJoin 에서 서버가 보낸 메시지는 핸들러 등록 전에 도착하면 버려지기 때문에,
   * 한 번 놓치면 3D 월드가 영영 만들어지지 않는다 (화면이 카운트다운에서 멈춤).
   */
  ensureTrack(onReady?: () => void) {
    if (this.track) { onReady?.(); return; }
    let tries = 0;
    const iv = setInterval(() => {
      if (this.track) { clearInterval(iv); onReady?.(); return; }
      if (++tries > 20) { clearInterval(iv); console.error("[net] 트랙 수신 실패"); return; }
      this.requestTrack();
    }, 400);
    this.requestTrack();
  },

  /** 입력은 바뀔 때만 보낸다. 30Hz로 계속 쏘면 낭비다. */
  sendInput(i: InputState) {
    const L = this._lastSent;
    if (i.throttle === L.throttle && i.steer === L.steer && i.drift === L.drift) return;
    this._lastSent = { ...i };
    this.room?.send("input", i);
  },

  me(): any { return this.state?.karts?.get?.(this.selfId) ?? null; },

  on(event: string, cb: (payload: any) => void) {
    (this._handlers[event] ||= []).push(cb);
    if (!this._bound[event] && this.room) {
      this._bound[event] = true;
      this.room.onMessage(event, (payload: any) => {
        (this._handlers[event] || []).forEach((f) => {
          try { f(payload); } catch (e) { console.error(`[net] ${event}`, e); }
        });
      });
    }
  },

  onState(cb: (state: any) => void) {
    this.room?.onStateChange((s: any) => { this.state = s; cb(s); });
  },

  _wire() {
    if (!this.room) return;
    this.selfId = this.room.sessionId;
    this._bound = {};
    this.room.onStateChange((s: any) => { this.state = s; this.lastStateAt = performance.now(); });
    // 트랙 지오메트리는 접속 시 한 번만 온다
    this.on("track", (t: any) => { this.track = t; });
  },
};
