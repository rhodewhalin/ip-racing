// ============================================================
// 대규모 완주 시뮬레이션
//
// 서버 update() 루프를 그대로 재현한다:
//   물리 → 드리프트 부스트 → 벽 → 끼임 리스폰 → 체크포인트 랩 판정
//   + 퀴즈 효과(부스트/감속) + 물폭탄 스핀 + 아이템
//
// 목적: "어떤 주행 패턴이든 완주가 되는가"를 수천 회로 검증.
// ============================================================

import {
  buildTrack, projectHinted, pointAt, offsetPoint,
  TRACK_POINTS, TRACK_WIDTH, TrackData,
} from "./src/track";
import { stepKart, KartBody, KART, applyWall, driftTier, driftTierInfo } from "./src/physics";
import { CONFIG } from "./src/gameConfig";

const dt = 1 / CONFIG.tickHz;
const track = buildTrack(TRACK_POINTS, TRACK_WIDTH);

export interface Profile {
  name: string;
  lookahead: number;
  gain: number;
  reactTicks: number;   // 반응 지연
  inputHz: number;      // 초당 조향 입력 횟수
  driftChance: number;
  brakeSkill: number;   // 0 = 브레이크 안 씀
  quizAccuracy: number;
  idleChance: number;   // 가끔 손을 놓는 정도
  quizLiftSec: number;  // 문제를 읽느라 액셀에서 손을 떼는 시간
  quizStop: boolean;    // 아예 브레이크까지 밟는가
}

export interface RaceResult {
  finished: boolean;
  timeSec: number;
  laps: number;
  respawns: number;
  wallTicks: number;
  stunCount: number;
  maxStallMs: number;
  maxNoAdvanceSec: number;
}

function curvature(t: TrackData, s: number, span = 260): number {
  const a = offsetPoint(t, s + span * 0.5, 0);
  const b = offsetPoint(t, s + span * 1.5, 0);
  const c = offsetPoint(t, s + span * 2.5, 0);
  const A = Math.hypot(b.x - a.x, b.y - a.y);
  const B = Math.hypot(c.x - b.x, c.y - b.y);
  const C = Math.hypot(c.x - a.x, c.y - a.y);
  const ar = Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;
  return ar < 1e-6 ? 1e6 : (A * B * C) / (4 * ar);
}

