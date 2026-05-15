"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Mic,
  ImageIcon,
  Type,
  Search,
  Clock,
  Tag,
  Plus,
} from "lucide-react";
import { FRAGMENTS } from "@/lib/data";
import type { FragmentData } from "@/lib/data";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

function FragmentIcon({ type }: { type: FragmentData["type"] }) {
  switch (type) {
    case "voice":
      return <Mic className="w-3.5 h-3.5" />;
    case "image":
      return <ImageIcon className="w-3.5 h-3.5" />;
    default:
      return <Type className="w-3.5 h-3.5" />;
  }
}

export default function FragmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(FRAGMENTS.flatMap((f) => f.tags)));

  const filtered = FRAGMENTS.filter((f) => {
    if (selectedTag && !f.tags.includes(selectedTag)) return false;
    if (searchQuery && !f.content?.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl font-bold">파편</h1>
        <Button size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          새 파편
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="파편 검색..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <Tag className="w-3.5 h-3.5 text-muted-foreground" />
        <button
          onClick={() => setSelectedTag(null)}
          className={`text-xs px-2 py-1 rounded-full transition-colors ${
            !selectedTag
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          전체
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              selectedTag === tag
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Fragment Feed */}
      <div className="space-y-3">
        {filtered.map((fragment) => (
          <Card
            key={fragment.id}
            className="group hover:border-primary/30 transition-colors cursor-pointer"
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1.5 rounded-md bg-secondary">
                  <FragmentIcon type={fragment.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {fragment.content}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {timeAgo(fragment.createdAt)}
                    </span>
                    <div className="flex gap-1.5">
                      {fragment.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p>파편이 없습니다</p>
          <p className="text-sm mt-1">+ 버튼으로 첫 파편을 남겨보세요</p>
        </div>
      )}
    </div>
  );
}
