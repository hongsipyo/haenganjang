import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  try {
    const supabase = await createClient();
    const { error: authError } = await supabase.auth.exchangeCodeForSession(code);
    if (authError) throw authError;
    return NextResponse.redirect(`${origin}/home`);
  } catch {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }
}
