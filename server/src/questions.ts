// ============================================================
// 문제 DB 시딩 (1단계: 트랙 1개 = IP CITY)
// 스키마는 PRD 25장의 부분집합. CMS 확장 시 필드만 채우면 된다.
// 3.1 제약: question <= 60자, option <= 12자.  options 3개 = 게이트 A/B/C.
// correctIndex는 서버만 안다(클라이언트로 절대 안 보냄, IP Review 시점에만 공개).
// ============================================================

export type Difficulty = "Easy" | "Normal" | "Hard";

export interface Question {
  id: string;
  category: string;
  difficulty: Difficulty;
  text: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
  explanation: string;
  sourceName: string;
  sourceUrl: string;
}

export const QUESTIONS: Question[] = [
  {
    id: "IPCITY-001",
    category: "IP 상식",
    difficulty: "Easy",
    text: "다음 중 발명을 보호하는 대표적인 권리는?",
    options: ["특허", "상표", "저작권"],
    correctIndex: 0,
    explanation: "특허는 새로운 기술적 발명을 보호하기 위한 권리입니다.",
    sourceName: "대한민국 특허청",
    sourceUrl: "https://www.kipo.go.kr",
  },
  {
    id: "IPCITY-002",
    category: "IP 상식",
    difficulty: "Easy",
    text: "브랜드 이름·로고를 보호하는 권리는?",
    options: ["저작권", "상표", "영업비밀"],
    correctIndex: 1,
    explanation: "상표권은 상품·서비스의 출처를 나타내는 표지를 보호합니다.",
    sourceName: "대한민국 특허청",
    sourceUrl: "https://www.kipo.go.kr",
  },
  {
    id: "IPCITY-003",
    category: "저작권",
    difficulty: "Easy",
    text: "소설·음악·그림 같은 창작물을 보호하는 권리는?",
    options: ["특허", "디자인권", "저작권"],
    correctIndex: 2,
    explanation: "저작권은 인간의 사상·감정을 표현한 창작물을 보호합니다.",
    sourceName: "한국저작권위원회",
    sourceUrl: "https://www.copyright.or.kr",
  },
  {
    id: "IPCITY-004",
    category: "IP 상식",
    difficulty: "Normal",
    text: "제품의 형태·모양 등 외관 디자인을 보호하는 권리는?",
    options: ["디자인권", "상표", "특허"],
    correctIndex: 0,
    explanation: "디자인권은 물품의 형상·모양·색채 등 미적 외관을 보호합니다.",
    sourceName: "대한민국 특허청",
    sourceUrl: "https://www.kipo.go.kr",
  },
  {
    id: "IPCITY-005",
    category: "업무 상황",
    difficulty: "Normal",
    text: "회사에서 외부 이미지를 쓸 때 가장 먼저 확인할 것은?",
    options: ["파일 용량", "이용 라이선스", "이미지 색상"],
    correctIndex: 1,
    explanation: "외부 콘텐츠는 사용 전 라이선스·이용 범위를 반드시 확인해야 합니다.",
    sourceName: "한국저작권위원회",
    sourceUrl: "https://www.copyright.or.kr",
  },
  {
    id: "IPCITY-006",
    category: "영업비밀",
    difficulty: "Normal",
    text: "공개하지 않고 관리하는 기술·경영 정보를 보호하는 것은?",
    options: ["상표", "영업비밀", "저작권"],
    correctIndex: 1,
    explanation: "비공개로 관리되어 경제적 가치를 갖는 정보는 영업비밀로 보호됩니다.",
    sourceName: "한국특허정보원",
    sourceUrl: "https://www.kipris.or.kr",
  },
  {
    id: "IPCITY-007",
    category: "실제 사례",
    difficulty: "Hard",
    text: "Apple과 Samsung 간 대규모로 다툰 IP 분쟁 유형은?",
    options: ["상표 분쟁", "특허 분쟁", "저작권 분쟁"],
    correctIndex: 1,
    explanation: "두 기업은 스마트폰 관련 특허를 놓고 다수 국가에서 분쟁했습니다.",
    sourceName: "WIPO",
    sourceUrl: "https://www.wipo.int",
  },
  {
    id: "IPCITY-008",
    category: "IP 침해",
    difficulty: "Hard",
    text: "타인의 등록상표를 무단으로 상품에 쓰면 무엇이 되나?",
    options: ["상표권 침해", "정당한 사용", "저작권 등록"],
    correctIndex: 0,
    explanation: "등록상표를 권한 없이 동일·유사 상품에 쓰면 상표권 침해입니다.",
    sourceName: "대한민국 특허청",
    sourceUrl: "https://www.kipo.go.kr",
  },
];

const GATE_LABELS = ["A", "B", "C"] as const;
export type GateLabel = (typeof GATE_LABELS)[number];

export function gateLabel(index: number): GateLabel {
  return GATE_LABELS[index];
}

/** 한 매치용 문제 6개를 중복 없이 뽑는다(난이도 램프 순으로 정렬). */
export function pickMatchQuestions(count = 6): Question[] {
  const order: Record<Difficulty, number> = { Easy: 0, Normal: 1, Hard: 2 };
  const pool = [...QUESTIONS];
  // 셔플
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).sort((a, b) => order[a.difficulty] - order[b.difficulty]);
}
