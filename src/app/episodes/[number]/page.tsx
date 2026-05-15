"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { EPISODES } from "@/lib/data";

export default function EpisodeDetailPage() {
  const params = useParams();
  const ep = EPISODES.find((e) => e.number === Number(params.number));

  const [title, setTitle] = useState(ep?.title ?? "");
  const [synopsis, setSynopsis] = useState(ep?.synopsis ?? "");
  const [progress, setProgress] = useState(ep?.progress ?? 0);

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
        <Button className="gap-1.5">
          <Save className="w-4 h-4" />
          저장
        </Button>
      </div>
    </div>
  );
}
