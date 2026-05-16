"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Feather, Sparkles, Save, Loader2 } from "lucide-react";
import { saveScratch } from "@/lib/supabase/actions";

export default function ZenPage() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleConnect = async () => {
    if (!text.trim()) return;
    setSaving(true);
    setSummary(null);

    // 저장
    await saveScratch(`[zen] ${text.trim()}`);

    // 간단 연결 요약 생성 (로컬 규칙 기반)
    const content = text.trim();
    const connections: string[] = [];

    if (/김형식|행안부|장관|관료/.test(content)) connections.push("김형식 캐릭터");
    if (/기재부|빌런|악역|적/.test(content)) connections.push("기재부장관 (빌런)");
    if (/문형철|차관|무능/.test(content)) connections.push("문형철 차관");
    if (/팬티|수모|굴욕/.test(content)) connections.push("발단부 - 팬티 찢김");
    if (/괴력|봉인|힘|각성/.test(content)) connections.push("전개부 - 각성");
    if (/반격|복수|흙/.test(content)) connections.push("절정부 - 반격");
    if (/대통령|치매/.test(content)) connections.push("대통령 캐릭터");
    if (/박잭슨|외교/.test(content)) connections.push("박잭슨 캐릭터");
    if (/노양진|회칼/.test(content)) connections.push("노양진 캐릭터");
    if (/김광태|고소/.test(content)) connections.push("김광태 캐릭터");
    if (/국토|토기/.test(content)) connections.push("국토교통부장관");
    if (/오행|화기|불|소방/.test(content)) connections.push("오행 시스템");
    if (/웹툰|웹소설|영화|플랫폼/.test(content)) connections.push("플랫폼 전략");
    if (/개그|코미디|웃/.test(content)) connections.push("코미디 톤");
    if (/액션|싸움|주먹/.test(content)) connections.push("액션 시퀀스");

    if (connections.length > 0) {
      setSummary(`연결: ${connections.join(" · ")}`);
    } else {
      setSummary("새로운 아이디어 — 기존 요소와 직접 연결 없음. 파편으로 저장됨.");
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    setText("");
    setSummary(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 min-h-screen flex flex-col">
      {/* Header - minimal */}
      <div className="flex items-center gap-2 mb-12">
        <Feather className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground tracking-widest uppercase">
          zen
        </span>
      </div>

      {/* Writing area */}
      <div className="flex-1 flex flex-col">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="그냥 써."
          className="flex-1 min-h-[400px] text-base leading-relaxed border-none shadow-none resize-none focus-visible:ring-0 placeholder:text-muted-foreground/30 font-serif"
          autoFocus
        />
      </div>

      {/* Connection summary */}
      {summary && (
        <div className="mt-6 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-medium text-primary">프로젝트 연결</span>
          </div>
          <p className="text-sm text-foreground/70">{summary}</p>
        </div>
      )}

      {/* Actions - bottom */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/30">
        <span className="text-[10px] text-muted-foreground">
          {text.length > 0 ? `${text.length}자` : "빈 칸"}
        </span>
        <div className="flex gap-2">
          {text.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs">
              비우기
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleConnect}
            disabled={!text.trim() || saving}
            className="gap-1.5"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saved ? (
              <Save className="w-3.5 h-3.5" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {saved ? "저장됨" : "연결"}
          </Button>
        </div>
      </div>
    </div>
  );
}
