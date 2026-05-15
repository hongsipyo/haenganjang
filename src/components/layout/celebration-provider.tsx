"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface CelebrationContextValue {
  celebrate: (message?: string) => void;
}

const CelebrationContext = createContext<CelebrationContextValue>({
  celebrate: () => {},
});

export function useCelebration() {
  return useContext(CelebrationContext);
}

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("저장됨!");

  const celebrate = useCallback((msg?: string) => {
    setMessage(msg || "저장됨!");
    setShow(true);
    setTimeout(() => setShow(false), 1500);
  }, []);

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      {children}
      {show && <SaveCelebrationOverlay message={message} />}
    </CelebrationContext.Provider>
  );
}

function SaveCelebrationOverlay({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
      <div className="relative">
        {/* Expanding warm burst */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-32 h-32 rounded-full opacity-0"
            style={{
              background: "radial-gradient(circle, rgba(251,113,133,0.3) 0%, rgba(251,191,36,0.2) 50%, transparent 70%)",
              animation: "celebrateBurst 1.5s ease-out forwards",
            }}
          />
        </div>
        {/* Message */}
        <div
          className="relative bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-rose-200/50"
          style={{
            animation: "celebrateMessage 1.5s ease-out forwards",
          }}
        >
          <p className="text-base font-medium text-rose-600 text-center whitespace-nowrap">
            {message}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes celebrateBurst {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          60% {
            transform: scale(4);
            opacity: 0.3;
          }
          100% {
            transform: scale(6);
            opacity: 0;
          }
        }
        @keyframes celebrateMessage {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          20% {
            transform: scale(1.05);
            opacity: 1;
          }
          30% {
            transform: scale(1);
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
