// ============================================================
// 카트 물리 v2 — 순수 함수. Colyseus 의존성 없음.
//
// ⚠️ 이 파일은 client/src/physics.ts 와 **완전히 동일**해야 한다.
//    클라이언트가 같은 물리로 자기 카트를 예측해서 그리기 때문이다.
//
// v1 대비 변경:
//  ① 조향 램프 — 키를 눌러도 즉시 최대 조향이 걸리지 않는다. 약 0.15초에 걸쳐
//     차오르고, 놓으면 더 빠르게 중앙으로 돌아온다. v1의 0/1 이진 조향이
//     "조작이 어렵다"의 절반이었다.
//  ② 선회 강화 — 최고속 620/선회 2.5 → 최소 회전반경 248이었는데 트랙 반폭이
//     150이라 물리적으로 코너 통과가 불가능했다. 560/3.4 → 반경 165, 반폭 220.
//  ③ 저속 선회 하한 상향 — 0.35 → 0.5. 감속했을 때 답답함이 줄어든다.
// ============================================================

import { TrackData, project, pointAt } from "./track";

export interface KartInput {
  throttle: number; // -1 후진 / 0 / 1 가속
  steer: number;    // -1 좌 / 0 / 1 우 (키보드는 이진, 램프는 아래에서)
  drift: boolean;
}

export interface KartBody {
  x: number;
  y: number;
  heading: number;
  speed: number;
  steerActual: number; // 램프가 적용된 실제 조향값
  driftCharge: number;
  drifting: boolean;
}

export interface StepContext {
  offTrack: boolean;
  speedMul: number;
  stunned: boolean;
  /** 현재 위치에서 코스가 향하는 방향(rad). 조향 보조에 쓴다. */
  trackAngle?: number;
}

export const KART = {
  maxSpeed: 520,  // 3D 시점 + 조향 보조에 맞춰 소폭 하향. 반응할 시간을 준다.
  accel: 520,
  reverseSpeed: 250,  // 벽에서 빠져나올 때 답답하지 않도록 상향
  brake: 880,
  drag: 240,

  // 기본 그립으로는 최소 회전반경 560/2.4 ≈ 233.
  // 이보다 조인 코너는 감속하거나 드리프트해야 한다 — 이게 실력 표현의 여지다.
  turnRate: 2.4,
  lowSpeedTurn: 0.5,   // 저속에서도 이 비율만큼은 돈다
  steerRampUp: 7.0,    // 초당 조향 증가율 (1.0까지 약 0.14초)
  steerRampDown: 12.0, // 키를 놓았을 때 중앙 복귀

  // 드리프트 중 선회반경 560/(2.4×2.1) ≈ 111. 그립 한계를 확실히 넘어선다.
  // 1.55였을 때는 드리프트 이득이 1.3%에 그쳐 사실상 무의미했다.
  driftTurnMul: 2.1,
  // 드리프트에 들어가려면 조향을 확실히 넣어야 한다 (살짝 건드리는 걸로는 안 됨)
  driftSteerEnter: 0.30,
  // 드리프트 중에는 최소 이만큼 꺾인다. 직선에서 드리프트를 물고 있으면
  // 코스 밖으로 나가버린다 — "항상 드리프트"가 최적해가 되는 걸 막는 장치.
  driftMinTurn: 0.55,
  driftGripLoss: 0.032, // 초당 약 9% 감속. 0.11(초당 28%)은 드리프트를 손해로 만들었다.
  driftMinSpeed: 200,

  // 드리프트 다단 부스트 — 카트라이더 주행감의 핵심.
  // 오래 물고 있을수록 단계가 올라간다. 색이 바뀌면서 "지금 몇 단"이 보여야 한다.
  driftTiers: [
    // 문턱은 실제 코너 통과 시간(약 1~2초)에 맞춰야 한다.
    // 2.4초짜리 3단은 어떤 코너에서도 도달 불가능했다.
    { need: 0.50, mul: 1.30, ms: 900,  color: 0x66c2ff }, // 1단 파랑
    { need: 1.10, mul: 1.50, ms: 1450, color: 0xff8a3d }, // 2단 주황
    { need: 1.80, mul: 1.72, ms: 2100, color: 0xff4d6d }, // 3단 빨강
  ],

  offTrackMul: 0.7,    // v1은 0.55. 리스폰이 있으니 즉발 페널티는 완화.
  offTrackDrag: 500,

  // --- 조향 보조 ---
  // 키보드 좌우만으로 코너를 도는 건 생각보다 어렵다.
  // 조향을 놓으면 카트가 코스 방향으로 부드럽게 정렬된다.
  // 이게 있으면 "손을 떼면 알아서 펴진다"는 안정감이 생긴다.
  assistRate: 2.2,        // 초당 정렬 속도(rad). 4.2는 무입력 자율주행이 돼버렸다.
  assistMaxAngle: 1.0,    // 이보다 크게 어긋나 있으면 보조하지 않는다(역주행 방지)
  assistWhileSteering: 0.6,  // 조향 중에도 이 비율만큼은 보조

  radius: 42,
  // 피격은 "완전 정지"가 아니라 "스핀아웃"이어야 한다.
  // 이전 값(감속 1400, 하한 0)은 0.37초 만에 차를 세워버렸고,
  // 3.2초 동안 제자리에서 도는 바람에 "차가 멈췄다"로 보였다.
  stunSpin: 5.4,
  stunDecel: 620,
  stunGlide: 150,   // 스핀 중에도 이 속도로는 계속 미끄러진다
} as const;

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/** 조향 램프. 목표값으로 서서히 다가가고, 중앙 복귀는 더 빠르게. */
function rampSteer(current: number, target: number, dt: number): number {
  const towardCenter = Math.abs(target) < Math.abs(current) || target * current < 0;
  const rate = towardCenter ? KART.steerRampDown : KART.steerRampUp;
  const d = target - current;
  const step = rate * dt;
  if (Math.abs(d) <= step) return target;
  return current + Math.sign(d) * step;
}

