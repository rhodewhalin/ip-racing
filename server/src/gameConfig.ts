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

  // --- 코스 경계(벽) ---
  // 이전에는 코스를 벗어나면 마지막 지점으로 되돌렸다. 그런데 되돌아가자마자
  // 같은 방향으로 또 나가면 제자리로 반복해 튕겨서 "벽에 갇혀 못 움직이는" 느낌이 났다.
  // 이제는 텔레포트 대신 벽에 밀착시키고 코스 방향으로 미끄러지게 한다.
  wall: {
    enabled: true,
    margin: 10,        // 벽 안쪽 여유 (카트 반지름 + 이 값만큼 안쪽이 한계)
    slideAlign: 0.30,  // 벽에 닿으면 진행 방향을 코스 방향으로 이만큼 끌어당긴다
    speedKeep: 0.93,   // 벽을 긁을 때 남는 속도 비율 (0.93 = 매 틱 7% 손실)
    minSlideSpeed: 60, // 이 속도 아래로는 더 깎지 않는다 (완전히 멈춰 갇히는 걸 방지)
  },

  // --- 끼임 탈출 ---
  // 벽이 있어도 구석에서 못 빠져나오는 상황은 생길 수 있다. 최후의 안전장치.
  stuckSpeed: 45,
  stuckMs: 2600,

  // --- 코스 이탈 리스폰 (벽이 켜져 있으면 거의 발동하지 않는다) ---
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
