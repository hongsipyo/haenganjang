"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Lightbulb,
  Shuffle,
  ChevronRight,
  Pen,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { CHARACTERS, EPISODES, FRAGMENTS } from "@/lib/data";
import { saveBrainstorm, getBrainstormHistory, saveCharacterField, saveScratch } from "@/lib/supabase/actions";

// ============================================================
// 브레인스토밍 질문 뱅크 — 작품 맥락에 맞는 질문들
// ============================================================
const QUESTIONS = {
  character: [
    "김형식이 32년간 관료 생활하면서 딱 한 번 규칙을 어긴 적이 있다면 언제야?",
    "기재부장관이 기업인 시절에 제일 큰 돈을 벌었던 건은 뭐야? 그게 왜 더러워?",
    "박잭슨이 외교부장관이 된 진짜 이유는 뭐야? 외세 연결 말고.",
    "김형식 아내가 화기 접신 전에 가장 무미건조했던 하루는 어땠어?",
    "대통령이 치매 걸리기 전에 제일 잘했던 정책은 뭐야? 기억이나 해?",
    "국토교통부 장관의 토기운은 언제 처음 발현됐어?",
    "김광태가 '고소가 안될텐데요? 하하하' 할 때 진짜 웃는 거야?",
    "노양진이 회칼 쓰는 법을 누구한테 배웠어?",
    "문형철 차관이 도움이 안 되는 이유가 뭐야? 무능의 구체적 양상은?",
    "기재부장관 간신배 중에 제일 충성스러운 놈은 누구야? 왜 붙어있어?",
    "김형식이 봉인된 괴력을 처음 자각한 순간은 언제야?",
    "김형식과 기재부장관이 처음 만난 날은 어땠어? (과동기)",
    "대통령이 기도할 때 진짜로 비는 건 뭐야?",
    "기재부장관이 여자에 인기 많은 비결이 뭐야? 외모? 돈? 말빨?",
    "김형식이 퇴근하고 집에서 혼자 할 때 하는 루틴은?",
    // — Pixar Rules 기반 —
    "김형식을 존경하는 이유를 세 가지 대봐. 능력 말고 성격에서. (Pixar #1: 고생하는 캐릭터가 성공하는 캐릭터보다 좋다)",
    "김형식이 절대 안 할 행동은 뭐야? 그걸 하게 만드는 상황은? (Pixar #1: 캐릭터를 시험에 들게 해)",
    "기재부장관이 거울 앞에서 혼자 하는 말은 뭐야? 자기합리화의 내용은?",
    "김형식에게서 빼면 안 되는 본질적 특성 하나만 골라. 그게 없으면 이야기가 왜 안 돼? (Pixar #2: 작가로서 재미있는 것 vs 관객으로서 재미있는 것)",
    "기재부장관이 어린 시절에 가장 원했던 건 뭐야? 지금 하는 짓과 연결돼?",
    "문형철 차관이 무능하지만 김형식이 안 자르는 이유가 뭐야? 정때문이야? 빚 때문이야?",
    "박잭슨의 이름이 왜 박잭슨이야? 그 이름에 얽힌 사연을 만들어봐.",
    "김형식 아내가 화기 접신 전에 남편한테 제일 서운했던 순간은?",
    "대통령이 치매 전에 김형식에게 한 말 중 제일 의미 있는 한마디는?",
    "국토교통부장관이 토기운을 숨기면서 제일 불편한 상황은 뭐야?",
    // — Save the Cat 기반 —
    "김형식의 'Save the Cat' 순간은 뭐야? 관객이 첫 10분 안에 이 사람 편이 되는 장면. (STC: Opening Image)",
    "기재부장관의 'Save the Cat' 순간이 있을 수 있어? 악당도 한 번은 인간적이어야 하는데.",
    "김형식이 팬티 찢기기 전에 평범한 일상이 얼마나 지루한지 보여줘. (STC: Set-Up)",
    "김형식이 거부할 수 없는 제안을 받는 순간은 언제야? (STC: Catalyst)",
    "김형식이 '이건 내 일이 아니야'라고 한 번은 거부하는 장면이 필요해. 언제야? (STC: Debate)",
    "김형식이 동맹을 모으는 과정에서 가장 설득하기 힘든 장관은 누구야? 왜?",
    // — John Truby 기반 —
    "김형식의 도덕적 약점은 뭐야? 규칙만 지키면 된다는 착각? (Truby: Moral Weakness)",
    "김형식이 자기 약점을 인정하는 순간은 언제야? 봉인 해제 전이야 후야? (Truby: Self-Revelation)",
    "기재부장관이 김형식의 약점을 정확히 찌르는 대사를 써봐. (Truby: Opponent's Attack)",
    "김형식과 기재부장관이 사실은 같은 문제의 양면이라면 그 문제는 뭐야? (Truby: Double Reversal)",
    "김형식이 이기고 나서 잃는 것은 뭐야? (Truby: Battle의 대가)",
    // — 한국 풍자/코미디 전통 —
    "김형식이 가장 한국 공무원스러운 순간은 언제야? 점심 줄 서기? 연가 눈치?",
    "기재부장관 스타일의 악당이 한국 정치사에서 실존하는 모델이 있어?",
    "이 캐릭터들 중 소주 마시면 울 것 같은 사람은? 왜?",
    "김형식이 회식에서 2차 노래방 갈 때 부르는 노래는?",
    "농림축산부장관이 한우 등급 얘기할 때 눈빛이 어떻게 변해?",
    "노양진이 수산시장 출신이라는 소문은 진짜야? 배경을 만들어봐.",
    "김광태가 법조인답게 말을 꼬는 습관 — 일상에서도 그래? 주문할 때도?",
    "각 장관의 카톡 프로필 사진은 뭐야?",
    "김형식이 32년차 공무원으로서 체득한 '생존의 기술' 세 가지는?",
  ],
  scene: [
    "김형식이 팬티 찢기면서 괴력이 발동하는 순간 — 주변 사람들 표정은?",
    "책상이 부러지는 장면에서 소리를 묘사해봐. 나무? 철재? 유리?",
    "유리창이 깨지는 순간 파편이 날아가는 슬로모션을 써봐.",
    "김형식이 회의실에서 참다참다 주먹을 쥐는 장면 — 손등 혈관 묘사.",
    "기재부장관이 간신배들 데리고 고급 레스토랑에서 밀담하는 장면의 분위기는?",
    "노양진이 회칼로 방어를 잡는 장면 — 국회 수산위 회의 중에?",
    "대통령이 치매로 이름을 까먹는 순간의 정적을 묘사해봐.",
    "국토교통부 장관이 토기운으로 땅을 읽는 장면은 어떤 화면이야?",
    "김형식 아내가 화기 접신하는 순간 — 불꽃? 체온? 눈빛?",
    "박잭슨이 외국 대사와 은밀하게 만나는 장소는 어디야? 왜 거기야?",
    // — Pixar Rules 기반 —
    "김형식이 괴력 발동하는 순간, 카메라가 얼굴이 아니라 발끝을 비추면 어떤 느낌이야? (Pixar #16: 위기의 순간, 캐릭터가 할 수 있는 최대치는?)",
    "기재부장관이 승리를 확신하는 순간의 표정과 손동작을 디테일하게 써봐.",
    "회의실 천장 형광등이 깜빡이는 장면 — 이게 김형식 내면의 뭘 반영해?",
    "봉인이 풀리는 순간 김형식 주변 공기가 어떻게 변해? 온도? 습도? 소리?",
    "국토교통부장관이 토기운으로 건물 구조를 읽는 장면 — POV로 쓰면 어떤 느낌?",
    "김형식 아내가 화기 접신할 때 주방에서 일어나는 일들 — 냄비가 끓고 커튼이 타고...",
    "노양진이 회칼을 꺼내는 순간 주변 사람들의 반응을 5명 각각 다르게 써봐.",
    "대통령 집무실의 냄새, 조명, 가구 배치를 디테일하게 묘사해봐. 치매의 흔적이 보여?",
    // — Save the Cat 기반 —
    "오프닝 이미지: 이 작품의 첫 프레임은 뭐야? 관공서 복도? 새벽 출근길? (STC: Opening Image)",
    "파이널 이미지: 마지막 프레임은 뭐야? 오프닝과 뭐가 달라져야 해? (STC: Final Image)",
    "B Story의 핵심 장면 — 김형식과 아내의 관계가 변하는 결정적 순간은? (STC: B Story)",
    "All Is Lost 순간 — 김형식이 완전히 바닥을 찍는 장면의 공간과 시간대는? (STC: All Is Lost)",
    "Dark Night of the Soul — 김형식이 혼자 앉아있는 장소는 어디야? 뭘 보고 있어?",
    // — John Truby 기반 —
    "김형식과 기재부장관이 대칭되는 장면 두 개를 써봐. 같은 공간 다른 행동. (Truby: Moral Argument)",
    "김형식이 처음으로 괴력을 '선택적으로' 쓰는 장면 — 뭘 부수고 뭘 안 부숴? (Truby: Apparent Defeat → Real Victory)",
    "기재부장관의 몰락이 시작되는 미세한 신호 — 커피잔이 떨린다든가. (Truby: Opponent's Weakness Revealed)",
    // — 한국 풍자/코미디 전통 —
    "국정감사 현장의 분위기를 오감으로 묘사해봐. 마이크 피드백 소리, 물컵 소리...",
    "김형식이 구내식당에서 혼밥하는 장면 — 메뉴는 뭐야? 누가 옆에 앉아?",
    "기재부장관이 고급 승용차 뒷좌석에서 전화하는 장면 — 창밖 풍경은?",
    "장관 회의 중 문형철 차관이 졸다가 깨는 순간의 코미디 타이밍을 써봐.",
    "농림축산부장관이 한우 시식회에서 감동의 눈물을 흘리는 장면.",
    "김광태가 법정에서 하는 것처럼 회의실에서 이의제기하는 장면의 온도감은?",
    "비 오는 날 정부종합청사 앞 풍경 — 우산 든 공무원들의 행렬을 묘사해봐.",
    "김형식이 승진 발표를 듣는 순간 — 표정이 안 변해. 왜?",
    "기재부장관이 김형식에게 처음으로 위협을 느끼는 순간의 신체 반응은?",
    "최종 대결 장소는 어디야? 왜 하필 거기야? 그 장소의 상징성은?",
  ],
  theme: [
    "규칙을 지키는 게 폭력보다 강할 수 있어? 아니면 결국 주먹이 이겨?",
    "32년 관료가 봉인을 푸는 순간, 그건 해방이야 타락이야?",
    "공무원 사회에서 '정의'는 규정 준수야? 아니면 뭔가 다른 거야?",
    "기재부장관 같은 악당이 시스템 안에서 번창하는 이유가 뭐야?",
    "괴력이 은유라면 뭘 의미해? 억눌린 분노? 공무원의 한계?",
    "치매 걸린 대통령은 비극이야 희극이야? 왜?",
    "간신배 정치는 조선시대나 지금이나 뭐가 달라?",
    "이 이야기에서 '규칙'은 방패야 족쇄야?",
    "관료주의가 악인을 보호하는 방패가 되는 순간은 언제야?",
    "김형식이 괴력을 봉인한 이유와 푸는 이유 중 뭐가 더 인간적이야?",
    // — Pixar Rules 기반 —
    "이 이야기의 진짜 주제를 한 단어로 쓴다면? 그 단어가 모든 장면에 녹아있어? (Pixar #3: 주제는 끝나야 알 수 있다, 하지만 처음부터 깔아라)",
    "김형식이 원하는 것(want)과 필요한 것(need)은 뭐가 달라? (Pixar #4)",
    "이 이야기에서 '한 번은 옳았던 규칙'이 '지금은 틀린 규칙'이 되는 지점은? (Pixar #19: 우연으로 문제에 빠뜨리되, 우연으로 빠져나오지 마라)",
    "관객이 김형식에게 '제발 때려!'라고 외치는 순간이 있어야 해. 그 전에 뭘 참아야 해?",
    "괴력은 축복이야 저주야? 둘 다라면 비율은 어떻게 변해?",
    "기재부장관도 나름의 정의가 있어? '효율'이라는 이름의 정의?",
    "'힘이 있는데 안 쓰는 것'과 '힘이 없어서 못 쓰는 것' — 이 차이가 작품의 핵심이야?",
    // — Save the Cat 기반 —
    "이 작품의 장르는 뭐야? STC 10개 장르 중에서. (Monster? Institutionalized? Superhero?)",
    "이 이야기의 'Theme Stated' — 누군가 초반에 주제를 직접 말하는 대사가 있어야 해. 뭐야? (STC: Theme Stated)",
    "김형식의 변화 아크: 봉인된 상태 → ??? → 각성 후 상태. 중간은 뭐야?",
    "기재부장관의 반변화 아크: 전성기 → ??? → 몰락. 중간에 뭘 놓쳐?",
    // — John Truby 기반 —
    "이 작품에서 '정의로운 폭력'은 존재해? 존재한다면 어디까지가 정당해? (Truby: Moral Problem)",
    "김형식이 기재부장관을 이기면서 동시에 기재부장관과 닮아가는 순간은? (Truby: Double Reversal의 위험)",
    "각 장관이 대표하는 가치관을 한 단어씩 붙여봐. 그 가치들이 충돌하는 구도는? (Truby: Values in Conflict)",
    "이 세계에서 '봉인'이라는 개념이 개인을 넘어 사회 전체에 적용된다면? (Truby: Social Arena)",
    "김형식이 승리한 후 세상이 더 나아졌어? 아니면 그냥 악당만 바뀐 거야?",
    // — 한국 풍자/코미디 전통 —
    "한국 관료주의의 본질은 '무사안일'이야? '줄서기'야? 이 작품은 뭘 풍자해?",
    "공무원의 괴력 봉인은 현실에서 뭐에 해당해? 능력 있는데 눈치 보는 거?",
    "이 작품이 웃기면서도 씁쓸한 이유는 뭐야? 코미디 뒤에 깔린 진심은?",
    "한국 정치 풍자에서 '치매 대통령'은 어떤 메타포야? 시스템의 기억상실?",
    "기재부장관 같은 인물이 실제로 처벌받는 경우가 드문 현실 — 이 작품은 그걸 어떻게 다뤄?",
    "'규칙을 지키는 사람이 바보가 되는 사회'에서 김형식은 바보야 영웅이야?",
    "이 작품의 풍자가 불편하지 않으려면 어디까지가 선이야?",
    "장관들의 초능력이 각자 부처의 속성인 건 우연이야 필연이야? 이 설정의 의미는?",
    "한국 사회에서 '주먹'의 의미 — 폭력? 정의? 무력감의 반대편?",
    "이 이야기의 교훈이 '참지 마라'면 너무 위험해. 진짜 교훈은 뭐야?",
  ],
  structure: [
    "이 이야기를 영화로 만들면 첫 장면은 뭐야? 웹툰이면?",
    "코미디 텐션이 가장 높아지는 지점은 어디야? 왜?",
    "웹툰 버전에서 괴력 장면의 연출은 어떻게 달라져야 해?",
    "웹소설이면 회차 끊기는 어디서 해야 독자가 다음 화를 눌러?",
    "장관들 간의 대립 구도를 한 문장으로 정리하면?",
    "김형식 vs 기재부장관 대결의 클라이맥스는 물리적 싸움이야 제도적 싸움이야?",
    "코미디와 액션의 비율은 몇 대 몇이 적절해?",
    "각 장관의 에피소드를 옴니버스로 할 거야 일직선으로 할 거야?",
    "관객이 기재부장관을 미워하다가 동정하게 만드는 타이밍은?",
    "엔딩에서 김형식은 다시 봉인해야 해? 아니면 괴력을 인정해?",
    // — Pixar Rules 기반 —
    "이야기를 한 문장으로 줄여봐: '옛날에 ___가 있었어. 매일 ___했어. 어느 날 ___. 그래서 ___. 그래서 ___. 마침내 ___.' (Pixar #4: Story Spine)",
    "제일 쉬운 선택지를 버려. 김형식이 단순히 기재부장관을 때리면 끝? 절대 안 돼. 뭘 더 해야 해? (Pixar #11: 종이에 쓰면 고칠 수 있다)",
    "이 이야기에서 빼도 무방한 장면이 있어? 그 장면을 빼면 뭐가 달라져? 안 달라지면 빼. (Pixar #5: 심플하게, 집중해, 조합해, 우회를 빼)",
    "관객이 예상하는 전개를 써봐. 그리고 그 정반대로 가봐. 뭐가 나와? (Pixar #12: 처음 떠오르는 아이디어를 버려라)",
    "Act 1이 끝나는 정확한 순간은? 김형식이 돌이킬 수 없는 선택을 하는 지점. (Pixar #9: 막히면 다음에 안 일어날 일을 리스트업하라)",
    "각 장관의 첫 등장 순서를 정해봐. 누가 먼저 나와야 임팩트가 커?",
    "1화, 5화, 10화, 15화, 20화의 핵심 한 줄을 각각 써봐.",
    // — Save the Cat 기반 —
    "Beat Sheet를 채워봐: Opening Image → Theme Stated → Set-Up → Catalyst → Debate → Break into Two → B Story → Fun and Games → Midpoint → Bad Guys Close In → All Is Lost → Dark Night → Break into Three → Finale → Final Image",
    "Fun and Games 구간 — '이 작품의 약속'을 이행하는 파트. 장관들 능력 배틀? 코미디 에피소드? (STC: Fun and Games)",
    "Midpoint: 가짜 승리 or 가짜 패배? 김형식이 중간에 이긴 것 같지만 사실은? (STC: Midpoint)",
    "Bad Guys Close In — 기재부장관의 반격 방식은? 물리적? 제도적? 여론전? (STC: Bad Guys Close In)",
    "Break into Three — 김형식이 A Story와 B Story의 교훈을 합치는 순간은? (STC: Break into Three)",
    "서브플롯은 몇 개야? 각 서브플롯이 메인 플롯에 어떻게 합류해?",
    // — John Truby 기반 —
    "22단계 중 'Ghost + Backstory Reveal'은 언제야? 김형식의 과거가 밝혀지는 타이밍. (Truby: Revelation)",
    "동맹 모으기 시퀀스의 패턴: 만남 → 갈등 → 합류. 각 장관마다 다르게 변주해봐. (Truby: Ally Sequence)",
    "기재부장관의 계획이 단계적으로 커지는 구조를 그려봐. 소탐대실? 처음은 작게? (Truby: Opponent's Plan)",
    "이 작품의 '위기 → 전투 → 자기인식 → 새 균형'을 한 줄씩 써봐. (Truby: Four-Corner Structure)",
    "에피소드 구성: 매회 끝에 뭘 줘야 다음 화를 눌러? 반전? 질문? 클리프행어?",
    // — 한국 풍자/코미디 전통 —
    "판소리 구조처럼 '아니리(설명) → 창(감정폭발)' 패턴을 적용하면 어떤 장면이야?",
    "한국 시트콤의 '반복 개그'를 이 작품에 쓸 수 있어? 문형철의 반복 실수?",
    "이 작품의 회차 제목을 '사자성어'로 지어봐. 1~5화만.",
    "기승전결 대신 기승전'병'으로 가는 에피소드가 하나쯤 있어야 해. 어디야?",
    "각 장관의 단독 에피소드 vs 앙상블 에피소드의 비율은 몇 대 몇?",
    "관객이 '아 이건 실화 아니야?'라고 느끼는 장면이 있어야 해. 어디야?",
    "작품 전체의 템포: 시작은 느리게? 빠르게? 어디서 숨을 줘?",
    "시즌 1 피날레에서 해결되는 것과 남겨지는 것은 각각 뭐야?",
    "이 작품을 3막으로 나누면 각 막의 제목은?",
    "Ticking Clock — 김형식에게 시간 제한이 있어야 해. 뭐야? 인사발령? 국정감사?",
  ],
  wild: [
    "이 세계관에서 장관들끼리 체육대회 하면 종목별 1등은?",
    "김형식이 마블 유니버스에 들어가면 어떤 히어로랑 붙어?",
    "현직 공무원이 이 작품 보면 제일 공감하는 장면은?",
    "이 이야기의 냄새는 뭐야? 관공서 복도? 기재부장관 향수?",
    "노양진이 회칼 대신 다른 무기를 쓴다면?",
    "대통령 치매 개그 중 제일 웃긴 상황을 즉석에서 만들어봐.",
    "국회 청문회에서 김형식이 괴력을 들킬 뻔하는 장면은?",
    "이 이야기를 현실 정치인으로 캐스팅하면 누가 누구야?",
    "김광태가 진짜 고소당하면 어떤 표정이야?",
    "문형철 차관이 기적적으로 도움이 되는 순간이 딱 한 번 온다면 언제야?",
    // — Pixar Rules 기반 —
    "캐릭터들을 다른 장르에 던져봐 — 행안부장관이 로맨스물에 나오면? 호러면? (Pixar #9: 막혔을 때 안 일어날 일 리스트업)",
    "이 세계관에서 유튜브가 있으면 누가 제일 먼저 짤이 돼? 어떤 짤?",
    "김형식의 괴력 발동 장면을 ASMR로 만들면 어떤 소리가 나?",
    "장관들 전원이 한 엘리베이터에 갇히면 30분 후에 무슨 일이 일어나?",
    "기재부장관이 김형식한테 지고 나서 유튜브 먹방 채널을 열면?",
    "이 세계관의 공무원 시험에 '초능력 실기'가 있다면 과목은?",
    "각 장관의 MBTI는 뭐야? 틀려도 돼, 느낌으로.",
    "김형식이 퇴직 후 치킨집을 열면 메뉴 이름은 뭐야?",
    // — Save the Cat 기반 (와일드 버전) —
    "이 작품의 로그라인을 10가지 버전으로 써봐. 제일 웃긴 걸 골라.",
    "이 작품의 포스터 카피는 뭐야? 한 줄로.",
    "관객이 극장에서 가장 크게 웃을 장면 top 3 예상해봐.",
    "관객이 가장 소름 돋을 장면은? 코미디인데 소름이 돋을 수 있어?",
    // — John Truby 기반 (와일드 버전) —
    "이 작품을 '기재부장관 시점'으로 다시 쓰면 제목이 뭐야? (Truby: Opponent's POV)",
    "각 장관의 능력이 부처가 아니라 '음식'과 연결되면? 김형식은 뭐?",
    "이 세계관에 '전직 장관 은퇴자 모임'이 있다면 거기서 뭘 해?",
    // — 한국 풍자/코미디 전통 (와일드) —
    "이 캐릭터들이 나오는 국회 예능 프로그램 이름을 지어봐.",
    "김형식이 나오는 공익광고는 어떤 내용이야?",
    "농림축산부장관이 한우 홍보대사로 나오는 CF 시나리오를 써봐.",
    "이 작품의 OST 리스트를 5곡만 골라봐. 실존 한국 노래로.",
    "장관들이 카카오톡 단톡방에서 새벽 3시에 하는 대화를 써봐.",
    "이 세계관의 나무위키 '행정안전부장관 김형식' 문서 첫 문단은?",
    "김형식이 꿈에서 만나는 전직 장관의 유령은 누구야? 뭐라고 해?",
    "이 작품의 굿즈를 만든다면 제일 잘 팔릴 아이템은?",
    "기재부장관의 비서가 쓰는 비밀 일기장의 한 페이지를 써봐.",
    "장관들 전원이 무인도에 표류하면 첫 24시간 동안 무슨 일이 벌어져?",
    "이 작품을 한 줄 리뷰로 악평하면? 호평하면?",
    "10년 후 이 작품이 레전드가 된다면 어떤 장면 때문이야?",
  ],
};

