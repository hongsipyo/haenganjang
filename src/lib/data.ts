// ============================================================
// 행정안전부 장관 — 모든 작품 데이터
// Supabase 연결 전까지 이 파일이 진실의 원천
// ============================================================

export interface CharacterData {
  id: string;
  name: string;
  description: string;
  element: string | null;
  animal: string | null;
  details: Record<string, string>;
  relationships: string[];
  notes: string;
  keyLines: string[];
}

export interface EpisodeData {
  number: number;
  title: string | null;
  firstLine: string | null;
  synopsis: string | null;
  focusCharacter: string | null;
  scenes: { title: string; content: string }[];
  keyFragments: string[];
  progress: number;
}

export interface FragmentData {
  id: string;
  content: string;
  tags: string[];
  character?: string;
  episode?: number;
  type: "text" | "voice" | "image";
  createdAt: string;
}

export interface RefData {
  id: string;
  type: string;
  title: string;
  note: string;
  tags: string[];
}

// ============================================================
// LOGLINE
// ============================================================
export const LOGLINE =
  "규칙을 지키며 살아온 32년차 관료 행안부장관 김형식이, 기재부장관에게 국무회의에서 팬티를 찢기는 수모를 당하고, 무능한 차관 문형철밖에 없는 행안부를 지키기 위해 봉인된 힘을 깨우는 정치풍자 코미디.";

// ============================================================
// CHARACTERS
// ============================================================
export const CHARACTERS: CharacterData[] = [
  {
    id: "hyungsik",
    name: "김형식 (행안부장관)",
    description: "32년차 관료, 규칙주의자, 봉인된 괴력, 여자에 인기 없음",
    element: "火 (봉인됨)",
    animal: null,
    details: {
      경력: "32년차 관료, 행정안전부 장관",
      성격: "규칙주의자, 원칙론자, 성실함이 몸에 밴 사람",
      약점: "여자에 인기 없음, 골프 안 쳐서 소외됨",
      봉인: "어렸을 때 힘이 너무 강해 사람을 죽일 수도 있어서 혈이 봉인됨",
      오행: "火 — 봉인되어 있어 본인도 모름",
      섹스: "성실하게 노동하듯이 섹스했음",
      골프: "안 침. 공무원 사회에서 소외 원인",
      언어변화: "처음엔 '나쁜 사람' '정말 좋지 못한 행동' → 나중에 바로 욕 갈김",
      당뇨: "당뇨 있음",
    },
    relationships: [
      "기재부장관 — 과동기, 적대 관계, 푸코를 안 들었음",
      "문형철 — 행안부 차관, 무능한 부하",
      "아내 — 성욕 없다고 괜찮다 했는데 화기 접신 후 여자가 되어버림",
      "노양진 — 회칼 들고 다녀서 개쫄",
      "대통령 — 충성하지만 치매라 소통 안 됨",
    ],
    notes: "산불이 유독 많이 나는 이유가 사실 행안부장관이 불기운이라서. 맞지 않는 생활을 해왔기 때문에 주기적으로 배터리가 나가서 기억의 흐름이 끊겨 있었음. 아내가 불을 가방에서 빼놓자 화를 불같이 내서 아내가 놀람.",
    keyLines: [
      "공무원이 전화를 안받아? 근무 이탈이야 이새끼.",
      "팬티 찢지 마십시오. 이것은 협상입니다.",
      "언포기븐. 무시마. 내가 걸어온 커리어.",
    ],
  },
  {
    id: "hyungchul",
    name: "문형철 (행안부 차관)",
    description: "행안부 차관, 김형식 밑의 무능한 deputy. 도움이 안 됨.",
    element: null,
    animal: null,
    details: {
      직위: "행정안전부 차관 (김형식의 부하)",
      성격: "무능, 일 못함, 존재감 없음",
      문제: "도움을 요청하면 더 꼬이게 만듦",
    },
    relationships: [
      "김형식 — 상관. 부하인데 도움이 안 됨",
    ],
    notes: "행안부 차관인데 무능해서 김형식이 답답해함. 도움이 안 되는 이유는 배신이 아니라 순수한 무능.",
    keyLines: [],
  },
  {
    id: "gijaebu",
    name: "기재부장관 (이름 미정)",
    description: "기업인 출신 엘리트, 간신배 거느림, 작은 일 키우는 스타일. 메인 악역.",
    element: null,
    animal: null,
    details: {
      출신: "기업인 출신, 엘리트",
      성격: "작은 일을 키우는 스타일, 권모술수",
      여자: "여자들이 좋아함 (단, 룸빵은 안 감)",
      사주: "몰래 사주 봄 — 날짜 오기재",
      화장실: "화장실 갈 때 직원 3명이 종류별로 휴지 대기",
      동기: "김형식과 과동기, 근데 푸코를 안 들음",
    },
    relationships: [
      "김형식 — 과동기, 적대 관계",
      "박잭슨 — 공모 관계",
      "대통령 — 납치 음모",
      "직원들 — 간신배 거느림",
    ],
    notes: "예산심의하러 기재부 가서 신체검사 받다가 김형식 고추를 만짐당함. 특전사에서 비비탄저격수 구해옴. 불기운을 막으려고 소방청을 부름. 우정사업본부장을 매수해서 택배가 안 옴.",
    keyLines: [
      "이건 예산 문제가 아니라 인사 문제입니다.",
    ],
  },
  {
    id: "jackson",
    name: "박잭슨 (외교부장관)",
    description: "외세 끌어오는 역할, 기재부장관과 공모",
    element: null,
    animal: null,
    details: {
      역할: "외세 끌어오는 역할",
      공모: "기재부장관과 함께 대통령 납치 음모",
      번역: "영어 번역이 TV로 나가는데 알카에다가 한 거 같음",
    },
    relationships: [
      "기재부장관 — 공모 관계",
    ],
    notes: "영어번역 tv로 나가는거 알카에다가 한거같아",
    keyLines: [],
  },
  {
    id: "wife",
    name: "김형식 아내",
    description: "성욕 없다고 괜찮다 하다가 화기 접신 후 여자가 되어버림",
    element: null,
    animal: null,
    details: {
      변화전: "남편 성욕 없다고 괜찮다고 함",
      변화후: "화기 접신 후 여자가 되어버림",
      불기운: "불을 가방에서 빼놓자 화를 불같이 내서 놀람",
    },
    relationships: [
      "김형식 — 남편",
    ],
    notes: "아내가 불을 가방에서 빼놓자 화를 불같이 내서 아내가 놀람",
    keyLines: [],
  },
  {
    id: "president",
    name: "대통령",
    description: "치매, 기독교인, 감언이설에 넘어감",
    element: null,
    animal: null,
    details: {
      건강: "치매",
      종교: "기독교인",
      약점: "감언이설에 넘어감",
    },
    relationships: [
      "기재부장관 — 기재부장관에게 조종당함",
      "김형식 — 기독교인인 척 교회 다님",
    ],
    notes: "김형식이 대통령이 기독교인이라 기독교인인척 함 교회 다님. '이런 바리새인 같은 새끼.'",
    keyLines: [
      "주님께서 그리 하라 하셨느니라.",
    ],
  },
  {
    id: "kukto",
    name: "국토교통부 장관",
    description: "여자라서 팬티 안 찢김, 토기운",
    element: "土",
    animal: null,
    details: {
      성별: "여자",
      오행: "토기운",
      특이사항: "여자라서 팬티 안 찢김",
    },
    relationships: [
      "김형식 — 팬티 찢기는 현장 목격",
    ],
    notes: "",
    keyLines: [],
  },
  {
    id: "gwangtae",
    name: "김광태 (법무부장관)",
    description: "법적으로 안 되는 이유만 설명하는 남자",
    element: null,
    animal: null,
    details: {
      성격: "법조인 특유의 냉소, 뭐든 고소 안 된다고 함",
    },
    relationships: [
      "김형식 — 도움 요청받지만 매번 거절",
    ],
    notes: "",
    keyLines: [
      "그걸로는 고소가 안 될 텐데요? 하하하.",
    ],
  },
  {
    id: "jeoninkwon",
    name: "전인권 (인권위원장)",
    description: "인권위원장",
    element: null,
    animal: null,
    details: {
      직함: "인권위원장",
    },
    relationships: [],
    notes: "",
    keyLines: [],
  },
  {
    id: "noyangjin",
    name: "노양진 (해양수산부장관)",
    description: "회칼로 방어 잡음, 김형식이 개쫄",
    element: null,
    animal: null,
    details: {
      특기: "회칼로 방어 잡음",
      위협: "김형식이 개쫄",
    },
    relationships: [
      "김형식 — 무서운 동료",
    ],
    notes: "",
    keyLines: [],
  },
  {
    id: "nonglim",
    name: "농림축산부장관",
    description: "소고기 맨날 먹음",
    element: null,
    animal: null,
    details: {
      식습관: "소고기 맨날 먹음",
      접대: "소고기 대접",
    },
    relationships: [
      "김형식 — 소고기 대접",
    ],
    notes: "",
    keyLines: [],
  },
];

