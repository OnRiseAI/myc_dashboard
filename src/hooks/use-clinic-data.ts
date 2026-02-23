// hooks/use-clinic-data.ts
// Data fetching hooks for all dashboard pages
// ─────────────────────────────────────────────

"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowser, callEdgeFunction } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

// ═══════════════════════════════════════
//  Types
// ═══════════════════════════════════════

export interface Clinic {
  [key: string]: any;
  id: string;
  slug: string;
  name: string;
  description: string | null;
  description_short: string | null;
  address: string | null;
  website_url: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  year_founded: number | null;
  patients_per_year: number | null;
  num_doctors: number | null;
  primary_specialty: string | null;
  specialties: string[];
  languages_spoken: string[];
  accepted_payment_methods: string[];
  offers_accommodation: boolean;
  offers_transfers: boolean;
  offers_translator: boolean;
  meta_title: string | null;
  meta_description: string | null;
  is_verified: boolean;
  is_claimed: boolean;
  owner_id: string | null;
  // Joined data
  city_name?: string;
  country_name?: string;
  procedure_count?: number;
  doctor_count?: number;
  enquiry_count?: number;
  lead_count?: number;
}

export interface Enquiry {
  id: string;
  type: "form" | "chat";
  name: string;
  email: string | null;
  phone: string | null;
  country_of_residence: string | null;
  message: string | null;
  procedure: string | null;
  source_page: string | null;
  status: string;
  created_at: string;
  // Chat-specific fields
  category?: string | null;
  timeframe?: string | null;
}

export interface Claim {
  id: string;
  clinic_id: string;
  user_id: string | null;
  email: string;
  email_domain: string;
  verification_status: string;
  status: string;
  email_domain_match: boolean;
  is_free_email_provider: boolean;
  ip_address: string | null;
  ip_country: string | null;
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  // Joined
  clinic_name?: string;
  clinic_slug?: string;
  clinic_website?: string;
  clinic_city?: string;
  clinic_country?: string;
}

// ═══════════════════════════════════════
//  useClinic — fetch the owner's clinic
// ═══════════════════════════════════════

