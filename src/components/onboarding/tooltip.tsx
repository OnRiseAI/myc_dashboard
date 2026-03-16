"use client";

import { useState, useEffect, useRef } from "react";
import { useOnboarding } from "@/hooks/use-onboarding";

interface OnboardingTooltipProps {
  pageId: string;
  message: string;
  position?: "top" | "bottom";
  children: React.ReactNode;
}

export function OnboardingTooltip({
  pageId,
  message,
  position = "bottom",
  children,
}: OnboardingTooltipProps) {
  const { shouldShowTooltip, dismissTooltip } = useOnboarding();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoHideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!shouldShowTooltip(pageId)) return;

    // Delay appearance by 800ms so the page settles first
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, 800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pageId, shouldShowTooltip]);

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (!visible) return;
    autoHideRef.current = setTimeout(() => {
      handleDismiss();
    }, 10000);
    return () => {
      if (autoHideRef.current) clearTimeout(autoHideRef.current);
    };
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    dismissTooltip(pageId);
    if (autoHideRef.current) clearTimeout(autoHideRef.current);
  };

  if (!visible) return <>{children}</>;

  const isTop = position === "top";

  return (
    <div className="relative inline-block">
      {children}
      <div
        className={`absolute z-50 ${
          isTop ? "bottom-full mb-2" : "top-full mt-2"
        } left-0`}
        style={{ animation: `tooltipEnter 0.25s ease-out` }}
      >
        <div
          className="rounded-lg px-4 py-3 max-w-[280px] shadow-xl"
          style={{
            background: "#132139",
            border: "1px solid rgba(20,184,166,0.15)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          }}
        >
          {/* Arrow */}
          <div
            className={`absolute left-6 w-2.5 h-2.5 rotate-45 ${
              isTop ? "bottom-[-5px]" : "top-[-5px]"
            }`}
            style={{
              background: "#132139",
              borderRight: isTop ? "none" : "1px solid rgba(20,184,166,0.15)",
              borderBottom: isTop ? "none" : "1px solid rgba(20,184,166,0.15)",
              borderLeft: isTop ? "1px solid rgba(20,184,166,0.15)" : "none",
              borderTop: isTop ? "1px solid rgba(20,184,166,0.15)" : "none",
            }}
          />
          <p className="text-[13px] text-white/70 leading-relaxed mb-2">{message}</p>
          <button
            onClick={handleDismiss}
            className="text-[12px] text-teal-400 hover:text-teal-300 font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>

      <style>{`
        @keyframes tooltipEnter {
          from { opacity: 0; transform: translateY(${isTop ? "4px" : "-4px"}); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
