import { createClient } from "@/lib/supabase/client";

// 고정 user_id — 비공개 사이트, 본인만 사용
const USER_ID = "b18e8cbe-a644-4ef5-b7f0-b2969cbbe8ba";

export interface ActivityLogRow {
  id: string;
  action: string;
  detail: string;
  section: string;
  related_id: string | null;
  user_id: string;
  created_at: string;
}

// --------------- Activity Log ---------------

export async function logActivity(
  action: string,
  detail: string,
  section: string,
  relatedId?: string
) {
  const supabase = createClient();
  await supabase.from("activity_log" as never).insert({
    user_id: USER_ID,
    action,
    detail,
    section,
    related_id: relatedId ?? null,
  } as never);
}

export async function getActivityLog(days: number = 30) {
  const supabase = createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = (await supabase
    .from("activity_log" as never)
    .select("*")
    .gte("created_at" as never, since.toISOString() as never)
    .order("created_at" as never, { ascending: false } as never)) as {
    data: ActivityLogRow[] | null;
  };

  return data ?? [];
}

export async function getDailyStats(days: number = 30) {
  const logs = await getActivityLog(days);

  const map = new Map<string, { count: number; sections: Set<string> }>();

  for (const log of logs) {
    const date = log.created_at.slice(0, 10);
    if (!map.has(date)) {
      map.set(date, { count: 0, sections: new Set() });
    }
    const entry = map.get(date)!;
    entry.count++;
    if (log.section) entry.sections.add(log.section);
  }

  return Array.from(map.entries())
    .map(([date, { count, sections }]) => ({
      date,
      count,
      sections: Array.from(sections),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// --------------- Fragments ---------------

export async function saveFragment(
  content: string,
  tags: string[],
  type: string = "text"
) {
  const supabase = createClient();
  const { data, error } = (await supabase
    .from("fragments" as never)
    .insert({
      content,
      tags,
      type,
      user_id: USER_ID,
    } as never)
    .select()
    .single()) as { data: { id: string } | null; error: unknown };

  if (!error && data) {
    await logActivity("create", content.slice(0, 80), "fragments", data.id);
  }

  return data;
}

// --------------- Characters ---------------

export interface CharacterRow {
  id: string;
  name: string;
  description: string | null;
  element: string | null;
  animal: string | null;
  details: Record<string, string> | null;
  notes: string | null;
  order_index: number;
}

export async function getCharacterOverrides(): Promise<Record<string, Partial<CharacterRow>>> {
  const supabase = createClient();
  const { data } = await supabase
    .from("characters" as never)
    .select("*");
  const map: Record<string, Partial<CharacterRow>> = {};
  if (data) {
    for (const row of data as CharacterRow[]) {
      map[row.name] = row;
    }
  }
  return map;
}

export async function saveCharacterField(
  charName: string,
  field: string,
  value: string | null
) {
  const supabase = createClient();

  // Check if character exists in DB
  const { data: existing } = await supabase
    .from("characters" as never)
    .select("id")
    .eq("name" as never, charName as never)
    .single() as { data: { id: string } | null };

  if (existing) {
    await supabase
      .from("characters" as never)
      .update({ [field]: value } as never)
      .eq("id" as never, existing.id as never);
  } else {
    await supabase
      .from("characters" as never)
      .insert({
        name: charName,
        [field]: value,
        user_id: USER_ID,
      } as never);
  }

  await logActivity("character_edited", `${charName} ${field} 수정`, "people");
}

export async function getFragments() {
  const supabase = createClient();
  const { data } = await supabase
    .from("fragments" as never)
    .select("*")
    .order("created_at" as never, { ascending: false } as never);

  return (data ?? []) as Record<string, unknown>[];
}

// --------------- Scratch ---------------

export async function saveScratch(content: string) {
  const supabase = createClient();
  const { data, error } = (await supabase
    .from("scratch" as never)
    .insert({
      content,
      user_id: USER_ID,
    } as never)
    .select()
    .single()) as { data: { id: string } | null; error: unknown };

  if (!error && data) {
    await logActivity("create", content.slice(0, 80), "scratch", data.id);
  }

  return data;
}

export async function getScratchItems() {
  const supabase = createClient();
  const { data } = await supabase
    .from("scratch" as never)
    .select("*")
    .order("created_at" as never, { ascending: false } as never);

  return (data ?? []) as Record<string, unknown>[];
}

export async function deleteScratch(id: string) {
  const supabase = createClient();
  await supabase
    .from("scratch" as never)
    .delete()
    .eq("id" as never, id as never);

  await logActivity("delete", "메모 삭제", "scratch", id);
}

// --------------- Brainstorm ---------------

export async function saveBrainstorm(question: string, answer: string, category: string) {
  const supabase = createClient();
  const result = await supabase
    .from("brainstorm_history" as never)
    .insert({
      question,
      answer,
      category,
      user_id: USER_ID,
    } as never)
    .select()
    .single();

  if (result.error) {
    throw new Error(result.error.message);
  }

  const data = result.data as { id: string; question: string; answer: string; created_at: string } | null;

  if (data) {
    await logActivity("brainstorm", answer.slice(0, 80), "brainstorm", data.id);
  }

  return data;
}

export async function getBrainstormHistory() {
  const supabase = createClient();
  const { data } = (await supabase
    .from("brainstorm_history" as never)
    .select("*")
    .order("created_at" as never, { ascending: false } as never)
    .limit(50)) as { data: { id: string; question: string; answer: string; created_at: string }[] | null };

  return data ?? [];
}

// --------------- Written Scenes ---------------

export interface WrittenScene {
  id: string;
  title: string;
  content: string;
  characters: string[];
  episode_number: number | null;
  scene_order: number;
  prompt_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function saveScene(scene: {
  title: string;
  content: string;
  characters?: string[];
  episode_number?: number | null;
  prompt_id?: string | null;
}) {
  const supabase = createClient();
  const result = await supabase
    .from("written_scenes" as never)
    .insert({
      ...scene,
      characters: scene.characters ?? [],
      user_id: USER_ID,
    } as never)
    .select()
    .single();

  if (result.error) throw new Error(result.error.message);
  const data = result.data as WrittenScene | null;
  if (data) {
    await logActivity("scene_created", scene.title, "scenes", data.id);
  }
  return data;
}

export async function updateScene(id: string, updates: {
  title?: string;
  content?: string;
  characters?: string[];
  episode_number?: number | null;
  scene_order?: number;
}) {
  const supabase = createClient();
  await supabase
    .from("written_scenes" as never)
    .update(updates as never)
    .eq("id" as never, id as never);
}

export async function getScenes() {
  const supabase = createClient();
  const { data } = await supabase
    .from("written_scenes" as never)
    .select("*")
    .order("episode_number" as never, { ascending: true } as never)
    .order("scene_order" as never, { ascending: true } as never);
  return (data ?? []) as WrittenScene[];
}

export async function deleteScene(id: string) {
  const supabase = createClient();
  await supabase
    .from("written_scenes" as never)
    .delete()
    .eq("id" as never, id as never);
  await logActivity("scene_deleted", "장면 삭제", "scenes", id);
}