export function simulateRace(p: Profile, maxSec: number, rng: () => number, lapsOverride?: number): RaceResult {
  const LAPS = lapsOverride ?? CONFIG.laps;
  const sp = offsetPoint(track, 80, (rng() - 0.5) * 180);
  const b: KartBody = {
    x: sp.x, y: sp.y, heading: sp.angle, speed: 0,
    steerActual: 0, driftCharge: 0, drifting: false,
  };

  let hint = 0;
  let lap = 0, prevS = projectHinted(track, b.x, b.y, 0).s;
  let halfPassed = false;
  let speedMul = 1, boostMs = 0, stunMs = 0;
  let wasDrift = false, driftHold = 0;
  let stuckMs = 0, respawns = 0, wallTicks = 0, stunCount = 0;
  let stallMs = 0, maxStallMs = 0;
  let lastAdvanceTick = 0, maxNoAdvanceSec = 0;
  let quizCooldown = 0;
  let liftUntil = -1;
  const hist: number[] = [];
  let heldSteer = 0, sinceInput = 0;

  const maxTicks = Math.floor(maxSec * CONFIG.tickHz);

  for (let i = 0; i < maxTicks; i++) {
    // --- 상태 타이머 ---
    stunMs = Math.max(0, stunMs - dt * 1000);
    boostMs = Math.max(0, boostMs - dt * 1000);
    if (boostMs <= 0) speedMul = 1;
    quizCooldown = Math.max(0, quizCooldown - dt * 1000);

    let pr = projectHinted(track, b.x, b.y, hint);
    hint = pr.index;

    // --- 무작위 이벤트: 물폭탄/기름 피격 (평균 12초에 한 번) ---
    if (stunMs <= 0 && rng() < dt / 12) {
      stunMs = rng() < 0.5 ? CONFIG.stunMs : CONFIG.oilSpinMs;
      stunCount++;
    }

    // --- 무작위 이벤트: 픽업 → 퀴즈 결과 (평균 7초에 한 번) ---
    if (quizCooldown <= 0 && rng() < dt / 7) {
      quizCooldown = CONFIG.quizCooldownMs;
      const right = rng() < p.quizAccuracy;
      // 실제 사람은 문제를 읽는 동안 액셀에서 손을 뗀다. 이게 랩타임을 크게 늘린다.
      liftUntil = i + p.quizLiftSec * CONFIG.tickHz;
      if (rng() < 0.4) {
        // IP 블록: 정답이면 부스트, 오답이면 감속
        speedMul = right ? CONFIG.blockCorrectBoost : CONFIG.blockWrongMul;
        boostMs = right ? CONFIG.blockCorrectMs : CONFIG.blockWrongMs;
      } else if (right && rng() < 0.35) {
        // 아이템 부스터 사용
        speedMul = CONFIG.boostMul;
        boostMs = CONFIG.boostMs;
      }
    }

    // --- 조향 입력 (반응 지연 + 낮은 입력 빈도) ---
    const look = p.lookahead + Math.abs(b.speed) * 0.35;
    const aim = offsetPoint(track, pr.s + look, 0);
    let d = Math.atan2(aim.y - b.y, aim.x - b.x) - b.heading;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    hist.push(d);
    const seen = hist.length > p.reactTicks ? hist[hist.length - 1 - p.reactTicks] : 0;

    sinceInput += dt;
    if (sinceInput >= 1 / p.inputHz) {
      sinceInput = 0;
      heldSteer = Math.abs(seen) < 0.05 ? 0 : Math.max(-1, Math.min(1, seen * p.gain));
      if (rng() < p.idleChance) heldSteer = 0;
    }

    // --- 스로틀 (브레이크 실력 반영) ---
    const R = curvature(track, pr.s);
    const turnCap = KART.turnRate * (driftHold > 0 ? KART.driftTurnMul : 1);
    const cornerSpeed = R * turnCap;
    const target = Math.min(KART.maxSpeed * speedMul, cornerSpeed / Math.max(0.35, p.brakeSkill));
    let throttle = 1;
    if (p.brakeSkill > 0 && b.speed > target * 1.1) throttle = -1;
    if (i < liftUntil) throttle = p.quizStop ? -1 : 0;

    // --- 드리프트 ---
    if (R < 1100 && Math.abs(b.speed) > KART.driftMinSpeed + 40 && driftHold <= 0) {
      if (rng() < p.driftChance * dt * 12) driftHold = 0.6 + rng() * 1.5;
    }
    if (driftHold > 0) { driftHold -= dt; if (R > 1600) driftHold = 0; }

    const input = { throttle, steer: heldSteer, drift: driftHold > 0 };

    // --- 물리 ---
    const before = { x: b.x, y: b.y };
    stepKart(b, input, dt, {
      offTrack: false, speedMul, stunned: stunMs > 0,
      trackAngle: pointAt(track, pr.s).angle,
    });

    // --- 드리프트 부스트 ---
    if (wasDrift && !b.drifting) {
      const info = driftTierInfo(driftTier(b.driftCharge));
      if (info) { speedMul = info.mul; boostMs = info.ms; }
    }
    wasDrift = b.drifting;
    if (!b.drifting) b.driftCharge = 0;

    // --- 벽 ---
    if (applyWall(track, b, input)) wallTicks++;
    pr = projectHinted(track, b.x, b.y, hint);
    hint = pr.index;

    // --- 스핀 종료 시 방향 보정 ---
    if (stunMs > 0 && stunMs - dt * 1000 <= 0) {
      b.heading = pointAt(track, pr.s).angle;
      b.speed = Math.max(b.speed, 170);
    }

    // --- 끼임 리스폰 ---
    if (stunMs <= 0) {
      let ds = pr.s - prevS;
      if (ds < -track.total / 2) ds += track.total;
      if (ds > track.total / 2) ds -= track.total;
      const trying = CONFIG.stuckNeedsThrottle ? input.throttle > 0 : (Math.abs(b.speed) > 40 || input.throttle !== 0);
      stuckMs = (ds < CONFIG.stuckProgress && trying) ? stuckMs + dt * 1000 : 0;
      if (stuckMs > CONFIG.stuckMs) {
        stuckMs = 0; respawns++;
        const q = offsetPoint(track, pr.s + 140, 0);
        b.x = q.x; b.y = q.y; b.heading = q.angle;
        b.speed = Math.min(Math.abs(b.speed), CONFIG.respawnSpeed);
        b.steerActual = 0;
        pr = projectHinted(track, b.x, b.y, hint);
        hint = pr.index;
        prevS = pr.s;
        continue;
      }
    }

    // 실제 이동량 기준 정지 추적
    const moved = Math.hypot(b.x - before.x, b.y - before.y);
    if (stunMs <= 0 && moved < 0.4) { stallMs += dt * 1000; maxStallMs = Math.max(maxStallMs, stallMs); }
    else stallMs = 0;

    // --- 랩 ---
    if (pr.s > track.total * 0.45 && pr.s < track.total * 0.6) halfPassed = true;
    const crossed = prevS > track.total * 0.75 && pr.s < track.total * 0.25;
    if (crossed && halfPassed) {
      halfPassed = false;
      lap++;
      if (lap >= LAPS) {
        return { finished: true, timeSec: (i + 1) / CONFIG.tickHz, laps: lap, respawns, wallTicks, stunCount, maxStallMs, maxNoAdvanceSec };
      }
    } else if (prevS < track.total * 0.25 && pr.s > track.total * 0.75) {
      lap = Math.max(0, lap - 1);
      halfPassed = true;
    }
    {
      let adv = pr.s - prevS;
      if (adv < -track.total / 2) adv += track.total;
      if (adv > track.total / 2) adv -= track.total;
      if (adv > 1) lastAdvanceTick = i;
      maxNoAdvanceSec = Math.max(maxNoAdvanceSec, (i - lastAdvanceTick) / CONFIG.tickHz);
    }
    prevS = pr.s;
  }

  return { finished: false, timeSec: maxSec, laps: lap, respawns, wallTicks, stunCount, maxStallMs, maxNoAdvanceSec };
}

