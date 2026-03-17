"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export default function AuthPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthPageContent />
    </Suspense>
  );
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const nextPath = useMemo(() => {
    const next = searchParams.get("next");
    if (!next || !next.startsWith("/")) return "/dashboard";
    return next;
  }, [searchParams]);

  const appBaseUrl = useMemo(() => {
    const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (configured && /^https?:\/\//.test(configured)) {
      return configured.replace(/\/+$/, "");
    }
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "";
  }, []);

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace(nextPath);
    }
  }, [loading, nextPath, router, user]);

  useEffect(() => {
    const urlError = searchParams.get("error");
    const urlSuccess = searchParams.get("success");

    if (urlError) {
      setToast({ type: "error", message: urlError });
      return;
    }

    if (urlSuccess === "signed_out") {
      setToast({ type: "success", message: "Signed out successfully." });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const signInWithGoogle = useCallback(async () => {
    setSubmitting(true);
    setToast(null);

    try {
      if (!appBaseUrl) {
        throw new Error("Unable to determine app URL for authentication redirect.");
      }

      const supabase = getSupabaseBrowser();
      const redirectTo = `${appBaseUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`;

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to start Google sign-in.";
      setToast({ type: "error", message });
      setSubmitting(false);
    }
  }, [appBaseUrl, nextPath]);

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white tracking-tight">Welcome to MeetYourClinic</h1>
          <p className="text-white/50 text-sm mt-2">
            Sign up or log in with Google to access your clinic dashboard.
          </p>
        </div>

        {toast && (
          <div
            className={`mb-4 rounded-lg px-3 py-2 text-xs ${
              toast.type === "success" ? "text-emerald-200" : "text-red-200"
            }`}
            style={{
              background:
                toast.type === "success"
                  ? "rgba(16,185,129,0.12)"
                  : "rgba(239,68,68,0.12)",
              border:
                toast.type === "success"
                  ? "1px solid rgba(16,185,129,0.24)"
                  : "1px solid rgba(239,68,68,0.2)",
            }}
          >
            {toast.message}
          </div>
        )}

        <button
          onClick={signInWithGoogle}
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
          style={{
            background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
            border: "1px solid rgba(20,184,166,0.4)",
          }}
        >
          <GoogleIcon />
          {submitting ? "Redirecting to Google..." : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" />
    </svg>
  );
}
