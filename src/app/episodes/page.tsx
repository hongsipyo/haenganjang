"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Film, Monitor, BookOpen, Clapperboard } from "lucide-react";
import Link from "next/link";
import { PLOT_BEATS, PLATFORM_PLANS, getOverallProgress } from "@/lib/data";
import type { PlotBeat } from "@/lib/data";

const ACT_COLORS: Record<PlotBeat["act"], { bg: string; text: string; border: string; dot: string }> = {
  "발단": { bg: "bg-accent/10", text: "text-accent", border: "border-accent/25", dot: "bg-accent" },
  "전개": { bg: "bg-primary/8", text: "text-foreground/80", border: "border-primary/15", dot: "bg-primary/60" },
  "위기": { bg: "bg-primary/12", text: "text-primary", border: "border-primary/30", dot: "bg-primary" },
  "절정": { bg: "bg-primary/18", text: "text-neon", border: "border-primary/40", dot: "bg-primary" },
  "결말": { bg: "bg-accent/12", text: "text-accent", border: "border-accent/30", dot: "bg-accent" },
};

const PLATFORM_ICONS = {
  "영화": Monitor,
  "웹툰": Clapperboard,
  "웹소설": BookOpen,
};

const PLATFORM_COLORS = {
  "영화": { bg: "bg-secondary/50", border: "border-border", text: "text-foreground/80", badge: "bg-secondary/50 text-foreground/80" },
  "웹툰": { bg: "bg-primary/10", border: "border-primary/25", text: "text-primary", badge: "bg-primary/10 text-primary" },
  "웹소설": { bg: "bg-secondary/50", border: "border-border", text: "text-foreground/80", badge: "bg-secondary/50 text-foreground/80" },
};

export default function EpisodesPage() {
  const totalProgress = getOverallProgress();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-2 animate-float-up">
        <div className="flex items-center gap-2 text-accent">
          <Film className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Plot</span>
        </div>
        <h1 className="mt-1 font-serif text-4xl font-black text-neon">플롯 구조</h1>
      </div>
      <div className="flex items-center gap-3 mb-10">
        <Progress value={totalProgress} className="h-1.5 flex-1 max-w-xs" />
        <span className="text-sm text-muted-foreground">{totalProgress}%</span>
      </div>

      {/* ── 5막 타임라인 ── */}
      <section className="mb-16">
        <h2 className="text-sm font-medium text-primary uppercase tracking-wider mb-6">
          5막 타임라인
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-4">
            {PLOT_BEATS.map((beat, i) => {
              const colors = ACT_COLORS[beat.act];
              return (
                <div key={beat.id} className="relative pl-12">
                  {/* Dot on timeline */}
                  <div className={`absolute left-2.5 top-5 w-3 h-3 rounded-full ${colors.dot} ring-2 ring-background`} />

                  <Card className={`${colors.bg} ${colors.border} border shadow-sm hover:shadow-md transition-shadow`}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className={`text-[10px] ${colors.bg} ${colors.text} border-0`}>
                          {beat.act}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Beat {i + 1}</span>
                        <div className="ml-auto flex items-center gap-2">
                          <Progress value={beat.progress} className="h-1 w-16" />
                          <span className="text-[10px] text-muted-foreground">{beat.progress}%</span>
                        </div>
                      </div>

                      <h3 className={`font-medium text-base mb-1.5 ${colors.text}`}>
                        {beat.title}
                      </h3>
                      <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                        {beat.description}
                      </p>

                      {/* Scenes */}
                      {beat.scenes.length > 0 && (
                        <div className="space-y-1.5 mb-3">
                          {beat.scenes.map((scene, j) => (
                            <div key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="text-muted-foreground/40 mt-0.5 shrink-0">S{j + 1}</span>
                              <div>
                                <span className="font-medium text-foreground/80">{scene.title}</span>
                                <span className="text-muted-foreground mx-1">--</span>
                                <span>{scene.content}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <Link
                        href={`/episodes/${i + 1}`}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        써보기 &rarr;
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 플랫폼별 계획 ── */}
      <section>
        <h2 className="text-sm font-medium text-primary uppercase tracking-wider mb-6">
          플랫폼별 계획
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {PLATFORM_PLANS.map((plan) => {
            const Icon = PLATFORM_ICONS[plan.platform];
            const colors = PLATFORM_COLORS[plan.platform];
            return (
              <Card key={plan.platform} className={`${colors.bg} ${colors.border} border shadow-sm`}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                    <h3 className={`font-medium text-sm ${colors.text}`}>{plan.platform}</h3>
                    <Badge variant="secondary" className={`text-[10px] ml-auto border-0 ${colors.badge}`}>
                      {plan.totalLength}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {plan.pacing}
                  </p>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    {plan.notes}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
