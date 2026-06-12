"use client";

import { useState } from "react";
import { MessageSquare, Eye, ThumbsUp, ThumbsDown, ArrowLeft, Pencil, Flame } from "lucide-react";

interface Cmt { id: string; nick: string; ip: string; text: string; time: string; up: number; }
interface Post {
  id: string; tag: string; title: string; nick: string; ip: string; date: string;
  views: number; up: number; down: number; body: string; comments: Cmt[]; hot?: boolean;
}

const SEED: Post[] = [
  {
    id: "p1", tag: "일반", hot: true, title: "김형식 각성씬 소름ㅋㅋㅋ 기재부장관 발리는거 ㄹㅇ 사이다", nick: "ㅇㅇ", ip: "118.43",
    date: "10:42", views: 2841, up: 213, down: 4,
    body: "아니 32년차 관료가 봉인 풀고 예산안 들이미는데 기재부장관 표정 ㅋㅋㅋㅋ 그 페이지에서 폰 떨어뜨림 ㄹㅇ 추천좀\n\n\"전결권은 제가 받겠습니다\" 이 대사 한방에 정리되는거 미쳤노",
    comments: [
      { id: "c1", nick: "ㅇㅇ", ip: "211.36", text: "ㅇㅇ나도 그 컷에서 소리지름ㅋㅋㅋ 작가 천재네", time: "10:45", up: 47 },
      { id: "c2", nick: "행안러", ip: "1.221", text: "기재부장관 그동안 빌드업한게 한방에 터지는거 ㄹㅇ 카타르시스", time: "10:51", up: 22 },
      { id: "c3", nick: "ㅇㅇ", ip: "39.7", text: "이게 데뷔작이라고? 사기캐노", time: "11:02", up: 31 },
    ],
  },
  {
    id: "p2", tag: "정보", hot: true, title: "[정보] 이거 실존 부처 풍자 맞제? 디테일 정리함 (스압)", nick: "분석관", ip: "112.156",
    date: "09:15", views: 5102, up: 288, down: 9,
    body: "행안부 vs 기재부 예산 줄다리기 이거 현실고증 ㅈㄴ 빡셈ㅋㅋ 작중 \"교부세\" 떡밥이랑 실제 지방교부세 구조랑 거의 일치함. 32년차 사무관이 장관 자리까지 올라가는 라인도 실제 행시 출신 테크트리 그대로 따라감.\n\n작가 공무원 출신 아니냐는 말 나오는 이유가 있음 ㅋㅋ",
    comments: [
      { id: "c1", nick: "ㅇㅇ", ip: "175.223", text: "와 이거 보고 다시 정주행하러감", time: "09:33", up: 58 },
      { id: "c2", nick: "ㅇㅇ", ip: "203.99", text: "분석관 형 다음편도 부탁함 교부세편 더 파줘", time: "09:40", up: 14 },
    ],
  },
  {
    id: "p3", tag: "짤", title: "오늘자 김형식 봉인해제.jpg", nick: "ㅇㅇ", ip: "121.88",
    date: "08:50", views: 1733, up: 92, down: 1,
    body: "(이미지) 안경 벗는 그 컷 ㅋㅋㅋㅋ 평범한 공무원에서 갑자기 포스 미쳐버림\n\n월급쟁이 관료의 분노 게이지 풀충전 ㄹㅇ",
    comments: [{ id: "c1", nick: "ㅇㅇ", ip: "58.29", text: "ㅋㅋㅋㅋ 이거 프사로 씀", time: "09:01", up: 19 }],
  },
  {
    id: "p4", tag: "일반", title: "작가 이거 고소 안당하냐ㅋㅋㅋ 풍자 수위 미쳤는데", nick: "걱정러", ip: "106.101",
    date: "08:12", views: 1290, up: 64, down: 3,
    body: "기재부장관 캐릭터 너무 대놓고 까는거 아님? ㅋㅋㅋ 근데 코미디로 잘 빠져서 명예훼손은 피해갈듯\n\n작가 멘탈 ㄹㅇ 강철이노 ㅋㅋ",
    comments: [
      { id: "c1", nick: "ㅇㅇ", ip: "117.111", text: "이게 풍자의 정석이지 ㅋㅋ 웃기면서 뼈때림", time: "08:20", up: 12 },
      { id: "c2", nick: "법잘알", ip: "61.84", text: "특정인 아니라 직책 풍자라 ㄱㅊ음 ㅇㅇ", time: "08:31", up: 9 },
    ],
  },
  {
    id: "p5", tag: "일반", title: "행안갤 사람들아 다음화 떡밥 뭐라고 봄?", nick: "예언자", ip: "223.38",
    date: "07:44", views: 612, up: 18, down: 0,
    body: "김형식이 봉인 한번 더 풀면 이제 총리실까지 가는거 아니냐ㅋㅋ 부처 끝판왕 누구일지 예측좀~노",
    comments: [
      { id: "c1", nick: "ㅇㅇ", ip: "175.196", text: "최종보스는 청와대 행정관일듯ㅋㅋ", time: "07:50", up: 7 },
      { id: "c2", nick: "ㅇㅇ", ip: "210.91", text: "감사원 라인 떡밥도 있던데", time: "07:58", up: 5 },
    ],
  },
  {
    id: "p6", tag: "짤", title: "기재부장관 발리는 짤 모음 ㅋㅋㅋ", nick: "짤줍줍", ip: "175.112",
    date: "07:10", views: 980, up: 51, down: 0,
    body: "(이미지) 예산안 빠꾸 먹는 컷부터 멘붕 컷까지 풀세트로 모았다 추천좀ㅋㅋ",
    comments: [{ id: "c1", nick: "ㅇㅇ", ip: "39.118", text: "3번째 짤 표정 ㅋㅋㅋㅋ 사이다 그 자체", time: "07:18", up: 16 }],
  },
];

