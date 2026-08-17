// ============================================================
// Colyseus 상태 스키마 (명세 4.2)
// 이 state는 클라이언트로 자동 동기화된다. 여기에 정답은 절대 넣지 않는다.
// 정답/설명/출처는 match_end 메시지로만 공개(IP Review).
// ============================================================

import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";

export class GateOption extends Schema {
  @type("string") label = ""; // "A" | "B" | "C"
  @type("string") text = ""; // 보기 텍스트
  @type("string") item = ""; // 게이트에 표시되는 연출용 아이템
}

export class AnswerRecord extends Schema {
  @type("number") gateIndex = 0;
  @type("string") chosen = ""; // "", "A", "B", "C"
  @type("boolean") correct = false;
}

export class PlayerState extends Schema {
  @type("string") sessionId = "";
  @type("string") nickname = "";
  @type("number") progress = 0; // 0 ~ trackLength
  @type("number") speedMultiplier = 1;
  @type("string") currentItem = ""; // "", rocket, shield, booster
  @type("boolean") shieldActive = false;
  @type("number") rank = 1;
  @type("boolean") ready = false;
  @type([AnswerRecord]) answers = new ArraySchema<AnswerRecord>();
}

export class RoomState extends Schema {
  // phase: lobby | countdown | racing | quiz_read | quiz_choose | resolving | finished
  @type("string") phase = "lobby";
  @type("string") roomCode = ""; // 사람이 읽기 쉬운 6자리 입장 코드
  @type("number") currentGateIndex = 0;
  @type("number") countdown = 0;

  // 현재 문제(read/choose 중에만 채워짐) — 정답 미포함
  @type("string") questionId = "";
  @type("string") questionText = "";
  @type([GateOption]) options = new ArraySchema<GateOption>();
  @type("number") readMs = 0;
  @type("number") chooseMs = 0;

  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}