type Category = keyof typeof QUESTIONS;

const CATEGORY_INFO: { key: Category; label: string; icon: typeof Lightbulb; color: string }[] = [
  { key: "character", label: "인물", icon: MessageCircle, color: "text-accent" },
  { key: "scene", label: "장면", icon: Pen, color: "text-foreground/80" },
  { key: "theme", label: "테마", icon: Lightbulb, color: "text-accent" },
  { key: "structure", label: "구조", icon: ChevronRight, color: "text-foreground/80" },
  { key: "wild", label: "와일드", icon: Sparkles, color: "text-foreground/80" },
];

// Suggestions based on current state
function getSuggestions(): string[] {
  const suggestions: string[] = [];

  const emptyEpisodes = EPISODES.filter(ep => !ep.title && !ep.synopsis);
  if (emptyEpisodes.length > 0) {
    const ep = emptyEpisodes[Math.floor(Math.random() * emptyEpisodes.length)];
    suggestions.push(`${ep.number}화가 아직 비어있어. 이 화의 핵심 장관은 누구야?`);
  }

  const charsWithoutLines = CHARACTERS.filter(c => c.keyLines.length === 0);
  if (charsWithoutLines.length > 0) {
    const c = charsWithoutLines[Math.floor(Math.random() * charsWithoutLines.length)];
    suggestions.push(`${c.name}의 핵심 대사가 아직 없어. 이 장관이 절대 안 할 말부터 생각해봐.`);
  }

  const recentFragments = FRAGMENTS.slice(0, 5);
  if (recentFragments.length > 0) {
    const f = recentFragments[Math.floor(Math.random() * recentFragments.length)];
    suggestions.push(`최근 파편 "${f.content.slice(0, 30)}..." — 이게 몇 화에 들어갈 수 있을까?`);
  }

  suggestions.push("김형식이 괴력을 봉인 해제하는 장면 첫 문단만 써봐. 3문장이면 충분해.");
  suggestions.push("오늘 하나만 쓴다면? 제일 웃긴 장면 하나 골라서 대사만 써봐.");
  suggestions.push("기재부장관의 간신배 중 한 명 캐릭터를 즉석에서 만들어봐. 이름, 습관, 약점.");

  return suggestions;
}

