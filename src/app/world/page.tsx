"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, ImageIcon, Music, FileText, Plus, ExternalLink, Trash2 } from "lucide-react";
import { useState } from "react";

interface MusicItem {
  id: string;
  title: string;
  artist: string;
  url: string;
  note: string;
}

const INITIAL_MUSIC: MusicItem[] = [
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
  const [memoContent, setMemoContent] = useState(
    `시대: 근미래 대한민국
톤: 정치풍자 코미디 + 액션 + 판타지
장르: 웹소설 / 웹툰 / 영화

━━━ 오행 시스템 ━━━

장관들마다 오행 속성이 있음 (목/화/토/금/수)
속성에 따라 능력과 약점이 다름
속성 상극 관계가 정치적 갈등과 연결
예: 행안부 장관(토) vs 국방부 장관(목) — 토극수, 목극토

━━━ 봉인된 힘 ━━━

각 장관직에는 봉인된 힘이 있음
규칙을 완벽히 지키면 역설적으로 봉인이 풀림
봉인이 풀리면 팬티가 찢어짐 (물리적으로)
팬티 찢어짐 = 각성의 시각적 표현

━━━ 공무원 사회 풍자 ━━━

관료제의 비효율을 능력 시스템으로 치환
결재 라인이 길수록 능력 약화
직급 체계 = 파워 레벨
감사원 = 디버프 시전자
국회 = 레이드 보스

━━━ 정치 코미디 톤 ━━━

진지한 상황 + 바보 같은 결과
규칙을 지키려는 선의가 재앙을 부름
악당은 합법적으로 나쁜 짓을 함
웃기지만 슬프고, 슬프지만 웃김
"법대로 하겠습니다" = 이 작품의 "아멘"

━━━ 모티프 ━━━

팬티 — 관료의 체면, 격식, 위선의 상징. 찢어지면 본모습 드러남.
도장 — 결재 도장이 곧 마법 인장. 위조 도장은 저주.
넥타이 — 목을 조이는 것 = 규율에 의한 억압. 풀면 해방.
명함 — 정체성의 전부. 명함 없으면 투명인간.

━━━ 격언 ━━━

법대로 하면 다 죽는다. 그래서 법대로 안 하는 거다.

공무원의 가장 강력한 무기는 "검토하겠습니다"이다.

장관은 바뀌어도 과장은 영원하다.

팬티가 찢어질 때 비로소 인간이 된다.`
  );

  const [musicList, setMusicList] = useState<MusicItem[]>(INITIAL_MUSIC);
  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newNote, setNewNote] = useState("");

  const addMusic = () => {
    if (!newTitle.trim()) return;
    setMusicList([
      ...musicList,
      {
        id: String(Date.now()),
        title: newTitle.trim(),
        artist: newArtist.trim(),
        url: newUrl.trim(),
        note: newNote.trim(),
      },
    ]);
    setNewTitle("");
    setNewArtist("");
    setNewUrl("");
    setNewNote("");
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
            <p className="text-sm text-muted-foreground mb-4">
              행안부장관 사운드트랙 후보들
            </p>

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
                      onClick={() => setMusicList(musicList.filter((m) => m.id !== item.id))}
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
              <CardTitle className="text-sm font-medium">세계관 메모</CardTitle>
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
