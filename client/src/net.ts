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

  /** 6자리 방 코드로 입장. 실패 시 이유가 담긴 Error를 던진다. */
  async join(code: string, nickname: string) {
    const wanted = code.trim().toUpperCase();
    if (wanted.length !== 6) throw new Error("방 코드는 6자리입니다.");

    // 열려 있는 race 방 목록에서 코드가 일치하는 방을 찾는다
    const rooms = await this.client.getAvailableRooms("race");
    const match = rooms.find((r: any) => r.metadata?.roomCode === wanted);
    if (!match) throw new Error("그 코드의 방을 찾을 수 없어요. 코드를 다시 확인하거나, 방이 이미 시작/종료되지 않았는지 보세요.");
    if (match.clients >= match.maxClients) throw new Error("방이 가득 찼어요 (2인).");

    this.room = await this.client.joinById(match.roomId, { nickname });
    this._wire();
    return (this.room as any).roomId as string;
  },

  /** 화면에 표시할 사람용 방 코드 */
  roomCode(): string { return this.state?.roomCode || ""; },

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
