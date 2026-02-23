"use client";
import { useState, useEffect, useCallback } from "react";


// ═══════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════

function Icon({ name, className = "w-5 h-5" }) {
  const icons = {
    home: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    building: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
      </svg>
    ),
    inbox: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
    ),
    users: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    star: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    bar_chart: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" />
      </svg>
    ),
    settings: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    external: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" />
      </svg>
    ),
    chevron_right: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
      </svg>
    ),
    menu: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
      </svg>
    ),
    x: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
      </svg>
    ),
    image: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
    check: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    alert: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
      </svg>
    ),
    clock: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    eye: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
    log_out: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
      </svg>
    ),
    stethoscope: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
      </svg>
    ),
  };
  return icons[name] || null;
}

// ═══════════════════════════════════════
//  STAT CARD
// ═══════════════════════════════════════

function StatCard({ label, value, icon, trend = undefined, accent = "teal", badge = undefined }) {
  const accentMap = {
    teal: { bg: "rgba(20,184,166,0.08)", border: "rgba(20,184,166,0.12)", text: "text-teal-400", icon: "text-teal-400/60" },
    amber: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.12)", text: "text-amber-400", icon: "text-amber-400/60" },
    blue: { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.12)", text: "text-blue-400", icon: "text-blue-400/60" },
    purple: { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.12)", text: "text-purple-400", icon: "text-purple-400/60" },
  };
  const a = accentMap[accent];

  return (
    <div
      className="rounded-xl p-5 transition-all duration-200 hover:translate-y-[-1px]"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: a.bg, border: `1px solid ${a.border}` }}
        >
          <Icon name={icon} className={`w-[18px] h-[18px] ${a.icon}`} />
        </div>
        {trend && (
          <span className={`text-[12px] font-medium ${a.text}`}>{trend}</span>
        )}
      </div>
      <p className="text-[26px] font-semibold text-white tracking-tight">{value}</p>
      <p className="text-[13px] text-white/40 mt-0.5">{label}</p>
    </div>
  );
}

// ═══════════════════════════════════════
//  COMPLETENESS RING
// ═══════════════════════════════════════

function CompletenessRing({ percentage }) {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 80 ? "#14b8a6" : percentage >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[22px] font-bold text-white">{percentage}%</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  COMPLETENESS CHECKLIST
// ═══════════════════════════════════════

function ChecklistItem({ label, done, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors hover:bg-white/[0.03] text-left group"
    >
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
          done
            ? "bg-teal-500/20 border border-teal-500/30"
            : "border border-white/10 group-hover:border-white/20"
        }`}
      >
        {done && <Icon name="check" className="w-3 h-3 text-teal-400" />}
      </div>
      <span className={`text-[13px] ${done ? "text-white/40 line-through" : "text-white/60"}`}>
        {label}
      </span>
      {!done && <Icon name="chevron_right" className="w-3.5 h-3.5 text-white/15 ml-auto" />}
    </button>
  );
}

// ═══════════════════════════════════════
//  ENQUIRY ROW
// ═══════════════════════════════════════

function EnquiryRow({ name, procedure, date, status }) {
  const statusStyles = {
    new: { bg: "rgba(20,184,166,0.1)", text: "text-teal-300", label: "New" },
    contacted: { bg: "rgba(59,130,246,0.1)", text: "text-blue-300", label: "Contacted" },
    converted: { bg: "rgba(34,197,94,0.1)", text: "text-green-300", label: "Converted" },
  };
  const s = statusStyles[status] || statusStyles.new;

  return (
    <div
      className="flex items-center gap-4 py-3.5 px-4 rounded-lg transition-colors hover:bg-white/[0.02] cursor-pointer"
    >
      <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0">
        <span className="text-[13px] font-semibold text-white/50">
          {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-white/80 font-medium truncate">{name}</p>
        <p className="text-[12px] text-white/35 truncate">{procedure}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${s.text}`}
          style={{ background: s.bg }}
        >
          {s.label}
        </span>
        <p className="text-[11px] text-white/25 mt-1">{date}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  SIDEBAR NAV
// ═══════════════════════════════════════

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "home" },
  { id: "profile", label: "Clinic Profile", icon: "building" },
  { id: "enquiries", label: "Enquiries", icon: "inbox", badge: 3 },
  { id: "doctors", label: "Doctors & Team", icon: "stethoscope" },
  { id: "reviews", label: "Reviews", icon: "star" },
  { id: "analytics", label: "Analytics", icon: "bar_chart" },
  { id: "photos", label: "Photos & Media", icon: "image" },
  { id: "settings", label: "Settings", icon: "settings" },
];