export function useClinic() {
  const { clinicId, user } = useAuth();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseBrowser();

  const fetchClinic = useCallback(async () => {
    if (!clinicId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Main clinic data
      const { data, error: fetchError } = await supabase
        .from("clinics")
        .select(`
          *,
          cities ( name ),
          countries ( name )
        `)
        .eq("id", clinicId)
        .single();

      if (fetchError) throw fetchError;

      // Aggregate counts in parallel
      const [procCount, docCount, enqCount, leadCount] = await Promise.all([
        supabase.from("clinic_procedures").select("id", { count: "exact", head: true }).eq("clinic_id", clinicId),
        supabase.from("clinic_doctors").select("id", { count: "exact", head: true }).eq("clinic_id", clinicId),
        supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("clinic_id", clinicId),
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("clinic_id", clinicId),
      ]);

      setClinic({
        ...(data as any),
        city_name: data.cities?.name,
        country_name: data.countries?.name,
        procedure_count: procCount.count || 0,
        doctor_count: docCount.count || 0,
        enquiry_count: enqCount.count || 0,
        lead_count: leadCount.count || 0,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clinicId, supabase]);

  useEffect(() => {
    fetchClinic();
  }, [fetchClinic]);

  return { clinic, loading, error, refetch: fetchClinic };
}

// ═══════════════════════════════════════
//  useUpdateClinic — save profile changes
// ═══════════════════════════════════════

export function useUpdateClinic() {
  const { clinicId } = useAuth();
  const [saving, setSaving] = useState(false);
  const supabase = getSupabaseBrowser();

  const updateClinic = useCallback(
    async (updates: Partial<Clinic>) => {
      if (!clinicId) throw new Error("No clinic ID");
      setSaving(true);
      try {
        // Strip joined/computed fields
        const {
          city_name, country_name, procedure_count, doctor_count,
          enquiry_count, lead_count, ...dbUpdates
        } = updates as any;

        const { error } = await supabase
          .from("clinics")
          .update({ ...dbUpdates, updated_at: new Date().toISOString() })
          .eq("id", clinicId);

        if (error) throw error;
      } finally {
        setSaving(false);
      }
    },
    [clinicId, supabase]
  );

  return { updateClinic, saving };
}

// ═══════════════════════════════════════
//  useEnquiries — fetch clinic enquiries
// ═══════════════════════════════════════

export function useEnquiries() {
  const { clinicId } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowser();

  const fetchEnquiries = useCallback(async () => {
    if (!clinicId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch form enquiries
      const { data: formEnquiries } = await supabase
        .from("enquiries")
        .select(`
          id, name, email, phone, country_of_residence,
          message, source_page, status, created_at,
          procedures ( name )
        `)
        .eq("clinic_id", clinicId)
        .order("created_at", { ascending: false })
        .limit(100);

      // Fetch chat leads
      const { data: chatLeads } = await supabase
        .from("leads")
        .select("*")
        .eq("clinic_id", clinicId)
        .order("created_at", { ascending: false })
        .limit(100);

      // Normalize into unified format
      const normalized: Enquiry[] = [
        ...(formEnquiries || []).map((e: any) => ({
          id: e.id,
          type: "form" as const,
          name: e.name,
          email: e.email,
          phone: e.phone,
          country_of_residence: e.country_of_residence,
          message: e.message,
          procedure: e.procedures?.name || null,
          source_page: e.source_page,
          status: e.status || "new",
          created_at: e.created_at,
        })),
        ...(chatLeads || []).map((l: any) => ({
          id: l.id,
          type: "chat" as const,
          name: l.phone_e164 || "Chat Lead",
          email: null,
          phone: l.phone_e164,
          country_of_residence: l.country,
          message: [l.goal_template, l.extra_details].filter(Boolean).join(" — "),
          procedure: l.category_selected,
          source_page: l.page_context_final,
          status: l.status || "new",
          created_at: l.created_at,
          category: l.category_selected,
          timeframe: l.timeframe,
        })),
      ];

      // Sort by date descending
      normalized.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setEnquiries(normalized);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
    } finally {
      setLoading(false);
    }
  }, [clinicId, supabase]);

  const updateStatus = useCallback(
    async (enquiryId: string, type: "form" | "chat", newStatus: string) => {
      const table = type === "form" ? "enquiries" : "leads";
      await supabase
        .from(table)
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", enquiryId);

      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
    },
    [supabase]
  );

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // Subscribe to realtime for new enquiries
  useEffect(() => {
    if (!clinicId) return;

    const channel = supabase
      .channel("enquiries-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "enquiries", filter: `clinic_id=eq.${clinicId}` },
        () => fetchEnquiries()
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads", filter: `clinic_id=eq.${clinicId}` },
        () => fetchEnquiries()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clinicId, supabase, fetchEnquiries]);

  return { enquiries, loading, updateStatus, refetch: fetchEnquiries };
}

// ═══════════════════════════════════════
//  useClaims — admin: fetch all claims
// ═══════════════════════════════════════

export function useClaims() {
  const { isAdmin, session } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowser();

  const fetchClaims = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("claims")
        .select(`
          *,
          clinics (
            id, name, slug, website_url, is_claimed, owner_id,
            cities ( name ),
            countries ( name )
          )
        `)
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;

      const mapped: Claim[] = (data || []).map((c: any) => ({
        ...c,
        clinic_name: c.clinics?.name,
        clinic_slug: c.clinics?.slug,
        clinic_website: c.clinics?.website_url,
        clinic_city: c.clinics?.cities?.name,
        clinic_country: c.clinics?.countries?.name,
      }));

      setClaims(mapped);
    } catch (err) {
      console.error("Error fetching claims:", err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, supabase]);

  const reviewClaim = useCallback(
    async (claimId: string, action: "approve" | "reject", reviewNotes?: string) => {
      if (!session?.access_token) throw new Error("Not authenticated");

      const result = await callEdgeFunction(
        "admin-review-claim",
        { claim_id: claimId, action, review_notes: reviewNotes },
        session.access_token
      );

      // Optimistic update
      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? {
                ...c,
                status: action === "approve" ? "completed" : "rejected",
                verification_status: action === "approve" ? "domain_verified" : "rejected",
                review_notes: reviewNotes || `${action}d by admin`,
                reviewed_at: new Date().toISOString(),
              }
            : c
        )
      );

      return result;
    },
    [session]
  );

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return { claims, loading, reviewClaim, refetch: fetchClaims };
}

// ═══════════════════════════════════════
//  useClaimFlow — public: initiate claim
// ═══════════════════════════════════════

export function useClaimFlow() {
  const [loading, setLoading] = useState(false);

  const checkStatus = useCallback(async (clinicId: string) => {
    return callEdgeFunction("claim-status", undefined).then(() => {
      // claim-status is a GET, so we fetch directly
      const supabase = getSupabaseBrowser();
      return fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/claim-status?clinic_id=${clinicId}`,
        {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
        }
      ).then((r) => r.json());
    });
  }, []);

  const initiateClaim = useCallback(async (clinicId: string, email: string) => {
    setLoading(true);
    try {
      return await callEdgeFunction("initiate-claim", { clinic_id: clinicId, email });
    } finally {
      setLoading(false);
    }
  }, []);

  const completeClaim = useCallback(async (claimId: string, accessToken: string) => {
    setLoading(true);
    try {
      return await callEdgeFunction("complete-claim", { claim_id: claimId }, accessToken);
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkStatus, initiateClaim, completeClaim, loading };
}
