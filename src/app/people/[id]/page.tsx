"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit2, Save, ChevronDown, ChevronUp, Pen, BookOpen } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  CHARACTERS,
  getCharacterQuestions,
  getCharacterRelationships,
  CHARACTER_Q_CATEGORIES,
  SCENE_PROMPTS,
} from "@/lib/data";
import { saveBrainstorm, getBrainstormHistory, saveCharacterField } from "@/lib/supabase/actions";
import { Input } from "@/components/ui/input";

// Tension color mapping
const TENSION_COLORS: Record<string, string> = {
  love: "bg-pink-100 text-pink-700 border-pink-200",
  family: "bg-amber-100 text-amber-700 border-amber-200",
  friend: "bg-green-100 text-green-700 border-green-200",
  conflict: "bg-red-100 text-red-700 border-red-200",
  mentor: "bg-blue-100 text-blue-700 border-blue-200",
  loss: "bg-gray-200 text-gray-600 border-gray-300",
};

const TENSION_LABELS: Record<string, string> = {
  love: "사랑",
  family: "가족",
  friend: "우정",
  conflict: "갈등",
  mentor: "멘토",
  loss: "상실",
};

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
};

export default function CharacterDetailPage() {
  const params = useParams();
  const charId = params.id as string;
  const char = CHARACTERS.find((c) => c.id === charId);

  const [notes, setNotes] = useState(char?.notes ?? "");
  const [editing, setEditing] = useState(false);

  // Editable character fields
  const [element, setElement] = useState(char?.element ?? "");
  const [animal, setAnimal] = useState(char?.animal ?? "");
  const [description, setDescription] = useState(char?.description ?? "");
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveProfile = async () => {
    if (!char) return;
    setSavingProfile(true);
    try {
      await saveCharacterField(char.name, "element", element || null);
      await saveCharacterField(char.name, "animal", animal || null);
      await saveCharacterField(char.name, "description", description || null);
      await saveCharacterField(char.name, "notes", notes || null);
      setEditingProfile(false);
    } catch (err) {
      console.error(err);
    }
    setSavingProfile(false);
  };

  // Brainstorm history
  const [answeredMap, setAnsweredMap] = useState<Record<string, string>>({});
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Relationship scene writing
  const [openRelScene, setOpenRelScene] = useState<string | null>(null);
  const [relSceneText, setRelSceneText] = useState<Record<string, string>>({});
  const [savingRel, setSavingRel] = useState<string | null>(null);

  // Character questions
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [savingQ, setSavingQ] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Scene prompts
  const [openScene, setOpenScene] = useState<string | null>(null);
  const [sceneText, setSceneText] = useState<Record<string, string>>({});
  const [savingScene, setSavingScene] = useState<string | null>(null);

  // Load brainstorm history
  const loadHistory = useCallback(async () => {
    try {
      const history = await getBrainstormHistory();
      const map: Record<string, string> = {};
      for (const h of history) {
        map[h.question] = h.answer;
      }
      setAnsweredMap(map);
    } catch {
      // ignore
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (!char) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href="/people"
          className="inline-flex items-center gap-1.5 text-sm text-rose-400 hover:text-rose-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          인물 목록
        </Link>
        <p className="text-gray-500">인물을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const questions = getCharacterQuestions(charId);
  const relationships = getCharacterRelationships(charId);
  const characterScenes = SCENE_PROMPTS.filter((sp) =>
    sp.characters.includes(charId)
  );

  // Count answered questions for this character
  const answeredCount = questions.filter((q) => answeredMap[q.question]).length;
  const totalQuestions = questions.length;

  // Group questions by category
  const questionsByCategory: Record<string, typeof questions> = {};
  for (const q of questions) {
    if (!questionsByCategory[q.category]) {
      questionsByCategory[q.category] = [];
    }
    questionsByCategory[q.category].push(q);
  }

  // Save handlers
  async function handleSaveRelScene(relKey: string, prompt: string) {
    const text = relSceneText[relKey];
    if (!text?.trim()) return;
    setSavingRel(relKey);
    try {
      await saveBrainstorm(prompt, text, `character-${charId}`);
      setAnsweredMap((prev) => ({ ...prev, [prompt]: text }));
      setOpenRelScene(null);
    } catch {
      // ignore
    } finally {
      setSavingRel(null);
    }
  }

  async function handleSaveQuestion(questionText: string) {
    const answer = questionAnswers[questionText];
    if (!answer?.trim()) return;
    setSavingQ(questionText);
    try {
      await saveBrainstorm(questionText, answer, `character-${charId}`);
      setAnsweredMap((prev) => ({ ...prev, [questionText]: answer }));
      setOpenQuestion(null);
    } catch {
      // ignore
    } finally {
      setSavingQ(null);
    }
  }

  async function handleSaveScene(sceneId: string, prompt: string) {
    const text = sceneText[sceneId];
    if (!text?.trim()) return;
    setSavingScene(sceneId);
    try {
      await saveBrainstorm(prompt, text, `character-${charId}`);
      setAnsweredMap((prev) => ({ ...prev, [prompt]: text }));
      setOpenScene(null);
    } catch {
      // ignore
    } finally {
      setSavingScene(null);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-gradient-to-b from-rose-50/50 via-white to-amber-50/30 min-h-screen">
      <Link
        href="/people"
        className="inline-flex items-center gap-1.5 text-sm text-rose-400 hover:text-rose-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        인물 목록
      </Link>

      {/* ─── 1. Header ─── */}
      <div className="flex items-start gap-6 mb-8">
        <div className="w-28 h-36 bg-gradient-to-b from-rose-100 to-amber-50 rounded-lg flex items-center justify-center shrink-0 border border-rose-200">
          <span className="font-serif text-5xl text-rose-300">
            {char.name[0]}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="font-serif text-2xl font-bold text-gray-800">
              {char.name}
            </h1>
            {editingProfile ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400">오행</span>
                  <Input
                    value={element}
                    onChange={(e) => setElement(e.target.value)}
                    placeholder="水/火/木/金/土"
                    className="w-24 h-7 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400">동물</span>
                  <Input
                    value={animal}
                    onChange={(e) => setAnimal(e.target.value)}
                    placeholder="물고기, 새..."
                    className="w-28 h-7 text-xs"
                  />
                </div>
              </>
            ) : (
              <>
                {element && (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 cursor-pointer" onClick={() => setEditingProfile(true)}>
                    {element}
                  </Badge>
                )}
                {animal && (
                  <Badge className="bg-pink-100 text-pink-700 border-pink-200 cursor-pointer" onClick={() => setEditingProfile(true)}>
                    {animal}
                  </Badge>
                )}
                {!element && !animal && (
                  <button onClick={() => setEditingProfile(true)} className="text-[10px] text-rose-300 hover:text-rose-500 border border-dashed border-rose-200 rounded-full px-2 py-0.5">
                    + 오행/동물 설정
                  </button>
                )}
              </>
            )}
          </div>
          {editingProfile ? (
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="인물 설명..."
              className="text-sm mb-3 min-h-[60px]"
            />
          ) : (
            <p className="text-gray-500 mb-3 cursor-pointer hover:text-gray-700" onClick={() => setEditingProfile(true)}>
              {description || "설명을 추가하세요..."}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            {editingProfile && (
              <Button
                size="sm"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                {savingProfile ? "저장 중..." : "프로필 저장"}
              </Button>
            )}
            {editingProfile && (
              <Button variant="outline" size="sm" onClick={() => setEditingProfile(false)}>
                취소
              </Button>
            )}
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-full px-3 py-1 text-sm">
              <BookOpen className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-600 font-medium">
                {answeredCount}/{totalQuestions} 답변 완료
              </span>
              {!loadingHistory && (
                <div className="w-16 h-1.5 bg-rose-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-400 rounded-full transition-all"
                    style={{
                      width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%`,
                    }}
                  />
                </div>
              )}
            </div>
            {!editingProfile && (
              <button onClick={() => setEditingProfile(true)} className="text-[10px] text-rose-300 hover:text-rose-500">
                <Edit2 className="w-3 h-3 inline mr-0.5" />
                편집
              </button>
            )}
          </div>
        </div>
      </div>

      <Separator className="mb-8 bg-rose-100" />

      {/* ─── 2. 기본 정보 + 관계 ─── */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-rose-100 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {Object.entries(char.details).map(([key, val]) => (
              <div key={key} className="flex gap-3 text-sm">
                <span className="text-gray-400 w-20 shrink-0">{key}</span>
                <span className="text-gray-700">{val}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-amber-100 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              관계
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {char.relationships.map((rel, i) => (
              <p key={i} className="text-sm text-gray-600">
                {rel}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ─── 3. 핵심 대사 ─── */}
      {char.keyLines.length > 0 && (
        <Card className="mb-8 border-pink-100 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              핵심 대사
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {char.keyLines.map((line, i) => (
              <p
                key={i}
                className="text-sm text-gray-600 italic border-l-2 border-rose-200 pl-3"
              >
                &ldquo;{line}&rdquo;
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ─── 4. 관계망 ─── */}
      {relationships.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-lg font-bold text-gray-800 mb-4">
            관계망
          </h2>
          <div className="space-y-4">
            {relationships.map((rel) => {
              const otherCharId =
                rel.from === charId ? rel.to : rel.from;
              const otherChar = CHARACTERS.find((c) => c.id === otherCharId);
              const relKey = `${rel.from}-${rel.to}`;
              const isOpen = openRelScene === relKey;
              const existingAnswer = answeredMap[rel.scenePrompt];

              return (
                <Card
                  key={relKey}
                  className="border-rose-100 bg-white shadow-sm"
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800">
                          {otherChar?.name ?? otherCharId}
                        </span>
                        <span className="text-sm text-gray-500">
                          {rel.label}
                        </span>
                        <Badge
                          className={`text-xs border ${TENSION_COLORS[rel.tension]}`}
                        >
                          {TENSION_LABELS[rel.tension]}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setOpenRelScene(isOpen ? null : relKey)
                        }
                        className="text-rose-500 hover:text-rose-700 gap-1"
                      >
                        <Pen className="w-3.5 h-3.5" />
                        장면 쓰기
                      </Button>
                    </div>

                    {existingAnswer && !isOpen && (
                      <p className="text-sm text-green-700 bg-green-50 rounded p-2 mt-2 whitespace-pre-wrap">
                        {existingAnswer}
                      </p>
                    )}

                    {isOpen && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm text-gray-500 italic bg-amber-50 rounded p-2 border border-amber-100">
                          {rel.scenePrompt}
                        </p>
                        <Textarea
                          placeholder="여기에 장면을 써보세요..."
                          className="min-h-[100px] text-sm border-rose-200 focus:border-rose-400"
                          value={relSceneText[relKey] ?? existingAnswer ?? ""}
                          onChange={(e) =>
                            setRelSceneText((prev) => ({
                              ...prev,
                              [relKey]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            handleSaveRelScene(relKey, rel.scenePrompt)
                          }
                          disabled={savingRel === relKey}
                          className="bg-rose-500 hover:bg-rose-600 text-white"
                        >
                          {savingRel === relKey ? "저장 중..." : "저장"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── 5. 캐릭터 질문 ─── */}
      <section className="mb-8">
        <h2 className="font-serif text-lg font-bold text-gray-800 mb-4">
          캐릭터 질문
        </h2>
        <div className="space-y-3">
          {Object.entries(questionsByCategory).map(([cat, qs]) => {
            const catLabel =
              CHARACTER_Q_CATEGORIES[cat] ?? cat;
            const answeredInCat = qs.filter(
              (q) => answeredMap[q.question]
            ).length;
            const isExpanded = expandedCategory === cat;

            return (
              <Card
                key={cat}
                className="border-amber-100 bg-white shadow-sm"
              >
                <CardHeader
                  className="pb-2 pt-3 cursor-pointer"
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : cat)
                  }
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      {catLabel}
                      <span className="text-xs text-gray-400 font-normal">
                        {answeredInCat}/{qs.length}
                      </span>
                    </CardTitle>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="space-y-3 pt-0">
                    {qs.map((q) => {
                      const isAnswered = !!answeredMap[q.question];
                      const isQOpen = openQuestion === q.id;

                      return (
                        <div
                          key={q.id}
                          className={`rounded-lg p-3 border transition-colors ${
                            isAnswered
                              ? "bg-green-50 border-green-200"
                              : "bg-rose-50/50 border-rose-100 hover:border-rose-200"
                          }`}
                        >
                          <div
                            className="flex items-start justify-between cursor-pointer"
                            onClick={() =>
                              setOpenQuestion(isQOpen ? null : q.id)
                            }
                          >
                            <p
                              className={`text-sm flex-1 ${
                                isAnswered
                                  ? "text-green-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {q.question}
                            </p>
                            {isAnswered && (
                              <Badge className="bg-green-100 text-green-600 border-green-200 text-xs ml-2 shrink-0">
                                완료
                              </Badge>
                            )}
                          </div>

                          {isAnswered && !isQOpen && (
                            <p className="text-sm text-green-700 mt-2 whitespace-pre-wrap">
                              {answeredMap[q.question]}
                            </p>
                          )}

                          {isQOpen && (
                            <div className="mt-3 space-y-2">
                              <Textarea
                                placeholder="답변을 써보세요..."
                                className="min-h-[80px] text-sm border-rose-200 focus:border-rose-400"
                                value={
                                  questionAnswers[q.question] ??
                                  answeredMap[q.question] ??
                                  ""
                                }
                                onChange={(e) =>
                                  setQuestionAnswers((prev) => ({
                                    ...prev,
                                    [q.question]: e.target.value,
                                  }))
                                }
                              />
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleSaveQuestion(q.question)
                                }
                                disabled={savingQ === q.question}
                                className="bg-rose-500 hover:bg-rose-600 text-white"
                              >
                                {savingQ === q.question
                                  ? "저장 중..."
                                  : "저장"}
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* ─── 6. 이 인물이 등장하는 장면 ─── */}
      {characterScenes.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-lg font-bold text-gray-800 mb-4">
            이 인물이 등장하는 장면
          </h2>
          <div className="space-y-4">
            {characterScenes.map((sp) => {
              const isSceneOpen = openScene === sp.id;
              const existingAnswer = answeredMap[sp.prompt];

              return (
                <Card
                  key={sp.id}
                  className="border-amber-100 bg-white shadow-sm"
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800 text-sm">
                          {sp.title}
                        </span>
                        <Badge
                          className={`text-xs ${DIFFICULTY_BADGE[sp.difficulty]}`}
                        >
                          {DIFFICULTY_LABELS[sp.difficulty]}
                        </Badge>
                        {sp.episode && (
                          <span className="text-xs text-gray-400">
                            {sp.episode}화
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setOpenScene(isSceneOpen ? null : sp.id)
                        }
                        className="text-amber-600 hover:text-amber-800 gap-1"
                      >
                        <Pen className="w-3.5 h-3.5" />
                        써보기
                      </Button>
                    </div>

                    {existingAnswer && !isSceneOpen && (
                      <p className="text-sm text-green-700 bg-green-50 rounded p-2 mt-2 whitespace-pre-wrap">
                        {existingAnswer}
                      </p>
                    )}

                    {isSceneOpen && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm text-gray-500 italic bg-amber-50 rounded p-2 border border-amber-100">
                          {sp.prompt}
                        </p>
                        <Textarea
                          placeholder="장면을 써보세요..."
                          className="min-h-[100px] text-sm border-amber-200 focus:border-amber-400"
                          value={
                            sceneText[sp.id] ?? existingAnswer ?? ""
                          }
                          onChange={(e) =>
                            setSceneText((prev) => ({
                              ...prev,
                              [sp.id]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            handleSaveScene(sp.id, sp.prompt)
                          }
                          disabled={savingScene === sp.id}
                          className="bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          {savingScene === sp.id ? "저장 중..." : "저장"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── 7. 메모 ─── */}
      <Card className="border-rose-100 bg-white shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-700">
            메모
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(!editing)}
            className="gap-1.5 text-rose-500 hover:text-rose-700"
          >
            {editing ? (
              <>
                <Save className="w-3.5 h-3.5" />
                저장
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                편집
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {editing ? (
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px] text-sm border-rose-200 focus:border-rose-400"
            />
          ) : (
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              {notes || "아직 메모가 없습니다."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
