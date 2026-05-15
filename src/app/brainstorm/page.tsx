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
import { saveBrainstorm, getBrainstormHistory } from "@/lib/supabase/actions";

// ============================================================
// 브레인스토밍 질문 뱅크 — 작품 맥락에 맞는 질문들
// ============================================================
const QUESTIONS = {
  character: [
    "김형식이 32년간 관료 생활하면서 딱 한 번 규칙을 어긴 적이 있다면 언제야?",
    "문형철이 기업인 시절에 제일 큰 돈을 벌었던 건은 뭐야? 그게 왜 더러워?",
    "박잭슨이 외교부장관이 된 진짜 이유는 뭐야? 외세 연결 말고.",
    "김형식 아내가 화기 접신 전에 가장 무미건조했던 하루는 어땠어?",
    "대통령이 치매 걸리기 전에 제일 잘했던 정책은 뭐야? 기억이나 해?",
    "국토교통부 장관의 토기운은 언제 처음 발현됐어?",
    "김광태가 '고소가 안될텐데요? 하하하' 할 때 진짜 웃는 거야?",
    "노양진이 회칼 쓰는 법을 누구한테 배웠어?",
    "행안부 차관이 도움이 안 되는 이유가 무능이야 배신이야?",
    "문형철 간신배 중에 제일 충성스러운 놈은 누구야? 왜 붙어있어?",
    "김형식이 봉인된 괴력을 처음 자각한 순간은 언제야?",
    "김형식과 문형철이 처음 만난 날은 어땠어?",
    "대통령이 기도할 때 진짜로 비는 건 뭐야?",
    "문형철이 여자에 인기 많은 비결이 뭐야? 외모? 돈? 말빨?",
    "김형식이 퇴근하고 집에서 혼자 할 때 하는 루틴은?",
  ],
  scene: [
    "김형식이 팬티 찢기면서 괴력이 발동하는 순간 — 주변 사람들 표정은?",
    "책상이 부러지는 장면에서 소리를 묘사해봐. 나무? 철재? 유리?",
    "유리창이 깨지는 순간 파편이 날아가는 슬로모션을 써봐.",
    "김형식이 회의실에서 참다참다 주먹을 쥐는 장면 — 손등 혈관 묘사.",
    "문형철이 간신배들 데리고 고급 레스토랑에서 밀담하는 장면의 분위기는?",
    "노양진이 회칼로 방어를 잡는 장면 — 국회 수산위 회의 중에?",
    "대통령이 치매로 이름을 까먹는 순간의 정적을 묘사해봐.",
    "국토교통부 장관이 토기운으로 땅을 읽는 장면은 어떤 화면이야?",
    "김형식 아내가 화기 접신하는 순간 — 불꽃? 체온? 눈빛?",
    "박잭슨이 외국 대사와 은밀하게 만나는 장소는 어디야? 왜 거기야?",
  ],
  theme: [
    "규칙을 지키는 게 폭력보다 강할 수 있어? 아니면 결국 주먹이 이겨?",
    "32년 관료가 봉인을 푸는 순간, 그건 해방이야 타락이야?",
    "공무원 사회에서 '정의'는 규정 준수야? 아니면 뭔가 다른 거야?",
    "문형철 같은 악당이 시스템 안에서 번창하는 이유가 뭐야?",
    "괴력이 은유라면 뭘 의미해? 억눌린 분노? 공무원의 한계?",
    "치매 걸린 대통령은 비극이야 희극이야? 왜?",
    "간신배 정치는 조선시대나 지금이나 뭐가 달라?",
    "이 이야기에서 '규칙'은 방패야 족쇄야?",
    "관료주의가 악인을 보호하는 방패가 되는 순간은 언제야?",
    "김형식이 괴력을 봉인한 이유와 푸는 이유 중 뭐가 더 인간적이야?",
  ],
  structure: [
    "이 이야기를 영화로 만들면 첫 장면은 뭐야? 웹툰이면?",
    "코미디 텐션이 가장 높아지는 지점은 어디야? 왜?",
    "웹툰 버전에서 괴력 장면의 연출은 어떻게 달라져야 해?",
    "웹소설이면 회차 끊기는 어디서 해야 독자가 다음 화를 눌러?",
    "장관들 간의 대립 구도를 한 문장으로 정리하면?",
    "김형식 vs 문형철 대결의 클라이맥스는 물리적 싸움이야 제도적 싸움이야?",
    "코미디와 액션의 비율은 몇 대 몇이 적절해?",
    "각 장관의 에피소드를 옴니버스로 할 거야 일직선으로 할 거야?",
    "관객이 문형철을 미워하다가 동정하게 만드는 타이밍은?",
    "엔딩에서 김형식은 다시 봉인해야 해? 아니면 괴력을 인정해?",
  ],
  wild: [
    "이 세계관에서 장관들끼리 체육대회 하면 종목별 1등은?",
    "김형식이 마블 유니버스에 들어가면 어떤 히어로랑 붙어?",
    "현직 공무원이 이 작품 보면 제일 공감하는 장면은?",
    "이 이야기의 냄새는 뭐야? 관공서 복도? 문형철 향수?",
    "노양진이 회칼 대신 다른 무기를 쓴다면?",
    "대통령 치매 개그 중 제일 웃긴 상황을 즉석에서 만들어봐.",
    "국회 청문회에서 김형식이 괴력을 들킬 뻔하는 장면은?",
    "이 이야기를 현실 정치인으로 캐스팅하면 누가 누구야?",
    "김광태가 진짜 고소당하면 어떤 표정이야?",
    "행안부 차관이 기적적으로 도움이 되는 순간이 딱 한 번 온다면 언제야?",
  ],
};

type Category = keyof typeof QUESTIONS;

const CATEGORY_INFO: { key: Category; label: string; icon: typeof Lightbulb; color: string }[] = [
  { key: "character", label: "인물", icon: MessageCircle, color: "text-rose-400" },
  { key: "scene", label: "장면", icon: Pen, color: "text-blue-400" },
  { key: "theme", label: "테마", icon: Lightbulb, color: "text-amber-400" },
  { key: "structure", label: "구조", icon: ChevronRight, color: "text-emerald-400" },
  { key: "wild", label: "와일드", icon: Sparkles, color: "text-purple-400" },
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
  suggestions.push("문형철의 간신배 중 한 명 캐릭터를 즉석에서 만들어봐. 이름, 습관, 약점.");

  return suggestions;
}

export default function BrainstormPage() {
  const [category, setCategory] = useState<Category>("character");
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<{ id?: string; q: string; a: string; created_at?: string }[]>([]);
  const [suggestions] = useState(getSuggestions);
  const [saving, setSaving] = useState(false);

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
                  <span className={`text-xs ${saveStatus.includes("실패") ? "text-destructive" : "text-emerald-600"}`}>
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