// ============================================================
// 반영 시스템 — 답변에서 캐릭터/에피소드 자동 감지 후 구조에 반영
// ============================================================
const CHARACTER_NAMES = CHARACTERS.map(c => ({ id: c.id, name: c.name }));
const EPISODE_PATTERN = /(\d{1,2})부/g;
const MAX_EP = EPISODES.length;

function detectMentions(text: string) {
  const chars = CHARACTER_NAMES.filter(c => text.includes(c.name));
  const episodes: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = EPISODE_PATTERN.exec(text)) !== null) {
    const n = parseInt(m[1]);
    if (n >= 1 && n <= MAX_EP && !episodes.includes(n)) episodes.push(n);
  }
  EPISODE_PATTERN.lastIndex = 0;
  return { chars, episodes };
}

type ApplyTarget = { type: "character"; id: string; name: string } | { type: "episode"; number: number } | { type: "world" };

export default function BrainstormPage() {
  const [category, setCategory] = useState<Category>("character");
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<{ id?: string; q: string; a: string; created_at?: string }[]>([]);
  const [suggestions] = useState(getSuggestions);
  const [saving, setSaving] = useState(false);

  // 반영 시스템 state
  const [applyPanel, setApplyPanel] = useState<{ question: string; answer: string; targets: ApplyTarget[] } | null>(null);
  const [applySelected, setApplySelected] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState(false);
  const [applyDone, setApplyDone] = useState(false);

  // Load history from Supabase
  useEffect(() => {
    async function loadHistory() {
      const data = await getBrainstormHistory();
      if (data.length > 0) {
        setHistory(data.map((d) => ({
          id: d.id,
          q: d.question,
          a: d.answer,
          created_at: d.created_at,
        })));
      }
    }
    loadHistory();
  }, []);

  const pickRandom = useCallback(() => {
    const pool = QUESTIONS[category];
    const q = pool[Math.floor(Math.random() * pool.length)];
    setCurrentQuestion(q);
    setAnswer("");
  }, [category]);

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const saveAndNext = async () => {
    if (currentQuestion && answer.trim()) {
      setSaving(true);
      setSaveStatus(null);
      try {
        const data = await saveBrainstorm(currentQuestion, answer.trim(), category);
        if (data) {
          setHistory((prev) => [{ id: data.id, q: data.question, a: data.answer, created_at: data.created_at }, ...prev]);
          setSaveStatus("저장됨!");

          // 반영 시스템: 캐릭터/에피소드 자동 감지
          const { chars, episodes } = detectMentions(answer.trim() + " " + currentQuestion);
          const targets: ApplyTarget[] = [
            ...chars.map(c => ({ type: "character" as const, id: c.id, name: c.name })),
            ...episodes.map(n => ({ type: "episode" as const, number: n })),
            { type: "world" as const },
          ];
          if (targets.length > 1) {
            setApplyPanel({ question: currentQuestion, answer: answer.trim(), targets });
            setApplySelected(new Set(chars.map(c => `char:${c.id}`)));
            setApplyDone(false);
          }
        } else {
          setSaveStatus("저장 실패 — 데이터 없음");
        }
      } catch (err) {
        setSaveStatus("저장 실패: " + String(err));
      }
      setSaving(false);
    }
    setTimeout(() => pickRandom(), 500);
  };

  // 반영 실행
  const applyToTargets = async () => {
    if (!applyPanel) return;
    setApplying(true);
    const snippet = `\n\n---\n**[브레인스토밍]** ${applyPanel.question}\n> ${applyPanel.answer}`;

    const selectedArr = Array.from(applySelected);
    for (const key of selectedArr) {
      if (key.startsWith("char:")) {
        const charId = key.replace("char:", "");
        const char = CHARACTERS.find(c => c.id === charId);
        if (char) {
          await saveCharacterField(char.name, "notes", (char.notes || "") + snippet);
        }
      } else if (key.startsWith("ep:")) {
        const epNum = key.replace("ep:", "");
        await saveScratch(`[brainstorm→ep${epNum}] Q: ${applyPanel.question}\nA: ${applyPanel.answer}`);
      } else if (key === "world") {
        await saveScratch(`[brainstorm→세계관] Q: ${applyPanel.question}\nA: ${applyPanel.answer}`);
      }
    }
    setApplying(false);
    setApplyDone(true);
    setTimeout(() => setApplyPanel(null), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h1 className="font-serif text-2xl font-bold">브레인스토밍</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-8">
        질문에 답하다 보면 이야기가 자라. 틀려도 돼. 일단 써.
      </p>

      {/* Suggestions */}
      <section className="mb-10">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          지금 할 수 있는 것
        </h2>
        <div className="space-y-2">
          {suggestions.slice(0, 3).map((s, i) => (
            <Card key={i} className="bg-card/60 border-primary/10 hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-3 flex items-start gap-3">
                <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                <p className="text-sm text-foreground/80">{s}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Category tabs */}
      <section className="mb-6">
        <div className="flex gap-2 flex-wrap">
          {CATEGORY_INFO.map((cat) => (
            <button
              key={cat.key}
              onClick={() => { setCategory(cat.key); setCurrentQuestion(null); }}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
                category === cat.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              <cat.icon className="w-3 h-3" />
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Question card */}
      <section className="mb-8">
        {currentQuestion ? (
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lightbulb className="w-4 h-4 text-primary" />
                </div>
                <p className="text-foreground leading-relaxed pt-1">
                  {currentQuestion}
                </p>
              </div>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="생각나는 대로 써... 완벽 안 해도 돼."
                className="min-h-[120px] text-sm"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={saveAndNext} disabled={saving} className="gap-1.5">
                  {saving ? "저장 중..." : answer.trim() ? "저장하고 다음" : "건너뛰기"}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
                <Button variant="outline" size="sm" onClick={pickRandom} className="gap-1.5">
                  <Shuffle className="w-3.5 h-3.5" />
                  다른 질문
                </Button>
                {saveStatus && (
                  <span className={`text-xs ${saveStatus.includes("실패") ? "text-destructive" : "text-foreground/80"}`}>
                    {saveStatus}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center space-y-4">
              <Lightbulb className="w-8 h-8 mx-auto text-muted-foreground/30" />
              <p className="text-muted-foreground">
                카테고리를 고르고 질문을 뽑아봐
              </p>
              <Button onClick={pickRandom} className="gap-1.5">
                <Shuffle className="w-4 h-4" />
                질문 뽑기
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* 반영하기 패널 */}
      {applyPanel && (
        <section className="mb-8">
          <Card className="border-border bg-secondary/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-foreground/80" />
                <p className="text-sm font-medium text-foreground/80">이 답변을 어디에 반영할까?</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {applyPanel.targets.map(t => {
                  const key = t.type === "character" ? `char:${t.id}` : t.type === "episode" ? `ep:${t.number}` : "world";
                  const label = t.type === "character" ? `${t.name}` : t.type === "episode" ? `${t.number}부` : "🌏 세계관";
                  const checked = applySelected.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setApplySelected(prev => {
                          const next = new Set(prev);
                          if (next.has(key)) next.delete(key); else next.add(key);
                          return next;
                        });
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        checked
                          ? "bg-secondary text-foreground border-border"
                          : "bg-card/80 text-foreground/80 border-border hover:bg-secondary/50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={applyToTargets} disabled={applying || applySelected.size === 0 || applyDone} className="bg-secondary hover:bg-secondary text-xs gap-1">
                  {applyDone ? "✓ 반영됨!" : applying ? "반영 중..." : `${applySelected.size}개에 반영`}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setApplyPanel(null)} className="text-xs text-muted-foreground">
                  건너뛰기
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* History */}
      {history.length > 0 && (
        <section>
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            지금까지 나온 생각들
          </h2>
          <div className="space-y-3">
            {history.map((item, i) => (
              <Card key={i} className="bg-card/40">
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground">{item.q}</p>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                    {item.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