// ============================================================
// PLOT BEATS (플롯 비트 구조 — 5막)
// ============================================================
export interface PlotBeat {
  id: string;
  act: "발단" | "전개" | "위기" | "절정" | "결말";
  title: string;
  description: string;
  scenes: { title: string; content: string }[];
  progress: number;
}

export interface PlatformPlan {
  platform: "영화" | "웹툰" | "웹소설";
  totalLength: string;
  pacing: string;
  beats: string[];
  notes: string;
}

export const PLOT_BEATS: PlotBeat[] = [
  {
    id: "b1",
    act: "발단",
    title: "팬티 찢김",
    description: "국무회의에서 기재부장관에게 팬티를 찢기는 수모. 여자 장관들, 직원들 앞에서. 협상했지만 얼굴에 흙뿌림.",
    scenes: [
      { title: "국무회의 시작", content: "평범한 국무회의. 예산안 심의. 김형식 발언 중 기재부장관이 끼어듦" },
      { title: "팬티 찢김", content: "여자 장관들, 직원들 보는 앞에서 팬티가 찢긴다. 인명피해 없음. 수치심만." },
      { title: "협상 실패", content: "팬티 찢지 말라고 협상. 기재부장관이 얼굴에 흙을 뿌림. 김형식 무력함." },
    ],
    progress: 15,
  },
  {
    id: "b2",
    act: "발단",
    title: "반복되는 굴욕",
    description: "마이크 끄기, 제로콜라 라벨에 설탕콜라(당뇨 쇼크), 골프 모임 소외. 작은 일을 키우는 기재부장관의 패턴.",
    scenes: [
      { title: "마이크 끄기", content: "국무회의에서 김형식 발언 중 마이크가 꺼진다. 기재부장관 측근의 소행." },
      { title: "설탕콜라", content: "제로콜라 라벨에 설탕콜라. 당뇨인 김형식 쇼크." },
      { title: "골프 소외", content: "장관들 골프 모임에서 김형식만 빠짐. 혼자 청사에 남는 오후." },
    ],
    progress: 10,
  },
  {
    id: "b3",
    act: "전개",
    title: "책상 부러짐",
    description: "분노한 김형식이 책상을 치는데 책상이 부러진다. 봉인된 힘이 새어나온 첫 순간. 의식을 잃는다.",
    scenes: [
      { title: "기재부의 도발", content: "기재부장관이 사소한 행정 문제를 국가 위기로 확대" },
      { title: "책상 부러짐", content: "김형식이 책상을 치는데 책상이 부러진다. 주변 사람들 경악." },
      { title: "의식 상실", content: "봉인된 힘이 새어나옴. 김형식 쓰러짐." },
    ],
    progress: 10,
  },
  {
    id: "b4",
    act: "전개",
    title: "힘 깨우기",
    description: "혈 봉인 해제, 화기운 보충제 복용, 한전사장에게 전기충격. 언어가 '나쁜 사람'에서 욕으로 변한다. 테이저건 확보.",
    scenes: [
      { title: "봉인의 진실", content: "혈이 봉인되어 있다는 사실을 알게 됨. 어렸을 때 사람을 죽일 수도 있어서 봉인" },
      { title: "화기운 보충제", content: "화기운 보충. 남자답게 행동하기 시작. 언어도 변함. '나쁜 사람' → '그 새끼'" },
      { title: "전기충격", content: "한전사장에게 전기충격. 경찰청장에게서 테이저건 훔쳐옴." },
    ],
    progress: 10,
  },
  {
    id: "b5",
    act: "전개",
    title: "아군 모으기",
    description: "장관급 인사들을 포섭. 농림축산부장관(소고기 외교), 국토부장관(토기운), 경찰청장(테이저건). 노양진은 회칼이 무서워서 실패.",
    scenes: [
      { title: "소고기 외교", content: "농림축산부장관이 소고기 대접하며 동맹 제안" },
      { title: "노양진 실패", content: "해양수산부장관 노양진이 회칼 들고 있어서 김형식 개쫄. 포섭 실패." },
      { title: "경찰특공대", content: "경찰청장 설득. 테이저건 + 경찰특공대 확보." },
    ],
    progress: 5,
  },
  {
    id: "b6",
    act: "위기",
    title: "약빨 떨어짐",
    description: "기재부가 소방청 불러서 불기운 차단. 화기운 보충제 효과 소멸. 대통령 납치 음모 발각. 기재부장관+박잭슨 공모.",
    scenes: [
      { title: "소방청 출동", content: "기재부에서 불기운을 막으려고 소방청을 부름. 김형식 힘 약화." },
      { title: "약빨 소멸", content: "화기운 보충제 효과 떨어져 속수무책. 다시 찐따로 회귀." },
      { title: "납치 음모", content: "기재부장관과 박잭슨이 대통령 납치를 계획. 김형식이 눈치챔." },
    ],
    progress: 5,
  },
  {
    id: "b7",
    act: "절정",
    title: "반격",
    description: "김형식이 기재부장관한테 온갖 모욕 미러링. 서울구경 시켜줌, 보건복지부장관 통해 스케일링, 추나요법, 내시경. 흙 뿌리기. 비비탄 vs 경찰특공대.",
    scenes: [
      { title: "서울구경", content: "기재부장관을 끌고 다니며 서울구경 시키기. 굴욕 미러링." },
      { title: "장관 활용", content: "보건복지부장관: 내시경+스케일링+추나요법. 장관들의 특기를 무기로." },
      { title: "비비탄 대치", content: "기재부가 특전사에서 비비탄저격수 구해옴. 김형식이 경찰특공대로 대응." },
      { title: "흙 뿌리기", content: "금속탐지기 통과. 가방에 숨긴 흙을 기재부장관 얼굴에 뿌림. 복수 완성." },
    ],
    progress: 5,
  },
  {
    id: "b8",
    act: "결말",
    title: "팬티 찢기",
    description: "기재부장관 팬티를 찢는다. 갈색이 묻어 있다. 행안부 존속. 김형식 승리.",
    scenes: [
      { title: "최후의 일격", content: "김형식이 기재부장관 팬티를 찢는다." },
      { title: "갈색", content: "찢긴 팬티에 갈색이 묻어 있다. 모두 경악." },
      { title: "행안부 존속", content: "행안부 폐지 위기 모면. 김형식, 규칙을 지킨 남자의 승리." },
    ],
    progress: 5,
  },
];

