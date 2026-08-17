# IP Racing — 인터넷 배포 가이드 (내 PC 설치 없이)

목표: 동료가 **URL 하나**로 들어와 방 코드를 공유하고 플레이한다.

게임은 두 조각으로 되어 있어서 각각 다른 곳에 올린다.

| 조각 | 역할 | 어디에 | 비용 |
|---|---|---|---|
| **서버** (`server/`) | 게임 판정 · WebSocket 방 | **Railway** (또는 Render) | 무료 티어로 시작 가능 |
| **클라이언트** (`client/`) | 화면 · 브라우저에서 열리는 게임 | **Vercel** | 무료 |

> Vercel은 "항상 켜진 WebSocket 서버"를 못 돌려서 서버만 Railway에 둔다. 나머지는 전부 Vercel.

전체 흐름은 **①GitHub에 올리기 → ②서버 배포 → ③클라이언트 배포 → ④둘 연결 → ⑤공유** 5단계. 코드는 안 건드려도 된다.

---

## ① GitHub에 코드 올리기 (10분)

Railway와 Vercel 둘 다 GitHub 저장소를 보고 자동 배포하기 때문에 먼저 여기 올린다.

1. github.com 로그인 → 우상단 **+** → **New repository** → 이름 `ip-racing` → **Create**.
2. 새 저장소 화면에서 **"uploading an existing file"** 링크 클릭.
3. zip을 풀어서 나온 `ip-racing` **폴더 안의 내용물**(`server`, `client`, `README.md`, `package.json` 등)을 그대로 드래그 앤 드롭.
   - 폴더 째로가 아니라 **안의 파일·폴더들**을 올려야 한다. 저장소 최상위에 `server/`와 `client/`가 보이면 정답.
4. **Commit changes**.

---

## ② 서버 배포 — Railway (10분)

1. railway.app → GitHub 계정으로 로그인.
2. **New Project** → **Deploy from GitHub repo** → `ip-racing` 선택.
3. 프로젝트가 생기면 서비스 클릭 → **Settings** 탭:
   - **Root Directory** → `server` 입력. ← 가장 중요. 이걸 안 하면 빌드가 실패한다.
   - 나머지 빌드/시작 명령은 `server/railway.json`이 자동으로 알려주므로 손 안 대도 됨.
4. **Settings > Networking** → **Generate Domain** 클릭 → `xxxx.up.railway.app` 같은 주소가 생긴다. **이 주소를 복사해 둔다.**
5. **Deployments** 탭에서 초록불(Success)이 뜨면 완료. 브라우저로 그 주소를 열어 `IP Racing server is running.` 이 보이면 서버가 살아있는 것.

> Render를 쓸 경우: **New > Web Service** → 저장소 선택 → Root Directory `server` → 나머지는 `render.yaml`대로. 무료 플랜은 15분 놀면 잠들었다 첫 접속 때 30초쯤 걸리니 참고.

---

## ③ 클라이언트 배포 — Vercel (5분)

1. vercel.com → GitHub로 로그인 → **Add New > Project** → `ip-racing` 저장소 **Import**.
2. 설정 화면에서:
   - **Root Directory** → `client` (Edit 눌러서 선택). ← 이것도 필수.
   - Framework는 Vite로 자동 인식된다.
3. **Environment Variables** 펼치기 → 다음 하나 추가:
   - Name: `VITE_SERVER_URL`
   - Value: `wss://` + ②에서 복사한 Railway 주소 (예: `wss://ip-racing.up.railway.app`)
   - `ws://`가 아니라 **`wss://`**(s 붙음). Vercel은 https라서 반드시 보안 소켓이어야 한다.
4. **Deploy**. 1~2분 뒤 `ip-racing.vercel.app` 같은 URL이 생긴다.

---

## ④ 연결 확인 (2분)

브라우저 탭 두 개로 Vercel URL을 연다.
- 탭 1: 닉네임 → **게임 만들기** → 방 코드 확인 → **준비 완료**
- 탭 2: 닉네임 → **방 코드 입장** → 코드 입력 후 Enter → **준비 완료**
- 3초 카운트다운 후 레이스가 시작되면 성공.

**"방 생성 실패: 서버가 켜져 있나요?"** 가 뜨면 → 99%는 `VITE_SERVER_URL` 오타이거나 `ws://`로 넣은 것. Vercel 환경변수 고친 뒤 **Redeploy** 해야 반영된다(환경변수는 빌드 시점에 굽힌다).

---

## ⑤ 공유

Vercel URL 하나만 동료에게 보내면 끝. 각자 그 URL로 들어와 방 코드로 만난다.
사내 위키/슬랙에 URL 고정해두면 상시 접속 가능.

---

## 이후 수정은 어떻게?

GitHub 저장소의 파일을 고치고 커밋하면 **Railway와 Vercel이 자동으로 다시 배포**한다.
예: 문제를 추가하려면 `server/src/questions.ts`만 편집 → 커밋 → 서버 자동 재배포.
밸런스 수치는 `server/src/gameConfig.ts` 한 곳.

## 커스텀 도메인 (선택)

Vercel 프로젝트 **Settings > Domains** 에서 `ipracing.kipi.or.kr` 같은 사내 도메인을 붙일 수 있다(DNS CNAME 한 줄). 서버 쪽 Railway도 커스텀 도메인 지원.

## 알아둘 것

- 서버가 무료 티어라 동시 접속이 많아지면 유료 전환(월 $5 수준)이 필요할 수 있다. 1단계 테스트에는 무료면 충분.
- 정답은 서버에만 있으므로, 클라이언트 URL을 공유해도 답이 새지 않는다.
