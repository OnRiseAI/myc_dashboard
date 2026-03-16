"use client";

import Link from "next/link";
import type { Nudge } from "@/hooks/use-onboarding";

// ═══════════════════════════════════════
//  Icons
// ═══════════════════════════════════════

function NudgeIcon({ name, className }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    building: <><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" /></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></>,
    stethoscope: <><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" /></>,
    image: <><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></>,
    tag: <><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></>,
    mail: <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || paths.building}
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

// ═══════════════════════════════════════
//  Main Component
// ═══════════════════════════════════════

interface ProgressNudgesProps {
  nudges: Nudge[];
  onDismiss: (nudgeId: string) => void;
}

export function ProgressNudges({ nudges, onDismiss }: ProgressNudgesProps) {
  if (nudges.length === 0) return null;

  return (
    <div className="space-y-3 mb-6" style={{ animation: "nudgeFadeIn 0.4s ease-out" }}>
      {nudges.map((nudge) => (
        <div
          key={nudge.id}
          className="relative rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all"
          style={{
            background: "rgba(20,184,166,0.04)",
            border: "1px solid rgba(20,184,166,0.12)",
          }}
        >
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
            <NudgeIcon name={nudge.icon} className="w-5 h-5 text-teal-400/70" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-8 sm:pr-0">
            <p className="text-[14px] font-medium text-white/80">{nudge.title}</p>
            <p className="text-[13px] text-white/40 mt-0.5 leading-relaxed">{nudge.description}</p>
          </div>

          {/* Action */}
          <Link
            href={nudge.href}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-[13px] font-medium text-teal-300 hover:text-teal-200 transition-colors whitespace-nowrap flex-shrink-0"
            style={{
              background: "rgba(20,184,166,0.08)",
              border: "1px solid rgba(20,184,166,0.15)",
            }}
          >
            {nudge.action}
          </Link>

          {/* Dismiss */}
          <button
            onClick={() => onDismiss(nudge.id)}
            className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/[0.05] transition-colors"
            aria-label="Dismiss"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      <style>{`
        @keyframes nudgeFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
