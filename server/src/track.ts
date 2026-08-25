// ============================================================
// 트랙 지오메트리 — 중심선(폴리라인) 기반.
//
// 트랙은 "중심선 점들 + 폭"으로만 정의된다. 여기서 파생되는 것:
//  · s       : 중심선을 따라 달린 거리 → 랩/순위 계산
//  · lateral : 중심선에서 벗어난 거리 → |lateral| > width/2 면 잔디(감속)
//
// 중심선 좌표(TRACK_POINTS)는 서버가 소유하고, 접속 시 클라이언트로 보낸다.
// 클라이언트는 이 파일의 "함수"만 복사해 쓴다. 좌표를 양쪽에 두면 반드시 어긋난다.
// ============================================================

export interface TrackData {
  points: number[][]; // [[x,y], ...] 닫힌 루프
  width: number;
  cum: number[];      // 각 점까지의 누적 거리
  total: number;
}

export interface Projection {
  s: number;        // 중심선을 따른 거리
  lateral: number;  // 부호 있는 횡방향 거리
  offTrack: boolean;
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

/** 점 (x,y) 를 중심선에 투영. 세그먼트가 20개 남짓이라 전수 검사로 충분하다. */
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
      // 외적 부호로 좌/우 구분
      const cross = (vx * dy - vy * dx) / len;
      best = { s: t.cum[i] + len * u, lateral: cross, d2 };
    }
  }

  return {
    s: best.s,
    lateral: best.lateral,
    offTrack: Math.abs(best.lateral) > t.width / 2,
  };
}

/** 중심선 위 거리 s 에 해당하는 좌표와 진행 방향 */
export function pointAt(t: TrackData, s: number): { x: number; y: number; angle: number } {
  const d = ((s % t.total) + t.total) % t.total;
  let i = 0;
  while (i < t.points.length - 1 && t.cum[i + 1] <= d) i++;

  const a = t.points[i];
  const b = t.points[(i + 1) % t.points.length];
  const segLen = t.cum[i + 1] - t.cum[i] || 1;
  const u = (d - t.cum[i]) / segLen;

  return {
    x: a[0] + (b[0] - a[0]) * u,
    y: a[1] + (b[1] - a[1]) * u,
    angle: Math.atan2(b[1] - a[1], b[0] - a[0]),
  };
}

/** 중심선에서 lateral 만큼 옆으로 밀어낸 좌표 */
export function offsetPoint(t: TrackData, s: number, lateral: number) {
  const p = pointAt(t, s);
  return {
    x: p.x - Math.sin(p.angle) * lateral,
    y: p.y + Math.cos(p.angle) * lateral,
    angle: p.angle,
  };
}

// ---------- IP CITY 트랙 (서버 소유) ----------
// 좌우로 긴 비대칭 루프. 긴 직선 2개 + 헤어핀 1개 + 완만한 S자.
// 드리프트를 쓸 곳과 안 쓸 곳이 섞이도록 곡률을 일부러 불균등하게 뒀다.
export const TRACK_POINTS: number[][] = [
  [700, 2050], [560, 1550], [640, 1050], [980, 680], [1480, 540],
  [2020, 600], [2380, 880], [2470, 1250], [2820, 1470], [3320, 1420],
  [3620, 1020], [3960, 880], [4260, 1140], [4280, 1700], [4020, 2080],
  [3480, 2240], [2880, 2180], [2340, 2280], [1720, 2400], [1160, 2300],
];

export const TRACK_WIDTH = 300;
