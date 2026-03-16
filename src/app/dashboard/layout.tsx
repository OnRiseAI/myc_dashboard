"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RequireAuth, useAuth } from "@/lib/auth";
import { useClinic } from "@/hooks/use-clinic-data";
import { useOnboarding } from "@/hooks/use-onboarding";
import { WelcomeModal } from "@/components/onboarding/welcome-modal";

// ═══════════════════════════════════════
//  ICONS (extracted from dashboard.tsx)
// ═══════════════════════════════════════

function Icon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    home: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>),
    building: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" /></svg>),
    inbox: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>),
    stethoscope: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" /></svg>),
    star: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>),
    bar_chart: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></svg>),
    image: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>),
    settings: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>),
    external: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></svg>),
    log_out: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>),
    menu: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>),
    x: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>),
  };
  return <>{icons[name] || null}</>;
}

// ═══════════════════════════════════════
//  NAV CONFIG
// ═══════════════════════════════════════

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "home", href: "/dashboard" },
  { id: "profile", label: "Clinic Profile", icon: "building", href: "/dashboard/profile" },
  { id: "enquiries", label: "Enquiries", icon: "inbox", href: "/dashboard/enquiries" },
  { id: "doctors", label: "Doctors & Team", icon: "stethoscope", href: "/dashboard/doctors" },
  { id: "reviews", label: "Reviews", icon: "star", href: "/dashboard/reviews" },
  { id: "analytics", label: "Analytics", icon: "bar_chart", href: "/dashboard/analytics" },
  { id: "photos", label: "Photos & Media", icon: "image", href: "/dashboard/photos" },
  { id: "settings", label: "Settings", icon: "settings", href: "/dashboard/settings" },
];

// ═══════════════════════════════════════
//  SIDEBAR
// ═══════════════════════════════════════

function Sidebar({
  clinicName,
  newEnquiryCount,
  mobileOpen,
  onCloseMobile,
  onSignOut,
}: {
  clinicName: string;
  newEnquiryCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onSignOut: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 w-[260px] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, rgba(10,22,40,0.98) 0%, rgba(8,18,34,0.99) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Brand */}
        <div className="px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <div>
              <p className="text-white/90 font-semibold text-[14px] leading-tight">MeetYourClinic</p>
              <p className="text-white/30 text-[11px]">Dashboard</p>
            </div>
          </div>
          <button onClick={onCloseMobile} className="lg:hidden text-white/40 hover:text-white/60">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Clinic name */}
        <div className="px-5 mb-4">
          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-[13px] text-white/70 font-medium truncate">{clinicName}</p>
            <p className="text-[11px] text-teal-400/60 mt-0.5">Verified Owner</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const badge = item.id === "enquiries" && newEnquiryCount > 0 ? newEnquiryCount : null;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onCloseMobile}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                  active
                    ? "bg-teal-500/10 text-white"
                    : "text-white/45 hover:text-white/70 hover:bg-white/[0.03]"
                }`}
              >
                <Icon
                  name={item.icon}
                  className={`w-[18px] h-[18px] ${active ? "text-teal-400" : "text-white/30 group-hover:text-white/50"}`}
                />
                <span className="text-[14px] font-medium flex-1">{item.label}</span>
                {badge && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: active ? "rgba(20,184,166,0.2)" : "rgba(20,184,166,0.15)",
                      color: "#5eead4",
                    }}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 space-y-1 border-t border-white/[0.05]">
          <a
            href="https://meetyourclinic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/35 hover:text-white/55 hover:bg-white/[0.03] transition-colors"
          >
            <Icon name="external" className="w-4 h-4" />
            <span className="text-[13px]">View Public Listing</span>
          </a>
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/35 hover:text-red-400/70 hover:bg-red-500/[0.04] transition-colors"
          >
            <Icon name="log_out" className="w-4 h-4" />
            <span className="text-[13px]">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ═══════════════════════════════════════
//  LOADING SKELETON
// ═══════════════════════════════════════

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-white/[0.06]" />
      <div className="h-4 w-72 rounded bg-white/[0.04]" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-white/[0.03]" style={{ border: "1px solid rgba(255,255,255,0.06)" }} />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-white/[0.03]" style={{ border: "1px solid rgba(255,255,255,0.06)" }} />
    </div>
  );
}

// ═══════════════════════════════════════
//  LAYOUT
// ═══════════════════════════════════════

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const { clinic, loading } = useClinic();
  const { shouldShowWelcome, dismissWelcome } = useOnboarding();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const clinicName = clinic?.name || "Your Clinic";
  const newEnquiryCount = (clinic?.lead_count || 0);

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Mobile header */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(10,22,40,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button onClick={() => setMobileMenuOpen(true)} className="text-white/60">
          <Icon name="menu" className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">M</span>
          </div>
          <span className="text-white/80 font-semibold text-[14px]">Dashboard</span>
        </div>
        <div className="w-6" />
      </header>

      {/* Sidebar */}
      <Sidebar
        clinicName={clinicName}
        newEnquiryCount={newEnquiryCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onSignOut={signOut}
      />

      {/* Main content */}
      <main className="lg:ml-[260px] min-h-screen pt-16 lg:pt-0">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {loading ? <DashboardSkeleton /> : children}
        </div>
      </main>

      {/* Welcome modal (first-time onboarding) */}
      {shouldShowWelcome && clinic && (
        <WelcomeModal clinic={clinic} onDismiss={dismissWelcome} />
      )}

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none -z-0 lg:ml-[260px]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </RequireAuth>
  );
}
