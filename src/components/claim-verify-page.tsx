"use client";
import { useState, useEffect, useRef } from "react";


// ── Icons ──

function ShieldCheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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

function AlertIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function Spinner({ size = "md" }) {
  const s = size === "lg" ? "h-8 w-8" : "h-5 w-5";
  return (
    <svg className={`animate-spin ${s}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ── Background ──

function MedicalGridBg() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a1628]" />
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
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(56,189,176,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

// ── Verification Steps ──

function VerificationStep({ label, status, index }) {
  // status: "done" | "active" | "pending"
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
          status === "done"
            ? "bg-teal-500/20 border border-teal-500/30"
            : status === "active"
            ? "bg-teal-500/10 border border-teal-500/20 animate-pulse"
            : "bg-white/[0.03] border border-white/[0.06]"
        }`}
      >
        {status === "done" ? (
          <CheckIcon className="w-3.5 h-3.5 text-teal-400" />
        ) : status === "active" ? (
          <Spinner />
        ) : (
          <span className="text-[11px] font-semibold text-white/20">{index + 1}</span>
        )}
      </div>
      <span
        className={`text-[14px] transition-colors duration-300 ${
          status === "done"
            ? "text-white/70"
            : status === "active"
            ? "text-white/60"
            : "text-white/25"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// ── Flow States ──
const STATE = {
  INITIALIZING: "initializing",
  EXCHANGING_TOKEN: "exchanging_token",
  COMPLETING_CLAIM: "completing_claim",
  SUCCESS: "success",
  PENDING_REVIEW: "pending_review",
  ALREADY_CLAIMED: "already_claimed",
  ERROR: "error",
};

// ── Main Component ──

export default function ClaimVerifyPage() {
  const [state, setState] = useState(STATE.INITIALIZING);
  const [errorMessage, setErrorMessage] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(4);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    runVerification();
  }, []);

  // Countdown timer for success redirect
  useEffect(() => {
    if (state !== STATE.SUCCESS) return;
    if (redirectCountdown <= 0) {
      window.location.href = "/dashboard";
      return;
    }
    const timer = setTimeout(() => setRedirectCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [state, redirectCountdown]);

  async function runVerification() {
    try {
      // ── Step 1: Parse URL parameters ──
      setState(STATE.INITIALIZING);

      const url = new URL(window.location.href);
      const params = url.searchParams;

      // Supabase magic link includes access_token in the hash fragment
      // or as query params after PKCE exchange
      let accessToken = params.get("access_token");
      let refreshToken = params.get("refresh_token");
      const claimId = params.get("claim_id");
      const clinicId = params.get("clinic_id");

      // Check hash fragment (implicit flow)
      if (!accessToken && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        accessToken = hashParams.get("access_token");
        refreshToken = hashParams.get("refresh_token");
      }

      // If we have a token_hash, we need to exchange it (PKCE flow)
      if (!accessToken) {
        const tokenHash = params.get("token_hash");
        const type = params.get("type") || "email";

        if (tokenHash) {
          setState(STATE.EXCHANGING_TOKEN);

          const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            },
            body: JSON.stringify({
              token_hash: tokenHash,
              type: type,
            }),
          });

          if (!verifyRes.ok) {
            throw new Error("Email verification link has expired. Please request a new one.");
          }

          const verifyData = await verifyRes.json();
          accessToken = verifyData.access_token;
          refreshToken = verifyData.refresh_token;
        }
      }

      if (!accessToken) {
        throw new Error("Authentication session not found. Please request a new secure access link.");
      }

      if (!claimId) {
        throw new Error("Claim reference not found. Please restart the claim process.");
      }

      // ── Step 2: Complete the claim ──
      setState(STATE.COMPLETING_CLAIM);

      // Fetch clinic name for the UI
      if (clinicId) {
        try {
          const statusRes = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/claim-status?clinic_id=${clinicId}`,
            {
              headers: {
                "Content-Type": "application/json",
                apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const statusData = await statusRes.json();
          if (statusData.clinic_name) setClinicName(statusData.clinic_name);

          // If already owner, skip to dashboard
          if (statusData.is_owner) {
            setState(STATE.SUCCESS);
            return;
          }
        } catch {
          // Non-critical, continue
        }
      }

      const completeRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/complete-claim`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ claim_id: claimId }),
        }
      );

      const result = await completeRes.json();

      // ── Step 3: Handle result ──
      switch (result.status) {
        case "CLAIM_COMPLETED":
          setState(STATE.SUCCESS);
          break;
        case "CLAIM_REQUIRES_REVIEW":
          setState(STATE.PENDING_REVIEW);
          break;
        case "CLAIM_ALREADY_CLAIMED":
          setState(STATE.ALREADY_CLAIMED);
          break;
        default:
          throw new Error(result.message || "Unable to complete verification. Please try again.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setErrorMessage(
        err.message || "An unexpected error occurred. Please try again."
      );
      setState(STATE.ERROR);
    }
  }

  // ── Step status helpers ──
  function getStepStatus(stepState) {
    const order = [STATE.INITIALIZING, STATE.EXCHANGING_TOKEN, STATE.COMPLETING_CLAIM, STATE.SUCCESS];
    const currentIdx = order.indexOf(state);
    const stepIdx = order.indexOf(stepState);

    if (state === STATE.ERROR || state === STATE.PENDING_REVIEW || state === STATE.ALREADY_CLAIMED) {
      // Show all steps up to where we failed as done
      if (stepIdx < currentIdx || stepIdx < order.indexOf(STATE.COMPLETING_CLAIM)) {
        if (state !== STATE.INITIALIZING && stepIdx === 0) return "done";
        if (state === STATE.COMPLETING_CLAIM && stepIdx <= 1) return "done";
      }
      return stepIdx === currentIdx ? "active" : "pending";
    }

    if (stepIdx < currentIdx) return "done";
    if (stepIdx === currentIdx) return "active";
    return "pending";
  }

  const isProcessing = [STATE.INITIALIZING, STATE.EXCHANGING_TOKEN, STATE.COMPLETING_CLAIM].includes(state);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      <MedicalGridBg />

      {/* Logo */}
      <div className="mb-10 text-center animate-[fadeDown_0.6s_ease-out]">
        <a href="https://meetyourclinic.com" className="inline-flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
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
        style={{ animationFillMode: "backwards", animationDelay: "0.1s" }}
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
          {/* Accent line */}
          <div
            className={`h-[2px] transition-all duration-1000 ${
              state === STATE.SUCCESS
                ? "bg-gradient-to-r from-transparent via-teal-400 to-transparent"
                : state === STATE.ERROR
                ? "bg-gradient-to-r from-transparent via-red-400/60 to-transparent"
                : state === STATE.PENDING_REVIEW
                ? "bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
                : "bg-gradient-to-r from-transparent via-teal-400/40 to-transparent"
            }`}
          />

          <div className="p-8 sm:p-10">

            {/* ── Processing States ── */}
            {isProcessing && (
              <div className="animate-[fadeIn_0.3s_ease-out]">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-5">
                    <ShieldCheckIcon className="w-7 h-7 text-teal-400 animate-pulse" />
                  </div>
                  <h1 className="text-[22px] font-semibold text-white tracking-tight mb-2">
                    Verifying Ownership
                  </h1>
                  <p className="text-white/45 text-[15px]">
                    {clinicName ? `Setting up ${clinicName}…` : "Please wait a moment…"}
                  </p>
                </div>

                {/* Step indicators */}
                <div
                  className="rounded-xl p-5 space-y-4"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <VerificationStep
                    label="Authenticating session"
                    status={
                      state === STATE.INITIALIZING
                        ? "active"
                        : "done"
                    }
                    index={0}
                  />
                  <VerificationStep
                    label="Verifying email ownership"
                    status={
                      state === STATE.EXCHANGING_TOKEN
                        ? "active"
                        : state === STATE.INITIALIZING
                        ? "pending"
                        : "done"
                    }
                    index={1}
                  />
                  <VerificationStep
                    label="Assigning clinic ownership"
                    status={
                      state === STATE.COMPLETING_CLAIM
                        ? "active"
                        : [STATE.INITIALIZING, STATE.EXCHANGING_TOKEN].includes(state)
                        ? "pending"
                        : "done"
                    }
                    index={2}
                  />
                </div>
              </div>
            )}

            {/* ── Success State ── */}
            {state === STATE.SUCCESS && (
              <div className="text-center animate-[scaleIn_0.5s_ease-out]">
                {/* Animated success ring */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="absolute w-20 h-20 rounded-full border-2 border-teal-400/20 animate-ping" style={{ animationDuration: "2s" }} />
                  <div className="w-16 h-16 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
                    <CheckIcon className="w-8 h-8 text-teal-400" />
                  </div>
                </div>

                <h2 className="text-[22px] font-semibold text-white mb-2">
                  Clinic Claimed Successfully
                </h2>
                <p className="text-white/50 text-[15px] leading-relaxed mb-2">
                  {clinicName ? (
                    <>You now own <span className="text-white/70 font-medium">{clinicName}</span></>
                  ) : (
                    "Your clinic has been verified and assigned to your account."
                  )}
                </p>
                <p className="text-white/30 text-[13px] mb-8">
                  Redirecting to your dashboard in {redirectCountdown}s…
                </p>

                {/* What's next */}
                <div
                  className="rounded-xl p-4 mb-6 text-left space-y-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {[
                    "Update your clinic profile and photos",
                    "Manage patient enquiries",
                    "Track your listing performance",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400/50 flex-shrink-0" />
                      <span className="text-[13px] text-white/40">{item}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                    border: "1px solid rgba(20,184,166,0.3)",
                  }}
                >
                  Go to Dashboard
                  <ArrowRightIcon className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* ── Pending Review State ── */}
            {state === STATE.PENDING_REVIEW && (
              <div className="text-center animate-[fadeIn_0.4s_ease-out]">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                  <ClockIcon className="w-8 h-8 text-amber-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Verification Under Review
                </h2>
                <p className="text-white/50 text-[15px] leading-relaxed mb-6">
                  {clinicName ? (
                    <>Your claim for <span className="text-white/70 font-medium">{clinicName}</span> requires manual verification.</>
                  ) : (
                    "Your claim requires additional verification."
                  )}
                </p>

                <div
                  className="rounded-xl p-5 mb-6 text-left"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <h3 className="text-[13px] font-medium text-white/60 mb-3">What happens next</h3>
                  <div className="space-y-3">
                    {[
                      "Our team will verify your ownership within 24–48 hours",
                      "You'll receive an email once your claim is approved",
                      "Dashboard access is granted immediately upon approval",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[10px] font-semibold text-amber-400/70">{i + 1}</span>
                        </div>
                        <span className="text-[13px] text-white/40 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <a
                    href="https://meetyourclinic.com"
                    className="px-5 py-2.5 rounded-lg text-[14px] font-medium text-white/60 hover:text-white/80 transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    Back to Directory
                  </a>
                  <a
                    href="mailto:support@meetyourclinic.com"
                    className="px-5 py-2.5 rounded-lg text-[14px] font-medium text-teal-300 hover:text-teal-200 transition-colors"
                    style={{
                      background: "rgba(20,184,166,0.08)",
                      border: "1px solid rgba(20,184,166,0.15)",
                    }}
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            )}

            {/* ── Already Claimed State ── */}
            {state === STATE.ALREADY_CLAIMED && (
              <div className="text-center animate-[fadeIn_0.4s_ease-out]">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                  <ShieldCheckIcon className="w-8 h-8 text-amber-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Already Claimed
                </h2>
                <p className="text-white/50 text-[15px] leading-relaxed mb-6">
                  Ownership already verified. Contact support if this is incorrect.
                </p>
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

            {/* ── Error State ── */}
            {state === STATE.ERROR && (
              <div className="text-center animate-[fadeIn_0.4s_ease-out]">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                  <AlertIcon className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Verification Issue
                </h2>
                <p className="text-white/50 text-[15px] leading-relaxed mb-6">
                  {errorMessage}
                </p>

                <div className="flex items-center justify-center gap-3">
                  <a
                    href="https://meetyourclinic.com"
                    className="px-5 py-2.5 rounded-lg text-[14px] font-medium text-white/60 hover:text-white/80 transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    Back to Directory
                  </a>
                  <button
                    onClick={() => {
                      hasRun.current = false;
                      setState(STATE.INITIALIZING);
                      setErrorMessage("");
                      runVerification();
                    }}
                    className="px-5 py-2.5 rounded-lg text-[14px] font-medium text-teal-300 hover:text-teal-200 transition-colors"
                    style={{
                      background: "rgba(20,184,166,0.08)",
                      border: "1px solid rgba(20,184,166,0.15)",
                    }}
                  >
                    Try Again
                  </button>
                </div>
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

      {/* Animations */}
      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
