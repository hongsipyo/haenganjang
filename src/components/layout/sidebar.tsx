"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Globe,
  Users,
  Film,
  Sparkles,
  BookOpen,
  StickyNote,
  Search,
  Lightbulb,
  TrendingUp,
  Menu,
  X,
  Pen,
  Feather,
  BookText,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/home", label: "홈", icon: Home, emoji: "" },
  { href: "/world", label: "세계관", icon: Globe, emoji: "" },
  { href: "/people", label: "인물", icon: Users, emoji: "" },
  { href: "/episodes", label: "회차", icon: Film, emoji: "" },
  { href: "/scenes", label: "장면 작업실", icon: Pen, emoji: "" },
  { href: "/fragments", label: "파편", icon: Sparkles, emoji: "" },
  { href: "/brainstorm", label: "브레인스토밍", icon: Lightbulb, emoji: "" },
  { href: "/progress", label: "프로그레스", icon: TrendingUp, emoji: "" },
  { href: "/community", label: "독자 반응", icon: MessageSquare, emoji: "" },
  { href: "/refs", label: "레퍼런스", icon: BookOpen, emoji: "" },
  { href: "/scratch", label: "메모", icon: StickyNote, emoji: "" },
  { href: "/treatment", label: "트리트먼트", icon: FileText, emoji: "" },
  { href: "/zen", label: "Zen", icon: Feather, emoji: "" },
  { href: "/manuscript", label: "전체 원고", icon: BookText, emoji: "" },
];

const ENCOURAGEMENTS = [
  "오늘도 한 씬이면 충분해",
  "팬티를 찢어라",
  "개그는 디테일이다",
  "일단 박아. 정리는 나중에",
  "규칙을 지키면 팬티가 찢어진다",
  "웃기면 정의다",
  "장관님, 오늘도 출근하셨군요",
];

function getDailyEncouragement() {
  const today = new Date();
  const idx = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % ENCOURAGEMENTS.length;
  return ENCOURAGEMENTS[idx];
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2.5 rounded-xl glass text-foreground"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen w-60 glass border-r border-primary/15 flex flex-col transition-transform duration-200",
          "md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header — 작가 홍시표 */}
        <div className="p-5 border-b border-primary/15 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <Link href="/home" className="block">
            <span className="font-serif text-2xl font-black tracking-tight text-neon">
              행안부장관
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Pen className="w-3 h-3 text-accent" />
              <span className="text-[11px] text-muted-foreground tracking-wide">
                작가 홍시표
              </span>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="absolute top-5 right-4 md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
                  isActive
                    ? "bg-primary/15 text-primary font-semibold glow-red border border-primary/30"
                    : "text-foreground/55 hover:text-foreground hover:bg-secondary/70"
                )}
              >
                <item.icon className={cn("w-4 h-4 shrink-0", isActive && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom — 격려 + 검색 */}
        <div className="p-4 border-t border-primary/15 space-y-3">
          {/* Daily encouragement */}
          <div className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-primary/15 to-accent/15 border border-primary/20">
            <p className="text-[11px] text-accent/90 italic leading-relaxed">
              {getDailyEncouragement()}
            </p>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-foreground/50 hover:text-foreground hover:bg-secondary/70 transition-colors"
          >
            <Search className="w-4 h-4" />
            검색
          </Link>
        </div>
      </aside>
    </>
  );
}
