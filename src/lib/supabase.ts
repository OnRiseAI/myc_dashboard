// lib/supabase.ts
// Supabase client utilities for MeetYourClinic dashboard
// ─────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ── Browser client (singleton) ──
// Used in React components, hooks, client-side data fetching
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowser() {
  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return browserClient;
}

// ── Server client (for API routes / server components) ──
// Creates a fresh client each time (no singleton) with optional auth header
export function getSupabaseServer(accessToken?: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
    global: accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined,
  });
}

// ── Edge Function caller ──
export async function callEdgeFunction<T = any>(
  functionName: string,
  body?: Record<string, any>,
  accessToken?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
    method: body ? "POST" : "GET",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || `Edge function error: ${res.status}`);
  }

  return res.json();
}

// ── Constants ──
export { SUPABASE_URL, SUPABASE_ANON_KEY };
