"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookText, Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import { getScratchItems, saveScratch, deleteScratch } from "@/lib/supabase/actions";

interface ManuscriptBlock {
  id: string;
  content: string;
  created_at: string;
}

export default function ManuscriptPage() {
  const [blocks, setBlocks] = useState<ManuscriptBlock[]>([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getScratchItems().then((rows) => {
      const typed = rows as unknown as {
        id: string;
        content: string;
        created_at: string;
        moved_to: string | null;
      }[];
      // [zen] 태그 포함 + [manuscript] 태그 포함된 것만
      const manuscriptRows = typed.filter(
        (r) => r.content.startsWith("[zen]") || r.content.startsWith("[manuscript]")
      );
      setBlocks(
        manuscriptRows.map((r) => ({
          id: r.id,
          content: r.content.replace(/^\[(zen|manuscript)\]\s*/, ""),
          created_at: r.created_at,
        }))
      );
      setLoading(false);
    });
  }, []);

  const addBlock = async () => {
    if (!newText.trim()) return;
    setSaving(true);
    const result = await saveScratch(`[manuscript] ${newText.trim()}`);
    if (result) {
      setBlocks((prev) => [
        ...prev,
        { id: result.id, content: newText.trim(), created_at: new Date().toISOString() },
      ]);
    }
    setNewText("");
    setSaving(false);
  };

  const removeBlock = async (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    await deleteScratch(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-2">
        <BookText className="w-5 h-5 text-primary" />
        <h1 className="font-serif text-2xl font-bold">전체 원고</h1>
      </div>
      <p className="text-xs text-muted-foreground mb-10">
        완성된 장면과 문장들. 순서대로 쌓임. Zen에서 쓴 것도 여기 들어옴.
      </p>

      {/* Existing blocks */}
      <div className="space-y-4 mb-10">
        {blocks.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            아직 없음. 아래에서 쓰거나, Zen 모드에서 써.
          </div>
        )}
        {blocks.map((block) => (
          <Card key={block.id} className="group">
            <CardContent className="p-5">
              <div className="flex gap-3">
                <GripVertical className="w-4 h-4 text-muted-foreground/30 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-serif">
                    {block.content}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(block.created_at).toLocaleDateString("ko-KR")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeBlock(block.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add new block */}
      <div className="border-t border-border/30 pt-8">
        <Textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="완성된 장면이나 문장을 여기에..."
          className="min-h-[120px] text-sm font-serif leading-relaxed mb-3"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) {
              e.preventDefault();
              addBlock();
            }
          }}
        />
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-muted-foreground">Cmd+Enter로 추가</span>
          <Button size="sm" onClick={addBlock} disabled={!newText.trim() || saving} className="gap-1.5">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            추가
          </Button>
        </div>
      </div>
    </div>
  );
}
