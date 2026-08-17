// ============================================================
// IP Racing - Stage 1 game config
// 명세(IP_Racing_Stage1_Build_Spec.md) 1·2·3장의 1차 수치를 그대로 옮긴 것.
// 값 자체는 플레이 테스트로 튜닝. 여기 한 곳만 바꾸면 밸런스가 바뀐다.
// ============================================================

export const CONFIG = {
  // --- 1. 레이스 물리 ---
  trackLength: 6000, // progress units
  baseSpeed: 40, // units / sec  → 무패널티 완주 150s
  gatePositions: [800, 1700, 2700, 3700, 4700, 5600], // 6 gates
  gateCount: 6,

  // 오답 패널티: 다음 racing 구간 동안 감속
  wrongPenaltyMultiplier: 0.5,
  wrongPenaltyDurationMs: 3000,

  // --- 3. 3초 퀴즈 UI ---
  readMsBase: 2000,
  readMsPerChar: 40, // 2.0s + 0.04s * chars
  readMsMin: 2000,
  readMsMax: 5000,
  chooseMs: 3000, // 고정

  // --- 흐름 ---
  countdownMs: 3000,
  simHz: 10, // 서버 시뮬레이션 주파수 (state가 자동 동기화됨 → 별도 position_sync 불필요)
  maxClients: 2, // Stage 1 = 2인 개인전
} as const;

// --- 2. 아이템 파라미터 ---
export type ItemId = "rocket" | "shield" | "booster";

export const ITEMS: Record<ItemId, { durationMs: number; multiplier?: number }> = {
  rocket: { durationMs: 2000, multiplier: 0.4 }, // 앞선 상대 속도 ×0.4
  booster: { durationMs: 2000, multiplier: 1.5 }, // 자기 속도 ×1.5
  shield: { durationMs: 6000 }, // 다음 피격 1회 무효
};
