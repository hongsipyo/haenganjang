"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, FileText } from "lucide-react";
import { saveScratch, getScratchItems } from "@/lib/supabase/actions";

const MARKER_OVERALL = "[트리트먼트:전체]";

export default function TreatmentPage() {
  const [overall, setOverall] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const items = await getScratchItems();
      for (const item of items as { content: string }[]) {
        if (item.content.startsWith(MARKER_OVERALL)) {
          setOverall(item.content.slice(MARKER_OVERALL.length + 1));
          break;
        }
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function saveOverall() {
    if (!overall.trim()) return;
    setSaving(true);
    try {
      await saveScratch(`${MARKER_OVERALL} ${overall}`);
    } catch { /* ignore */ }
    setSaving(false);
  }

  if (!loaded) return <div className="max-w-3xl mx-auto px-6 py-10 text-gray-400">로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="w-5 h-5 text-primary" />
        <h1 className="font-serif text-2xl font-bold">트리트먼트</h1>
      </div>

      <Card className="border-rose-100 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">전체 트리트먼트</CardTitle>
          <Button
            size="sm"
            onClick={saveOverall}
            disabled={saving}
            className="gap-1.5 bg-rose-500 hover:bg-rose-600 text-white"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "저장 중..." : "저장"}
          </Button>
        </CardHeader>
        <CardContent>
          <Textarea
            value={overall}
            onChange={(e) => setOverall(e.target.value)}
            placeholder="행정안전부 장관 전체 트리트먼트: 주제, 갈등 구조, 주요 인물 아크, 결말 방향, 풍자 포인트..."
            className="min-h-[400px] text-sm border-rose-200 focus:border-rose-400"
          />
        </CardContent>
      </Card>
    </div>
  );
}
