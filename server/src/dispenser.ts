// ============================================================
// 문제 출제기
// 기존 questions.ts 의 QUESTIONS 풀을 셔플해 순환시킨다.
// 퀴즈가 자주 뜨는 구조라 6문제로는 부족하다 — 풀이 소진되면 다시 셔플.
//
// ⚠️ 현재 questions.ts 에는 문항이 9개뿐이다. 한 판에 30~40회 출제되므로
//    같은 문제가 반복된다. 다른 프로젝트에 검증된 70문항이 있다면 그걸
//    questions.ts 의 QUESTIONS 배열에 그대로 붙이면 바로 반영된다.
// ============================================================

import { QUESTIONS, Question } from "./questions";

export class QuestionDispenser {
  private queue: Question[] = [];
  private lastId = "";

  next(): Question {
    if (this.queue.length === 0) this.refill();
    let q = this.queue.pop()!;
    // 직전 문제와 같으면 한 번 더 뽑는다
    if (q.id === this.lastId && this.queue.length > 0) {
      const alt = this.queue.pop()!;
      this.queue.push(q);
      q = alt;
    }
    this.lastId = q.id;
    return q;
  }

  private refill() {
    const pool = [...QUESTIONS];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    this.queue = pool;
  }
}
