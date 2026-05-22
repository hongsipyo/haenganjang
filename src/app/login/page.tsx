"use client";

import { useState } from "react";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  async function handleSubmit(formData: FormData) {
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const result = mode === "login" ? await login(formData) : await signup(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setInfo(result.success);
        setMode("login");
      }
    } catch {
      // redirect from server action throws - this is expected on success
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-lg">
            행안부장관 — {mode === "login" ? "로그인" : "회원가입"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="이메일"
              required
              autoFocus
            />
            <Input
              name="password"
              type="password"
              placeholder="비밀번호 (6자 이상)"
              required
              minLength={6}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            {info && <p className="text-sm text-green-600">{info}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "처리 중..."
                : mode === "login"
                  ? "로그인"
                  : "가입하기"}
            </Button>
          </form>
          <button
            type="button"
            className="w-full mt-3 text-sm text-muted-foreground hover:underline"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
              setInfo("");
            }}
          >
            {mode === "login"
              ? "계정이 없으면 여기서 가입"
              : "이미 계정이 있으면 로그인"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
