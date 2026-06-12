"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { CHARACTERS } from "@/lib/data";
import type { CharacterData } from "@/lib/data";
import { getCharacterOverrides } from "@/lib/supabase/actions";

function getElementColor(element: string | null) {
  if (!element) return "bg-secondary text-secondary-foreground";
  if (element.includes("水")) return "bg-secondary/40 text-foreground/80";
  if (element.includes("火")) return "bg-primary/20 text-accent";
  if (element.includes("木")) return "bg-secondary/40 text-foreground/80";
  if (element.includes("金")) return "bg-primary/20 text-accent";
  if (element.includes("土")) return "bg-primary/20 text-accent";
  return "bg-secondary text-secondary-foreground";
}

export default function PeoplePage() {
  const [characters, setCharacters] = useState<CharacterData[]>(CHARACTERS);

  useEffect(() => {
    async function loadOverrides() {
      try {
        const overrides = await getCharacterOverrides();
        if (Object.keys(overrides).length === 0) return;

        const merged = CHARACTERS.map((char) => {
          const override = overrides[char.name];
          if (!override) return char;
          return {
            ...char,
            description: (override.description as string) ?? char.description,
            element: override.element !== undefined ? (override.element as string | null) : char.element,
            animal: override.animal !== undefined ? (override.animal as string | null) : char.animal,
          };
        });
        setCharacters(merged);
      } catch {
        // DB unavailable — keep hardcoded only
      }
    }
    loadOverrides();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-end justify-between mb-8 animate-float-up">
        <div>
          <div className="flex items-center gap-2 text-accent">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Characters</span>
          </div>
          <h1 className="mt-1 font-serif text-4xl font-black text-neon">인물</h1>
          <p className="mt-1 text-sm text-muted-foreground">권력과 풍자의 한복판을 사는 {characters.length}명</p>
        </div>
        <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 glow-red">
          <Plus className="w-4 h-4" />
          새 인물
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {characters.map((char, i) => (
          <Link key={char.id} href={`/people/${char.id}`} className="animate-float-up" style={{ animationDelay: `${i * 50}ms` }}>
            <Card className="group hover:border-primary/30 hover:glow-red transition-all duration-300 hover:-translate-y-1.5 cursor-pointer h-full overflow-hidden">
              <CardContent className="p-0">
                {/* Image placeholder */}
                <div className="aspect-[3/4] relative flex items-center justify-center" style={{ background: "radial-gradient(120% 90% at 50% 15%, hsl(0 80% 40% / 0.35), transparent 60%), linear-gradient(180deg, hsl(220 16% 13%), hsl(220 18% 8%))" }}>
                  <span className="font-serif text-5xl text-neon opacity-80 transition group-hover:scale-110 group-hover:opacity-100">
                    {char.name[0]}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[hsl(220_18%_8%)] to-transparent" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-medium text-sm">{char.name}</h3>
                    {char.element && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getElementColor(char.element)}`}>
                        {char.element}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {char.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
