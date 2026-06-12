"use client";

import Link from "next/link";

interface MoodOption {
  emoji: string;
  label: string;
  recommendation: string;
  href: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

const MOODS: MoodOption[] = [
  {
    emoji: "🔥",
    label: "개그 쓰고 싶어",
    recommendation: "장면 작업실에서 한 씬 써보자",
    href: "/scenes",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/25",
    textColor: "text-primary",
  },
  {
    emoji: "💪",
    label: "액션 장면",
    recommendation: "팬티 찢어지는 액션 써보자",
    href: "/scenes",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/25",
    textColor: "text-primary",
  },
  {
    emoji: "🤔",
    label: "설정 고민",
    recommendation: "브레인스토밍, 구조 질문",
    href: "/brainstorm",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/25",
    textColor: "text-primary",
  },
  {
    emoji: "😈",
    label: "악당 심화",
    recommendation: "형철이 더 나쁘게 만들자",
    href: "/people/hyungchul",
    bgColor: "bg-secondary/50",
    borderColor: "border-border",
    textColor: "text-foreground/80",
  },
  {
    emoji: "😴",
    label: "귀찮아",
    recommendation: "딱 한 문장만 + 메모",
    href: "/scratch",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/25",
    textColor: "text-primary",
  },
];

export function MoodPicker() {
  return (
    <section className="space-y-4">
      <div className="text-center">
        <h2 className="text-sm font-medium text-primary uppercase tracking-wider">
          오늘 뭐 할래?
        </h2>
        <p className="text-xs text-accent mt-1">
          기분에 따라 작업을 추천해줄게
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {MOODS.map((mood) => (
          <Link key={mood.label} href={mood.href}>
            <div
              className={`${mood.bgColor} ${mood.borderColor} border rounded-xl p-4 text-center space-y-2 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer h-full`}
            >
              <span className="text-3xl block">{mood.emoji}</span>
              <p className={`text-sm font-medium ${mood.textColor}`}>
                {mood.label}
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {mood.recommendation}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