/** 재현 가능한 난수 */
export function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const PROFILES: Profile[] = [
  { name: "숙련자        ", lookahead: 400, gain: 2.2, reactTicks: 2,  inputHz: 20, driftChance: 0.9, brakeSkill: 0.9, quizAccuracy: 0.85, idleChance: 0.00, quizLiftSec: 0, quizStop: false },
  { name: "보통          ", lookahead: 430, gain: 1.8, reactTicks: 5,  inputHz: 10, driftChance: 0.5, brakeSkill: 0.7, quizAccuracy: 0.6,  idleChance: 0.03, quizLiftSec: 1, quizStop: false },
  { name: "초보          ", lookahead: 460, gain: 1.4, reactTicks: 9,  inputHz: 5,  driftChance: 0.2, brakeSkill: 0.3, quizAccuracy: 0.4,  idleChance: 0.08, quizLiftSec: 2, quizStop: false },
  { name: "완전초보      ", lookahead: 520, gain: 1.0, reactTicks: 14, inputHz: 3,  driftChance: 0.0, brakeSkill: 0.0, quizAccuracy: 0.3,  idleChance: 0.15, quizLiftSec: 3, quizStop: false },
  { name: "엉망          ", lookahead: 600, gain: 0.7, reactTicks: 20, inputHz: 2,  driftChance: 0.0, brakeSkill: 0.0, quizAccuracy: 0.2,  idleChance: 0.30, quizLiftSec: 3, quizStop: false },
  { name: "문제읽느라정지", lookahead: 500, gain: 1.2, reactTicks: 12, inputHz: 4,  driftChance: 0.0, brakeSkill: 0.4, quizAccuracy: 0.5,  idleChance: 0.10, quizLiftSec: 5, quizStop: true },
  { name: "매번완전정지  ", lookahead: 520, gain: 1.0, reactTicks: 16, inputHz: 3,  driftChance: 0.0, brakeSkill: 0.6, quizAccuracy: 0.4,  idleChance: 0.20, quizLiftSec: 6, quizStop: true },
  { name: "거의방치      ", lookahead: 600, gain: 0.5, reactTicks: 26, inputHz: 1.5,driftChance: 0.0, brakeSkill: 0.0, quizAccuracy: 0.2,  idleChance: 0.50, quizLiftSec: 4, quizStop: true },
];
