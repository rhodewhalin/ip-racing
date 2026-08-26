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
}

export const KART = {
  maxSpeed: 560,
  accel: 520,
  reverseSpeed: 200,
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

  radius: 42,
  stunSpin: 7.5,
  stunDecel: 1400,
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
    b.speed -= KART.stunDecel * dt;
    if (b.speed < 0) b.speed = 0;
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

  b.x += Math.cos(b.heading) * b.speed * dt;
  b.y += Math.sin(b.heading) * b.speed * dt;
}

/** 충전량으로 부스트 단계를 구한다. 0 = 부스트 없음, 1~3 = 단계. */
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