// ============================================================
// PLATFORM PLANS (플랫폼별 계획)
// ============================================================
export const PLATFORM_PLANS: PlatformPlan[] = [
  {
    platform: "영화",
    totalLength: "90분",
    pacing: "빠른 호흡. 발단 짧게(15분), 전개 압축(25분), 위기~절정 길게(40분), 결말 임팩트(10분).",
    beats: ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"],
    notes: "굴욕 몽타주로 발단 압축. 절정의 장관 활용 시퀀스가 영화의 하이라이트. 마지막 갈색 팬티로 극장 폭소.",
  },
  {
    platform: "웹툰",
    totalLength: "15~20화",
    pacing: "회당 하나의 개그 포인트. 비주얼 개그 강조. 각 비트 1~3화.",
    beats: ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"],
    notes: "팬티 찢김, 책상 부러짐, 갈색 팬티 등 비주얼 임팩트 장면을 풀페이지로. 장관별 개그 에피소드 가능.",
  },
  {
    platform: "웹소설",
    totalLength: "40~50화",
    pacing: "에피소드 추가 가능. 장관들 에피소드 각각 할애. 디테일 살리기.",
    beats: ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"],
    notes: "장관별 포섭 에피소드를 5~10화씩 할애. 문서기안 배틀, 사주 드립, 공무원 디테일 최대한 살리기. 독자 댓글 반응 보고 에피소드 추가.",
  },
];

