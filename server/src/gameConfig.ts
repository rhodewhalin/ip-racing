// ============================================================
// IP Racing - game config (Stage 1.5)
// 변경점: ① 페이싱 재조정(150s → 72s) ② 확신도 베팅 파라미터 추가
// 값 자체는 플레이 테스트로 튜닝. 여기 한 곳만 바꾸면 밸런스가 바뀐다.
// ============================================================

export const CONFIG = {
  // --- 1. 레이스 물리 ---
  // [변경] 완주 150s는 너무 길었다. 게이트 간 20~25s 공백이 죽은 시간이었음.
  // baseSpeed를 올려 완주 ~72s, 게이트 간 ~9~12s 로 압축.
  trackLength: 6000,
  baseSpeed: 85, // units/sec → 무패널티 완주 약 71s (이전 40 = 150s)
  gatePositions: [700, 1550, 2450, 3350, 4250, 5200],
  gateCount: 6,

  // 오답 패널티 (베팅 미사용 시의 기본값 — 아래 BET이 우선한다)
  wrongPenaltyMultiplier: 0.5,
  wrongPenaltyDurationMs: 3000,

  // --- 3. 퀴즈 UI ---
  readMsBase: 2000,
  readMsPerChar: 40,
  readMsMin: 2000,
  readMsMax: 5000,
  chooseMs: 3000,

  // --- 흐름 ---
  countdownMs: 3000,
  simHz: 20, // [변경] 10 → 20Hz. 보간 품질과 이펙트 만료 정밀도 개선.
  maxClients: 2,

  // --- 4. 확신도 베팅 (신규) ---
  // READ 단계에서 이번 문제에 "안전" 또는 "승부"를 건다.
  // 지식(정답) 위에 판단(리스크)이라는 두 번째 결정축을 얹는 것이 목적.
  BET: {
    enabled: true,
    lockOnChoose: true, // choose_open 시점에 베팅 잠금

    safe: {
      // 안전: 틀려도 가볍게 넘어간다. 대신 맞혀도 아이템뿐.
      wrongMultiplier: 0.7,
      wrongMs: 2500,
      correctBoost: 0, // 0 = 부스트 없음
      correctMs: 0,
    },
    risk: {
      // 승부: 맞히면 즉시 부스트 + 아이템. 틀리면 스핀아웃.
      wrongMultiplier: 0.3,
      wrongMs: 3500,
      correctBoost: 1.7,
      correctMs: 2500,
    },
  },
} as const;

export type BetKind = "safe" | "risk";

// --- 2. 아이템 파라미터 ---
export type ItemId = "rocket" | "shield" | "booster";

export const ITEMS: Record<ItemId, { durationMs: number; multiplier?: number }> = {
  rocket: { durationMs: 2000, multiplier: 0.4 },
  booster: { durationMs: 2000, multiplier: 1.5 },
  shield: { durationMs: 6000 },
};
