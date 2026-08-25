// ============================================================
// 아이템 배정 — 순위가 낮을수록 강한 것이 나온다 (역전 장치).
// 2~4인 모두에서 동작하도록 순위 비율(0=선두, 1=꼴찌)로 가중치를 잡았다.
// ============================================================

import { ItemId } from "./gameConfig";

type Weights = Partial<Record<ItemId, number>>;

function weightedPick(w: Weights): ItemId {
  const entries = Object.entries(w).filter(([, n]) => (n ?? 0) > 0) as [ItemId, number][];
  const total = entries.reduce((s, [, n]) => s + n, 0);
  let r = Math.random() * total;
  for (const [id, n] of entries) {
    r -= n;
    if (r <= 0) return id;
  }
  return entries[0][0];
}

/**
 * @param rank        현재 순위 (1부터)
 * @param playerCount 참가 인원
 * @param hasTarget   앞에 때릴 상대가 있는가 (물폭탄 유효 조건)
 */
export function grantItem(rank: number, playerCount: number, hasTarget: boolean): ItemId {
  const t = playerCount > 1 ? (rank - 1) / (playerCount - 1) : 0; // 0=선두, 1=꼴찌

  if (t < 0.34) {
    // 선두권: 방어와 유지 위주. 공격 아이템을 거의 주지 않는다.
    return weightedPick({ shield: 42, oil: 38, boost: 20 });
  }
  if (t < 0.67) {
    // 중위권: 골고루
    return weightedPick({ bomb: hasTarget ? 32 : 0, boost: 34, oil: 20, shield: 14 });
  }
  // 하위권: 강하게
  return weightedPick({ bomb: hasTarget ? 48 : 0, boost: hasTarget ? 34 : 62, shield: 10, oil: 8 });
}

export const ITEM_LABEL: Record<ItemId, string> = {
  bomb: "💧 물폭탄",
  boost: "🔥 부스터",
  oil: "🛢 기름",
  shield: "🛡 방어막",
};
