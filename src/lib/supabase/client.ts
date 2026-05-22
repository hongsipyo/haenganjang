import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const URL = "https://evrjofckfslmbbtiagdp.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2cmpvZmNrZnNsbWJidGlhZ2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NDg5NDcsImV4cCI6MjA5NDMyNDk0N30.Mn2DN6VROvuXbQiqSbhWsZIBWEF1GB1BidLrW8mhoaQ";

export function createClient() {
  return createBrowserClient<Database>(URL, KEY);
}
