"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Save, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { EPISODES } from "@/lib/data";
import { getScratchItems, saveScratch, deleteScratch, logActivity, getScenes, saveScene, updateScene } from "@/lib/supabase/actions";

type SaveState = "idle" | "saving" | "saved";

/** Scratch content markers for episode fields */
function makeMarker(epNum: number, field: string) {
  return `[episode:${epNum}:${field}]`;
}

function parseMarker(content: string): { epNum: number; field: string; value: string } | null {
  const match = content.match(/^\[episode:(\d+):(\w+)\]\n?([\s\S]*)$/);
  if (!match) return null;
  return { epNum: Number(match[1]), field: match[2], value: match[3] };
}

export default function EpisodeDetailPage() {
  const params = useParams();
  const ep = EPISODES.find((e) => e.number === Number(params.number));

  const [title, setTitle] = useState(ep?.title ?? "");
  const [synopsis, setSynopsis] = useState(ep?.synopsis ?? "");
  const [progress, setProgress] = useState(ep?.progress ?? 0);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [, setLoaded] = useState(false);

  // 회차 본문 — written_scenes(prompt_id=haenganjang). MCP·채팅·코워크가 쓴 본문을 여기서 읽고 쓴다(양방향).
  const [body, setBody] = useState("");
  const [bodySceneId, setBodySceneId] = useState<string | null>(null);

  // Track scratch IDs so we can delete old values before saving new ones
  const [scratchIds, setScratchIds] = useState<Record<string, string>>({});

  // Load saved data from DB on mount
  useEffect(() => {
    if (!ep) return;
    let cancelled = false;

    async function loadFromDb() {
      try {
        const items = await getScratchItems();
        if (cancelled) return;

        const ids: Record<string, string> = {};

        for (const item of items) {
          const content = item.content as string;
          const id = item.id as string;
          const parsed = parseMarker(content);
          if (!parsed || parsed.epNum !== ep!.number) continue;

          // Only take the first (latest) match per field
          if (ids[parsed.field]) continue;
          ids[parsed.field] = id;

          switch (parsed.field) {
            case "title":
              setTitle(parsed.value);
              break;
            case "synopsis":
              setSynopsis(parsed.value);
              break;
            case "progress":
              setProgress(Number(parsed.value) || 0);
              break;
          }
        }

        setScratchIds(ids);

        // 회차 본문 로드 (written_scenes — MCP/채팅이 쓴 본문)
        const scenes = await getScenes();
        if (!cancelled) {
          const mine = scenes.filter((s) => s.episode_number === ep!.number);
          if (mine.length) {
            setBody(mine.map((s) => s.content).filter(Boolean).join("\n\n"));
            setBodySceneId(mine[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load episode data:", err);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    loadFromDb();
    return () => { cancelled = true; };
  }, [ep]);

  const handleSave = useCallback(async () => {
    if (!ep || saveState === "saving") return;
    setSaveState("saving");

    try {
      const fields = [
        { field: "title", value: title },
        { field: "synopsis", value: synopsis },
        { field: "progress", value: String(progress) },
      ];

      const newIds: Record<string, string> = {};

      for (const { field, value } of fields) {
        // Delete old scratch item for this field
        const oldId = scratchIds[field];
        if (oldId) {
          try {
            await deleteScratch(oldId);
          } catch {
            // ignore delete errors
          }
        }

        // Save new value
        const content = `${makeMarker(ep.number, field)}\n${value}`;
        const result = await saveScratch(content);
        if (result?.id) {
          newIds[field] = result.id;
        }
      }

      setScratchIds((prev) => ({ ...prev, ...newIds }));

      // 회차 본문 저장 (written_scenes — MCP writeEpisode와 동일하게 scene_order=0 단일행 upsert)
      if (body.trim() || bodySceneId) {
        if (bodySceneId) {
          await updateScene(bodySceneId, { content: body, title: title || `${ep.number}부` });
        } else {
          const saved = await saveScene({ title: title || `${ep.number}부`, content: body, episode_number: ep.number });
          if (saved?.id) setBodySceneId(saved.id);
        }
      }

      await logActivity("episode_saved", `${ep.number}부 저장`, "episodes");

      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1500);
    } catch (err) {
      console.error("Failed to save episode:", err);
      setSaveState("idle");
    }
  }, [ep, title, synopsis, progress, scratchIds, saveState, body, bodySceneId]);

  if (!ep) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href="/episodes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          회차 목록
        </Link>
        <p className="text-muted-foreground">회차를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/episodes"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        회차 목록
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {ep.number}부
        </Badge>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-serif text-xl font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0"
          placeholder="제목을 입력하세요..."
        />
      </div>

      {ep.firstLine && (
        <p className="text-sm text-primary/70 italic mb-3 ml-1">
          &ldquo;{ep.firstLine}&rdquo;
        </p>
      )}

      {ep.focusCharacter && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-muted-foreground">중심 인물:</span>
          <Badge variant="secondary" className="text-xs">
            {ep.focusCharacter}
          </Badge>
        </div>
      )}

      <div className="flex items-center gap-3 mb-8">
        <Progress value={progress} className="h-2 flex-1 max-w-xs" />
        <Input
          type="number"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-16 h-7 text-xs text-center"
        />
        <span className="text-xs text-muted-foreground">%</span>
      </div>

      <Separator className="mb-8" />

      {/* Synopsis */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">시놉시스</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className="min-h-[100px] text-sm leading-relaxed border-none bg-transparent p-0 resize-none focus-visible:ring-0"
            placeholder="이 회차의 시놉시스..."
          />
        </CardContent>
      </Card>

      {/* 본문 — written_scenes 연동 (MCP·채팅·코워크와 양방향) */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">본문</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[260px] text-sm leading-relaxed border-none bg-transparent p-0 resize-none focus-visible:ring-0"
            placeholder="여기에 회차 본문을 쓰거나, 채팅·코워크에서 쓴 본문이 자동으로 불러와집니다…"
          />
        </CardContent>
      </Card>

      {/* Scenes */}
      {ep.scenes.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">장면</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <Plus className="w-3.5 h-3.5" />
              추가
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {ep.scenes.map((scene, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-secondary/50 border border-border/50"
              >
                <h4 className="text-sm font-medium mb-1">{scene.title}</h4>
                <p className="text-xs text-muted-foreground">{scene.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Key Fragments */}
      {ep.keyFragments.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">핵심 파편</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <Plus className="w-3.5 h-3.5" />
              추가
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {ep.keyFragments.map((frag, i) => (
              <p key={i} className="text-sm text-foreground/80 italic">
                &ldquo;{frag}&rdquo;
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button
          className="gap-1.5"
          onClick={handleSave}
          disabled={saveState === "saving"}
        >
          {saveState === "saving" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saveState === "saved" ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saveState === "saving"
            ? "저장 중..."
            : saveState === "saved"
              ? "저장됨"
              : "저장"}
        </Button>
      </div>
    </div>
  );
}
