// ============================================================
// Colyseus 상태 스키마
// 이 state는 클라이언트로 자동 동기화된다. 여기에 정답은 절대 넣지 않는다.
// 정답/설명/출처는 match_end 메시지로만 공개(IP Review).
//
// [변경] PlayerState.bet 추가 — 상대의 베팅이 보이는 것이 설계 의도다.
//        "쟤가 승부를 걸었다"는 정보가 심리전을 만든다.
//        숨기고 싶다면 이 필드를 빼고 gate_resolved 페이로드로만 공개하면 된다.
// ============================================================

import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";

export class GateOption extends Schema {
  @type("string") label = ""; // "A" | "B" | "C"
  @type("string") text = "";
  @type("string") item = ""; // 게이트에 표시되는 연출용 아이템
}

export class AnswerRecord extends Schema {
  @type("number") gateIndex = 0;
  @type("string") chosen = ""; // "", "A", "B", "C"
  @type("boolean") correct = false;
  @type("string") bet = "safe"; // [신규] 그 문제에 건 베팅
}

export class PlayerState extends Schema {
  @type("string") sessionId = "";
  @type("string") nickname = "";
  @type("number") progress = 0;
  @type("number") speedMultiplier = 1;
  @type("string") currentItem = "";
  @type("boolean") shieldActive = false;
  @type("number") rank = 1;
  @type("boolean") ready = false;

  // [신규] 이번 게이트 베팅. quiz_read 시작 시 "safe"로 리셋된다.
  @type("string") bet = "safe";
  // [신규] 연속 정답. 연출(콤보)과 후속 밸런싱용.
  @type("number") streak = 0;

  @type([AnswerRecord]) answers = new ArraySchema<AnswerRecord>();
}

export class RoomState extends Schema {
  // phase: lobby | countdown | racing | quiz_read | quiz_choose | resolving | finished
  @type("string") phase = "lobby";
  @type("string") roomCode = "";
  @type("number") currentGateIndex = 0;
  @type("number") countdown = 0;

  @type("string") questionId = "";
  @type("string") questionText = "";
  @type([GateOption]) options = new ArraySchema<GateOption>();
  @type("number") readMs = 0;
  @type("number") chooseMs = 0;

  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}
