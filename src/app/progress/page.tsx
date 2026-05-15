"use client";

import { useEffect, useState } from "react";
import {
  getActivityLog,
  getDailyStats,
  type ActivityLogRow,
} from "@/lib/supabase/actions";

interface DayStat {
  date: string;
  count: number;
  sections: string[];
}

const SECTION_COLORS: Record<string, string> = {
  fragments: "bg-amber-400",
  brainstorm: "bg-pink-400",
  scratch: "bg-yellow-400",
  episodes: "bg-rose-400",
  people: "bg-orange-300",
  world: "bg-amber-300",
  refs: "bg-pink-300",
};

const SECTION_LABELS: Record<string, string> = {
  fragments: "파편",
  brainstorm: "브레인스토밍",
  scratch: "메모",
  episodes: "회차",
  people: "인물",
  world: "세계관",
  refs: "레퍼런스",
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${month}/${day} ${h}:${m}`;
}

function getHeatColor(count: number) {
  if (count === 0) return "bg-gray-100";
  if (count <= 2) return "bg-amber-200";
  if (count <= 5) return "bg-amber-300";
  if (count <= 10) return "bg-pink-300";
  return "bg-pink-400";
}

function calculateStreak(stats: DayStat[]): number {
  if (stats.length === 0) return 0;

  const dateSet = new Set(stats.map((s) => s.date));
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (dateSet.has(key)) {
      streak++;
    } else {
      // Allow today to be missing (day not over yet)
      if (i === 0) continue;
      break;
    }
  }

  return streak;
}

export default function ProgressPage() {
  const [activities, setActivities] = useState<ActivityLogRow[]>([]);
  const [dailyStats, setDailyStats] = useState<DayStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [logs, stats] = await Promise.all([
          getActivityLog(30),
          getDailyStats(30),
        ]);
        setActivities(logs);
        setDailyStats(stats);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayActivities = activities.filter(
    (a) => a.created_at?.slice(0, 10) === today
  );
  const streak = calculateStreak(dailyStats);

  // Section stats
  const sectionCounts: Record<string, number> = {};
  for (const a of activities) {
    if (a.section) {
      sectionCounts[a.section] = (sectionCounts[a.section] || 0) + 1;
    }
  }
  const maxSectionCount = Math.max(...Object.values(sectionCounts), 1);

  // Build 30-day calendar
  const calendarDays: { date: string; count: number; label: string }[] = [];
  const statsMap = new Map(dailyStats.map((s) => [s.date, s.count]));
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayLabel = `${d.getMonth() + 1}/${d.getDate()}`;
    calendarDays.push({
      date: key,
      count: statsMap.get(key) ?? 0,
      label: dayLabel,
    });
  }

  const streakMessages = [
    { min: 30, msg: "30일 연속! 전설의 작가!" },
    { min: 14, msg: "2주 연속! 대단해!" },
    { min: 7, msg: "일주일 연속 작업 중! 멋져!" },
    { min: 3, msg: `${streak}일 연속 작업 중!` },
    { min: 1, msg: "오늘도 쓰고 있네! 좋아!" },
    { min: 0, msg: "오늘 첫 작업을 시작해보자!" },
  ];
  const streakMsg =
    streakMessages.find((m) => streak >= m.min)?.msg ?? streakMessages[streakMessages.length - 1].msg;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground animate-pulse">
          불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">프로그레스</h1>
        <p className="text-sm text-muted-foreground mt-1">
          나의 창작 여정을 한눈에
        </p>
      </div>

      {/* Streak + Today */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Streak Card */}
        <div className="rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50 to-amber-50 p-5">
          <div className="text-xs font-medium text-pink-400 uppercase tracking-wider">
            스트릭
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-pink-500">{streak}</span>
            <span className="text-sm text-pink-400">일</span>
          </div>
          <p className="mt-2 text-sm text-pink-600/80 italic">{streakMsg}</p>
        </div>

        {/* Today Card */}
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5">
          <div className="text-xs font-medium text-amber-500 uppercase tracking-wider">
            오늘의 활동
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-amber-600">
              {todayActivities.length}
            </span>
            <span className="text-sm text-amber-500">건</span>
          </div>
          {todayActivities.length > 0 && (
            <div className="mt-2 space-y-1">
              {todayActivities.slice(0, 3).map((a) => (
                <p key={a.id} className="text-xs text-amber-700 truncate">
                  {SECTION_LABELS[a.section] ?? a.section} &middot;{" "}
                  {a.detail?.slice(0, 30)}
                </p>
              ))}
              {todayActivities.length > 3 && (
                <p className="text-xs text-amber-400">
                  +{todayActivities.length - 3}건 더
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Calendar */}
      <div className="rounded-2xl border border-border/50 bg-white p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          주간 캘린더 히트맵
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            최근 30일
          </span>
        </h2>
        <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5">
          {calendarDays.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-0.5">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md ${getHeatColor(
                  day.count
                )} flex items-center justify-center transition-colors`}
                title={`${day.date}: ${day.count}건`}
              >
                {day.count > 0 && (
                  <span className="text-[10px] font-medium text-white/90">
                    {day.count}
                  </span>
                )}
              </div>
              <span className="text-[9px] text-muted-foreground">
                {day.label}
              </span>
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground">
          <span>적음</span>
          <div className="w-4 h-4 rounded bg-gray-100" />
          <div className="w-4 h-4 rounded bg-amber-200" />
          <div className="w-4 h-4 rounded bg-amber-300" />
          <div className="w-4 h-4 rounded bg-pink-300" />
          <div className="w-4 h-4 rounded bg-pink-400" />
          <span>많음</span>
        </div>
      </div>

      {/* Section Stats */}
      <div className="rounded-2xl border border-border/50 bg-white p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          섹션별 통계
        </h2>
        {Object.keys(sectionCounts).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            아직 활동 기록이 없어요
          </p>
        ) : (
          <div className="space-y-3">
            {Object.entries(sectionCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([section, count]) => (
                <div key={section}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground/80">
                      {SECTION_LABELS[section] ?? section}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {count}건
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        SECTION_COLORS[section] ?? "bg-amber-300"
                      } transition-all duration-500`}
                      style={{
                        width: `${(count / maxSectionCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Activity Feed */}
      <div className="rounded-2xl border border-border/50 bg-white p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          최근 활동 피드
        </h2>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            아직 활동 기록이 없어요. 파편이나 메모를 써보세요!
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {activities.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0"
              >
                <div
                  className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    SECTION_COLORS[a.section] ?? "bg-gray-300"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground/70">
                      {SECTION_LABELS[a.section] ?? a.section}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {a.action}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 truncate mt-0.5">
                    {a.detail}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {formatTime(a.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
