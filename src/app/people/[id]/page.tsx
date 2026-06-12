"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit2, Save, ChevronDown, ChevronUp, Pen, BookOpen, Plus, Check, X } from "lucide-react";
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
import { saveBrainstorm, getBrainstormHistory, saveCharacterField, getCharacterOverrides, saveScratch, getScratchItems } from "@/lib/supabase/actions";
import { Input } from "@/components/ui/input";

// Tension color mapping
const TENSION_COLORS: Record<string, string> = {
  love: "bg-primary/10 text-primary border-primary/25",
  family: "bg-primary/10 text-primary border-primary/25",
  friend: "bg-secondary/50 text-foreground/80 border-border",
  conflict: "bg-primary/10 text-primary border-primary/25",
  mentor: "bg-secondary/50 text-foreground/80 border-border",
  loss: "bg-secondary/40 text-foreground/80 border-border",
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
  easy: "bg-secondary/50 text-foreground/80",
  medium: "bg-primary/10 text-primary",
  hard: "bg-primary/10 text-primary",
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
  const [charName, setCharName] = useState(char?.name ?? "");
  const [element, setElement] = useState(char?.element ?? "");
  const [animal, setAnimal] = useState(char?.animal ?? "");
  const [description, setDescription] = useState(char?.description ?? "");
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // DB에서 저장된 캐릭터 데이터 로드
  useEffect(() => {
    if (!char) return;
    getCharacterOverrides().then((overrides) => {
      const saved = overrides[char.name];
      if (saved) {
        if (saved.name) setCharName(saved.name as string);
        if (saved.notes) setNotes(saved.notes as string);
        if (saved.element) setElement(saved.element as string);
        if (saved.animal) setAnimal(saved.animal as string);
        if (saved.description) setDescription(saved.description as string);
      }
    }).catch(() => {});
  }, [char]);

  const handleSaveProfile = async () => {
    if (!char) return;
    setSavingProfile(true);
    try {
      const saveName = char.name; // 원본 이름으로 DB 조회
      if (charName !== char.name) {
        await saveCharacterField(saveName, "name", charName);
      }
      await saveCharacterField(saveName, "element", element || null);
      await saveCharacterField(saveName, "animal", animal || null);
      await saveCharacterField(saveName, "description", description || null);
      await saveCharacterField(saveName, "notes", notes || null);
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

  // Memo → Question picker
  const [showQuestionPicker, setShowQuestionPicker] = useState(false);

  // Scene prompts
  const [openScene, setOpenScene] = useState<string | null>(null);
  const [sceneText, setSceneText] = useState<Record<string, string>>({});
  const [savingScene, setSavingScene] = useState<string | null>(null);

  // Editable relationships
  type TensionType = "love" | "family" | "friend" | "conflict" | "mentor" | "loss";
  interface RelOverride { label?: string; tension?: TensionType; scenePrompt?: string }
  const [relOverrides, setRelOverrides] = useState<Record<string, RelOverride>>({});
  const [editingRelLabel, setEditingRelLabel] = useState<string | null>(null);
  const [editingRelPrompt, setEditingRelPrompt] = useState<string | null>(null);
  const [tempRelLabel, setTempRelLabel] = useState("");
  const [tempRelPrompt, setTempRelPrompt] = useState("");
  const [savingRelEdit, setSavingRelEdit] = useState<string | null>(null);
  const [customRels, setCustomRels] = useState<{ from: string; to: string; label: string; tension: TensionType; scenePrompt: string }[]>([]);
  const [addingRel, setAddingRel] = useState(false);
  const [newRelTo, setNewRelTo] = useState("");
  const [newRelLabel, setNewRelLabel] = useState("");
  const [newRelTension, setNewRelTension] = useState<TensionType>("friend");
  const [newRelPrompt, setNewRelPrompt] = useState("");

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

  // Load relationship overrides from scratch
  useEffect(() => {
    if (!charId) return;
    getScratchItems().then((items) => {
      const overrides: Record<string, RelOverride> = {};
      const customs: typeof customRels = [];
      const seenKeys = new Set<string>();
      for (const item of items) {
        const content = item.content as string;
        if (!content) continue;
        const match = content.match(/^\[rel:([^:]+):([^:]+)\]\s*([\s\S]+)$/);
        if (!match) continue;
        const [, fromId, toId, jsonStr] = match;
        // Only load relationships relevant to this character
        if (fromId !== charId && toId !== charId) continue;
        const key = `${fromId}-${toId}`;
        if (seenKeys.has(key)) continue; // first = newest, skip older
        seenKeys.add(key);
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed._custom) {
            customs.push({ from: fromId, to: toId, label: parsed.label ?? "", tension: parsed.tension ?? "friend", scenePrompt: parsed.scenePrompt ?? "" });
          } else {
            overrides[key] = parsed;
          }
        } catch { /* ignore */ }
      }
      setRelOverrides(overrides);
      setCustomRels(customs);
    }).catch(() => {});
  }, [charId]);

  if (!char) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href="/people"
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          인물 목록
        </Link>
        <p className="text-muted-foreground">인물을 찾을 수 없습니다.</p>
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

  async function saveRelOverride(fromId: string, toId: string, override: RelOverride & { _custom?: boolean }) {
    const key = `${fromId}-${toId}`;
    setSavingRelEdit(key);
    try {
      const marker = `[rel:${fromId}:${toId}]`;
      await saveScratch(`${marker} ${JSON.stringify(override)}`);
      if (!override._custom) {
        setRelOverrides((prev) => ({ ...prev, [key]: override }));
      }
    } catch (err) {
      console.error(err);
    }
    setSavingRelEdit(null);
  }

  async function handleAddRelationship() {
    if (!newRelTo.trim() || !newRelLabel.trim()) return;
    const toId = newRelTo.trim();
    const newRel = { from: charId, to: toId, label: newRelLabel, tension: newRelTension, scenePrompt: newRelPrompt || `${charName}와(과) ${toId}의 관계를 보여주는 장면을 써보세요.` };
    await saveRelOverride(charId, toId, { ...newRel, _custom: true });
    setCustomRels((prev) => [newRel, ...prev.filter(r => !(r.from === charId && r.to === toId))]);
    setAddingRel(false);
    setNewRelTo("");
    setNewRelLabel("");
    setNewRelTension("friend");
    setNewRelPrompt("");
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
    <div className="max-w-3xl mx-auto px-6 py-10 bg-gradient-to-b from-primary/20 via-white to-accent/15 min-h-screen">
      <Link
        href="/people"
        className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        인물 목록
      </Link>

      {/* ─── 1. Header ─── */}
      <div className="flex items-start gap-6 mb-8">
        <div className="w-28 h-36 bg-gradient-to-b from-primary/20 to-accent/15 rounded-lg flex items-center justify-center shrink-0 border border-primary/25">
          <span className="font-serif text-5xl text-accent">
            {charName[0] || "?"}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            {editingProfile ? (
              <Input
                value={charName}
                onChange={(e) => setCharName(e.target.value)}
                className="font-serif text-2xl font-bold h-10 w-48"
              />
            ) : (
              <h1 className="font-serif text-2xl font-bold text-foreground/80">
                {charName}
              </h1>
            )}
            {editingProfile ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">오행</span>
                  <Input
                    value={element}
                    onChange={(e) => setElement(e.target.value)}
                    placeholder="水/火/木/金/土"
                    className="w-24 h-7 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">동물</span>
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
                  <Badge className="bg-primary/10 text-primary border-primary/25 cursor-pointer" onClick={() => setEditingProfile(true)}>
                    {element}
                  </Badge>
                )}
                {animal && (
                  <Badge className="bg-primary/10 text-primary border-primary/25 cursor-pointer" onClick={() => setEditingProfile(true)}>
                    {animal}
                  </Badge>
                )}
                {!element && !animal && (
                  <button onClick={() => setEditingProfile(true)} className="text-[10px] text-accent hover:text-primary border border-dashed border-primary/25 rounded-full px-2 py-0.5">
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
            <p className="text-muted-foreground mb-3 cursor-pointer hover:text-foreground/80" onClick={() => setEditingProfile(true)}>
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
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-3 py-1 text-sm">
              <BookOpen className="w-3.5 h-3.5 text-accent" />
              <span className="text-primary font-medium">
                {answeredCount}/{totalQuestions} 답변 완료
              </span>
              {!loadingHistory && (
                <div className="w-16 h-1.5 bg-primary/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%`,
                    }}
                  />
                </div>
              )}
            </div>
            {!editingProfile && (
              <button onClick={() => setEditingProfile(true)} className="text-[10px] text-accent hover:text-primary">
                <Edit2 className="w-3 h-3 inline mr-0.5" />
                편집
              </button>
            )}
          </div>
        </div>
      </div>

      <Separator className="mb-8 bg-primary/10" />

      {/* ─── 2. 기본 정보 + 관계 ─── */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-primary/25 bg-card/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/80">
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {Object.entries(char.details).map(([key, val]) => (
              <div key={key} className="flex gap-3 text-sm">
                <span className="text-muted-foreground w-20 shrink-0">{key}</span>
                <span className="text-foreground/80">{val}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/25 bg-card/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/80">
              관계
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {char.relationships.map((rel, i) => (
              <p key={i} className="text-sm text-foreground/80">
                {rel}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ─── 3. 핵심 대사 ─── */}
      {char.keyLines.length > 0 && (
        <Card className="mb-8 border-primary/25 bg-card/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/80">
              핵심 대사
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {char.keyLines.map((line, i) => (
              <p
                key={i}
                className="text-sm text-foreground/80 italic border-l-2 border-primary/25 pl-3"
              >
                &ldquo;{line}&rdquo;
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ─── 4. 관계망 ─── */}
      {(relationships.length > 0 || customRels.length > 0) && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-bold text-foreground/80">
              관계망
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddingRel(!addingRel)}
              className="gap-1 text-primary hover:text-primary border-primary/25"
            >
              <Plus className="w-3.5 h-3.5" />
              관계 추가
            </Button>
          </div>

          {/* 새 관계 추가 폼 */}
          {addingRel && (
            <Card className="border-primary/25 border-dashed bg-primary/10 shadow-sm mb-4">
              <CardContent className="pt-4 pb-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={newRelTo}
                    onChange={(e) => setNewRelTo(e.target.value)}
                    className="text-sm border border-primary/25 rounded px-2 py-1.5 bg-card/80"
                  >
                    <option value="">상대 인물 선택...</option>
                    {CHARACTERS.filter((c) => c.id !== charId).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <Input
                    value={newRelLabel}
                    onChange={(e) => setNewRelLabel(e.target.value)}
                    placeholder="관계 설명 (예: 첫사랑)"
                    className="w-40 h-8 text-sm"
                  />
                  <select
                    value={newRelTension}
                    onChange={(e) => setNewRelTension(e.target.value as TensionType)}
                    className="text-sm border border-primary/25 rounded px-2 py-1.5 bg-card/80"
                  >
                    {Object.entries(TENSION_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <Input
                  value={newRelPrompt}
                  onChange={(e) => setNewRelPrompt(e.target.value)}
                  placeholder="장면 프롬프트 (비워두면 자동 생성)"
                  className="h-8 text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddRelationship} className="bg-primary hover:bg-primary text-foreground gap-1">
                    <Check className="w-3.5 h-3.5" />
                    추가
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAddingRel(false)}>
                    취소
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {[...relationships, ...customRels].map((rel) => {
              const otherCharId =
                rel.from === charId ? rel.to : rel.from;
              const otherChar = CHARACTERS.find((c) => c.id === otherCharId);
              const relKey = `${rel.from}-${rel.to}`;
              const override = relOverrides[relKey];
              const effectiveLabel = override?.label ?? rel.label;
              const effectiveTension = override?.tension ?? rel.tension;
              const effectivePrompt = override?.scenePrompt ?? rel.scenePrompt;
              const isOpen = openRelScene === relKey;
              const existingAnswer = answeredMap[effectivePrompt];
              const isEditingLabel = editingRelLabel === relKey;
              const isEditingPrompt = editingRelPrompt === relKey;
              const isSaving = savingRelEdit === relKey;

              return (
                <Card
                  key={relKey}
                  className="border-primary/25 bg-card/80 shadow-sm"
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground/80">
                          {otherChar?.name ?? otherCharId}
                        </span>

                        {/* Editable label */}
                        {isEditingLabel ? (
                          <span className="flex items-center gap-1">
                            <Input
                              autoFocus
                              value={tempRelLabel}
                              onChange={(e) => setTempRelLabel(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const updated = { ...override, label: tempRelLabel };
                                  saveRelOverride(rel.from, rel.to, updated);
                                  setEditingRelLabel(null);
                                } else if (e.key === "Escape") {
                                  setEditingRelLabel(null);
                                }
                              }}
                              onBlur={() => {
                                if (tempRelLabel !== effectiveLabel) {
                                  const updated = { ...override, label: tempRelLabel };
                                  saveRelOverride(rel.from, rel.to, updated);
                                }
                                setEditingRelLabel(null);
                              }}
                              className="w-32 h-6 text-sm py-0 px-1.5"
                            />
                          </span>
                        ) : (
                          <span
                            className="text-sm text-muted-foreground cursor-pointer hover:text-foreground/80 hover:underline decoration-dashed"
                            onClick={() => {
                              setEditingRelLabel(relKey);
                              setTempRelLabel(effectiveLabel);
                            }}
                          >
                            {effectiveLabel}
                          </span>
                        )}

                        {/* Tension dropdown */}
                        <select
                          value={effectiveTension}
                          onChange={(e) => {
                            const newTension = e.target.value as TensionType;
                            const updated = { ...override, tension: newTension };
                            saveRelOverride(rel.from, rel.to, updated);
                            // Update customRels if this is a custom relationship
                            setCustomRels((prev) => prev.map((r) => `${r.from}-${r.to}` === relKey ? { ...r, tension: newTension } : r));
                          }}
                          className={`text-xs border rounded-full px-2 py-0.5 cursor-pointer ${TENSION_COLORS[effectiveTension]}`}
                        >
                          {Object.entries(TENSION_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>

                        {isSaving && <span className="text-xs text-muted-foreground">저장 중...</span>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setOpenRelScene(isOpen ? null : relKey)
                        }
                        className="text-primary hover:text-primary gap-1"
                      >
                        <Pen className="w-3.5 h-3.5" />
                        장면 쓰기
                      </Button>
                    </div>

                    {/* Editable scene prompt (shown below label) */}
                    {isEditingPrompt ? (
                      <div className="mt-1 mb-2 flex items-start gap-1">
                        <Textarea
                          autoFocus
                          value={tempRelPrompt}
                          onChange={(e) => setTempRelPrompt(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              const updated = { ...override, scenePrompt: tempRelPrompt };
                              saveRelOverride(rel.from, rel.to, updated);
                              setEditingRelPrompt(null);
                            } else if (e.key === "Escape") {
                              setEditingRelPrompt(null);
                            }
                          }}
                          className="text-xs min-h-[40px] border-primary/25 focus:border-primary/25"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = { ...override, scenePrompt: tempRelPrompt };
                            saveRelOverride(rel.from, rel.to, updated);
                            setEditingRelPrompt(null);
                          }}
                          className="shrink-0 text-foreground/80 p-1 h-auto"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingRelPrompt(null)}
                          className="shrink-0 text-muted-foreground p-1 h-auto"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <p
                        className="text-xs text-muted-foreground mt-1 cursor-pointer hover:text-foreground/80"
                        onClick={() => {
                          setEditingRelPrompt(relKey);
                          setTempRelPrompt(effectivePrompt);
                        }}
                      >
                        <Edit2 className="w-2.5 h-2.5 inline mr-1" />
                        {effectivePrompt.length > 60 ? effectivePrompt.slice(0, 60) + "..." : effectivePrompt}
                      </p>
                    )}

                    {existingAnswer && !isOpen && (
                      <p className="text-sm text-foreground/80 bg-secondary/50 rounded p-2 mt-2 whitespace-pre-wrap">
                        {existingAnswer}
                      </p>
                    )}

                    {isOpen && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm text-muted-foreground italic bg-primary/10 rounded p-2 border border-primary/25">
                          {effectivePrompt}
                        </p>
                        <Textarea
                          placeholder="여기에 장면을 써보세요..."
                          className="min-h-[100px] text-sm border-primary/25 focus:border-primary/25"
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
                            handleSaveRelScene(relKey, effectivePrompt)
                          }
                          disabled={savingRel === relKey}
                          className="bg-primary hover:bg-primary text-foreground"
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
        <h2 className="font-serif text-lg font-bold text-foreground/80 mb-4">
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
                className="border-primary/25 bg-card/80 shadow-sm"
              >
                <CardHeader
                  className="pb-2 pt-3 cursor-pointer"
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : cat)
                  }
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                      {catLabel}
                      <span className="text-xs text-muted-foreground font-normal">
                        {answeredInCat}/{qs.length}
                      </span>
                    </CardTitle>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
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
                              ? "bg-secondary/50 border-border"
                              : "bg-primary/10 border-primary/25 hover:border-primary/25"
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
                                  ? "text-foreground/80"
                                  : "text-foreground/80"
                              }`}
                            >
                              {q.question}
                            </p>
                            {isAnswered && (
                              <Badge className="bg-secondary/50 text-foreground/80 border-border text-xs ml-2 shrink-0">
                                완료
                              </Badge>
                            )}
                          </div>

                          {isAnswered && !isQOpen && (
                            <p className="text-sm text-foreground/80 mt-2 whitespace-pre-wrap">
                              {answeredMap[q.question]}
                            </p>
                          )}

                          {isQOpen && (
                            <div className="mt-3 space-y-2">
                              <Textarea
                                placeholder="답변을 써보세요..."
                                className="min-h-[80px] text-sm border-primary/25 focus:border-primary/25"
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
                                className="bg-primary hover:bg-primary text-foreground"
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
          <h2 className="font-serif text-lg font-bold text-foreground/80 mb-4">
            이 인물이 등장하는 장면
          </h2>
          <div className="space-y-4">
            {characterScenes.map((sp) => {
              const isSceneOpen = openScene === sp.id;
              const existingAnswer = answeredMap[sp.prompt];

              return (
                <Card
                  key={sp.id}
                  className="border-primary/25 bg-card/80 shadow-sm"
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground/80 text-sm">
                          {sp.title}
                        </span>
                        <Badge
                          className={`text-xs ${DIFFICULTY_BADGE[sp.difficulty]}`}
                        >
                          {DIFFICULTY_LABELS[sp.difficulty]}
                        </Badge>
                        {sp.episode && (
                          <span className="text-xs text-muted-foreground">
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
                        className="text-primary hover:text-primary gap-1"
                      >
                        <Pen className="w-3.5 h-3.5" />
                        써보기
                      </Button>
                    </div>

                    {existingAnswer && !isSceneOpen && (
                      <p className="text-sm text-foreground/80 bg-secondary/50 rounded p-2 mt-2 whitespace-pre-wrap">
                        {existingAnswer}
                      </p>
                    )}

                    {isSceneOpen && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm text-muted-foreground italic bg-primary/10 rounded p-2 border border-primary/25">
                          {sp.prompt}
                        </p>
                        <Textarea
                          placeholder="장면을 써보세요..."
                          className="min-h-[100px] text-sm border-primary/25 focus:border-primary/25"
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
                          className="bg-primary hover:bg-primary text-foreground"
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
      <Card className="border-primary/25 bg-card/80 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground/80">
            메모
          </CardTitle>
          <div className="flex gap-2">
            {notes.trim().length > 30 && !editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQuestionPicker((v) => !v)}
                className="gap-1.5 text-primary hover:text-primary border-primary/25"
              >
                <Pen className="w-3.5 h-3.5" />
                {showQuestionPicker ? "접기" : "질문에 반영"}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                if (editing && char) {
                  await saveCharacterField(char.name, "notes", notes || null);
                }
                setEditing(!editing);
              }}
              className="gap-1.5 text-primary hover:text-primary"
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
          </div>
        </CardHeader>
        <CardContent>
          {editing ? (
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="길게 붙여넣으면 캐릭터 질문 답변으로 활용 가능"
              className="min-h-[120px] text-sm border-primary/25 focus:border-primary/25"
            />
          ) : (
            <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {notes || "아직 메모가 없습니다. 길게 붙여넣으면 캐릭터 질문 답변으로 활용할 수 있어요."}
            </p>
          )}

          {/* 미답변 질문에 반영 패널 */}
          {showQuestionPicker && (
            <div className="mt-4 border-t border-primary/25 pt-4">
              <p className="text-xs text-primary mb-3">미답변 질문을 클릭하면 메모 내용이 답변으로 저장됩니다</p>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {questions.filter((q) => !answeredMap[q.question]).length === 0 ? (
                  <p className="text-xs text-muted-foreground">모든 질문에 답변 완료!</p>
                ) : (
                  questions
                    .filter((q) => !answeredMap[q.question])
                    .map((q) => (
                      <button
                        key={q.id}
                        onClick={async () => {
                          setSavingQ(q.question);
                          try {
                            await saveBrainstorm(q.question, notes, `character-${charId}`);
                            setAnsweredMap((prev) => ({ ...prev, [q.question]: notes }));
                          } catch { /* ignore */ }
                          setSavingQ(null);
                        }}
                        disabled={savingQ === q.question}
                        className="w-full text-left text-sm p-2.5 rounded-lg border border-primary/25 hover:bg-primary/10 hover:border-primary/25 transition-colors disabled:opacity-50"
                      >
                        <span className="text-xs text-primary mr-1.5">{CHARACTER_Q_CATEGORIES[q.category] ?? q.category}</span>
                        {q.question}
                        {savingQ === q.question && <span className="text-xs text-accent ml-2">저장 중...</span>}
                      </button>
                    ))
                )}
              </div>
            </div>
          )}

          {/* 떡밥 자동 수집 */}
          {(() => {
            if (!notes.trim()) return null;

            const CATEGORIES: { label: string; color: string; patterns: RegExp[] }[] = [
              { label: "미회수 떡밥", color: "red", patterns: [/미회수/, /떡밥/, /복선/, /떠넘/] },
              { label: "비밀/숨김", color: "purple", patterns: [/비밀/, /숨기/, /감추/, /몰래/, /들키/] },
              { label: "발전 가능", color: "amber", patterns: [/발전/, /가능/, /열린/, /나중에/, /이후에/, /언젠가/] },
              { label: "미해결", color: "blue", patterns: [/아직/, /안.*됐/, /모르/, /의문/, /단서/, /왜\??/] },
            ];

            const COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
              red: { bg: "bg-primary/10", border: "border-primary/25", text: "text-primary", badge: "bg-primary/10 text-primary" },
              purple: { bg: "bg-secondary/50", border: "border-border", text: "text-foreground/80", badge: "bg-secondary/50 text-foreground/80" },
              amber: { bg: "bg-primary/10", border: "border-primary/25", text: "text-primary", badge: "bg-primary/10 text-primary" },
              blue: { bg: "bg-secondary/50", border: "border-border", text: "text-foreground/80", badge: "bg-secondary/50 text-foreground/80" },
            };

            // 문장 단위로 분리 (줄바꿈, 마침표, - 글머리 기준)
            const sentences = notes
              .split(/\n|(?<=\.)\s|(?<=다\.)|(?<=요\.)|(?<=음\.)|(?<=됨\.)/)
              .map((s) => s.replace(/^[-·•*]\s*/, "").trim())
              .filter((s) => s.length > 2);

            const results: { sentence: string; category: string; color: string }[] = [];
            const seen = new Set<string>();

            for (const s of sentences) {
              for (const cat of CATEGORIES) {
                if (cat.patterns.some((p) => p.test(s))) {
                  const key = s.slice(0, 30);
                  if (!seen.has(key)) {
                    seen.add(key);
                    // 키워드 마커 제거해서 핵심만 추출
                    const cleaned = s
                      .replace(/^(떡밥|복선|비밀|단서|미회수)\s*[:：\-]\s*/i, "")
                      .replace(/^\[.*?\]\s*/, "")
                      .trim();
                    results.push({ sentence: cleaned || s, category: cat.label, color: cat.color });
                  }
                  break;
                }
              }
            }

            if (results.length === 0) return null;

            // 카테고리별 그룹화
            const grouped = new Map<string, typeof results>();
            for (const r of results) {
              if (!grouped.has(r.category)) grouped.set(r.category, []);
              grouped.get(r.category)!.push(r);
            }

            return (
              <div className="mt-4 border-t border-primary/25 pt-4">
                <p className="text-xs text-primary font-medium mb-3">떡밥 / 발전 가능 요소 ({results.length}개 추출)</p>
                <div className="space-y-3">
                  {Array.from(grouped.entries()).map(([cat, items]) => {
                    const c = COLORS[items[0].color];
                    return (
                      <div key={cat}>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-1.5 ${c.badge}`}>{cat}</span>
                        <div className="space-y-1">
                          {items.map((item, i) => (
                            <div key={i} className={`text-sm rounded p-2 ${c.bg} ${c.border} border`}>
                              <span className={c.text}>{item.sentence}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
