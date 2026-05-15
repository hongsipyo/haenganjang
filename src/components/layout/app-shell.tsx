"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { CaptureButton } from "../capture/capture-button";
import { ContextBanner } from "./context-banner";
import { SprintTimer } from "./sprint-timer";
import { CelebrationProvider } from "./celebration-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <CelebrationProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-h-screen overflow-y-auto">
          <ContextBanner />
          {children}
        </main>
      </div>
      <CaptureButton />
      <SprintTimer />
    </CelebrationProvider>
  );
}
