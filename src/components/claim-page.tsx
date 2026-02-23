"use client";
import { useState, useEffect, useCallback } from "react";


// --- Reusable UI Components ---

function ShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckCircleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function MailIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function BuildingIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
    </svg>
  );
}

function MapPinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function GlobeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// --- Animated Background ---
function MedicalGridBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep medical teal base */}
      <div className="absolute inset-0 bg-[#0a1628]" />
      
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(56,189,176,0.08) 0%, transparent 70%)",
        }}
      />
      
      {/* Secondary glow */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(56,189,176,0.04) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

// --- Flow States ---
const FLOW = {
  LOADING: "loading",
  READY: "ready",
  SUBMITTING: "submitting",
  LINK_SENT: "link_sent",
  ALREADY_CLAIMED: "already_claimed",
  ERROR: "error",
};

// --- Main Component ---
export default function ClaimClinicPage() {
  // In production, clinic_id comes from URL params: /claim/[clinic-id]
  // For this demo, we'll simulate it
  const [clinicId] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("clinic_id") || "demo-clinic-id";
    }
    return "demo-clinic-id";
  });

  const [flow, setFlow] = useState(FLOW.LOADING);
  const [email, setEmail] = useState("");
  const [clinicData, setClinicData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [claimId, setClaimId] = useState(null);

  // Fetch clinic claim status on mount
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/claim-status?clinic_id=${clinicId}`,
          {
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            },
          }
        );
        const data = await res.json();

        if (data.status === "CLAIM_ALREADY_CLAIMED" && !data.is_owner) {
          setClinicData(data);
          setFlow(FLOW.ALREADY_CLAIMED);
        } else if (data.status === "CLAIM_COMPLETED" && data.is_owner) {
          // Already owner — redirect to dashboard
          window.location.href = "/dashboard";
        } else if (data.status === "available") {
          setClinicData(data);
          setFlow(FLOW.READY);
        } else {
          setClinicData(data);
          setFlow(FLOW.READY);
        }
      } catch {
        // If API fails, still show the form (graceful degradation)
        setClinicData({
          clinic_name: "Your Clinic",
          domain_hint: null,
          has_website: false,
        });
        setFlow(FLOW.READY);
      }
    }
    fetchStatus();
  }, [clinicId]);

  // Handle claim submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!email.trim()) return;

      setFlow(FLOW.SUBMITTING);
      setErrorMessage("");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/initiate-claim`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            },
            body: JSON.stringify({
              clinic_id: clinicId,
              email: email.trim(),
            }),
          }
        );

        const data = await res.json();

        if (data.status === "CLAIM_INITIATED") {
          setClaimId(data.claim_id);
          setFlow(FLOW.LINK_SENT);
        } else if (data.status === "CLAIM_ALREADY_CLAIMED") {
          setFlow(FLOW.ALREADY_CLAIMED);
        } else {
          setErrorMessage(data.message || "Something went wrong. Please try again.");
          setFlow(FLOW.ERROR);
        }
      } catch {
        setErrorMessage("Unable to connect. Please check your connection and try again.");
        setFlow(FLOW.ERROR);
      }
    },
    [email, clinicId]
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      <MedicalGridBg />

      {/* Logo / Brand */}
      <div className="mb-10 text-center animate-[fadeDown_0.6s_ease-out]">
        <a href="https://meetyourclinic.com" className="inline-flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/30 transition-shadow">
            <span className="text-white font-bold text-sm tracking-tight">M</span>
          </div>
          <span className="text-white/90 font-semibold text-lg tracking-tight">
            MeetYourClinic
          </span>
        </a>
      </div>

      {/* Main Card */}
      <div
        className="w-full max-w-[440px] animate-[fadeUp_0.7s_ease-out]"
        style={{
          animationFillMode: "backwards",
          animationDelay: "0.1s",
        }}
      >
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset",
          }}
        >
          {/* Teal accent line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />

          <div className="p-8 sm:p-10">
            {/* Loading State */}
            {flow === FLOW.LOADING && (
              <div className="flex flex-col items-center py-12 gap-4">
                <Spinner />
                <p className="text-white/40 text-sm">Loading clinic details…</p>
              </div>
            )}

            {/* Ready State — Email Form */}
            {(flow === FLOW.READY || flow === FLOW.ERROR) && (
              <>
                {/* Clinic Info Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-5">
                    <ShieldIcon className="w-7 h-7 text-teal-400" />
                  </div>
                  <h1 className="text-[22px] font-semibold text-white tracking-tight mb-2">
                    Claim Your Clinic
                  </h1>
                  <p className="text-white/50 text-[15px] leading-relaxed">
                    Verify ownership and access your dashboard
                  </p>
                </div>

                {/* Clinic Details Card */}
                {clinicData && (
                  <div
                    className="rounded-xl p-4 mb-6"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BuildingIcon className="w-5 h-5 text-teal-400/70" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/90 font-medium text-[15px] truncate">
                          {clinicData.clinic_name}
                        </p>
                        {clinicData.domain_hint && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <GlobeIcon className="w-3.5 h-3.5 text-white/30" />
                            <p className="text-white/40 text-[13px]">{clinicData.domain_hint}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Form */}
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[13px] font-medium text-white/50 mb-2"
                      >
                        Clinic email address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <MailIcon className="w-[18px] h-[18px] text-white/25" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={
                            clinicData?.domain_hint
                              ? `you@${clinicData.domain_hint}`
                              : "you@yourclinic.com"
                          }
                          className="w-full pl-11 pr-4 py-3 rounded-xl text-[15px] text-white placeholder-white/25 outline-none transition-all duration-200 focus:ring-2 focus:ring-teal-500/30"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                          autoComplete="email"
                          autoFocus
                        />
                      </div>
                      {clinicData?.domain_hint && (
                        <p className="mt-2 text-[12px] text-white/30 flex items-center gap-1.5">
                          <ShieldIcon className="w-3 h-3" />
                          Use your @{clinicData.domain_hint} email for instant verification
                        </p>
                      )}
                    </div>

                    {/* Error Message */}
                    {flow === FLOW.ERROR && errorMessage && (
                      <div
                        className="rounded-lg px-4 py-3 text-[13px] text-red-300"
                        style={{
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.15)",
                        }}
                      >
                        {errorMessage}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={flow === FLOW.SUBMITTING || !email.trim()}
                      className="w-full py-3.5 rounded-xl text-[15px] font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98]"
                      style={{
                        background:
                          flow === FLOW.SUBMITTING
                            ? "rgba(20,184,166,0.3)"
                            : "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                        border: "1px solid rgba(20,184,166,0.3)",
                      }}
                    >
                      {flow === FLOW.SUBMITTING ? (
                        <>
                          <Spinner />
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <ShieldIcon className="w-[18px] h-[18px]" />
                          <span>Send Secure Access Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Trust Signals */}
                <div className="mt-6 pt-6 border-t border-white/[0.06]">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: "No password", icon: ShieldIcon },
                      { label: "One-click access", icon: CheckCircleIcon },
                      { label: "Secure & verified", icon: ShieldIcon },
                    ].map(({ label, icon: Icon }, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 py-2">
                        <Icon className="w-4 h-4 text-teal-400/40" />
                        <span className="text-[11px] text-white/30 leading-tight">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Link Sent State */}
            {flow === FLOW.LINK_SENT && (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6 animate-[scaleIn_0.4s_ease-out]">
                  <MailIcon className="w-8 h-8 text-teal-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Check Your Email</h2>
                <p className="text-white/50 text-[15px] leading-relaxed mb-6">
                  We've sent a secure access link to
                </p>
                <div
                  className="inline-block rounded-lg px-4 py-2 mb-6"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span className="text-teal-300 font-medium text-[15px]">{email}</span>
                </div>
                <p className="text-white/35 text-[13px] leading-relaxed max-w-xs mx-auto mb-6">
                  Click the link in the email to verify your ownership and access your clinic dashboard instantly.
                </p>

                {/* Steps indicator */}
                <div
                  className="rounded-xl p-4 text-left"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {[
                    { step: "1", text: "Open the email from MeetYourClinic", done: true },
                    { step: "2", text: "Click the secure access link", done: false },
                    { step: "3", text: "You'll land directly in your dashboard", done: false },
                  ].map(({ step, text, done }, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 ${i > 0 ? "mt-3 pt-3 border-t border-white/[0.04]" : ""}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-semibold ${
                          done
                            ? "bg-teal-500/20 text-teal-400"
                            : "bg-white/[0.04] text-white/30"
                        }`}
                      >
                        {done ? (
                          <CheckCircleIcon className="w-4 h-4" />
                        ) : (
                          step
                        )}
                      </div>
                      <span className={`text-[13px] ${done ? "text-white/60" : "text-white/35"}`}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Resend / different email */}
                <div className="mt-6 flex items-center justify-center gap-1 text-[13px]">
                  <span className="text-white/30">Didn't receive it?</span>
                  <button
                    onClick={() => {
                      setFlow(FLOW.READY);
                      setEmail("");
                    }}
                    className="text-teal-400/70 hover:text-teal-400 transition-colors underline underline-offset-2"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Already Claimed State */}
            {flow === FLOW.ALREADY_CLAIMED && (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                  <ShieldIcon className="w-8 h-8 text-amber-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Already Claimed</h2>
                <p className="text-white/50 text-[15px] leading-relaxed mb-6">
                  Ownership of{" "}
                  <span className="text-white/70 font-medium">
                    {clinicData?.clinic_name || "this clinic"}
                  </span>{" "}
                  has already been verified.
                </p>
                <div
                  className="rounded-xl p-4 mb-6 text-left"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <p className="text-[13px] text-white/40 leading-relaxed">
                    If you believe this is incorrect, please contact our support team and we'll investigate. Ownership disputes are handled manually to ensure security.
                  </p>
                </div>
                <a
                  href="mailto:support@meetyourclinic.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14px] font-medium text-teal-300 hover:text-teal-200 transition-colors"
                  style={{
                    background: "rgba(20,184,166,0.08)",
                    border: "1px solid rgba(20,184,166,0.15)",
                  }}
                >
                  Contact Support
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/20 text-[12px]">
            Protected by end-to-end encryption · No passwords stored
          </p>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }
        input:focus {
          background: rgba(255, 255, 255, 0.07) !important;
          border-color: rgba(20, 184, 166, 0.3) !important;
        }
      `}</style>
    </div>
  );
}
