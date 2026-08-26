// ============================================================
// Colyseus 상태 스키마 (Stage 2)
// 정답은 절대 들어가지 않는다. 퀴즈 문항은 해당 플레이어에게만 targeted message로.
// ============================================================

import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";

export class KartState extends Schema {
  @type("string") sessionId = "";
  @type("string") nickname = "";

  // 물리
  @type("number") x = 0;
  @type("number") y = 0;
  @type("number") heading = 0;
  @type("number") speed = 0;
  @type("number") steer = 0;      // 램프가 적용된 실제 조향값
  @type("boolean") drifting = false;
  @type("number") driftCharge = 0;

  // 코스 진행
  @type("number") lap = 0;
  @type("number") s = 0;        // 중심선 거리
  @type("number") rank = 1;
  @type("boolean") offTrack = false;
  @type("boolean") finished = false;
  @type("number") finishMs = 0;

  // 상태 효과 (남은 ms)
  @type("number") stunMs = 0;
  @type("number") shieldMs = 0;
  @type("number") boostMs = 0;
  @type("number") speedMul = 1;
  @type("number") respawnMs = 0;  // >0 이면 방금 복귀 (깜빡임/무적)

  @type("string") item = "";       // "", bomb, boost, oil, shield
  @type("boolean") quizActive = false;
  @type("string") quizKind = "";   // item | block | escape

  @type("number") correctCount = 0;
  @type("number") answerCount = 0;
  @type("boolean") ready = false;
  @type("boolean") isBot = false;

  // 드리프트 다단 부스트 표시용
  @type("number") driftTier = 0;   // 0=없음, 1~3단 (충전 중)
  @type("number") boostTier = 0;   // 발동된 부스트 단계

  // 랩타임
  @type("number") lastLapMs = 0;
  @type("number") bestLapMs = 0;
  @type("number") lapStartMs = 0; // 레이스 시작 기준, 현재 랩이 시작된 시각
}

export class PickupState extends Schema {
  @type("string") id = "";
  @type("string") kind = "item"; // item | block
  @type("number") x = 0;
  @type("number") y = 0;
  @type("boolean") active = true;
}

export class HazardState extends Schema {
  @type("string") id = "";
  @type("string") owner = "";
  @type("number") x = 0;
  @type("number") y = 0;
}

export class RoomState extends Schema {
  // lobby | countdown | racing | finished
  @type("string") phase = "lobby";
  @type("string") roomCode = "";
  @type("number") countdown = 0;
  @type("number") laps = 3;
  @type("number") raceMs = 0;
  @type("number") endsInMs = 0;  // 0보다 크면 곧 종료 (카운트다운 표시용)

  @type({ map: KartState }) karts = new MapSchema<KartState>();
  @type([PickupState]) pickups = new ArraySchema<PickupState>();
  @type([HazardState]) hazards = new ArraySchema<HazardState>();
}
