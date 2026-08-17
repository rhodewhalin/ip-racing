// ============================================================
// 네트워크 레이어 (colyseus.js)
// state는 room.onStateChange 로 통째로 받아 참조만 갱신(버전 무관하게 안정적).
// 이벤트는 room.onMessage 로 받는다.
// ============================================================

import { Client, Room } from "colyseus.js";

// 배포 시: Vercel 환경변수 VITE_SERVER_URL 에 서버 주소를 넣는다 (예: wss://ip-racing.up.railway.app)
// 미설정 시(로컬 개발): 같은 PC의 localhost:2567 로 접속
const ENDPOINT = (import.meta as any).env?.VITE_SERVER_URL || `ws://${location.hostname}:2567`;

export type Phase =
  | "lobby" | "countdown" | "racing"
  | "quiz_read" | "quiz_choose" | "resolving" | "finished";

export const net = {
  client: new Client(ENDPOINT),
  room: null as Room | null,
  state: null as any,
  selfId: "",

  async create(nickname: string) {
    this.room = await this.client.create("race", { nickname });
    this._wire();
    return (this.room as any).roomId as string;
  },

  async join(code: string, nickname: string) {
    this.room = await this.client.joinById(code, { nickname });
    this._wire();
    return (this.room as any).roomId as string;
  },

  ready() { this.room?.send("set_ready"); },
  choose(gate: "A" | "B" | "C") { this.room?.send("submit_choice", { gate }); },
  useItem() { this.room?.send("use_item"); },

  on(event: string, cb: (payload: any) => void) { this.room?.onMessage(event, cb); },
  onState(cb: (state: any) => void) {
    this.room?.onStateChange((s: any) => { this.state = s; cb(s); });
  },

  _wire() {
    if (!this.room) return;
    this.selfId = this.room.sessionId;
    this.room.onStateChange((s: any) => { this.state = s; });
  },
};
