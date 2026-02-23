// lib/auth.tsx
// Auth context, session management, and route protection
// ─────────────────────────────────────────────────────

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { getSupabaseBrowser } from "./supabase";
import type { User, Session } from "@supabase/supabase-js";

// ── Types ──

interface UserProfile {
  id: string;
  email: string;
  role: "patient" | "clinic" | "admin";
  clinic_id?: string; // the clinic they own (if role=clinic)
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isClinicOwner: boolean;
  clinicId: string | null;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signOut: async () => {},
  isAdmin: false,
  isClinicOwner: false,
  clinicId: null,
});

// ── Provider ──

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<ReturnType<typeof getSupabaseBrowser> | null>(null);

  // Initialize Supabase client only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        setSupabase(getSupabaseBrowser());
      } catch (error) {
        console.error("Failed to initialize Supabase:", error);
        setLoading(false);
      }
    }
  }, []);

  // Fetch user profile from public.users + clinic ownership
  const fetchProfile = useCallback(
    async (client: ReturnType<typeof getSupabaseBrowser>, userId: string, email: string) => {
      try {
        // Get user role
        const { data: userRow } = await client
          .from("users")
          .select("id, email, role")
          .eq("id", userId)
          .single();

        // Get clinic they own (if any)
        const { data: ownedClinic } = await client
          .from("clinics")
          .select("id")
          .eq("owner_id", userId)
          .limit(1)
          .single();

        setProfile({
          id: userId,
          email: userRow?.email || email,
          role: userRow?.role || "patient",
          clinic_id: ownedClinic?.id || undefined,
        });
      } catch {
        // No profile yet — new user
        setProfile({
          id: userId,
          email,
          role: "patient",
          clinic_id: undefined,
        });
      }
    },
    []
  );

  useEffect(() => {
    if (!supabase) return;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(supabase, s.user.id, s.user.email || "");
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(supabase, s.user.id, s.user.email || "");
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    window.location.href = "/";
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signOut,
        isAdmin: profile?.role === "admin",
        isClinicOwner: profile?.role === "clinic" && !!profile.clinic_id,
        clinicId: profile?.clinic_id || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hooks ──

export function useAuth() {
  return useContext(AuthContext);
}

// ── Route guards (use in layout.tsx or page.tsx) ──

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full" />
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }

  return <>{children}</>;
}

export function RequireClinicOwner({ children }: { children: ReactNode }) {
  const { isClinicOwner, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full" />
      </div>
    );
  }

  if (!isClinicOwner) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }

  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full" />
      </div>
    );
  }

  if (!isAdmin) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }

  return <>{children}</>;
}
