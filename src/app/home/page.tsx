"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Pen,
  Users,
  Layers,
  BarChart3,
  BookOpen,
  Clapperboard,
  Quote,
  ArrowRight,
  Heart,
  Sun,
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

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [dbStats, setDbStats] = useState<DbStats | null>(null);

  useEffect(() => {
    setMounted(true);

    // Fetch real counts from DB
    async function fetchDbStats() {
      try {
        const [fragments, scenes, characterOverrides, scratchItems] =
          await Promise.all([
            getFragments(),
            getScenes(),
            getCharacterOverrides(),
            getScratchItems(),
          ]);

        // Count unique episodes that have written scenes in DB
        const episodesWithScenes = new Set(
          scenes
            .filter((s) => s.episode_number != null)
            .map((s) => s.episode_number)
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
        // Keep showing hardcoded data on error
      }
    }

    fetchDbStats();
  }, []);

  // Hardcoded baseline stats
  const hardcodedProgress = getOverallProgress();
  const hardcodedFilledEpisodes = getFilledEpisodes();
  const hardcodedFragments = getTotalFragments();
  const hardcodedCharacters = getTotalCharacters();

  // Merge: combine hardcoded + DB counts
  // Fragments: hardcoded (data.ts) + DB fragments (no overlap — DB stores user-created ones)
  const totalFragments = dbStats
    ? hardcodedFragments + dbStats.dbFragments
    : hardcodedFragments;

  // Characters: hardcoded baseline; DB overrides share names, so use max of both
  // DB characters with new names (not in hardcoded) add to the count
  const totalCharacters = dbStats
    ? hardcodedCharacters + dbStats.dbCharacters
    : hardcodedCharacters;

  // Filled episodes: hardcoded filled + any new episodes that only exist in DB scenes
  const filledEpisodes = dbStats
    ? hardcodedFilledEpisodes + dbStats.dbEpisodesWithScenes
    : hardcodedFilledEpisodes;

  // Progress: factor in DB scenes (each written scene contributes to overall progress)
  const overallProgress = dbStats
    ? Math.min(100, hardcodedProgress + Math.round((dbStats.dbScenes * 2) / 16))
    : hardcodedProgress;
  const dailyMission = getDailyMission();
  const dailyFragment = getDailyFragment();

  // Stable daily encouragement
  const today = new Date();
  const dayIdx =
    (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) %
    ENCOURAGEMENTS.length;
  const encouragement = ENCOURAGEMENTS[dayIdx];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-16">
      {/* ── Cover Section ── */}
      <section className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-44 h-60 mx-auto rounded-xl overflow-hidden shadow-lg shadow-rose-200/40 border border-rose-200/60">
            {/* Warm light book cover */}
            <div className="w-full h-full relative bg-gradient-to-br from-amber-50 via-rose-50 to-yellow-50">
              {/* Soft warm glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-200/30 via-transparent to-rose-100/20" />
              {/* Decorative lines */}
              <div className="absolute top-6 left-4 right-4 h-px bg-rose-300/40" />
              <div className="absolute bottom-6 left-4 right-4 h-px bg-rose-300/40" />
              {/* Title */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="font-serif text-5xl font-bold tracking-tight bg-gradient-to-b from-rose-400 to-amber-500 bg-clip-text text-transparent">
                  행안부장관
                </span>
                <span className="text-[9px] tracking-[0.3em] text-rose-400/70 uppercase">
                  political satire &middot; comedy
                </span>
                <span className="text-[10px] tracking-[0.2em] text-amber-600/70 mt-4 font-medium">
                  홍시표
                </span>
              </div>
              {/* Spine shadow */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-amber-200/30 to-transparent" />
            </div>
          </div>
          <div className="absolute -inset-8 bg-gradient-to-b from-rose-100/40 via-amber-100/30 to-transparent rounded-3xl -z-10 blur-2xl" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-rose-900">
            행안부장관
          </h1>
          <p className="text-amber-800/70 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            정치풍자 코미디
          </p>
          {mounted && (
            <p className="text-sm text-rose-400/80 flex items-center justify-center gap-1.5 pt-1">
              <Sun className="w-3.5 h-3.5" />
              {encouragement}
            </p>
          )}
        </div>
      </section>

      {/* ── Mood Picker ── */}
      <MoodPicker />

      {/* ── Stats Bar ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            icon: BarChart3,
            label: "전체 진행률",
            value: `${overallProgress}%`,
            bg: "bg-blue-50",
            color: "text-blue-500",
            border: "border-blue-100",
          },
          {
            icon: Layers,
            label: "채워진 회차",
            value: `${filledEpisodes}/16`,
            bg: "bg-emerald-50",
            color: "text-emerald-500",
            border: "border-emerald-100",
          },
          {
            icon: Sparkles,
            label: "파편",
            value: `${totalFragments}개`,
            bg: "bg-amber-50",
            color: "text-amber-500",
            border: "border-amber-100",
          },
          {
            icon: Users,
            label: "인물",
            value: `${totalCharacters}명`,
            bg: "bg-rose-50",
            color: "text-rose-500",
            border: "border-rose-100",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`${stat.bg} ${stat.border} border shadow-sm`}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color} shrink-0`} />
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-lg font-semibold tracking-tight text-gray-800">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ── 16부작 진행률 Grid ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-amber-700/80 uppercase tracking-wider">
            16부작 진행률
          </h2>
          <span className="text-xs text-rose-400/70">
            {filledEpisodes}개 시작됨 -- 잘 하고 있어!
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {EPISODES.map((ep) => {
            const isFilled =
              ep.title !== null ||
              ep.synopsis !== null ||
              ep.scenes.length > 0;
            return (
              <Card
                key={ep.number}
                className={`relative overflow-hidden transition-all duration-300 ${
                  isFilled
                    ? "bg-white border-rose-200/60 shadow-md shadow-rose-100/50"
                    : "bg-amber-50/50 border-dashed border-amber-200/60"
                }`}
              >
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`text-xs font-medium ${
                        isFilled ? "text-rose-700" : "text-amber-400"
                      }`}
                    >
                      {ep.number}부
                    </span>
                    {ep.progress > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 border-0"
                      >
                        {ep.progress}%
                      </Badge>
                    )}
                  </div>
                  {isFilled ? (
                    <p className="text-xs text-gray-600 truncate leading-relaxed">
                      {ep.title || ep.firstLine || "untitled"}
                    </p>
                  ) : (
                    <p className="text-[11px] text-amber-300 italic">
                      여기 채워질 거야
                    </p>
                  )}
                  <Progress value={ep.progress} className="h-1" />
                </CardContent>
                {isFilled && ep.progress > 0 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-100/20 to-transparent pointer-events-none" />
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── 오늘의 미션 + 오늘의 파편 회상 ── */}
      <section className="grid md:grid-cols-2 gap-4">
        {/* 오늘의 미션 */}
        <Card className="bg-gradient-to-br from-rose-50 to-amber-50 border-rose-200/50 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Pen className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-medium text-rose-600">
                오늘의 미션
              </h3>
              <Heart className="w-3 h-3 text-rose-300 ml-auto" />
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              {mounted ? dailyMission : "\u00A0"}
            </p>
            <div className="flex items-center justify-between">
              <Link href="/fragments">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-rose-300/60 text-rose-600 hover:bg-rose-100/60 hover:border-rose-400/60 bg-white/60"
                >
                  도전하기
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <span className="text-[11px] text-amber-500/70 italic">
                완벽하지 않아도 돼
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 오늘의 파편 회상 */}
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200/50 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Quote className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-medium text-amber-700">
                오늘의 파편 회상
              </h3>
            </div>
            <blockquote className="relative">
              <span className="absolute -top-2 -left-1 text-3xl text-amber-300/60 font-serif select-none">
                &ldquo;
              </span>
              <p className="text-gray-700 italic leading-relaxed text-sm pl-4 pr-2">
                {mounted ? dailyFragment.content : "\u00A0"}
              </p>
              <span className="text-3xl text-amber-300/60 font-serif select-none leading-none">
                &rdquo;
              </span>
            </blockquote>
            {mounted && dailyFragment.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {dailyFragment.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-[10px] bg-amber-100/80 text-amber-700 border-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ── 소설 / 각본 트래커 ── */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-amber-700/80 uppercase tracking-wider">
          듀얼 트래커
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* 소설 */}
          <Card className="bg-white border-emerald-200/50 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <h3 className="font-medium text-sm text-gray-800">소설</h3>
              </div>
              <p className="text-xs text-gray-500">
                성석제 나레이션 + 매지컬 리얼리즘
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>초고 진행률</span>
                  <span>0%</span>
                </div>
                <Progress value={0} className="h-1.5" />
              </div>
              <p className="text-[11px] text-emerald-400 italic">
                첫 문장을 쓰는 날이 시작이야
              </p>
            </CardContent>
          </Card>

          {/* 드라마 각본 */}
          <Card className="bg-white border-violet-200/50 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Clapperboard className="w-4 h-4 text-violet-500" />
                <h3 className="font-medium text-sm text-gray-800">
                  드라마 각본
                </h3>
              </div>
              <p className="text-xs text-gray-500">
                옴니버스 16부작 &middot; 안나 카레니나 구조
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>각본 진행률</span>
                  <span>0%</span>
                </div>
                <Progress value={0} className="h-1.5" />
              </div>
              <p className="text-[11px] text-violet-400 italic">
                구조가 서면 장면은 따라와
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center pt-4 pb-8 space-y-1">
        <p className="text-xs text-rose-300">
          작가 홍시표의 작업 공간
        </p>
        <p className="text-[11px] text-amber-300/80">
          매일 조금씩, 한 줄씩
        </p>
      </footer>
    </div>
  );
}
