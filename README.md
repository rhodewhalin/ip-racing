# IP Racing — Stage 1 스켈레톤

2인 개인전 코어 루프를 검증하기 위한 **최소 실행 가능 골격**.
스택: **Phaser 3 (클라이언트) + Colyseus (권위 서버)**. 아트 없이 사각형·텍스트로 루프만 구현.

## 무엇이 들어있나 (명세 대응)

| 명세 항목 | 구현 위치 |
|---|---|
| ① 레이스 물리(진행도 모델, 6게이트, 오답 감속) | `server/src/gameConfig.ts`, `RaceRoom.update()` |
| ② 아이템 3종 + 순위 기반 배정 | `server/src/items.ts`, `RaceRoom.useItem()` |
| ③ 3초 UI(READ/CHOOSE, ←↓→ 선택, 타이머) | `client/index.html`, `client/src/ui.ts` |
| ④ 이벤트 기반 동기화(상태 스키마 + 메시지) | `server/src/schema.ts`, `RaceRoom.ts`, `client/src/net.ts` |
| ⑤ 문제 DB(PRD 25장 부분집합) + IP Review | `server/src/questions.ts`, `RaceRoom.endMatch()`, `ui.renderResult()` |

정답은 서버만 안다. 클라이언트는 게임 종료(`match_end`) 시점에만 정답·설명·출처를 받는다.

## 실행 방법

두 개의 터미널이 필요하다.

```bash
# 0) 의존성 설치 (최초 1회)
npm run install:all

# 1) 서버 (터미널 A)
npm run dev:server        # ws://localhost:2567

# 2) 클라이언트 (터미널 B)
npm run dev:client        # http://localhost:5173
```

브라우저 탭 **2개**로 `http://localhost:5173` 을 연다.
- 탭1: 닉네임 입력 → **게임 만들기** → 표시된 방 코드 확인 → **준비 완료**
- 탭2: 닉네임 입력 → **방 코드 입장** → 코드 입력 후 Enter → **준비 완료**
- 둘 다 준비되면 3초 카운트다운 후 레이스 시작.

조작: `←` `↓` `→` = 게이트 A/B/C 선택, `1` 또는 `Space` = 아이템 사용.

## 튜닝 포인트 (1차 값)

밸런스는 전부 `server/src/gameConfig.ts` 한 곳에 있다. 첫 플레이 테스트에서
특히 이 셋을 본다: 오답 패널티(`wrongPenalty*`), READ 시간 공식(`readMs*`),
로켓 배수(`ITEMS.rocket.multiplier`).

## 알려진 단순화 (1단계 의도)

- 차량 충돌·코너링 물리 없음(2단계 이월).
- 겹치는 속도 효과는 "마지막 복귀 우선"으로 단순 처리.
- 게이트 표시 아이템은 연출용, 실제 획득은 순위 기반(`items.ts` 주석 참고).
- 방 코드는 Colyseus의 `roomId`를 그대로 사용.

## 버전 주의

부트스트랩은 Colyseus **0.15.x** 기준이다. 0.16+ 를 쓰면 `server/src/index.ts`의
`Server` 생성부와 transport import가 달라질 수 있다.
