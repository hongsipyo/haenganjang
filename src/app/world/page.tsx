"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, ImageIcon, Music, FileText, Plus, ExternalLink, Trash2, Save, Loader2, Check } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { saveScratch, getScratchItems, deleteScratch } from "@/lib/supabase/actions";

const MARKER_NOTES = "[world:notes]";
const MARKER_MUSIC = "[world:music]";

interface MusicItem {
  id: string;
  title: string;
  artist: string;
  url: string;
  note: string;
}

const DEFAULT_MEMO = `여기에 행안부장관 세계관을 작성하세요.

━━━ 세계관 ━━━

━━━ 핵심 설정 ━━━

━━━ 모티프 ━━━

━━━ 톤/연출 ━━━
`;

const DEFAULT_MUSIC: MusicItem[] = [];

export default function WorldPage() {
  const [memoContent, setMemoContent] = useState(DEFAULT_MEMO);
  const [musicList, setMusicList] = useState<MusicItem[]>(DEFAULT_MUSIC);
  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newNote, setNewNote] = useState("");

  // DB row IDs for upsert (delete old + insert new)
  const [notesDbId, setNotesDbId] = useState<string | null>(null);
  const [musicDbId, setMusicDbId] = useState<string | null>(null);

  // Save status indicators
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [musicSaving, setMusicSaving] = useState(false);
  const [musicSaved, setMusicSaved] = useState(false);
  const [, setLoaded] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const items = await getScratchItems();

        // Find most recent notes entry
        const notesItem = items.find(
          (item) => typeof item.content === "string" && item.content.startsWith(MARKER_NOTES)
        );
        if (notesItem && typeof notesItem.content === "string") {
          setMemoContent(notesItem.content.slice(MARKER_NOTES.length));
          setNotesDbId(notesItem.id as string);
        }

        // Find most recent music entry
        const musicItem = items.find(
          (item) => typeof item.content === "string" && item.content.startsWith(MARKER_MUSIC)
        );
        if (musicItem && typeof musicItem.content === "string") {
          try {
            const parsed = JSON.parse(musicItem.content.slice(MARKER_MUSIC.length));
            if (Array.isArray(parsed)) {
              setMusicList(parsed);
            }
          } catch {
            // ignore parse errors, keep default
          }
          setMusicDbId(musicItem.id as string);
        }
      } catch (err) {
        console.error("Failed to load world data:", err);
      } finally {
        setLoaded(true);
      }
    }
    loadData();
  }, []);

  // Save notes to DB
  const saveNotes = useCallback(async () => {
    setNotesSaving(true);
    setNotesSaved(false);
    try {
      // Delete old entry if exists
      if (notesDbId) {
        await deleteScratch(notesDbId);
      }
      // Save new
      const result = await saveScratch(MARKER_NOTES + memoContent);
      if (result) {
        setNotesDbId(result.id);
      }
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setNotesSaving(false);
    }
  }, [memoContent, notesDbId]);

  // Save music list to DB
  const saveMusic = useCallback(async () => {
    setMusicSaving(true);
    setMusicSaved(false);
    try {
      // Delete old entry if exists
      if (musicDbId) {
        await deleteScratch(musicDbId);
      }
      // Save new
      const result = await saveScratch(MARKER_MUSIC + JSON.stringify(musicList));
      if (result) {
        setMusicDbId(result.id);
      }
      setMusicSaved(true);
      setTimeout(() => setMusicSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save music:", err);
    } finally {
      setMusicSaving(false);
    }
  }, [musicList, musicDbId]);

  const addMusic = () => {
    if (!newTitle.trim()) return;
    const updated = [
      ...musicList,
      {
        id: String(Date.now()),
        title: newTitle.trim(),
        artist: newArtist.trim(),
        url: newUrl.trim(),
        note: newNote.trim(),
      },
    ];
    setMusicList(updated);
    setNewTitle("");
    setNewArtist("");
    setNewUrl("");
    setNewNote("");
  };

  const removeMusic = (id: string) => {
    setMusicList(musicList.filter((m) => m.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Globe className="w-5 h-5 text-primary" />
        <h1 className="font-serif text-2xl font-bold">세계관</h1>
      </div>

      <Tabs defaultValue="moodboard">
        <TabsList className="mb-6">
          <TabsTrigger value="moodboard" className="gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            무드보드
          </TabsTrigger>
          <TabsTrigger value="music" className="gap-1.5">
            <Music className="w-3.5 h-3.5" />
            음악
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            메모
          </TabsTrigger>
        </TabsList>

        <TabsContent value="moodboard">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg border border-dashed border-border bg-card/50 flex items-center justify-center cursor-pointer hover:border-primary/30 transition-colors"
              >
                <div className="text-center">
                  <ImageIcon className="w-6 h-6 mx-auto text-muted-foreground/30 mb-2" />
                  <span className="text-xs text-muted-foreground/40">이미지 추가</span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="gap-1.5">
            <Plus className="w-4 h-4" />
            이미지 업로드
          </Button>
        </TabsContent>

        <TabsContent value="music">
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                사운드트랙 후보들
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={saveMusic}
                disabled={musicSaving}
                className="gap-1.5"
              >
                {musicSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : musicSaved ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {musicSaving ? "저장 중..." : musicSaved ? "저장됨" : "저장"}
              </Button>
            </div>

            {musicList.map((item) => (
              <Card key={item.id} className="group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <Music className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">{item.title}</h4>
                          {item.artist && (
                            <span className="text-xs text-muted-foreground">
                              — {item.artist}
                            </span>
                          )}
                        </div>
                        {item.note && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.note}
                          </p>
                        )}
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Apple Music에서 듣기
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeMusic(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add new music */}
            <Card className="border-dashed">
              <CardContent className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground font-medium">새 곡 추가</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="곡 제목"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="text-sm"
                  />
                  <Input
                    placeholder="아티스트"
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <Input
                  placeholder="Apple Music 링크 (선택)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="text-sm"
                />
                <Input
                  placeholder="메모 (어떤 장면?)"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="text-sm"
                />
                <Button variant="outline" size="sm" onClick={addMusic} className="gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  추가
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">세계관 메모</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveNotes}
                  disabled={notesSaving}
                  className="gap-1.5"
                >
                  {notesSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : notesSaved ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {notesSaving ? "저장 중..." : notesSaved ? "저장됨" : "저장"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={memoContent}
                onChange={(e) => setMemoContent(e.target.value)}
                className="min-h-[400px] text-sm leading-relaxed border-none bg-transparent p-0 resize-none focus-visible:ring-0"
                placeholder="시대 배경, 톤, 분위기, 모티프..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
