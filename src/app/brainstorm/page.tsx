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
    "다정이가 제일 싫어하는 자기 습관은 뭐야?",
    "정우는 다정이 없을 때 혼자 뭐 해?",
    "서현이가 가장 행복했던 순간은 언제야?",
    "수박형이 죽기 전날 뭐 했을까?",
    "엄마가 공부방 시작한 이유가 뭐야? 진짜 이유.",
    "아빠가 로또 당첨되면 제일 먼저 뭘 할까?",
    "언니(아정)가 식이장애 시작 전에 제일 좋아하던 음식은?",
    "할머니가 살아있을 때 다정이한테 가장 많이 한 말은?",
    "연우는 왜 이 빠진 채로 살아? 진짜 이유가 뭐야?",
    "한울이 눈치 없는 거 본인은 알아?",
    "다정이 핸드폰 배경화면은 뭐야? 왜?",
    "정우가 카페 문 닫고 혼자 있을 때 듣는 음악은?",
    "서현 아빠가 아들 자랑 안 하는 날이 있어? 그날 뭐가 달라?",
    "다정이네 가족이 마지막으로 같이 웃은 게 언제야?",
    "정우 패거리가 처음 모인 날은 어땠어?",
  ],
  scene: [
    "뮤지컬 씬에서 다정이 옷이 파리로 바뀔 때, 발밑의 바닥은 뭐야?",
    "편의점 어린 다정 장면 — 편의점 안에 뭐가 진열돼 있어?",
    "정우가 유리창에 머리 박을 때, 카페에 노래가 나오고 있어?",
    "다정이 지하철 지나칠 때 창밖에 뭐가 보여?",
    "공부방에서 학생이 울면 다정이 엄마는 뭐라고 해?",
    "서현이 병원 빈 침대에 진짜 눕는 장면을 써본다면?",
    "광명 빌라가 철거되는 날, 다정이 어디서 뭐 해?",
    "'늦더라도 오면 됐지' — 이 말 뒤에 이어지는 5초의 침묵을 묘사해봐.",
    "핑크색 풍선이 처음 터지는 순간의 소리는 어때?",
    "다정이가 픽사 채용공고를 닫고 나서 하는 행동은?",
  ],
  theme: [
    "착각이 깨지는 순간은 항상 아플까? 안 아픈 착각 깨짐도 있어?",
    "'인생에 의미는 없지만 형태는 있다' — 형태가 뭐야? 구체적으로.",
    "올바른 하루를 포기하는 순간과 올바른 하루가 필요 없어지는 순간은 달라?",
    "다정이가 '다정이는 다정이다'를 깨닫는 건 어떤 감각이야? 시각? 촉각?",
    "꿈이 사라진 자리에 뭐가 남아? 빈 공간? 아니면 뭔가 다른 것?",
    "할머니가 사라지는 건 슬픈 거야? 아니면 졸업 같은 거야?",
    "돌아돌아 가는 게 낭비야? 아니면 그게 유일한 방법이야?",
    "이 이야기에서 '돈'은 산소야? 독이야? 둘 다야?",
    "가난이 전염병이 아니라면, 가난은 뭐야?",
    "매지컬 리얼리즘이 이 이야기에 필요한 이유가 뭐야? 현실만으로는 왜 안 돼?",
  ],
  structure: [
    "16부 중에 가장 조용한 부는 몇 부야? 왜?",
    "소설 버전과 각본 버전에서 가장 크게 달라지는 장면은?",
    "이 이야기를 한 문장으로 줄이면? 그 문장이 독자에게 남기는 감정은?",
    "옴니버스인데, 부와 부 사이의 연결고리는 뭐야? 시간? 장소? 물건?",
    "첫 장면과 마지막 장면이 같은 장소라면 그 장소는 어디야?",
    "독자가 6부쯤에서 책을 덮고 싶어질 수 있어. 어떻게 잡아?",
    "각 부의 '다정이는 ___이다' 패턴이 사라지는 시점은 언제야? 왜?",
    "GTA5식 화면전환을 소설에서 어떻게 표현해?",
    "드라마에서 이 이야기의 첫 5초는 어떤 화면이야?",
    "엔딩 크레딧이 올라갈 때 어떤 노래가 나와?",
  ],
  wild: [
    "다정이가 10년 후에 이 이야기를 읽으면 뭐라고 할까?",
    "이 이야기를 싫어하는 사람은 왜 싫어해?",
    "넷플릭스 썸네일에 어떤 장면을 넣을 거야?",
    "이 이야기의 냄새는 뭐야?",
    "다정이가 니한테 한마디 할 수 있다면 뭐라고 해?",
    "이 이야기를 색깔 하나로 표현하면?",
    "니가 이 이야기를 안 쓰면 어떻게 돼?",
    "이 이야기에서 제일 웃긴 장면은 뭐야? 아직 안 썼으면 지금 떠올려봐.",
    "다정이네 동네에서 제일 유명한 사람은 누구야?",
    "10년 뒤 다정이가 후배한테 해줄 조언 한 마디는?",
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
    suggestions.push(`${ep.number}부가 아직 비어있어. 이 부의 중심 인물은 누구일까?`);
  }

  const charsWithoutLines = CHARACTERS.filter(c => c.keyLines.length === 0);
  if (charsWithoutLines.length > 0) {
    const c = charsWithoutLines[Math.floor(Math.random() * charsWithoutLines.length)];
    suggestions.push(`${c.name}의 핵심 대사가 아직 없어. 이 사람이 절대 하지 않을 말은 뭐야? 거기서 역으로 찾아봐.`);
  }

  const recentFragments = FRAGMENTS.slice(0, 5);
  if (recentFragments.length > 0) {
    const f = recentFragments[Math.floor(Math.random() * recentFragments.length)];
    suggestions.push(`최근 파편 "${f.content.slice(0, 30)}..." — 이게 몇 부에 들어갈 수 있을까?`);
  }

  suggestions.push("소설 초고 1부 첫 문단만 써봐. 완벽 안 해도 돼. 3문장이면 충분해.");
  suggestions.push("오늘 뭔가 하나만 쓴다면? 가장 쓰고 싶은 장면 하나만 골라.");
  suggestions.push("다정이 취향 아무거나 하나 정해봐. 좋아하는 음식? 싫어하는 계절?");

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
