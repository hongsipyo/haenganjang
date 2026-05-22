"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Plus, Search, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { REFS } from "@/lib/data";
import type { RefData } from "@/lib/data";
import { getScratchItems } from "@/lib/supabase/actions";

const typeColors: Record<string, string> = {
  소설: "bg-emerald-500/20 text-emerald-300",
  영화: "bg-blue-500/20 text-blue-300",
  게임: "bg-purple-500/20 text-purple-300",
  음악: "bg-pink-500/20 text-pink-300",
  책: "bg-yellow-500/20 text-yellow-300",
  기타: "bg-gray-500/20 text-gray-300",
};

interface DisplayRef extends RefData {
  fromDb?: boolean;
}

export default function RefsPage() {
  const [search, setSearch] = useState("");
  const [allRefs, setAllRefs] = useState<DisplayRef[]>(
    REFS.map((r) => ({ ...r, fromDb: false }))
  );

  useEffect(() => {
    async function loadDbRefs() {
      try {
        const scratchItems = await getScratchItems();
        // Filter scratch items that start with [ref] marker
        const refItems = scratchItems.filter((item) => {
          const content = (item.content as string) ?? "";
          return content.startsWith("[ref]");
        });

        const dbRefs: DisplayRef[] = refItems.map((item) => {
          const raw = ((item.content as string) ?? "").replace(/^\[ref\]\s*/, "");
          // Parse format: "type|title|note|tag1,tag2"
          const parts = raw.split("|");
          return {
            id: (item.id as string) ?? crypto.randomUUID(),
            type: parts[0]?.trim() || "기타",
            title: parts[1]?.trim() || raw,
            note: parts[2]?.trim() || "",
            tags: parts[3] ? parts[3].split(",").map((t) => t.trim()) : [],
            fromDb: true,
          };
        });

        // Merge: hardcoded first, then DB refs (avoid duplicates by title)
        const hardcodedTitles = new Set(REFS.map((r) => r.title));
        const newDbRefs = dbRefs.filter((r) => !hardcodedTitles.has(r.title));
        setAllRefs([
          ...REFS.map((r) => ({ ...r, fromDb: false })),
          ...newDbRefs,
        ]);
      } catch {
        // DB unavailable — keep hardcoded only
      }
    }
    loadDbRefs();
  }, []);

  const filtered = allRefs.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.note?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-primary" />
          <h1 className="font-serif text-2xl font-bold">레퍼런스</h1>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          추가
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="레퍼런스 검색..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filtered.map((ref) => (
          <Card key={ref.id} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        typeColors[ref.type || ""] || "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {ref.type}
                    </span>
                    <h3 className="text-sm font-medium">{ref.title}</h3>
                    {ref.fromDb && (
                      <Database className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  {ref.note && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {ref.note}
                    </p>
                  )}
                  {ref.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {ref.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