const TAGS = ["전체", "일반", "정보", "짤"];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(SEED);
  const [open, setOpen] = useState<string | null>(null);
  const [tag, setTag] = useState("전체");
  const [cmt, setCmt] = useState("");

  const post = posts.find((p) => p.id === open);
  const list = tag === "전체" ? posts : posts.filter((p) => p.tag === tag);

  const vote = (id: string, dir: "up" | "down") =>
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, [dir]: p[dir] + 1 } : p)));

  const addCmt = () => {
    if (!cmt.trim() || !post) return;
    setPosts((ps) => ps.map((p) => p.id === post.id ? {
      ...p, comments: [...p.comments, { id: `n${Date.now()}`, nick: "ㅇㅇ", ip: "127.0", text: cmt.trim(), time: "방금", up: 0 }],
    } : p));
    setCmt("");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* 갤러리 헤더 */}
      <div className="mb-4 flex items-end justify-between border-b-2 border-primary/40 pb-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-neon">행안부장관 갤러리</h1>
          <p className="text-xs text-muted-foreground">정치풍자 마이너 갤러리 · 봉인 풀러 모인 곳</p>
        </div>
        <span className="text-[11px] text-muted-foreground">실시간 {posts.length}글 · 접속 327</span>
      </div>

      {!post ? (
        <>
          {/* 말머리 탭 */}
          <div className="mb-2 flex items-center gap-1 text-xs">
            {TAGS.map((t) => (
              <button key={t} onClick={() => setTag(t)}
                className={`rounded px-2.5 py-1 font-medium transition ${tag === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
                {t}
              </button>
            ))}
            <button className="ml-auto flex items-center gap-1 rounded bg-secondary px-2.5 py-1 font-bold text-foreground hover:bg-secondary/70">
              <Pencil className="h-3 w-3" /> 글쓰기
            </button>
          </div>

          {/* 글 목록 (디시 테이블) */}
          <div className="overflow-hidden rounded-lg border border-border/50">
            <div className="grid grid-cols-[40px_1fr_70px_44px_44px] gap-1 border-b border-border/50 bg-secondary/40 px-2 py-1.5 text-[11px] font-semibold text-muted-foreground">
              <span className="text-center">번호</span><span>제목</span><span>글쓴이</span><span className="text-center">조회</span><span className="text-center">추천</span>
            </div>
            {list.map((p, i) => (
              <button key={p.id} onClick={() => setOpen(p.id)}
                className="grid w-full grid-cols-[40px_1fr_70px_44px_44px] items-center gap-1 border-b border-border/30 px-2 py-2 text-left text-[13px] transition hover:bg-secondary/40">
                <span className="text-center text-xs text-muted-foreground/60">{list.length - i}</span>
                <span className="truncate text-foreground/90">
                  <span className={`mr-1.5 text-[10px] font-bold ${p.tag === "정보" ? "text-accent" : p.tag === "짤" ? "text-primary" : "text-muted-foreground"}`}>[{p.tag}]</span>
                  {p.title}
                  <span className="ml-1 text-[11px] font-bold text-primary">[{p.comments.length}]</span>
                  {p.hot && <Flame className="ml-1 inline h-3 w-3 text-accent" />}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">{p.nick}<span className="text-muted-foreground/40">({p.ip})</span></span>
                <span className="text-center text-[11px] text-muted-foreground/70">{p.views}</span>
                <span className="text-center text-[11px] font-bold text-primary">{p.up}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        /* 글 상세 */
        <div className="animate-float-up">
          <button onClick={() => setOpen(null)} className="mb-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> 목록
          </button>
          <div className="rounded-lg border border-border/50 glass p-5">
            <div className="border-b border-border/40 pb-3">
              <h2 className="text-lg font-bold text-foreground">
                <span className="mr-1.5 text-sm font-bold text-accent">[{post.tag}]</span>{post.title}
              </h2>
              <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>{post.nick}<span className="text-muted-foreground/40">({post.ip})</span></span>
                <span>{post.date}</span>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views}</span>
              </div>
            </div>
            <p className="whitespace-pre-wrap py-5 text-sm leading-relaxed text-foreground/90">{post.body}</p>

            {/* 추천/비추 */}
            <div className="flex justify-center gap-2 py-3">
              <button onClick={() => vote(post.id, "up")} className="flex flex-col items-center rounded-lg border border-primary/30 bg-primary/10 px-6 py-2 transition hover:bg-primary/20">
                <ThumbsUp className="h-4 w-4 text-primary" /><span className="mt-0.5 text-sm font-bold text-primary">{post.up}</span>
              </button>
              <button onClick={() => vote(post.id, "down")} className="flex flex-col items-center rounded-lg border border-border/50 px-6 py-2 transition hover:bg-secondary">
                <ThumbsDown className="h-4 w-4 text-muted-foreground" /><span className="mt-0.5 text-sm font-bold text-muted-foreground">{post.down}</span>
              </button>
            </div>

            {/* 댓글 */}
            <div className="mt-2 border-t border-border/40 pt-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-foreground"><MessageSquare className="h-3.5 w-3.5 text-accent" />전체 댓글 {post.comments.length}</p>
              <div className="space-y-2.5">
                {post.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-2 text-[13px]">
                    <span className="shrink-0 text-[11px] text-muted-foreground">{c.nick}<span className="text-muted-foreground/40">({c.ip})</span></span>
                    <span className="flex-1 text-foreground/85">{c.text}</span>
                    {c.up >= 20 && <span className="shrink-0 rounded bg-primary/20 px-1 text-[9px] font-bold text-primary">HOT</span>}
                    <span className="shrink-0 text-[10px] text-muted-foreground/50">{c.time}</span>
                    <span className="flex shrink-0 items-center gap-0.5 text-[10px] text-primary"><ThumbsUp className="h-2.5 w-2.5" />{c.up}</span>
                  </div>
                ))}
              </div>
              {/* 댓글 작성 */}
              <div className="mt-4 flex gap-2">
                <input value={cmt} onChange={(e) => setCmt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCmt()}
                  placeholder="ㅇㅇ (익명) 댓글 달기..." className="flex-1 rounded-lg border border-border/50 bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent/40" />
                <button onClick={addCmt} className="rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90">등록</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
