"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Timer, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const DURATION_OPTIONS = [
  { label: "5분", minutes: 5 },
  { label: "10분", minutes: 10 },
  { label: "15분", minutes: 15 },
];

export function SprintTimer() {
  const [open, setOpen] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setSecondsLeft(selectedMinutes * 60);
    setRunning(true);
    setDone(false);
  }, [selectedMinutes]);

  const stop = useCallback(() => {
    setRunning(false);
    setSecondsLeft(0);
    setDone(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const extend = useCallback(() => {
    setSecondsLeft(selectedMinutes * 60);
    setDone(false);
    setRunning(true);
  }, [selectedMinutes]);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          setDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Collapsed pill button
  if (!open && !running && !done) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 left-6 z-50",
          "h-12 px-4 rounded-full flex items-center gap-2 shadow-lg transition-all duration-200",
          "bg-gradient-to-r from-amber-100 to-rose-100 text-amber-700 border border-amber-200/60",
          "hover:shadow-xl hover:scale-105 active:scale-95"
        )}
      >
        <Timer className="w-5 h-5" />
        <span className="text-sm font-medium">5분만 써보자</span>
      </button>
    );
  }

  // Running state — floating timer
  if (running) {
    return (
      <div
        className={cn(
          "fixed bottom-6 left-6 z-50",
          "rounded-2xl shadow-xl border border-amber-200/60 px-5 py-3",
          "bg-gradient-to-r from-amber-50 to-rose-50",
          "animate-pulse-gentle"
        )}
      >
        <style jsx>{`
          @keyframes pulse-gentle {
            0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.2); }
            50% { box-shadow: 0 0 0 8px rgba(251, 191, 36, 0); }
          }
          .animate-pulse-gentle {
            animation: pulse-gentle 2s ease-in-out infinite;
          }
        `}</style>
        <div className="flex items-center gap-3">
          <Timer className="w-5 h-5 text-amber-600" />
          <span className="text-2xl font-semibold text-amber-800 tabular-nums">
            {formatTime(secondsLeft)}
          </span>
          <button
            onClick={stop}
            className="ml-2 p-1.5 rounded-full hover:bg-rose-100 text-rose-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-amber-500 mt-1">집중 중... 잘 하고 있어!</p>
      </div>
    );
  }

  // Done state — celebration
  if (done) {
    return (
      <div
        className={cn(
          "fixed bottom-6 left-6 z-50",
          "rounded-2xl shadow-xl border border-rose-200/60 px-5 py-4",
          "bg-gradient-to-r from-rose-50 to-amber-50"
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-sm font-semibold text-rose-700">수고했어!</p>
            <p className="text-xs text-amber-600">{selectedMinutes}분 집중 완료</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={extend}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            한 번 더
          </button>
          <button
            onClick={() => { stop(); setOpen(false); }}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors"
          >
            완료
          </button>
        </div>
      </div>
    );
  }

  // Open — duration picker
  return (
    <div
      className={cn(
        "fixed bottom-6 left-6 z-50",
        "rounded-2xl shadow-xl border border-amber-200/60 px-5 py-4",
        "bg-gradient-to-r from-amber-50 to-rose-50"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">스프린트 타이머</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1 rounded-full hover:bg-rose-100 text-rose-400 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex gap-2 mb-3">
        {DURATION_OPTIONS.map((opt) => (
          <button
            key={opt.minutes}
            onClick={() => setSelectedMinutes(opt.minutes)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
              selectedMinutes === opt.minutes
                ? "bg-amber-200 text-amber-800"
                : "bg-white/60 text-amber-600 hover:bg-amber-100"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        onClick={start}
        className="w-full py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-rose-400 to-amber-400 text-white hover:opacity-90 transition-opacity"
      >
        시작!
      </button>
    </div>
  );
}
