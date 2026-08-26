// ============================================================
// AI 봇 드라이버
//
// 왜 필요한가: 지금까지는 사람 2명이 모여야 테스트조차 못 했다.
//   봇이 들어가면 혼자서도 4인전이 돌아가고, 이후 모든 튜닝이 빨라진다.
//
// 주행 방식 (사람이 하는 것과 같은 입력만 사용한다 — 치트 없음):
//  ① 앞쪽 중심선을 바라보고 조향
//  ② 앞쪽 곡률을 미리 재서 코너 전에 감속
//  ③ 각도가 크게 벌어지면 드리프트를 물었다 놓아 부스트
// ============================================================

import { TrackData, project, offsetPoint } from "./track";
import { KartInput, KART } from "./physics";

export interface BotLevel {
  label: string;
  lookahead: number;   // 몇 units 앞을 보는가 (짧을수록 반응이 날카롭다)
  gain: number;        // 조향 감도
  cornerBrake: number; // 코너 감속 정확도 (1에 가까울수록 한계까지 붙인다)
  driftSkill: number;  // 드리프트 사용 빈도 0~1
  speedCap: number;    // 최고속 대비 목표 속도 비율
}

export class BotDriver {
  private wobble: number;
  private driftHold = 0;
  private noiseT = 0;

  constructor(public level: BotLevel, seed = Math.random()) {
    // 봇마다 살짝 다른 버릇을 준다. 넷이 똑같이 달리면 티가 난다.
    this.wobble = (seed - 0.5) * 0.5;
  }

  /** 현재 상태를 보고 사람과 동일한 형태의 입력을 만든다. */
  think(track: TrackData, kart: { x: number; y: number; heading: number; speed: number; speedMul?: number }, dt: number): KartInput {
    this.noiseT += dt;
    const pr = project(track, kart.x, kart.y);

    // ① 조향: 앞쪽 목표점을 향해
    const look = this.level.lookahead + Math.abs(kart.speed) * 0.35;
    const aim = offsetPoint(track, pr.s + look, this.wobble * 60);
    let diff = Math.atan2(aim.y - kart.y, aim.x - kart.x) - kart.heading;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    // 코스 밖이면 중심선으로 강하게 복귀
    if (pr.offTrack) {
      const back = offsetPoint(track, pr.s + 200, 0);
      let d2 = Math.atan2(back.y - kart.y, back.x - kart.x) - kart.heading;
      while (d2 > Math.PI) d2 -= Math.PI * 2;
      while (d2 < -Math.PI) d2 += Math.PI * 2;
      diff = d2;
    }

    const steer = clamp(diff * this.level.gain, -1, 1);

    // ② 코너 감속: 앞쪽 곡률에서 통과 가능 속도를 역산
    //    드리프트 중에는 선회력이 1.55배라 더 빠르게 통과할 수 있다.
    const R = curvatureAhead(track, pr.s, 260);
    const turnCap = KART.turnRate * (this.driftHold > 0 ? KART.driftTurnMul : 1);
    const cornerSpeed = R * turnCap * this.level.cornerBrake;
    // ⚠️ 부스트 중에는 최고속이 올라간다. 이걸 반영하지 않으면 봇이 부스트를 받고도
    //    "너무 빠르다"고 판단해 액셀을 떼버린다. 드리프트 보상을 스스로 버리는 셈.
    const top = KART.maxSpeed * (kart.speedMul ?? 1) * this.level.speedCap;
    const target = Math.min(top, cornerSpeed);

    let throttle = 1;
    if (kart.speed > target * 1.1) throttle = -1;      // 브레이크
    else if (kart.speed > target) throttle = 0;         // 관성 주행

    // ③ 드리프트: 앞쪽 곡률로 판단한다.
    //    각도 편차로 판단하면, 조향이 좋은 봇일수록 편차가 안 생겨서
    //    드리프트를 아예 안 쓰는 역설이 생긴다 (실제로 그랬다).
    const tightCorner = R < 1100;
    const fastEnough = Math.abs(kart.speed) > KART.driftMinSpeed + 40;

    if (tightCorner && fastEnough && !pr.offTrack && this.driftHold <= 0) {
      if (Math.random() < this.level.driftSkill * dt * 12) {
        this.driftHold = 0.6 + Math.random() * 1.6;
      }
    }
    if (this.driftHold > 0) {
      this.driftHold -= dt;
      // 코너가 다 펴졌으면 미련 없이 놓는다
      if (R > 1600) this.driftHold = 0;
    }

    return { throttle, steer, drift: this.driftHold > 0 };
  }
}

/** s 지점 앞쪽의 곡률 반경. 세 점의 외접원 반지름으로 근사. */
function curvatureAhead(t: TrackData, s: number, span: number): number {
  const a = offsetPoint(t, s + span * 0.5, 0);
  const b = offsetPoint(t, s + span * 1.5, 0);
  const c = offsetPoint(t, s + span * 2.5, 0);

  const A = Math.hypot(b.x - a.x, b.y - a.y);
  const B = Math.hypot(c.x - b.x, c.y - b.y);
  const C = Math.hypot(c.x - a.x, c.y - a.y);
  const area = Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;

  if (area < 1e-6) return 1e6; // 직선
  return (A * B * C) / (4 * area);
}

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
