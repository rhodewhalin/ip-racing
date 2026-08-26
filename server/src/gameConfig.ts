// ============================================================
// IP Racing — Stage 2 (카트 주행 전면 재작성)
// 밸런스는 전부 여기에. 물리 상수만 physics.ts 의 KART 에 있다.
// ============================================================

export const CONFIG = {
  tickHz: 30,          // 서버 시뮬레이션. 주행 게임이라 10Hz로는 못 버틴다.
  maxClients: 4,
  minClients: 2,       // 2~4인 유연
  laps: 3,
  countdownMs: 3000,
  finishGraceMs: 12000, // 1등 골인 후 나머지 대기 시간

  // --- 퀴즈 ---
  // 핵심: 퀴즈는 레이스를 멈추지 않는다. 플레이어별로 따로 뜬다.
  quizMs: 5000,
  quizCooldownMs: 2500, // 연속 출제 방지

  // --- 픽업 ---
  itemBoxRespawnMs: 6000,
  ipBlockRespawnMs: 12000,
  pickupRadius: 62,

  // 트랙 진행률(0~1) 기준 배치
  itemBoxAt: [0.07, 0.20, 0.33, 0.46, 0.59, 0.72, 0.85],
  ipBlockAt: [0.14, 0.40, 0.66, 0.91],

  // --- 퀴즈 결과 효과 ---
  blockCorrectBoost: 1.35,
  blockCorrectMs: 1600,
  blockWrongMul: 0.78,
  blockWrongMs: 1400,

  // --- 아이템 ---
  stunMs: 3200,        // 물폭탄 피격
  oilSpinMs: 1600,     // 기름 밟음
  shieldMs: 7000,
  boostMul: 1.5,
  boostMs: 1800,
  oilArmMs: 700,       // 설치 직후 자기 자신 면역

  // --- 충돌 ---
  kartPushForce: 260,

  // --- 코스 이탈 리스폰 ---
  // 잔디에서 잠깐 헤매는 건 허용하되, 길을 잃으면 코스로 되돌린다.
  respawnAfterMs: 1200,   // 이탈 상태가 이만큼 이어지면 복귀
  respawnFarMul: 0.7,     // 중심선에서 308(=440×0.7)만큼 벗어나면 즉시 복귀
  respawnSpeed: 190,      // 복귀 직후 속도 (완전 정지는 답답하다)
  respawnBlinkMs: 900,    // 무적/깜빡임

  // --- AI 봇 ---
  // 혼자서도 테스트/플레이가 되도록. 사람이 부족하면 자동으로 채운다.
  bots: {
    enabled: true,
    fillTo: 4,          // 이 인원이 되도록 봇을 채운다
    addDelayMs: 900,    // 카운트다운 직전 투입
    names: ["김특허", "이상표", "박디자인", "최저작"],
    // 난이도: 예측거리·조향감도·코너감속·드리프트 사용률
    levels: [
      { label: "쉬움", lookahead: 560, gain: 1.1, cornerBrake: 0.55, driftSkill: 0.2, speedCap: 0.86 },
      { label: "보통", lookahead: 460, gain: 1.6, cornerBrake: 0.75, driftSkill: 0.6, speedCap: 0.95 },
      { label: "어려움", lookahead: 400, gain: 2.1, cornerBrake: 0.9, driftSkill: 0.9, speedCap: 1.0 },
    ],
    defaultLevel: 1,
    quizAccuracy: 0.6,   // 봇의 퀴즈 정답률
    quizDelayMs: [900, 2600], // 봇이 답하기까지 걸리는 시간 범위
    itemUseDelayMs: [400, 1800],
  },
} as const;

export type ItemId = "bomb" | "boost" | "oil" | "shield";
export type QuizKind = "item" | "block" | "escape";