export function stepKart(b: KartBody, input: KartInput, dt: number, ctx: StepContext) {
  if (ctx.stunned) {
    // 완전히 세우지 않고 활강 속도까지만 줄인다 = 미끄러지며 도는 스핀아웃
    if (b.speed > KART.stunGlide) b.speed -= KART.stunDecel * dt;
    else if (b.speed < KART.stunGlide) b.speed = Math.min(KART.stunGlide, b.speed + KART.accel * dt);
    b.heading += KART.stunSpin * dt;
    b.drifting = false;
    b.driftCharge = 0;
    b.steerActual = 0;
    b.x += Math.cos(b.heading) * b.speed * dt;
    b.y += Math.sin(b.heading) * b.speed * dt;
    return;
  }

  const topSpeed = KART.maxSpeed * ctx.speedMul * (ctx.offTrack ? KART.offTrackMul : 1);

  if (input.throttle > 0) b.speed += KART.accel * dt;
  else if (input.throttle < 0) b.speed -= KART.brake * dt;
  else {
    const d = KART.drag * dt;
    b.speed = b.speed > 0 ? Math.max(0, b.speed - d) : Math.min(0, b.speed + d);
  }

  if (ctx.offTrack && b.speed > topSpeed) b.speed -= KART.offTrackDrag * dt;
  b.speed = clamp(b.speed, -KART.reverseSpeed, Math.max(topSpeed, 0));

  // 조향 램프
  b.steerActual = rampSteer(b.steerActual, clamp(input.steer, -1, 1), dt);

  const fast = Math.abs(b.speed) > KART.driftMinSpeed;
  const turning = Math.abs(b.steerActual) > KART.driftSteerEnter;
  b.drifting = input.drift && fast && turning;

  // 드리프트는 "커브에 몸을 맡기는" 동작이다. 일단 물면 최소 회전량이 강제된다.
  let effSteer = b.steerActual;
  if (b.drifting) {
    const sgn = b.steerActual >= 0 ? 1 : -1;
    effSteer = sgn * Math.max(Math.abs(b.steerActual), KART.driftMinTurn);
  }

  const speedFactor = clamp(Math.abs(b.speed) / KART.maxSpeed, 0, 1);
  const dir = b.speed >= 0 ? 1 : -1;
  const turn =
    effSteer *
    KART.turnRate *
    (KART.lowSpeedTurn + (1 - KART.lowSpeedTurn) * speedFactor) *
    (b.drifting ? KART.driftTurnMul : 1) *
    dir;
  b.heading += turn * dt;

  if (b.drifting) {
    b.driftCharge += dt;
    b.speed *= 1 - KART.driftGripLoss * dt * 3;
  }

  // 조향 보조: 코스 방향으로 살짝 끌어당긴다.
  // 드리프트 중에는 끄는 게 맞다 — 일부러 미끄러뜨리는 동작이니까.
  if (ctx.trackAngle !== undefined && !b.drifting && Math.abs(b.speed) > 90) {
    let d = ctx.trackAngle - b.heading;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;

    if (Math.abs(d) < KART.assistMaxAngle) {
      const steering = Math.abs(b.steerActual) > 0.15;
      const scale = steering ? KART.assistWhileSteering : 1;
      b.heading += clamp(d, -1, 1) * KART.assistRate * scale * speedFactor * dt;
    }
  }

  b.x += Math.cos(b.heading) * b.speed * dt;
  b.y += Math.sin(b.heading) * b.speed * dt;
}

