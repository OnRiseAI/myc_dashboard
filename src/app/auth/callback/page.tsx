"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    async function completeOAuth() {
      const next = searchParams.get("next");
      const safeNext = next && next.startsWith("/") ? next : "/dashboard";
      const errorDescription = searchParams.get("error_description");
      const error = searchParams.get("error");

      if (error || errorDescription) {
        const message = encodeURIComponent(errorDescription || error || "Google authentication failed.");
        router.replace(`/auth?error=${message}`);
        return;
      }

      try {
        const supabase = getSupabaseBrowser();

        // Handles PKCE/implicit callback and persists session in Supabase client.
        const code = searchParams.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            throw exchangeError;
          }
        } else {
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            throw new Error("Authentication session was not created. Please try again.");
          }
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Google authentication failed. Please try again.";
        if (!cancelled) {
          router.replace(`/auth?error=${encodeURIComponent(message)}`);
        }
        return;
      }

      if (!cancelled) {
        router.replace(safeNext);
      }
    }

    completeOAuth();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full" />
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
