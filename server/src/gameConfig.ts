// ============================================================
// IP Racing — Stage 2 (카트 주행 전면 재작성)
// 밸런스는 전부 여기에. 물리 상수만 physics.ts 의 KART 에 있다.
// ============================================================

export const CONFIG = {
  tickHz: 30,          // 서버 시뮬레이션. 주행 게임이라 10Hz로는 못 버틴다.
  maxClients: 4,
  minClients: 2,       // 2~4인 유연
  // 3바퀴에서 2바퀴로. 무작위 프로파일 6,000회 비교 결과:
  //   3바퀴 → 완주율 97.15%, 중앙값 159초, 5분 초과 16.8%
  //   2바퀴 → 완주율 99.07%, 중앙값 104초, 5분 초과  8.1%
  // 사내 행사에서 한 판이 5분을 넘기면 회전이 안 된다.
  laps: 2,
  countdownMs: 3000,
  // ⚠️ 이전에는 "첫 골인 후 12초"였다. 봇은 60초, 사람은 90~120초가 걸리므로
  //    사람이 달리는 도중에 레이스가 끝나버렸다.
  humanGraceMs: 8000,  // 마지막 '사람'이 골인한 뒤 결과까지 대기
  // ⚠️ 이전엔 4분 하드 종료였다. 그런데 문제를 읽느라 차를 세우는 사람은
  //    3바퀴에 중앙값 233초, 90퍼센타일 363초가 걸린다.
  //    즉 "문제를 꼼꼼히 읽는 사람일수록 완주 전에 끊기는" 구조였다.
  //    이제는 시간이 아니라 **진행 여부**로 판단한다.
  afkMs: 120000,       // 모든 사람이 2분간 한 발짝도 못 나가면 종료
  maxRaceMs: 900000,   // 절대 상한 15분 (사실상 발동하지 않음)

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
  stunMs: 2200,        // 물폭탄 피격 (3200은 너무 길어 '멈췄다'는 인상을 줬다)
  oilSpinMs: 1300,     // 기름 밟음
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
  // 세부 수치는 physics.ts 의 WALL 에 있다.
  // 서버와 클라이언트 예측이 같은 함수(applyWall)를 써야 하기 때문이다.
  wall: { enabled: true },

  // --- 끼임 탈출 ---
  // 벽이 있어도 구석에서 못 빠져나오는 상황은 생길 수 있다. 최후의 안전장치.
  // 틱당 이 거리보다 덜 나아가면 "끼임"으로 본다 (30Hz 기준, 속도 60 상당)
  stuckProgress: 2.0,
  stuckMs: 1600,
  // 앞으로 가려는데 못 갈 때만 끼임이다. 문제를 읽으려 브레이크를 밟고
  // 서 있는 사람까지 잡으면 안 된다 (실측 리스폰 36~58회가 그 때문이었다).
  stuckNeedsThrottle: true,

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
