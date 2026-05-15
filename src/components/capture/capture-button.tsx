"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CaptureDialog } from "./capture-dialog";

export function CaptureButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-200",
          "bg-primary text-primary-foreground hover:opacity-90 hover:scale-105 active:scale-95"
        )}
      >
        <Plus className="w-6 h-6" />
      </button>
      <CaptureDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