function Sidebar({ activePage, onNavigate, clinicName, mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
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
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onCloseMobile(); }}
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
                {item.badge && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: active ? "rgba(20,184,166,0.2)" : "rgba(20,184,166,0.15)",
                      color: "#5eead4",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
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
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/35 hover:text-red-400/70 hover:bg-red-500/[0.04] transition-colors">
            <Icon name="log_out" className="w-4 h-4" />
            <span className="text-[13px]">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ═══════════════════════════════════════
//  PAGE: OVERVIEW
// ═══════════════════════════════════════

function OverviewPage({ clinic, onNavigate }) {
  // Compute profile completeness
  const fields = [
    { label: "Clinic description", done: !!clinic.description },
    { label: "Contact phone number", done: !!clinic.phone },
    { label: "Contact email", done: !!clinic.email },
    { label: "Clinic address", done: !!clinic.address },
    { label: "At least one doctor", done: (clinic.doctor_count || 0) > 0 },
    { label: "At least one photo", done: (clinic.photo_count || 0) > 0 },
    { label: "Website URL", done: !!clinic.website_url },
    { label: "Specialties listed", done: clinic.specialties?.length > 0 },
  ];
  const doneCount = fields.filter(f => f.done).length;
  const percentage = Math.round((doneCount / fields.length) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-[24px] font-semibold text-white tracking-tight">
          Welcome back
        </h1>
        <p className="text-white/40 text-[15px] mt-1">
          Here's an overview of your clinic's performance and profile.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Profile Views" value={clinic.view_count || "—"} icon="eye" accent="teal" trend={clinic.view_count ? "+12%" : undefined} />
        <StatCard label="Enquiries" value={clinic.enquiry_count || 0} icon="inbox" accent="blue" badge={clinic.new_enquiry_count} />
        <StatCard label="Listed Procedures" value={clinic.procedure_count || 0} icon="stethoscope" accent="purple" />
        <StatCard label="Team Members" value={clinic.doctor_count || 0} icon="users" accent="amber" />
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Profile Completeness */}
        <div
          className="lg:col-span-2 rounded-xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2 className="text-[16px] font-semibold text-white mb-5">Profile Completeness</h2>
          <div className="flex items-center gap-6 mb-5">
            <CompletenessRing percentage={percentage} />
            <div>
              <p className="text-[14px] text-white/60">{doneCount} of {fields.length} completed</p>
              <p className="text-[12px] text-white/30 mt-1">
                {percentage >= 80
                  ? "Your profile is looking great!"
                  : "Complete your profile to attract more patients."}
              </p>
            </div>
          </div>
          <div className="space-y-0.5">
            {fields.map((f, i) => (
              <ChecklistItem
                key={i}
                label={f.label}
                done={f.done}
                onClick={() => !f.done && onNavigate("profile")}
              />
            ))}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div
          className="lg:col-span-3 rounded-xl p-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-white">Recent Enquiries</h2>
            <button
              onClick={() => onNavigate("enquiries")}
              className="text-[13px] text-teal-400/60 hover:text-teal-400 transition-colors"
            >
              View all
            </button>
          </div>

          {(clinic.enquiry_count || 0) > 0 ? (
            <div className="space-y-1">
              <EnquiryRow name="Sarah Johnson" procedure="Rhinoplasty Consultation" date="2h ago" status="new" />
              <EnquiryRow name="Michael Chen" procedure="Hair Transplant FUE" date="5h ago" status="new" />
              <EnquiryRow name="Emma Williams" procedure="Dental Veneers Package" date="1d ago" status="contacted" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                <Icon name="inbox" className="w-7 h-7 text-white/15" />
              </div>
              <p className="text-white/40 text-[14px] mb-1">No enquiries yet</p>
              <p className="text-white/25 text-[13px] max-w-xs">
                Complete your profile and add procedures to start receiving patient enquiries.
              </p>
            </div>
          )}

          {/* Quick actions */}
          <div className="mt-5 pt-5 border-t border-white/[0.05]">
            <p className="text-[12px] text-white/25 uppercase tracking-wider font-medium mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Edit Profile", icon: "building", page: "profile" },
                { label: "Add Photos", icon: "image", page: "photos" },
                { label: "Manage Doctors", icon: "stethoscope", page: "doctors" },
                { label: "View Analytics", icon: "bar_chart", page: "analytics" },
              ].map((action) => (
                <button
                  key={action.page}
                  onClick={() => onNavigate(action.page)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-white/[0.04]"
                  style={{ border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <Icon name={action.icon} className="w-4 h-4 text-white/25" />
                  <span className="text-[13px] text-white/50">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  PAGE: PLACEHOLDER (for non-overview pages)
// ═══════════════════════════════════════

function PlaceholderPage({ title, icon, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Icon name={icon} className="w-8 h-8 text-white/15" />
      </div>
      <h2 className="text-[20px] font-semibold text-white mb-2">{title}</h2>
      <p className="text-white/40 text-[14px] max-w-sm">{description}</p>
      <div
        className="mt-6 px-4 py-2 rounded-lg text-[13px] text-teal-400/60"
        style={{ background: "rgba(20,184,166,0.06)", border: "1px solid rgba(20,184,166,0.1)" }}
      >
        Coming soon
      </div>
    </div>
  );
}

const PAGE_META = {
  profile: { title: "Clinic Profile", icon: "building", description: "Edit your clinic's public-facing information, contact details, and specialties." },
  enquiries: { title: "Enquiries", icon: "inbox", description: "View and manage patient enquiries from your MeetYourClinic listing." },
  doctors: { title: "Doctors & Team", icon: "stethoscope", description: "Manage your team of medical professionals and their credentials." },
  reviews: { title: "Reviews", icon: "star", description: "Monitor and respond to patient reviews across platforms." },
  analytics: { title: "Analytics", icon: "bar_chart", description: "Track profile views, enquiry rates, and listing performance." },
  photos: { title: "Photos & Media", icon: "image", description: "Upload and manage clinic photos, before & after galleries, and facility images." },
  settings: { title: "Settings", icon: "settings", description: "Manage your account, notification preferences, and clinic visibility." },
};

// ═══════════════════════════════════════
//  MAIN DASHBOARD
// ═══════════════════════════════════════

export default function Dashboard() {
  const [activePage, setActivePage] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simulated clinic data (in production, fetched from Supabase using owner_id)
  const [clinic] = useState({
    name: "Clinic Center",
    slug: "clinic-center-istanbul",
    description: "Medical tourism leader in Istanbul since 2013.",
    description_short: "Medical tourism leader Istanbul since 2013.",
    address: "Ceceli İş Merkezi, 19 Mayıs, Şişli, Istanbul",
    city: "Istanbul",
    country: "Turkey",
    phone: null,
    email: null,
    website_url: "https://cliniccenter.co.uk",
    specialties: ["Hair Transplant", "Dental", "Plastic Surgery", "Weight Loss Surgery"],
    primary_specialty: "Hair Restoration",
    is_verified: true,
    procedure_count: 18,
    doctor_count: 0,
    photo_count: 0,
    enquiry_count: 0,
    new_enquiry_count: 0,
    view_count: null,
    quality_score: null,
  });

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
        <div className="w-6" /> {/* Spacer for centering */}
      </header>

      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        clinicName={clinic.name}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main content */}
      <main className="lg:ml-[260px] min-h-screen pt-16 lg:pt-0">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {activePage === "overview" ? (
            <OverviewPage clinic={clinic} onNavigate={setActivePage} />
          ) : (
            <PlaceholderPage {...PAGE_META[activePage]} />
          )}
        </div>
      </main>

      {/* Subtle grid overlay on the content area */}
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
