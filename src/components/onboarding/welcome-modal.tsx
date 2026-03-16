"use client";

import { useRouter } from "next/navigation";

// ═══════════════════════════════════════
//  Icons
// ═══════════════════════════════════════

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

// ═══════════════════════════════════════
//  Pre-fill summary item
// ═══════════════════════════════════════

function SummaryItem({ label, value, present }: { label: string; value: string; present: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
          present
            ? "bg-teal-500/20 border border-teal-500/30"
            : "bg-white/[0.04] border border-white/[0.08]"
        }`}
      >
        {present ? (
          <CheckIcon className="w-3 h-3 text-teal-400" />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[13px] text-white/40">{label}</span>
      </div>
      <span className={`text-[13px] font-medium truncate max-w-[180px] ${present ? "text-white/70" : "text-white/20"}`}>
        {present ? value : "Not yet added"}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════
//  Next step item
// ═══════════════════════════════════════

function StepItem({ number, text, onClick }: { number: number; text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 px-3 rounded-lg transition-colors hover:bg-white/[0.03] text-left group"
    >
      <div className="w-6 h-6 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
        <span className="text-[11px] font-semibold text-teal-400">{number}</span>
      </div>
      <span className="text-[14px] text-white/60 flex-1 group-hover:text-white/80 transition-colors">{text}</span>
      <ArrowRightIcon className="w-4 h-4 text-white/15 group-hover:text-teal-400/60 transition-colors" />
    </button>
  );
}

// ═══════════════════════════════════════
//  Main Component
// ═══════════════════════════════════════

interface WelcomeModalProps {
  clinic: any;
  onDismiss: () => void;
}

export function WelcomeModal({ clinic, onDismiss }: WelcomeModalProps) {
  const router = useRouter();

  if (!clinic) return null;

  const doctorCount = clinic.doctor_count || 0;
  const procedureCount = clinic.procedure_count || 0;
  const reviewCount = clinic.enquiry_count || 0; // Approximate from available data

  const goTo = (path: string) => {
    onDismiss();
    router.push(path);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.3s ease-out" }}
        onClick={onDismiss}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="w-full max-w-[520px] pointer-events-auto rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(13,27,48,0.98) 0%, rgba(10,22,40,0.99) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
            animation: "modalEnter 0.4s ease-out",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Accent line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />

          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-5">
                <ShieldCheckIcon className="w-7 h-7 text-teal-400" />
              </div>
              <h1 className="text-[22px] font-semibold text-white tracking-tight mb-2">
                Welcome to your dashboard
              </h1>
              <p className="text-white/45 text-[15px] leading-relaxed">
                <span className="text-white/70 font-medium">{clinic.name}</span> has been claimed successfully.
                {doctorCount > 0 || procedureCount > 0
                  ? " Here\u2019s what we\u2019ve already imported for you."
                  : " Let\u2019s get your profile set up."}
              </p>
            </div>

            {/* Pre-filled data summary */}
            <div
              className="rounded-xl p-5 mb-6"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-[11px] text-white/25 uppercase tracking-wider font-semibold mb-3">
                Imported profile data
              </p>
              <div className="divide-y divide-white/[0.04]">
                <SummaryItem label="Clinic name" value={clinic.name || ""} present={!!clinic.name} />
                <SummaryItem label="Description" value={clinic.description ? `${clinic.description.slice(0, 50)}...` : ""} present={!!clinic.description} />
                <SummaryItem label="Address" value={clinic.address || ""} present={!!clinic.address} />
                <SummaryItem label="Team members" value={`${doctorCount} imported`} present={doctorCount > 0} />
                <SummaryItem label="Procedures" value={`${procedureCount} listed`} present={procedureCount > 0} />
                <SummaryItem label="Contact" value={clinic.phone || clinic.email || ""} present={!!(clinic.phone || clinic.email)} />
              </div>
            </div>

            {/* Recommended next steps */}
            <div className="mb-8">
              <p className="text-[11px] text-white/25 uppercase tracking-wider font-semibold mb-2 px-1">
                Recommended next steps
              </p>
              <StepItem number={1} text="Review and update your clinic profile" onClick={() => goTo("/dashboard/profile")} />
              <StepItem number={2} text="Verify your team members" onClick={() => goTo("/dashboard/doctors")} />
              <StepItem number={3} text="Upload high-quality clinic photos" onClick={() => goTo("/dashboard/photos")} />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onDismiss}
                className="flex-1 py-3.5 rounded-xl text-[15px] font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                  border: "1px solid rgba(20,184,166,0.3)",
                }}
              >
                Explore Your Dashboard
              </button>
              <button
                onClick={() => goTo("/dashboard/profile")}
                className="flex-1 py-3.5 rounded-xl text-[15px] font-medium text-white/60 hover:text-white/80 transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Go to Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalEnter {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
