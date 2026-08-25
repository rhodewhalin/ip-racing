// ============================================================
// 카트 물리 — 순수 함수. Colyseus 의존성 없음.
//
// ⚠️ 이 파일은 client/src/physics.ts 와 **완전히 동일**해야 한다.
//    클라이언트가 같은 물리로 자기 카트를 예측(prediction)해서 그리기 때문에,
//    한쪽만 고치면 내 카트가 계속 미끄러지듯 보정되는 현상이 생긴다.
//    고칠 일이 있으면 반드시 양쪽을 같이 고칠 것.
// ============================================================

export interface KartInput {
  throttle: number; // -1 후진 / 0 / 1 가속
  steer: number;    // -1 좌 / 0 / 1 우
  drift: boolean;
}

export interface KartBody {
  x: number;
  y: number;
  heading: number;   // rad
  speed: number;     // units/sec
  driftCharge: number; // 드리프트 누적 시간(sec)
  drifting: boolean;
}

export interface StepContext {
  offTrack: boolean;
  speedMul: number; // 부스트/디버프 배수
  stunned: boolean;
}

export const KART = {
  maxSpeed: 620,
  accel: 560,
  reverseSpeed: 220,
  brake: 900,
  drag: 240,

  turnRate: 2.5,      // rad/sec (최고속 기준)
  driftTurnMul: 1.7,  // 드리프트 중 조향 배수
  driftGripLoss: 0.14, // 드리프트 중 감속 계수
  driftMinSpeed: 220,

  driftChargeNeed: 1.1, // 부스트 발동에 필요한 드리프트 시간(sec)
  driftBoostMul: 1.35,
  driftBoostMs: 1200,

  offTrackMul: 0.55,
  offTrackDrag: 700,

  radius: 42,
  stunSpin: 7.5, // rad/sec
  stunDecel: 1400,
} as const;

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/** 카트 한 스텝 적분. body를 직접 변형한다. */
export function stepKart(b: KartBody, input: KartInput, dt: number, ctx: StepContext) {
  // 스턴: 조작 불가 + 제자리 스핀. 물폭탄 맞은 상태.
  if (ctx.stunned) {
    b.speed -= KART.stunDecel * dt;
    if (b.speed < 0) b.speed = 0;
    b.heading += KART.stunSpin * dt;
    b.drifting = false;
    b.driftCharge = 0;
    b.x += Math.cos(b.heading) * b.speed * dt;
    b.y += Math.sin(b.heading) * b.speed * dt;
    return;
  }

  const topSpeed = KART.maxSpeed * ctx.speedMul * (ctx.offTrack ? KART.offTrackMul : 1);

  if (input.throttle > 0) b.speed += KART.accel * dt;
  else if (input.throttle < 0) b.speed -= KART.brake * dt;
  else {
    // 코스팅: 0으로 수렴
    const d = KART.drag * dt;
    b.speed = b.speed > 0 ? Math.max(0, b.speed - d) : Math.min(0, b.speed + d);
  }

  // 잔디/모래에서는 초과 속도를 빠르게 깎는다 (부스트로 잠깐 가로지르는 건 가능)
  if (ctx.offTrack && b.speed > topSpeed) b.speed -= KART.offTrackDrag * dt;

  b.speed = clamp(b.speed, -KART.reverseSpeed, Math.max(topSpeed, 0));

  // 드리프트 판정
  const fast = Math.abs(b.speed) > KART.driftMinSpeed;
  const turning = Math.abs(input.steer) > 0.1;
  b.drifting = input.drift && fast && turning;

  // 조향: 저속에서는 잘 안 돈다. 후진 시 반대로.
  const speedFactor = clamp(Math.abs(b.speed) / KART.maxSpeed, 0, 1);
  const dir = b.speed >= 0 ? 1 : -1;
  const turn =
    input.steer *
    KART.turnRate *
    (0.35 + 0.65 * speedFactor) *
    (b.drifting ? KART.driftTurnMul : 1) *
    dir;
  b.heading += turn * dt;

  if (b.drifting) {
    b.driftCharge += dt;
    b.speed *= 1 - KART.driftGripLoss * dt * 3; // 미끄러지는 대신 조금 느려진다
  }

  b.x += Math.cos(b.heading) * b.speed * dt;
  b.y += Math.sin(b.heading) * b.speed * dt;
}

/** 드리프트를 놓는 순간 부스트가 터지는가 */
export function driftReleaseBoost(charge: number): boolean {
  return charge >= KART.driftChargeNeed;
}
