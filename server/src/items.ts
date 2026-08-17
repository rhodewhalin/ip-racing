// ============================================================
// 아이템 배정 로직 (역전 시스템 / PRD 20장)
// 정답 보상으로 주는 아이템의 강함은 "받는 플레이어의 현재 순위"로 결정.
// 로켓은 앞에 상대가 있을 때만 등장(2인전에서 1위에게 로켓 무의미).
//
// 참고: 게이트에 표시되는 아이템(연출용)과 실제 획득 아이템은
// 스펙상 일치가 이상적이지만, 두 명이 동시에 정답이면 순위가 달라 grant가
// 갈리므로 1단계에서는 "표시=랜덤 연출 / 획득=순위 기반"으로 분리한다.
// 표시=획득 엄격 일치는 후속 튜닝 과제. (spec 2.2 주석 참고)
// ============================================================

import { ItemId } from "./gameConfig";

type Weights = Partial<Record<ItemId, number>>;

function weightedPick(weights: Weights): ItemId {
  const entries = Object.entries(weights).filter(([, w]) => (w ?? 0) > 0) as [ItemId, number][];
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [id, w] of entries) {
    r -= w;
    if (r <= 0) return id;
  }
  return entries[0][0];
}

/**
 * 정답 플레이어에게 줄 아이템을 순위로 뽑는다.
 * @param isBehind  뒤처진(순위가 낮은) 플레이어인가
 * @param opponentAhead 앞에 상대가 있는가 (로켓 유효 조건)
 */
export function grantItemByRank(isBehind: boolean, opponentAhead: boolean): ItemId {
  if (isBehind) {
    // 2위: 로켓 55 / 부스터 30 / 방패 15
    return weightedPick({
      rocket: opponentAhead ? 55 : 0,
      booster: opponentAhead ? 30 : 55, // 로켓 불가 시 부스터로 흡수
      shield: 15,
    });
  }
  // 1위: 로켓 0 / 부스터 55 / 방패 45
  return weightedPick({ booster: 55, shield: 45 });
}

/** 게이트에 표시할 연출용 아이템(랜덤). */
export function randomDisplayItem(): ItemId {
  const all: ItemId[] = ["rocket", "shield", "booster"];
  return all[Math.floor(Math.random() * all.length)];
}
