"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, ImageIcon, Send, Tag, Check } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { saveFragment, saveScratch } from "@/lib/supabase/actions";

interface CaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SECTIONS = [
  { value: "fragments", label: "파편" },
  { value: "scratch", label: "메모" },
  { value: "world", label: "세계관" },
];

export function CaptureDialog({ open, onOpenChange }: CaptureDialogProps) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [section, setSection] = useState("fragments");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addTag = useCallback(() => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
  }, [tagInput, tags]);

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        // TODO: upload to Supabase Storage
        console.log("Recording saved:", blob.size, "bytes");
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !recording) return;
    setSaving(true);
    try {
      if (section === "fragments") {
        await saveFragment(content, tags);
      } else {
        // "scratch" and "world" (fallback) both save to scratch
        await saveScratch(content);
      }
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setContent("");
        setTags([]);
        onOpenChange(false);
      }, 800);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-medium">빠른 캡처</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Section selector */}
          <div className="flex gap-2">
            {SECTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSection(s.value)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  section === s.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Text input */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="떠오르는 장면, 대사, 감정..."
            className="min-h-[100px] text-sm"
            autoFocus
          />

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex gap-1.5 flex-wrap">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="태그 (선택)"
                  className="pl-8 h-8 text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {/* Voice */}
              <Button
                variant={recording ? "destructive" : "outline"}
                size="sm"
                className="gap-1.5"
                onClick={recording ? stopRecording : startRecording}
              >
                {recording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    {formatTime(recordingTime)}
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    녹음
                  </>
                )}
              </Button>

              {/* Image */}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                이미지
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // TODO: upload to Supabase Storage
                    console.log("Image selected:", file.name);
                  }
                }}
              />
            </div>

            <Button size="sm" onClick={handleSubmit} disabled={saving || saved} className="gap-1.5">
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  저장됨!
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  {saving ? "저장 중..." : "저장"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
