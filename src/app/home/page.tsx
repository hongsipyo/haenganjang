"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Pen,
  Users,
  Layers,
  BookOpen,
  Clapperboard,
  Quote,
  ArrowRight,
  Flame,
  Megaphone,
  Siren,
} from "lucide-react";
import { MoodPicker } from "./mood-picker";
import {
  getDailyFragment,
  getDailyMission,
  getOverallProgress,
  getFilledEpisodes,
  getTotalFragments,
  getTotalCharacters,
  EPISODES,
} from "@/lib/data";
import {
  getFragments,
  getScenes,
  getCharacterOverrides,
  getScratchItems,
} from "@/lib/supabase/actions";

const ENCOURAGEMENTS = [
  "기재부장관 팬티 찢기기 전에 한 줄 써",
  "김형식 32년차 관료의 눈물을 써줘",
  "봉인된 힘이 깨어나려면 네 펜이 필요해",
  "풍자는 현실보다 정확해야 한다",
  "오늘 안 쓰면 기재부가 이긴다",
];

interface DbStats {
  dbFragments: number;
  dbScenes: number;
  dbCharacters: number;
  dbScratchItems: number;
  dbEpisodesWithScenes: number;
}

/** 진행도 = 권력. 네온 레드→옐로로 타오르는 원형 진행 링 */
function ProgressRing({ value }: { value: number }) {
  const r = 78;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-48 w-48">
      <svg className="h-48 w-48 -rotate-90" viewBox="0 0 180 180">
        <defs>
          <linearGradient id="nr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(0 84% 56%)" />
            <stop offset="55%" stopColor="hsl(20 92% 56%)" />
            <stop offset="100%" stopColor="hsl(48 96% 58%)" />
          </linearGradient>
        </defs>
        <circle cx="90" cy="90" r={r} fill="none" stroke="hsl(220 12% 18%)" strokeWidth="10" />
        <circle
          cx="90" cy="90" r={r} fill="none" stroke="url(#nr)" strokeWidth="10"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)", filter: "drop-shadow(0 0 8px hsl(0 84% 55% / .6))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-5xl font-black text-neon leading-none">{value}%</span>
        <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">장악</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [dbStats, setDbStats] = useState<DbStats | null>(null);

  useEffect(() => {
    setMounted(true);
    async function fetchDbStats() {
      try {
        const [fragments, scenes, characterOverrides, scratchItems] = await Promise.all([
          getFragments(), getScenes(), getCharacterOverrides(), getScratchItems(),
        ]);
        const episodesWithScenes = new Set(
          scenes.filter((s) => s.episode_number != null).map((s) => s.episode_number)
        ).size;
        setDbStats({
          dbFragments: fragments.length,
          dbScenes: scenes.length,
          dbCharacters: Object.keys(characterOverrides).length,
          dbScratchItems: scratchItems.length,
          dbEpisodesWithScenes: episodesWithScenes,
        });
      } catch (err) {
        console.error("Failed to fetch DB stats:", err);
      }
    }
    fetchDbStats();
  }, []);

  const hardcodedProgress = getOverallProgress();
  const hardcodedFilledEpisodes = getFilledEpisodes();
  const hardcodedFragments = getTotalFragments();
  const hardcodedCharacters = getTotalCharacters();

  const totalFragments = dbStats ? hardcodedFragments + dbStats.dbFragments : hardcodedFragments;
  const totalCharacters = dbStats ? hardcodedCharacters + dbStats.dbCharacters : hardcodedCharacters;
  const filledEpisodes = dbStats ? hardcodedFilledEpisodes + dbStats.dbEpisodesWithScenes : hardcodedFilledEpisodes;
  const overallProgress = dbStats
    ? Math.min(100, hardcodedProgress + Math.round((dbStats.dbScenes * 2) / 16))
    : hardcodedProgress;
  const dailyMission = getDailyMission();
  const dailyFragment = getDailyFragment();

  const today = new Date();
  const dayIdx = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % ENCOURAGEMENTS.length;
  const encouragement = ENCOURAGEMENTS[dayIdx];

  const stats = [
    { icon: Layers, label: "채워진 회차", value: `${filledEpisodes}/16` },
    { icon: Sparkles, label: "파편", value: `${totalFragments}` },
    { icon: Users, label: "인물", value: `${totalCharacters}` },
    { icon: Pen, label: "이번 작업", value: `${dbStats?.dbScenes ?? 0}장면` },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-16 space-y-14">
      {/* ── HERO: B급 포스터 + 권력 진행 링 ── */}
      <section className="grid items-center gap-10 md:grid-cols-[auto_1fr] animate-float-up">
        {/* B급 정치 캠페인 포스터 */}
        <div className="relative mx-auto">
          <div className="relative h-64 w-48 overflow-hidden rounded-2xl border border-primary/25 glow-red">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220_16%_14%)] via-[hsl(220_18%_8%)] to-[hsl(0_50%_10%)]" />
            <div className="absolute right-0 top-0 h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary animate-flicker" />
            <div className="absolute left-0 bottom-0 h-1.5 w-full bg-gradient-to-r from-accent via-primary to-accent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
              <Siren className="h-6 w-6 text-accent animate-flicker" />
              <span className="font-serif text-3xl font-black leading-none text-neon">행정안전부</span>
              <span className="font-serif text-4xl font-black leading-none text-neon">장 관</span>
              <span className="mt-2 text-[8px] uppercase tracking-[0.3em] text-primary/70">political satire · comedy</span>
              <span className="mt-5 text-[10px] tracking-[0.25em] text-muted-foreground">홍시표</span>
            </div>
          </div>
          <div className="absolute -inset-6 -z-10 rounded-full bg-primary/25 blur-3xl" />
        </div>

        {/* 진행도 = 권력 장악 */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
          <ProgressRing value={overallProgress} />
          <div className="text-center md:text-left">
            <h1 className="font-serif text-3xl font-black text-foreground md:text-4xl leading-tight">
              규칙을 지키면<br /><span className="text-neon">팬티가 찢어진다</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">영화 · 웹툰 · 웹소설 · 16부작 풍자극</p>
            {mounted && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-secondary/50 px-3.5 py-1.5">
                <Flame className="h-3.5 w-3.5 text-accent animate-flicker" />
                <span className="text-xs text-foreground/80">{encouragement}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 무드 피커 ── */}
      <MoodPicker />

      {/* ── 스탯 (글래스 + 글로우) ── */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="glass rounded-2xl p-4 animate-float-up" style={{ animationDelay: `${i * 60}ms` }}>
            <s.icon className="h-5 w-5 text-accent" />
            <p className="mt-3 text-2xl font-black tracking-tight text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ── 16부작 진행 그리드 ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-accent">16부작 진행</h2>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Megaphone className="h-3.5 w-3.5 text-primary" /> {filledEpisodes}개 점화됨 — 계속 박아
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {EPISODES.map((ep) => {
            const isFilled = ep.title !== null || ep.synopsis !== null || ep.scenes.length > 0;
            return (
              <div
                key={ep.number}
                className={`relative overflow-hidden rounded-xl border p-3 transition-all duration-300 ${
                  isFilled ? "glass border-primary/25 glow-red" : "border-dashed border-border/60 bg-card/30"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className={`text-xs font-bold ${isFilled ? "text-neon" : "text-muted-foreground/50"}`}>{ep.number}부</span>
                  {ep.progress > 0 && (
                    <span className="rounded-full bg-primary/20 px-1.5 text-[10px] font-bold text-accent">{ep.progress}%</span>
                  )}
                </div>
                <p className={`mt-2 truncate text-xs leading-relaxed ${isFilled ? "text-foreground/80" : "italic text-muted-foreground/40"}`}>
                  {isFilled ? ep.title || ep.firstLine || "untitled" : "여기서 한 방 터진다"}
                </p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                  <div className={`h-full rounded-full ${ep.progress > 0 ? "progress-shine" : ""}`} style={{ width: `${ep.progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 오늘의 미션 + 파편 회상 ── */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Pen className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-bold text-neon">오늘의 미션</h3>
          </div>
          <p className="min-h-[2.5rem] text-sm leading-relaxed text-foreground/80">{mounted ? dailyMission : " "}</p>
          <div className="flex items-center justify-between">
            <Link href="/fragments">
              <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 glow-red">
                도전하기 <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <span className="text-[11px] italic text-muted-foreground">일단 박아. 정리는 나중에</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Quote className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-bold text-accent">오늘의 파편 회상</h3>
          </div>
          <blockquote className="relative pl-4">
            <span className="absolute -left-1 -top-2 select-none font-serif text-3xl text-primary/50">“</span>
            <p className="min-h-[2.5rem] text-sm italic leading-relaxed text-foreground/80">{mounted ? dailyFragment.content : " "}</p>
          </blockquote>
          {mounted && dailyFragment.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {dailyFragment.tags.map((tag) => (
                <Badge key={tag} className="border-0 bg-secondary text-[10px] text-foreground/70">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 듀얼 트래커 ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-accent">듀얼 트래커</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { icon: BookOpen, t: "소설", d: "성석제 나레이션 + 매지컬 리얼리즘", note: "첫 문장을 쓰는 날이 시작이야" },
            { icon: Clapperboard, t: "드라마 각본", d: "옴니버스 16부작 · 안나 카레니나 구조", note: "구조가 서면 장면은 따라와" },
          ].map((x) => (
            <div key={x.t} className="glass rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <x.icon className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-bold text-foreground">{x.t}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{x.d}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground"><span>초고 진행률</span><span>0%</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full w-0 rounded-full bg-primary" /></div>
              </div>
              <p className="text-[11px] italic text-accent/80">{x.note}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="space-y-1 pb-8 pt-4 text-center">
        <p className="text-xs text-muted-foreground">작가 홍시표의 작업 공간</p>
        <p className="text-[11px] text-primary/70">웃기면 정의다 — 매일 한 방씩</p>
      </footer>
    </div>
  );
}