// ============================================================
// EPISODES (하위호환용 — 플롯 비트 기반 10항목)
// ============================================================
export const EPISODES: EpisodeData[] = PLOT_BEATS.map((beat, i) => ({
  number: i + 1,
  title: beat.title,
  firstLine: null,
  synopsis: beat.description,
  focusCharacter: null,
  scenes: beat.scenes,
  keyFragments: [],
  progress: beat.progress,
}));

// ============================================================
// FRAGMENTS (대화에서 나온 모든 파편)
// ============================================================
export const FRAGMENTS: FragmentData[] = [
  // 핵심 설정
  { id: "f1", content: "팬티 찢는것도 여자 장관들 직원들 보는앞에서 찢는걸로", tags: ["설정", "팬티", "수치"], character: "hyungsik", episode: 1, type: "text", createdAt: "2026-05-14" },
  { id: "f2", content: "김형식은 성실하게 노동하듯이 섹스했음", tags: ["캐릭터", "김형식", "유머"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f3", content: "예산심의하러 기재부를 가서 신체검사를 받다가 고추를 만짐당함", tags: ["장면", "기재부", "수치"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f4", content: "골프 등의 공무원스러운 요소 초반에 활용. 주인공은 골프 안쳐서 소외됨", tags: ["설정", "골프", "소외"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f5", content: "화기운이 강하니까 사주 기운 가지고 드립", tags: ["오행", "사주", "유머"], type: "text", createdAt: "2026-05-14" },
  { id: "f6", content: "기재부장관 화장실 갈때 직원 3명이 종류별로 휴지 대기함", tags: ["캐릭터", "기재부장관", "유머"], character: "gijaebu", type: "text", createdAt: "2026-05-14" },
  { id: "f7", content: "언어사용이 변함 처음엔 나쁜사람 정말 좋지못한행동 이렇게하다가 나중에 바로 욕 갈김", tags: ["캐릭터", "김형식", "변화"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f8", content: "청사에 금속탐지기 검사 때 긴장 하지만 안걸림. 흙을 숨겨왓음", tags: ["장면", "긴장"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f9", content: "대통령이 기독교인이라 기독교인인척 함 교회 다님. 이런 바리새인 같은 새끼", tags: ["대통령", "종교", "유머"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f10", content: "너 세종시에 오래있느라고 좀 힘들었지? 아냐 절대그렇지않아 난 세종시가 좋아", tags: ["대사", "세종시"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f11", content: "건강검진 내시경 보건복지부장관이 내시경 한번 해줘. 스케일링. 추나요법.", tags: ["장면", "유머", "장관활용"], type: "text", createdAt: "2026-05-14" },
  { id: "f12", content: "경찰청장에게서 테이저건 훔쳐옴", tags: ["장면", "무기"], character: "hyungsik", episode: 4, type: "text", createdAt: "2026-05-14" },
  { id: "f13", content: "국무회의에서 기재부장관 미러링하려고 놀렸는데 존나 다정색함", tags: ["장면", "국무회의", "유머"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f14", content: "마이크끄기 장난도 당함", tags: ["장면", "괴롭힘"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f15", content: "중간에 당뇨인주인공에게 제로콜라라벨에 그냥 좆 설탕콜라 넣어서 쇼크오게함", tags: ["장면", "당뇨", "음모"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f16", content: "기재부장관이 특전사에서 비비탄저격수 구해와가지고 당해서 경찰특공대로 대응함", tags: ["장면", "액션", "대립"], type: "text", createdAt: "2026-05-14" },
  { id: "f17", content: "우정사업본부장을 매수해서 택배가 안옴", tags: ["장면", "음모", "유머"], character: "gijaebu", type: "text", createdAt: "2026-05-14" },
  { id: "f18", content: "장관님과의 식사 vs 5000만원", tags: ["아이디어", "유머"], type: "text", createdAt: "2026-05-14" },
  { id: "f19", content: "화기운을 만땅 하기위해 불을 끄고 제갈량처럼 사흘간 기도함 근데 어떤새끼가 들어와서 욕함", tags: ["장면", "화기운", "유머"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f20", content: "기재부에서 불기운을 막으려고 소방청을 부름", tags: ["장면", "오행", "대립"], character: "gijaebu", type: "text", createdAt: "2026-05-14" },
  { id: "f21", content: "기재부장관과 행안부장관은 과동기 근데 기재부장관이 푸코를 안들음", tags: ["설정", "관계"], type: "text", createdAt: "2026-05-14" },
  { id: "f22", content: "군인은 왜 근로자가 아니야 근로 했잖아 씨발 이라고 행패를 부리는데 행안부장관이 주먹으로 제압", tags: ["장면", "액션", "유머"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f23", content: "지갑 동원령 팬티 계엄령 회식 독박씀", tags: ["대사", "유머"], type: "text", createdAt: "2026-05-14" },
  { id: "f24", content: "언포기븐 무시마 내가걸어온 커리어", tags: ["대사", "김형식", "각성"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f25", content: "영어번역 tv로 나가는거 알카에다가 한거같아", tags: ["대사", "유머", "외교"], character: "jackson", type: "text", createdAt: "2026-05-14" },
  { id: "f26", content: "행안부장관 전용 불기운 아이템을 어떤새끼가 습득함", tags: ["장면", "불기운", "위기"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f27", content: "유독 산불이 많이 나는 이유는 사실 행안부장관이 불기운이라서", tags: ["설정", "오행", "유머"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f28", content: "아내가 불을 가방에서 빼놓자 화를 불같이 내서 아내가 놀람", tags: ["장면", "아내", "불기운"], character: "wife", type: "text", createdAt: "2026-05-14" },
  { id: "f29", content: "사실은 맞지 않는 생활을 해왔기 때문에 주기적으로 배터리가 나가서 기억의 흐름이 끊겨 있었음", tags: ["설정", "김형식", "봉인"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f30", content: "공무원이 전화를 안받아? 근무 이탈이야 이새끼", tags: ["대사", "김형식"], character: "hyungsik", type: "text", createdAt: "2026-05-14" },
  { id: "f31", content: "농림축산부장관 소고기 맨날먹는데 소고기 대접", tags: ["장면", "유머", "인물"], character: "nonglim", type: "text", createdAt: "2026-05-14" },
  { id: "f32", content: "해양수산부장관 노양진 회칼로 방어를 잡음", tags: ["장면", "인물"], character: "noyangjin", type: "text", createdAt: "2026-05-14" },
  { id: "f33", content: "문서기안으로 싸움. 공무원식 배틀", tags: ["장면", "공무원", "배틀"], type: "text", createdAt: "2026-05-14" },
  { id: "f34", content: "그걸로는 고소가 안될텐데요? 하하하", tags: ["대사", "법무부"], character: "gwangtae", type: "text", createdAt: "2026-05-14" },
];

// ============================================================
// REFS
// ============================================================
export const REFS: RefData[] = [
  { id: "r1", type: "영화", title: "언포기븐 (Unforgiven)", note: "은퇴한 남자가 다시 힘을 깨우는 구조. 무시마 내가 걸어온 커리어.", tags: ["구조", "각성"] },
  { id: "r2", type: "만화", title: "원펀맨 (One Punch Man)", note: "봉인된 힘, 한 방에 끝내는 괴력. 김형식의 봉인된 힘 모티프.", tags: ["힘", "봉인"] },
  { id: "r3", type: "시스템", title: "사주/오행", note: "火水木金土 시스템. 김형식은 火(봉인), 국토부장관은 土. 사주 기운으로 드립.", tags: ["세계관", "오행"] },
];

// ============================================================
// 오늘의 미션 — 랜덤으로 하나 제시
// ============================================================
export const DAILY_MISSIONS = [
  "Ch1 국무회의에서 팬티 찢기는 순간, 김형식의 내면 독백을 3문장으로 써봐.",
  "기재부장관이 화장실 갈 때 직원 3명이 휴지 대기하는 장면을 구체적으로 써봐.",
  "김형식이 골프 모임에서 소외당하는 장면을 5문장으로 써봐.",
  "화기운 보충제를 처음 먹고 언어가 변하는 그 순간을 써봐. '나쁜 사람'에서 욕으로.",
  "노양진 해양수산부장관이 회칼로 방어 잡는 장면. 김형식이 쫄아서 뒷걸음치는 것까지.",
  "문서기안으로 싸우는 공무원식 배틀 장면을 대사와 함께 써봐.",
  "대통령이 치매 증상을 보이는데 주변이 감언이설로 넘기는 장면을 써봐.",
  "김광태 법무부장관이 '그걸로는 고소가 안 될 텐데요? 하하하' 하는 전후 맥락을 써봐.",
  "제갈량처럼 사흘간 기도하는데 어떤 새끼가 들어와서 욕하는 장면을 써봐.",
  "제로콜라 라벨에 설탕콜라 넣어서 당뇨 쇼크 오게 하는 음모를 누가 어떻게 실행하는지 써봐.",
];

// ============================================================
// HELPERS
// ============================================================
export function getRandomFragment(): FragmentData {
  return FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)];
}

export function getRandomMission(): string {
  return DAILY_MISSIONS[Math.floor(Math.random() * DAILY_MISSIONS.length)];
}

export function getDailyMission(): string {
  const today = new Date();
  const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % DAILY_MISSIONS.length;
  return DAILY_MISSIONS[dayIndex];
}

export function getDailyFragment(): FragmentData {
  const today = new Date();
  const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % FRAGMENTS.length;
  return FRAGMENTS[dayIndex];
}

export function getOverallProgress(): number {
  const total = PLOT_BEATS.reduce((sum, b) => sum + b.progress, 0);
  return Math.round(total / PLOT_BEATS.length);
}

export function getFilledEpisodes(): number {
  return PLOT_BEATS.filter(b => b.progress > 0 || b.scenes.length > 0).length;
}

export function getPlotBeatsByAct(act: PlotBeat["act"]): PlotBeat[] {
  return PLOT_BEATS.filter(b => b.act === act);
}

export function getTotalFragments(): number {
  return FRAGMENTS.length;
}

export function getTotalCharacters(): number {
  return CHARACTERS.length;
}

// ============================================================
// CHARACTER DEEP-DIVE QUESTIONS (인물별 질문 뱅크)
// ============================================================
export interface CharacterQuestion {
  id: string;
  category: "inner" | "memory" | "relationship" | "habit" | "scene" | "secret";
  question: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  inner: "내면",
  memory: "기억",
  relationship: "관계",
  habit: "습관/취향",
  scene: "장면",
  secret: "비밀",
};
export { CATEGORY_LABELS as CHARACTER_Q_CATEGORIES };

// 공통 질문 (모든 캐릭터에 적용) — 정치풍자 코미디 버전
const COMMON_QUESTIONS: Omit<CharacterQuestion, "id">[] = [
  // 내면
  { category: "inner", question: "지금 가장 무서운 것은?" },
  { category: "inner", question: "스스로에게 가장 자주 하는 거짓말은?" },
  { category: "inner", question: "아무도 모르는 자기 자신에 대한 생각은?" },
  { category: "inner", question: "가장 부끄러운 욕망은?" },
  { category: "inner", question: "10년 후 자기 모습을 상상하면?" },
  { category: "inner", question: "어떤 순간에 가장 외로워?" },
  { category: "inner", question: "'권력'이란 단어를 들으면 제일 먼저 떠오르는 건?" },
  { category: "inner", question: "울고 싶은데 못 우는 순간이 있어?" },
  { category: "inner", question: "이 사람이 원하는 것(WANT)은? 정말 필요한 것(NEED)은?" },
  { category: "inner", question: "이 사람이 믿고 있는 거짓말(LIE)은?" },
  { category: "inner", question: "이 사람의 치명적 결함(Fatal Flaw)은?" },

  // 기억
  { category: "memory", question: "공직에 들어온 첫날은 어땠어?" },
  { category: "memory", question: "가장 행복했던 하루는?" },
  { category: "memory", question: "처음으로 '어른'이 됐다고 느낀 순간은?" },
  { category: "memory", question: "가장 후회하는 선택은?" },
  { category: "memory", question: "이 사람의 상처(WOUND)는? 과거에 어떤 일이 지금을 만들었어?" },

  // 관계
  { category: "relationship", question: "가장 가까운 사람에게도 못 하는 말이 있어?" },
  { category: "relationship", question: "제일 부러운 사람은 누구야? 왜?" },
  { category: "relationship", question: "이 사람 없으면 안 될 것 같은 사람은?" },
  { category: "relationship", question: "가장 실망한 사람은 누구야?" },
  { category: "relationship", question: "이 사람이 방에 들어오면 분위기가 어떻게 바뀌어?" },

  // 습관/취향
  { category: "habit", question: "혼자 있을 때 뭐 해?" },
  { category: "habit", question: "스트레스 받으면 어떻게 해?" },
  { category: "habit", question: "핸드폰 열면 제일 먼저 뭐 해?" },
  { category: "habit", question: "거짓말할 때 무의식적으로 하는 행동은?" },
  { category: "habit", question: "이 사람 가방/주머니 안에 항상 있는 것은?" },

  // 장면
  { category: "scene", question: "이 사람이 처음 등장하는 장면을 써봐." },
  { category: "scene", question: "이 사람이 가장 빛나는 순간은?" },
  { category: "scene", question: "이 사람이 울며 쓰러지는 장면이 있다면?" },
  { category: "scene", question: "이 사람의 마지막 장면은 어떻게 끝나?" },

  // 비밀
  { category: "secret", question: "아무에게도 말 안 한 비밀이 있어?" },
  { category: "secret", question: "남들이 모르는 이 사람의 재능은?" },
  { category: "secret", question: "이 사람이 죽기 전에 꼭 하고 싶은 한 가지는?" },
  { category: "secret", question: "이 사람의 묘비에 뭐라고 써?" },
];

// 캐릭터별 맞춤 질문
const CHARACTER_SPECIFIC_QUESTIONS: Record<string, Omit<CharacterQuestion, "id">[]> = {
  hyungsik: [
    { category: "inner", question: "봉인이 완전히 풀리면 뭘 할 거야?" },
    { category: "inner", question: "32년간 규칙을 지킨 건 신념이야 두려움이야?" },
    { category: "inner", question: "골프 안 치는 건 원칙이야 못 치는 거야?" },
    { category: "inner", question: "팬티 찢긴 그 순간, 진짜 감정은 분노야 수치야?" },
    { category: "memory", question: "어렸을 때 힘이 봉인된 그 날을 기억해?" },
    { category: "memory", question: "공무원 시험 합격한 날 뭘 했어?" },
    { category: "relationship", question: "아내한테 가장 미안한 건 뭐야?" },
    { category: "relationship", question: "기재부장관이 과동기라는 게 왜 더 분해?" },
    { category: "scene", question: "화기운이 처음 깨어나는 그 순간을 써봐." },
    { category: "scene", question: "'성실하게 노동하듯이 섹스'하는 장면의 톤을 잡아봐." },
    { category: "secret", question: "산불이 너 때문이라는 거 알아?" },
    { category: "secret", question: "기억의 흐름이 끊긴 부분에 뭐가 있어?" },
  ],
  hyungchul: [
    { category: "inner", question: "무능한 건 자각하고 있어? 아니면 자기는 잘하고 있다고 생각해?" },
    { category: "inner", question: "김형식 밑에서 차관하는 거 자존심 상해?" },
    { category: "scene", question: "김형식이 일 시켰는데 완전히 망쳐서 보고하는 장면을 써봐." },
    { category: "scene", question: "문형철이 기적적으로 도움이 되는 딱 한 순간을 써봐." },
    { category: "secret", question: "사실 김형식을 존경하는 거야?" },
  ],
  gijaebu: [
    { category: "inner", question: "작은 일을 키우는 건 전략이야 성격이야?" },
    { category: "inner", question: "사주를 몰래 보는 이유는?" },
    { category: "inner", question: "룸빵 안 가는 건 도덕이야 이미지 관리야?" },
    { category: "memory", question: "기업에서 정치로 넘어온 계기는?" },
    { category: "relationship", question: "김형식을 왜 그렇게 괴롭혀?" },
    { category: "scene", question: "직원 3명이 휴지 들고 서 있는 화장실 장면을 써봐." },
    { category: "secret", question: "사주 날짜 오기재한 걸 알아?" },
  ],
  president: [
    { category: "inner", question: "치매가 오기 전의 자기를 기억해?" },
    { category: "inner", question: "기독교 신앙이 진심이야?" },
    { category: "scene", question: "감언이설에 넘어가는 구체적 순간을 써봐." },
    { category: "secret", question: "맑은 정신인 순간이 가끔 있어?" },
  ],
  wife: [
    { category: "inner", question: "남편의 봉인된 힘을 처음 본 순간 뭘 느꼈어?" },
    { category: "inner", question: "'여자가 되어버린' 그 변화가 좋아 무서워?" },
    { category: "relationship", question: "성실하게 노동하듯이 섹스하는 남편에 대한 진짜 감정은?" },
    { category: "scene", question: "가방에서 불을 빼놓은 이유를 써봐." },
  ],
  noyangjin: [
    { category: "inner", question: "회칼을 들고 다니는 이유는?" },
    { category: "scene", question: "회칼로 방어 잡는 장면을 써봐. 주변 반응 포함." },
  ],
  gwangtae: [
    { category: "inner", question: "고소가 안 된다고 할 때 쾌감을 느끼나?" },
    { category: "scene", question: "김형식이 법적 도움을 요청하는데 거절하는 장면을 써봐." },
  ],
};

export function getCharacterQuestions(charId: string): CharacterQuestion[] {
  const common = COMMON_QUESTIONS.map((q, i) => ({ ...q, id: `common-${i}` }));
  const specific = (CHARACTER_SPECIFIC_QUESTIONS[charId] || []).map((q, i) => ({ ...q, id: `${charId}-${i}` }));
  return [...specific, ...common];
}

// ============================================================
// RELATIONSHIP MATRIX (인물간 관계)
// ============================================================
export interface RelationshipLink {
  from: string;
  to: string;
  label: string;
  tension: "love" | "family" | "friend" | "conflict" | "mentor" | "loss";
  scenePrompt: string;
}

export const RELATIONSHIPS: RelationshipLink[] = [
  {
    from: "hyungsik", to: "gijaebu",
    label: "과동기 → 적대",
    tension: "conflict",
    scenePrompt: "국무회의에서 기재부장관이 김형식을 도발하는 장면을 써봐. 과동기라는 사실이 드러나는 순간.",
  },
  {
    from: "hyungsik", to: "hyungchul",
    label: "상관 → 무능한 부하",
    tension: "conflict",
    scenePrompt: "김형식이 문형철 차관에게 일을 시켰는데 완전히 망쳐서 돌아오는 장면.",
  },
  {
    from: "hyungsik", to: "wife",
    label: "부부 — 봉인과 각성",
    tension: "family",
    scenePrompt: "화기 접신 후 아내가 '여자가 되어버린' 그날 밤을 써봐.",
  },
  {
    from: "hyungsik", to: "president",
    label: "충성 — 소통 불가",
    tension: "mentor",
    scenePrompt: "김형식이 대통령에게 보고하려는데 치매 때문에 대화가 안 되는 장면.",
  },
  {
    from: "hyungsik", to: "noyangjin",
    label: "동료 — 공포",
    tension: "conflict",
    scenePrompt: "노양진이 회칼을 꺼내는데 김형식이 뒷걸음치는 장면.",
  },
  {
    from: "hyungsik", to: "gwangtae",
    label: "도움 요청 — 거절",
    tension: "conflict",
    scenePrompt: "김형식이 법적 대응을 요청하는데 김광태가 웃으며 거절하는 장면.",
  },
  {
    from: "gijaebu", to: "jackson",
    label: "공모",
    tension: "friend",
    scenePrompt: "기재부장관과 박잭슨이 대통령 납치를 모의하는 밀실 장면을 써봐.",
  },
  {
    from: "gijaebu", to: "president",
    label: "조종",
    tension: "conflict",
    scenePrompt: "기재부장관이 감언이설로 대통령을 넘기는 장면. 대통령은 미소, 김형식은 분노.",
  },
  {
    from: "hyungsik", to: "kukto",
    label: "동료 — 팬티 현장 목격",
    tension: "friend",
    scenePrompt: "국토부장관이 팬티 찢기는 현장을 목격하고 눈을 돌리는 장면.",
  },
  {
    from: "hyungsik", to: "nonglim",
    label: "동료 — 소고기 외교",
    tension: "friend",
    scenePrompt: "농림축산부장관이 소고기를 대접하며 동맹을 제안하는 장면.",
  },
];

export function getCharacterRelationships(charId: string): RelationshipLink[] {
  return RELATIONSHIPS.filter(r => r.from === charId || r.to === charId);
}

// ============================================================
// SCENE PROMPTS (장면 작성 프롬프트)
// ============================================================
export interface ScenePrompt {
  id: string;
  title: string;
  characters: string[];
  episode?: number;
  prompt: string;
  difficulty: "easy" | "medium" | "hard";
  written: boolean;
}

export const SCENE_PROMPTS: ScenePrompt[] = [
  {
    id: "sp1", title: "팬티 찢김 — 국무회의", characters: ["hyungsik", "gijaebu"],
    episode: 1, difficulty: "hard", written: false,
    prompt: "국무회의 중 기재부장관이 김형식의 팬티를 찢는다. 여자 장관들, 직원들 보는 앞에서. 수치심, 분노, 무력함. 그 3초를 써봐.",
  },
  {
    id: "sp2", title: "흙 뿌림 — 협상 실패", characters: ["hyungsik", "gijaebu"],
    episode: 1, difficulty: "medium", written: false,
    prompt: "팬티 찢지 말라고 협상하는 김형식. 기재부장관이 얼굴에 흙을 뿌린다. 주변 반응, 김형식 내면.",
  },
  {
    id: "sp3", title: "책상 부러짐", characters: ["hyungsik"],
    episode: 2, difficulty: "medium", written: false,
    prompt: "분노한 김형식이 책상을 친다. 책상이 부러진다. 주변 사람들 경악. 김형식도 경악. 봉인된 힘의 첫 발현.",
  },
  {
    id: "sp4", title: "화기운 보충제 첫 복용", characters: ["hyungsik"],
    episode: 3, difficulty: "medium", written: false,
    prompt: "화기운 보충제를 처음 먹는다. 언어가 변하기 시작한다. '나쁜 사람'이 '그 새끼'로. 표정도 변한다.",
  },
  {
    id: "sp5", title: "금속탐지기 통과", characters: ["hyungsik"],
    episode: undefined, difficulty: "easy", written: false,
    prompt: "청사 금속탐지기. 긴장한 김형식. 안 걸린다. 가방에 흙이 있다. 왜 흙을 숨겨왔는지.",
  },
  {
    id: "sp6", title: "사흘간 기도", characters: ["hyungsik"],
    episode: undefined, difficulty: "medium", written: false,
    prompt: "화기운을 만땅 하기 위해 불을 끄고 제갈량처럼 사흘간 기도. 셋째 날, 누군가 문을 열고 들어와서 욕한다.",
  },
  {
    id: "sp7", title: "문서기안 배틀", characters: ["hyungsik", "gijaebu"],
    episode: undefined, difficulty: "hard", written: false,
    prompt: "문서기안으로 싸우는 공무원식 배틀. 결재선, 회신 기한, 참조 넣고 빼기. 대사와 함께.",
  },
  {
    id: "sp8", title: "비비탄 vs 경찰특공대", characters: ["hyungsik", "gijaebu"],
    episode: undefined, difficulty: "hard", written: false,
    prompt: "기재부장관이 특전사에서 비비탄저격수를 구해온다. 김형식이 경찰특공대로 대응한다. 이 대치를 써봐.",
  },
  {
    id: "sp9", title: "회칼 방어 잡기", characters: ["noyangjin", "hyungsik"],
    episode: undefined, difficulty: "easy", written: false,
    prompt: "노양진 해양수산부장관이 회칼로 방어를 잡는다. 김형식이 개쫄아서 뒷걸음. 5문장.",
  },
  {
    id: "sp10", title: "고소 안 됩니다", characters: ["gwangtae", "hyungsik"],
    episode: undefined, difficulty: "easy", written: false,
    prompt: "김형식이 법적 대응을 요청한다. 김광태가 '그걸로는 고소가 안 될 텐데요? 하하하.' 전후 맥락.",
  },
  {
    id: "sp11", title: "골프 소외", characters: ["hyungsik"],
    episode: undefined, difficulty: "easy", written: false,
    prompt: "장관들이 골프 라운딩 약속을 잡는다. 김형식만 빠진다. 혼자 청사에 남아있는 오후.",
  },
  {
    id: "sp12", title: "대통령 납치 음모", characters: ["gijaebu", "jackson"],
    episode: 5, difficulty: "hard", written: false,
    prompt: "기재부장관과 박잭슨이 대통령 납치를 계획한다. 밀실. 구체적 계획. 긴장감과 코미디 사이.",
  },
];
