"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Film } from "lucide-react";
import Link from "next/link";
import { EPISODES } from "@/lib/data";

export default function EpisodesPage() {
  const totalProgress = Math.round(
    EPISODES.reduce((sum, ep) => sum + ep.progress, 0) / 16
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Film className="w-5 h-5 text-primary" />
        <h1 className="font-serif text-2xl font-bold">회차</h1>
      </div>
      <div className="flex items-center gap-3 mb-8">
        <Progress value={totalProgress} className="h-1.5 flex-1 max-w-xs" />
        <span className="text-sm text-muted-foreground">{totalProgress}%</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {EPISODES.map((ep) => (
          <Link key={ep.number} href={`/episodes/${ep.number}`}>
            <Card
              className={`group hover:border-primary/30 transition-all hover:-translate-y-0.5 cursor-pointer h-full ${
                ep.progress > 0 ? "border-primary/20" : "border-dashed"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground font-medium">
                    {ep.number}부
                  </span>
                  {ep.focusCharacter && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      {ep.focusCharacter}
                    </span>
                  )}
                </div>

                <h3 className="font-medium text-sm mb-1 min-h-[20px]">
                  {ep.title || (
                    <span className="text-muted-foreground/40 italic">
                      제목 없음
                    </span>
                  )}
                </h3>

                {ep.firstLine && (
                  <p className="text-xs text-primary/70 italic mb-2">
                    &ldquo;{ep.firstLine}&rdquo;
                  </p>
                )}

                {ep.synopsis ? (
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-3">
                    {ep.synopsis}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground/30 italic mb-3">
                    여기 채워질 거야
                  </p>
                )}

                <Progress value={ep.progress} className="h-1" />
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  {ep.progress}%
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
