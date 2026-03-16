"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { useClinic } from "./use-clinic-data";

// ═══════════════════════════════════════
//  Types
// ═══════════════════════════════════════

export interface Nudge {
  id: string;
  icon: string;
  title: string;
  description: string;
  action: string;
  href: string;
  priority: number;
}

export interface OnboardingState {
  shouldShowWelcome: boolean;
  dismissWelcome: () => void;
  shouldShowTooltip: (pageId: string) => boolean;
  dismissTooltip: (pageId: string) => void;
  activeNudges: Nudge[];
  dismissNudge: (nudgeId: string) => void;
}

// ═══════════════════════════════════════
//  localStorage helpers
// ═══════════════════════════════════════

function getKey(clinicId: string, suffix: string) {
  return `myc_onboarding_${clinicId}_${suffix}`;
}

function isSet(clinicId: string, suffix: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(getKey(clinicId, suffix)) === "true";
}

function markSet(clinicId: string, suffix: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getKey(clinicId, suffix), "true");
}

// ═══════════════════════════════════════
//  Nudge definitions
// ═══════════════════════════════════════

const NUDGE_DEFS: Array<{
  id: string;
  icon: string;
  title: string;
  description: string;
  action: string;
  href: string;
  priority: number;
  condition: (clinic: any) => boolean;
}> = [
  {
    id: "missing_description",
    icon: "building",
    title: "Add a clinic description",
    description: "A compelling description helps patients choose your clinic with confidence.",
    action: "Edit Profile",
    href: "/dashboard/profile",
    priority: 1,
    condition: (c) => !c.description,
  },
  {
    id: "missing_phone",
    icon: "phone",
    title: "Add a contact number",
    description: "Patients need a way to reach your clinic directly.",
    action: "Edit Profile",
    href: "/dashboard/profile",
    priority: 2,
    condition: (c) => !c.phone,
  },
  {
    id: "no_doctors",
    icon: "stethoscope",
    title: "Add your medical team",
    description: "Showcasing your doctors builds trust and credibility with patients.",
    action: "Manage Team",
    href: "/dashboard/doctors",
    priority: 3,
    condition: (c) => (c.doctor_count || 0) === 0,
  },
  {
    id: "no_photos",
    icon: "image",
    title: "Upload clinic photos",
    description: "Clinics with photos receive significantly more patient enquiries.",
    action: "Add Photos",
    href: "/dashboard/photos",
    priority: 4,
    condition: () => true, // Always show until photo tracking is added
  },
  {
    id: "missing_specialties",
    icon: "tag",
    title: "List your specialties",
    description: "Help patients find you when searching for specific treatments.",
    action: "Edit Profile",
    href: "/dashboard/profile",
    priority: 5,
    condition: (c) => (c.specialties?.length || 0) === 0,
  },
  {
    id: "missing_email",
    icon: "mail",
    title: "Add an email address",
    description: "Ensure patient enquiries reach you reliably.",
    action: "Edit Profile",
    href: "/dashboard/profile",
    priority: 6,
    condition: (c) => !c.email,
  },
];

// ═══════════════════════════════════════
//  Hook
// ═══════════════════════════════════════

export function useOnboarding(): OnboardingState {
  const { clinicId } = useAuth();
  const { clinic, loading } = useClinic();

  // Initialize as false to avoid hydration mismatch
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [dismissedNudges, setDismissedNudges] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Read localStorage after mount
  useEffect(() => {
    setMounted(true);
    if (!clinicId) return;

    const welcomeDismissed = isSet(clinicId, "welcome_dismissed");
    if (!welcomeDismissed && !loading && clinic) {
      setWelcomeVisible(true);
    }

    // Read dismissed nudges
    const dismissed = new Set<string>();
    for (const def of NUDGE_DEFS) {
      if (isSet(clinicId, `nudge_${def.id}_dismissed`)) {
        dismissed.add(def.id);
      }
    }
    setDismissedNudges(dismissed);
  }, [clinicId, loading, clinic]);

  const dismissWelcome = useCallback(() => {
    if (!clinicId) return;
    markSet(clinicId, "welcome_dismissed");
    setWelcomeVisible(false);
  }, [clinicId]);

  const shouldShowTooltip = useCallback(
    (pageId: string) => {
      if (!mounted || !clinicId || welcomeVisible) return false;
      // Only show tooltips after welcome is dismissed
      if (!isSet(clinicId, "welcome_dismissed")) return false;
      return !isSet(clinicId, `tooltip_${pageId}`);
    },
    [mounted, clinicId, welcomeVisible]
  );

  const dismissTooltip = useCallback(
    (pageId: string) => {
      if (!clinicId) return;
      markSet(clinicId, `tooltip_${pageId}`);
    },
    [clinicId]
  );

  const activeNudges = useMemo(() => {
    if (!clinic || !clinicId || !mounted) return [];
    // Only show nudges after welcome is dismissed
    if (!isSet(clinicId, "welcome_dismissed")) return [];

    return NUDGE_DEFS
      .filter((def) => def.condition(clinic) && !dismissedNudges.has(def.id))
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 2)
      .map(({ condition, ...nudge }) => nudge);
  }, [clinic, clinicId, mounted, dismissedNudges]);

  const dismissNudge = useCallback(
    (nudgeId: string) => {
      if (!clinicId) return;
      markSet(clinicId, `nudge_${nudgeId}_dismissed`);
      setDismissedNudges((prev) => new Set([...prev, nudgeId]));
    },
    [clinicId]
  );

  return {
    shouldShowWelcome: welcomeVisible,
    dismissWelcome,
    shouldShowTooltip,
    dismissTooltip,
    activeNudges,
    dismissNudge,
  };
}
