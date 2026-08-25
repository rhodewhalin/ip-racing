// ============================================================
// 네트워크 레이어 (colyseus.js)
//
// [변경] 로컬 이벤트 팬아웃 추가.
//   기존엔 ui.ts와 RaceScene.ts가 같은 이벤트("gate_resolved")를 각각
//   room.onMessage로 구독하면 콜백이 덮어써질 수 있었다.
//   이제 room.onMessage는 이벤트당 딱 한 번만 걸고, 내부 배열로 뿌린다.
// ============================================================

import { Client, Room } from "colyseus.js";

const ENDPOINT = (import.meta as any).env?.VITE_SERVER_URL || `ws://${location.hostname}:2567`;

export type Phase =
  | "lobby" | "countdown" | "racing"
  | "quiz_read" | "quiz_choose" | "resolving" | "finished";

export type BetKind = "safe" | "risk";

export const net = {
  client: new Client(ENDPOINT),
  room: null as Room | null,
  state: null as any,
  selfId: "",

  _handlers: {} as Record<string, ((p: any) => void)[]>,
  _bound: {} as Record<string, boolean>,

  async create(nickname: string) {
    this.room = await this.client.create("race", { nickname });
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

  async join(code: string, nickname: string) {
    const wanted = code.trim().toUpperCase();
    if (wanted.length !== 6) throw new Error("방 코드는 6자리입니다.");

    const rooms = await this.client.getAvailableRooms("race");
    const match = rooms.find((r: any) => r.metadata?.roomCode === wanted);
    if (!match) throw new Error("그 코드의 방을 찾을 수 없어요. 코드를 다시 확인하거나, 방이 이미 시작/종료되지 않았는지 보세요.");
    if (match.clients >= match.maxClients) throw new Error("방이 가득 찼어요 (2인).");

    this.room = await this.client.joinById(match.roomId, { nickname });
    this._wire();
    await this._waitFirstState();
    return (this.room as any).roomId as string;
  },

  roomCode(): string { return this.state?.roomCode || ""; },

  ready() { this.room?.send("set_ready"); },
  choose(gate: "A" | "B" | "C") { this.room?.send("submit_choice", { gate }); },
  useItem() { this.room?.send("use_item"); },
  /** [신규] 확신도 베팅 (quiz_read 중에만 유효) */
  setBet(bet: BetKind) { this.room?.send("set_bet", { bet }); },

  /** 같은 이벤트를 여러 모듈이 안전하게 구독할 수 있다. */
  on(event: string, cb: (payload: any) => void) {
    (this._handlers[event] ||= []).push(cb);
    if (!this._bound[event] && this.room) {
      this._bound[event] = true;
      this.room.onMessage(event, (payload: any) => {
        (this._handlers[event] || []).forEach((f) => {
          try { f(payload); } catch (e) { console.error(`[net] ${event} handler`, e); }
        });
      });
    }
  },

  onState(cb: (state: any) => void) {
    this.room?.onStateChange((s: any) => { this.state = s; cb(s); });
  },

  /** 내 PlayerState (없으면 null) */
  me(): any {
    return this.state?.players?.get?.(this.selfId) ?? null;
  },

  _wire() {
    if (!this.room) return;
    this.selfId = this.room.sessionId;
    this._bound = {};
    this.room.onStateChange((s: any) => { this.state = s; });
  },
};
