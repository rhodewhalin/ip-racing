// ============================================================
// 트랙 지오메트리 v2
//
// v1의 문제: 제어점 20개를 직선으로 이어서 코너가 전부 "각진 꼭짓점"이었다.
//   63° 꼭짓점에는 돌아나갈 곡선 길이가 0이라 물리적으로 통과가 불가능했다.
//
// v2: 제어점을 Catmull-Rom 스플라인으로 보간해 매끄러운 곡선으로 만들고,
//   폭을 300 → 440 으로 넓혔다. 제어점은 "이 근처를 지나가라"는 힌트일 뿐이다.
// ============================================================

export interface TrackData {
  points: number[][];
  width: number;
  cum: number[];
  total: number;
}

export interface Projection {
  s: number;
  lateral: number;
  offTrack: boolean;
}

/** Catmull-Rom 스플라인으로 제어점 사이를 채운다. 닫힌 루프 가정. */
export function smoothLoop(control: number[][], perSeg = 10): number[][] {
  const n = control.length;
  const out: number[][] = [];
  const at = (i: number) => control[((i % n) + n) % n];

  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let j = 0; j < perSeg; j++) {
      const t = j / perSeg, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  return out;
}

export function buildTrack(points: number[][], width: number): TrackData {
  const cum: number[] = [0];
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    cum.push(cum[i] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  return { points, width, cum, total: cum[points.length] };
}

export function project(t: TrackData, x: number, y: number): Projection {
  let best = { s: 0, lateral: 0, d2: Infinity };

  for (let i = 0; i < t.points.length; i++) {
    const a = t.points[i];
    const b = t.points[(i + 1) % t.points.length];
    const vx = b[0] - a[0], vy = b[1] - a[1];
    const len2 = vx * vx + vy * vy;
    if (len2 === 0) continue;

    let u = ((x - a[0]) * vx + (y - a[1]) * vy) / len2;
    u = u < 0 ? 0 : u > 1 ? 1 : u;

    const px = a[0] + vx * u, py = a[1] + vy * u;
    const dx = x - px, dy = y - py;
    const d2 = dx * dx + dy * dy;

    if (d2 < best.d2) {
      const len = Math.sqrt(len2);
      const cross = (vx * dy - vy * dx) / len;
      best = { s: t.cum[i] + len * u, lateral: cross, d2 };
    }
  }

  return { s: best.s, lateral: best.lateral, offTrack: Math.abs(best.lateral) > t.width / 2 };
}

export function pointAt(t: TrackData, s: number): { x: number; y: number; angle: number } {
  const d = ((s % t.total) + t.total) % t.total;
  let lo = 0, hi = t.points.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (t.cum[mid] <= d) lo = mid; else hi = mid - 1;
  }
  const a = t.points[lo];
  const b = t.points[(lo + 1) % t.points.length];
  const segLen = t.cum[lo + 1] - t.cum[lo] || 1;
  const u = (d - t.cum[lo]) / segLen;

  return {
    x: a[0] + (b[0] - a[0]) * u,
    y: a[1] + (b[1] - a[1]) * u,
    angle: Math.atan2(b[1] - a[1], b[0] - a[0]),
  };
}

export function offsetPoint(t: TrackData, s: number, lateral: number) {
  const p = pointAt(t, s);
  return {
    x: p.x - Math.sin(p.angle) * lateral,
    y: p.y + Math.cos(p.angle) * lateral,
    angle: p.angle,
  };
}

// ---------- IP CITY 트랙 v2 ----------
// v1의 63° 헤어핀을 없애고 곡률을 고르게 폈다.
// 긴 직선 두 곳을 남겨 "그냥 밟는 구간"과 "드리프트 구간"을 구분했다.
export const TRACK_CONTROL: number[][] = [
  [900, 2280], [560, 1900], [520, 1300], [820, 820], [1400, 600],
  [2050, 560], [2600, 760], [2950, 1120], [3350, 1300], [3800, 1200],
  [4150, 900], [4600, 940], [4900, 1360], [4880, 1900], [4560, 2300],
  [4050, 2500], [3450, 2520], [2850, 2460], [2200, 2500], [1500, 2520],
];

/** 실제 주행 중심선. 제어점 사이를 12등분해 매끄럽게 만든 것. */
export const TRACK_POINTS: number[][] = smoothLoop(TRACK_CONTROL, 12);

// v1은 300이었다. 최소 회전반경 248 대비 너무 좁아 코너에서 무조건 튀어나갔다.
export const TRACK_WIDTH = 440;
