"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { CHARACTERS } from "@/lib/data";

function getElementColor(element: string | null) {
  if (!element) return "bg-secondary text-secondary-foreground";
  if (element.includes("水")) return "bg-blue-500/20 text-blue-300";
  if (element.includes("火")) return "bg-red-500/20 text-red-300";
  if (element.includes("木")) return "bg-green-500/20 text-green-300";
  if (element.includes("金")) return "bg-yellow-500/20 text-yellow-300";
  if (element.includes("土")) return "bg-amber-500/20 text-amber-300";
  return "bg-secondary text-secondary-foreground";
}

export default function PeoplePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <h1 className="font-serif text-2xl font-bold">인물</h1>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          새 인물
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CHARACTERS.map((char) => (
          <Link key={char.id} href={`/people/${char.id}`}>
            <Card className="group hover:border-primary/30 transition-all hover:-translate-y-0.5 cursor-pointer h-full">
              <CardContent className="p-0">
                {/* Image placeholder */}
                <div className="aspect-[3/4] bg-gradient-to-b from-secondary/50 to-card rounded-t-lg flex items-center justify-center">
                  <span className="font-serif text-4xl text-muted-foreground/30">
                    {char.name[0]}
                  </span>
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