/** 충전량으로 부스트 단계를 구한다. 0 = 부스트 없음, 1~3 = 단계. */
// ============================================================
// 벽 처리
//
// ⚠️ 서버와 클라이언트가 **같은 함수**를 써야 한다.
//    이전 버전은 벽 로직이 서버에만 있었다. 그래서 클라이언트 예측은 벽을
//    뚫고 나가려 하고 서버는 계속 안으로 되돌려서, 화면상으로는 카트가
//    제자리에서 부들거리며 전혀 안 나가는 것처럼 보였다.
// ============================================================

export const WALL = {
  margin: 10,
  slideAlign: 0.30,  // 벽에 닿았을 때 진행 방향을 코스 축으로 끌어당기는 비율
  speedKeep: 0.93,   // 긁을 때 남는 속도
  minSlideSpeed: 60, // 이 아래로는 더 깎지 않는다 (완전 정지 방지)
} as const;

export function wallLimit(t: TrackData): number {
  return t.width / 2 - KART.radius - WALL.margin;
}

/**
 * 카트를 코스 안으로 밀어 넣고 벽을 따라 미끄러지게 한다.
 * @returns 벽에 닿았으면 true
 *
 * 좌표를 offsetPoint(s, ±limit) 로 "다시 계산"하지 않는 것이 중요하다.
 * 코너 안쪽에서는 여러 위치가 같은 s로 투영돼 매 틱 같은 자리로 되돌려진다.
 * 대신 지금 좌표에서 법선 방향으로 초과분만큼만 밀어 넣는다.
 */
export function applyWall(t: TrackData, b: KartBody, input: KartInput): boolean {
  const limit = wallLimit(t);
  const pr = project(t, b.x, b.y);
  if (Math.abs(pr.lateral) <= limit) return false;

  const side = pr.lateral >= 0 ? 1 : -1;
  const g = pointAt(t, pr.s);
  const nx = -Math.sin(g.angle), ny = Math.cos(g.angle);
  const delta = side * limit - pr.lateral;
  b.x += nx * delta;
  b.y += ny * delta;

  // 후진으로 빠져나오려는 중이면 방향을 건드리지 않는다.
  // 이게 없으면 벽이 카트를 계속 돌려세워서 영영 못 빠져나온다.
  if (input.throttle >= 0) {
    let d = g.angle - b.heading;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    if (b.speed < 0) d = d > 0 ? d - Math.PI : d + Math.PI;
    b.heading += Math.max(-1, Math.min(1, d)) * WALL.slideAlign;
  }

  if (Math.abs(b.speed) > WALL.minSlideSpeed) b.speed *= WALL.speedKeep;
  return true;
}

// ============================================================
// 카트 충돌
//
// ⚠️ 벽과 같은 이유로 **서버·클라이언트가 같은 함수**를 써야 한다.
//    이전엔 서버에만 있어서, 화면에서는 상대 차를 그냥 통과했다.
//    부딪힌 감각이 전혀 없었던 이유다.
// ============================================================

export const BUMP = {
  minDist: KART.radius * 2,  // 84
  speedKeep: 0.86,           // 부딪히면 속도 손실
  shove: 0.20,               // 진행 방향이 밀려나는 정도
  minSeparate: 0.5,
} as const;

/**
 * b 를 (ox, oy) 에 있는 다른 카트 밖으로 밀어낸다.
 * @param share 1 = 나만 밀려남(클라이언트 예측), 0.5 = 양쪽이 절반씩(서버)
 * @returns 접촉했으면 true
 */
export function resolveBump(
  b: KartBody, ox: number, oy: number, share = 1
): boolean {
  const dx = b.x - ox, dy = b.y - oy;
  let d = Math.hypot(dx, dy);
  if (d >= BUMP.minDist) return false;
  if (d < 0.0001) { d = 0.0001; }

  const nx = dx / d, ny = dy / d;
  const push = (BUMP.minDist - d) * share;
  b.x += nx * push;
  b.y += ny * push;

  // 진행 방향을 밀려난 쪽으로 살짝 틀고 속도를 깎는다.
  // 위치만 떼어놓으면 "스치는" 느낌만 나고 부딪힌 감각이 안 산다.
  const away = Math.atan2(ny, nx);
  let diff = away - b.heading;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  if (Math.abs(diff) < Math.PI / 2) {
    b.heading += Math.max(-1, Math.min(1, diff)) * BUMP.shove;
  }
  if (Math.abs(b.speed) > 80) b.speed *= BUMP.speedKeep;
  return true;
}

export function driftTier(charge: number): number {
  let tier = 0;
  for (let i = 0; i < KART.driftTiers.length; i++) {
    if (charge >= KART.driftTiers[i].need) tier = i + 1;
  }
  return tier;
}

export function driftTierInfo(tier: number) {
  return KART.driftTiers[tier - 1] ?? null;
}
