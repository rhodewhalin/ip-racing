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

  turnRate: 3.4,       // rad/sec → 최소 회전반경 560/3.4 ≈ 165
  lowSpeedTurn: 0.5,   // 저속에서도 이 비율만큼은 돈다
  steerRampUp: 7.0,    // 초당 조향 증가율 (1.0까지 약 0.14초)
  steerRampDown: 12.0, // 키를 놓았을 때 중앙 복귀

  driftTurnMul: 1.55,
  driftGripLoss: 0.11,
  driftMinSpeed: 200,

  driftChargeNeed: 0.9,
  driftBoostMul: 1.4,
  driftBoostMs: 1300,

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
  const turning = Math.abs(b.steerActual) > 0.15;
  b.drifting = input.drift && fast && turning;

  const speedFactor = clamp(Math.abs(b.speed) / KART.maxSpeed, 0, 1);
  const dir = b.speed >= 0 ? 1 : -1;
  const turn =
    b.steerActual *
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

export function driftReleaseBoost(charge: number): boolean {
  return charge >= KART.driftChargeNeed;
}
