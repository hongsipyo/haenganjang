"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Film,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Save,
  Trash2,
  BookOpen,
  Clapperboard,
} from "lucide-react";
import { useState, useEffect } from "react";
import { SCENE_PROMPTS, CHARACTERS, EPISODES } from "@/lib/data";
import {
  saveScene,
  getScenes,
  updateScene,
  deleteScene,
  type WrittenScene,
} from "@/lib/supabase/actions";

const difficultyColor = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

const difficultyLabel = { easy: "쉬움", medium: "보통", hard: "도전" };

export default function ScenesPage() {
  const [scenes, setScenes] = useState<WrittenScene[]>([]);
  const [writing, setWriting] = useState<string | null>(null); // prompt id or "new"
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [episodeNum, setEpisodeNum] = useState<number | "">("");
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"prompts" | "written" | "timeline">("prompts");

  useEffect(() => {
    getScenes().then(setScenes);
  }, []);

  const writtenPromptIds = new Set(scenes.map((s) => s.prompt_id).filter(Boolean));

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      const data = await saveScene({
        title: title.trim(),
        content: content.trim(),
        episode_number: episodeNum || null,
        prompt_id: writing !== "new" ? writing : null,
      });
      if (data) {
        setScenes((prev) => [...prev, data]);
        setTitle("");
        setContent("");
        setEpisodeNum("");
        setWriting(null);
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setScenes((prev) => prev.filter((s) => s.id !== id));
    await deleteScene(id);
  };

  const moveScene = async (id: string, newEpisode: number | null) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, episode_number: newEpisode } : s))
    );
    await updateScene(id, { episode_number: newEpisode });
  };

  // Group scenes by episode for timeline view
  const scenesByEpisode = new Map<number | null, WrittenScene[]>();
  scenes.forEach((s) => {
    const key = s.episode_number;
    if (!scenesByEpisode.has(key)) scenesByEpisode.set(key, []);
    scenesByEpisode.get(key)!.push(s);
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Film className="w-5 h-5 text-primary" />
          <h1 className="font-serif text-2xl font-bold">장면 작업실</h1>
        </div>
        <Button
          size="sm"
          onClick={() => { setWriting("new"); setTitle(""); setContent(""); setEpisodeNum(""); }}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          자유 장면
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        장면을 쓰고, 회차에 배치하고, 이야기를 이어붙여.
      </p>

      {/* View tabs */}
      <div className="flex gap-2 mb-8">
        {[
          { key: "prompts" as const, label: "프롬프트", icon: Sparkles },
          { key: "written" as const, label: `쓴 장면 (${scenes.length})`, icon: BookOpen },
          { key: "timeline" as const, label: "타임라인", icon: Clapperboard },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
              view === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Writing panel */}
      {writing && (
        <Card className="mb-8 border-primary/20 shadow-md shadow-rose-100/30">
          <CardContent className="p-6 space-y-4">
            {writing !== "new" && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200/60">
                <p className="text-sm text-amber-800">
                  {SCENE_PROMPTS.find((sp) => sp.id === writing)?.prompt}
                </p>
              </div>
            )}
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="장면 제목"
              className="font-medium"
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="장면을 써봐. 완벽 안 해도 돼. 일단 써."
              className="min-h-[200px] text-sm leading-relaxed"
              autoFocus
            />
            <div className="flex items-center gap-3">
              <select
                value={episodeNum}
                onChange={(e) => setEpisodeNum(e.target.value ? Number(e.target.value) : "")}
                className="text-sm px-3 py-1.5 rounded-lg border border-border bg-background"
              >
                <option value="">회차 미정</option>
                {EPISODES.map((ep) => (
                  <option key={ep.number} value={ep.number}>
                    {ep.number}부 {ep.title ? `— ${ep.title}` : ""}
                  </option>
                ))}
              </select>
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={() => setWriting(null)}>
                취소
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
                <Save className="w-3.5 h-3.5" />
                {saving ? "저장 중..." : "저장"}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              첫 문장이 제일 어려워. 그 다음 문장은 따라와.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Prompts view */}
      {view === "prompts" && (
        <div className="space-y-3">
          {SCENE_PROMPTS.map((sp) => {
            const done = writtenPromptIds.has(sp.id);
            const chars = sp.characters
              .map((cid) => CHARACTERS.find((c) => c.id === cid)?.name)
              .filter(Boolean);
            return (
              <Card
                key={sp.id}
                className={`transition-all ${done ? "opacity-50" : "hover:border-primary/30"}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-sm font-medium">{sp.title}</h3>
                        <Badge className={`text-[10px] px-1.5 py-0 ${difficultyColor[sp.difficulty]}`}>
                          {difficultyLabel[sp.difficulty]}
                        </Badge>
                        {sp.episode && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {sp.episode}부
                          </Badge>
                        )}
                        {done && (
                          <Badge className="text-[10px] px-1.5 py-0 bg-emerald-100 text-emerald-700">
                            완료
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                        {sp.prompt}
                      </p>
                      <div className="flex gap-1.5">
                        {chars.map((name) => (
                          <span key={name} className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                    {!done && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setWriting(sp.id);
                          setTitle(sp.title);
                          setContent("");
                          setEpisodeNum(sp.episode || "");
                        }}
                        className="shrink-0"
                      >
                        써보기
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Written scenes view */}
      {view === "written" && (
        <div className="space-y-4">
          {scenes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Film className="w-8 h-8 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground mb-2">아직 쓴 장면이 없어</p>
                <p className="text-sm text-muted-foreground/60">프롬프트 탭에서 하나 골라봐</p>
              </CardContent>
            </Card>
          ) : (
            scenes.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                onDelete={handleDelete}
                onMove={moveScene}
              />
            ))
          )}
        </div>
      )}

      {/* Timeline view */}
      {view === "timeline" && (
        <div className="space-y-8">
          {scenes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Clapperboard className="w-8 h-8 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">장면을 쓰면 여기 타임라인이 만들어져</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {EPISODES.map((ep) => {
                const epScenes = scenesByEpisode.get(ep.number) || [];
                if (epScenes.length === 0) return null;
                return (
                  <div key={ep.number}>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {ep.number}부
                      </Badge>
                      <span className="text-sm font-medium">
                        {ep.title || "제목 없음"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        — {epScenes.length}개 장면
                      </span>
                    </div>
                    <div className="space-y-2 ml-4 border-l-2 border-primary/20 pl-4">
                      {epScenes.map((scene, i) => (
                        <div key={scene.id} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-medium text-primary">
                            {i + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{scene.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {scene.content.slice(0, 100)}...
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Unassigned scenes */}
              {(scenesByEpisode.get(null) || []).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs bg-gray-100">
                      미배치
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {(scenesByEpisode.get(null) || []).length}개 장면
                    </span>
                  </div>
                  <div className="space-y-2 ml-4 border-l-2 border-dashed border-gray-200 pl-4">
                    {(scenesByEpisode.get(null) || []).map((scene) => (
                      <div key={scene.id} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-[10px] text-gray-400">
                          ?
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{scene.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {scene.content.slice(0, 100)}...
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Scene card component
function SceneCard({
  scene,
  onDelete,
  onMove,
}: {
  scene: WrittenScene;
  onDelete: (id: string) => void;
  onMove: (id: string, ep: number | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-medium">{scene.title}</h3>
              {scene.episode_number && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {scene.episode_number}부
                </Badge>
              )}
            </div>
            {expanded ? (
              <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed mt-2">
                {scene.content}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {scene.content.slice(0, 150)}...
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground cursor-pointer" onClick={() => setExpanded(false)} />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground cursor-pointer" onClick={() => setExpanded(true)} />
            )}
            <select
              value={scene.episode_number ?? ""}
              onChange={(e) => onMove(scene.id, e.target.value ? Number(e.target.value) : null)}
              className="text-[10px] px-1.5 py-0.5 rounded border border-border bg-background"
              title="회차 배치"
            >
              <option value="">미배치</option>
              {Array.from({ length: 16 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}부</option>
              ))}
            </select>
            <button
              onClick={() => onDelete(scene.id)}
              className="p-1 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-muted-foreground">
            {new Date(scene.created_at).toLocaleDateString("ko-KR")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
