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

const DEFAULT_MEMO = `시대: 2020년대 초중반, 광명
톤: 매지컬 리얼리즘 + 한국적 정서
서술: 3인칭인데 1인칭에 존나 가까움, 객관화 시도하다 실패

━━━ 핵심 법칙 ━━━

속성 시스템 — 사람마다 물/불/흙/금/나무 속성이 있음. 속성이 물이면 물에 닿으면 기분 좋아짐. 옷이 황토 재질이면 퍼포먼스 떨어짐. 가볍게, 재미용.

사물의 도움 — 사물들은 모두 도움을 준다. 잘 정돈하고 매만지면. → 다정이 ADHD: 정리하면 사물이 도와주는데, 정리를 못 하니까 도움을 못 받음.

수면과 시공간 — 어제와 오늘 사이엔 수많은 시공간이 있는데, 이 열차는 대개 탈선하지 않음. 자다가 죽을 경우 탈선하기도 함.

신성과 소음 — 어릴때 가진 신성을 소음으로 뒤덮는다. 목표는 신성 잃지 않기. 다정이가 어른이 되면서 할머니가 안 보이게 되는 이유.

기억의 소거 — 아기 때의 기억이 지워지는 이유: 그때는 세상의 비밀을 알고 있기 때문. 꿈을 잊게 되는 이유도 같음.

파스칼 — "오직 보기를 원하는 자에게는 충분한 빛이 있고, 이와 반대되는 마음을 가진 자들에게는 충분한 어둠이 있다." → 할머니가 다정이에게만 보이는 이유.

━━━ 모티프 ━━━

핑크색 풍선 — 어릴 때 힘들면 핑크색 풍선으로 회피. 사랑에 빠지면 핑크색 풍선 나타남. 파랑색 풍선과 부풀어오름(썸) → 터짐.

할머니 수호신 — 라이프오브파이처럼 환상/현실 불명확. 호메로스/서유기처럼 보이지 않는 것들이 뒤에서 도움. 다정이 더이상 필요 없어지면 사라짐.

밥그릇 — 정우 트라우마. 어릴 때 밥그릇 없어서 환영 봄, 사랑의 표시로 밥그릇 줌.

온기 — 여자는 (온기)로 덥혀져야 하는데 그 온기는 엄마가 (볼)로 전달.

사랑의 시각적 변화 — 흰우유→딸기우유, 주변 모든 것 바뀜.

찰나의 기억 — 프루스트의 마들렌처럼 찰나에 오는 것들. 눈꺼풀 뒤에 있는 것들. 파편이라는 개념 자체가 이것.

━━━ 연출 ━━━

ADHD 연출 — 인사이드아웃식. 팽이 돌아가며 DDR(racing thoughts). 머릿속 7개 채널.

비유 톤 — "철사, 뱀" 같은 불길한 사물로 환기하기.

고르기아스 — "탁월한 문장은 언어를 통해 기쁨을 주고 슬픔을 가져간다. 마법이 가진 두 가지 기술 — 영혼을 혼란시키고 생각을 속이는 것."

━━━ 격언 ━━━

무엇이든 그것만 기다리고 있는 자에게는 그것이 오지 않는다. 마치 전여친의 연락처럼.

누구나 입이 가벼운 자에게는 비밀을 맡기고 싶지 않아 하는 법이다.

알고 싶은 것보다 모르고 싶은 게 더 많아지는 시기를 지나고 있었다.

어른이란 많은 실수를 저지른 사람을 일컫는다.`;

const DEFAULT_MUSIC: MusicItem[] = [
  {
    id: "1",
    title: "Leave the Door Open",
    artist: "Bruno Mars, Anderson .Paak, Silk Sonic",
    url: "https://music.apple.com/kr/album/leave-the-door-open/1551901062?i=1551901065",
    note: "뮤지컬 씬 핵심곡. 반지하, 하인 분장, 멱살 잡기",
  },
  {
    id: "2",
    title: "말달리자",
    artist: "",
    url: "",
    note: "락페 난입 장면. 보컬 밀치고 부르다가 말 타고 키스",
  },
];

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
                다정의 사운드트랙 후보들
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
