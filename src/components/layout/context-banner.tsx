"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getActivityLog, type ActivityLogRow } from "@/lib/supabase/actions";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "어제";
  return `${days}일 전`;
}

function sectionToPath(section: string): string {
  switch (section) {
    case "brainstorm":
      return "/brainstorm";
    case "scenes":
      return "/scenes";
    case "fragments":
      return "/fragments";
    case "scratch":
      return "/scratch";
    default:
      return "/home";
  }
}

export function ContextBanner() {
  const [activity, setActivity] = useState<ActivityLogRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityLog(7)
      .then((logs) => {
        if (logs.length > 0) {
          setActivity(logs[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (!activity) {
    return (
      <div className="mx-4 mt-4 mb-2">
        <div className="rounded-xl bg-gradient-to-r from-amber-50 via-rose-50 to-yellow-50 border border-amber-200/50 px-5 py-3 flex items-center justify-between">
          <p className="text-sm text-amber-800">
            오늘 첫 작업을 시작해볼까?
          </p>
          <Link
            href="/brainstorm"
            className="inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
          >
            시작하기
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mt-4 mb-2">
      <div className="rounded-xl bg-gradient-to-r from-amber-50 via-rose-50 to-yellow-50 border border-amber-200/50 px-5 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800 truncate">
            <span className="text-amber-600 font-medium">마지막 작업:</span>{" "}
            {activity.detail} —{" "}
            <span className="text-rose-500">{timeAgo(activity.created_at)}</span>
          </p>
        </div>
        <Link
          href={sectionToPath(activity.section)}
          className="inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors whitespace-nowrap shrink-0"
        >
          이어서 하기
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
