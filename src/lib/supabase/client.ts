import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createBrowserClient<Database>(URL, KEY);
}
