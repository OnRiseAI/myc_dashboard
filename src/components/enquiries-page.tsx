"use client";
import { useState, useEffect, useMemo, useCallback } from "react";

// ═══════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════

function Icon({ name, className = "w-5 h-5" }) {
  const paths = {
    inbox: <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></>,
    mail: <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></>,
    map_pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    message: <><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></>,
    x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
    check: <><polyline points="20 6 9 17 4 12" /></>,
    chevron_down: <><path d="m6 9 6 6 6-6" /></>,
    external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></>,
    user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    tag: <><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></>,
    calendar: <><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
    archive: <><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></>,
    reply: <><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" /></>,
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

// ═══════════════════════════════════════
//  STATUS CONFIG
// ═══════════════════════════════════════

const STATUS_CONFIG = {
  new: { label: "New", bg: "rgba(20,184,166,0.12)", text: "text-teal-300", dot: "bg-teal-400" },
  contacted: { label: "Contacted", bg: "rgba(59,130,246,0.12)", text: "text-blue-300", dot: "bg-blue-400" },
  qualified: { label: "Qualified", bg: "rgba(168,85,247,0.12)", text: "text-purple-300", dot: "bg-purple-400" },
  converted: { label: "Converted", bg: "rgba(34,197,94,0.12)", text: "text-green-300", dot: "bg-green-400" },
  lost: { label: "Lost", bg: "rgba(239,68,68,0.08)", text: "text-red-300/70", dot: "bg-red-400/60" },
  archived: { label: "Archived", bg: "rgba(255,255,255,0.04)", text: "text-white/30", dot: "bg-white/20" },
};

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${s.text}`}
      style={{ background: s.bg }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ═══════════════════════════════════════
//  RELATIVE TIME
// ═══════════════════════════════════════

function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ═══════════════════════════════════════
//  MOCK DATA (replaced by Supabase in production)
// ═══════════════════════════════════════

const MOCK_ENQUIRIES = [
  {
    id: "1", type: "form", name: "Sarah Johnson", email: "sarah.j@gmail.com", phone: "+44 7700 900123",
    country_of_residence: "United Kingdom", message: "Hi, I'm interested in a rhinoplasty consultation. I've been considering this for a while and would love to know about your packages including accommodation. What's the typical recovery time before I can fly home?",
    procedure: "Rhinoplasty", source: "Clinic Page", status: "new",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "2", type: "form", name: "Michael Chen", email: "m.chen@outlook.com", phone: "+1 415 555 0199",
    country_of_residence: "United States", message: "Looking for FUE hair transplant pricing. I'm a NW3 and want around 3000 grafts. Do you have any availability in March?",
    procedure: "Hair Transplant FUE", source: "Procedure Page", status: "new",
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: "3", type: "chat", name: "Emma Williams", email: null, phone: "+44 7911 123456",
    country_of_residence: "United Kingdom",
    message: "Interested in dental veneers, 8-10 teeth. Timeframe: next 2 months. Budget: flexible.",
    procedure: "Dental Veneers", source: "Chat Widget", status: "contacted",
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    category: "Dental", timeframe: "1-2 months",
  },
  {
    id: "4", type: "form", name: "Ahmed Al-Rashid", email: "ahmed.r@yahoo.com", phone: "+971 50 123 4567",
    country_of_residence: "UAE", message: "I need a full quote for BBL and liposuction combined. My wife is also interested in a breast augmentation. Can we both get consultations together?",
    procedure: "BBL + Liposuction", source: "Google", status: "qualified",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "5", type: "form", name: "Lisa Mueller", email: "lisa.m@web.de", phone: "+49 170 1234567",
    country_of_residence: "Germany", message: "Requesting information about gastric sleeve surgery. BMI is 38. Do you accept patients with controlled type 2 diabetes?",
    procedure: "Gastric Sleeve", source: "Clinic Page", status: "converted",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "6", type: "chat", name: "David Park", email: "david.p@gmail.com", phone: "+82 10 9876 5432",
    country_of_residence: "South Korea", message: "Thinking about LASIK. Currently -4.5 both eyes. Goal: clear vision without contacts.",
    procedure: "LASIK", source: "Chat Widget", status: "lost",
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    category: "Eye Surgery", timeframe: "3+ months",
  },
];

// ═══════════════════════════════════════
//  DETAIL DRAWER
// ═══════════════════════════════════════

function DetailDrawer({ enquiry, onClose, onStatusChange }) {
  if (!enquiry) return null;

  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const initials = enquiry.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-[480px] z-50 overflow-y-auto animate-[slideInRight_0.25s_ease-out]"
        style={{
          background: "linear-gradient(180deg, rgba(12,24,44,0.99) 0%, rgba(10,20,38,0.99) 100%)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{
            background: "rgba(12,24,44,0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500/20 to-teal-600/20 border border-teal-500/20 flex items-center justify-center">
              <span className="text-[13px] font-bold text-teal-300">{initials}</span>
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-white">{enquiry.name}</h3>
              <p className="text-[12px] text-white/35">{timeAgo(enquiry.created_at)}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors p-1">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Status + Actions */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                className="flex items-center gap-1.5 pr-2 rounded-full transition-opacity hover:opacity-80"
              >
                <StatusBadge status={enquiry.status} />
                <Icon name="chevron_down" className="w-3 h-3 text-white/25" />
              </button>
              {statusMenuOpen && (
                <div
                  className="absolute left-0 top-full mt-1 z-20 rounded-lg overflow-hidden min-w-[140px]"
                  style={{
                    background: "rgba(15,25,48,0.98)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
                  }}
                >
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => { onStatusChange(enquiry.id, key); setStatusMenuOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] transition-colors hover:bg-white/[0.05] ${
                        enquiry.status === key ? "text-white/80" : "text-white/45"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                      {enquiry.status === key && <Icon name="check" className="w-3.5 h-3.5 ml-auto text-teal-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1" />
            {enquiry.email && (
              <a
                href={`mailto:${enquiry.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-teal-300 hover:text-teal-200 transition-colors"
                style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.15)" }}
              >
                <Icon name="reply" className="w-3.5 h-3.5" />
                Reply
              </a>
            )}
          </div>

          {/* Contact Info */}
          <div
            className="rounded-xl p-4 space-y-3"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium">Contact</p>
            {enquiry.email && (
              <div className="flex items-center gap-3">
                <Icon name="mail" className="w-4 h-4 text-white/20" />
                <a href={`mailto:${enquiry.email}`} className="text-[13px] text-teal-300/80 hover:text-teal-300 transition-colors">
                  {enquiry.email}
                </a>
              </div>
            )}
            {enquiry.phone && (
              <div className="flex items-center gap-3">
                <Icon name="phone" className="w-4 h-4 text-white/20" />
                <a href={`tel:${enquiry.phone}`} className="text-[13px] text-white/60 hover:text-white/80 transition-colors">
                  {enquiry.phone}
                </a>
              </div>
            )}
            {enquiry.country_of_residence && (
              <div className="flex items-center gap-3">
                <Icon name="globe" className="w-4 h-4 text-white/20" />
                <span className="text-[13px] text-white/50">{enquiry.country_of_residence}</span>
              </div>
            )}
          </div>

          {/* Enquiry Details */}
          <div
            className="rounded-xl p-4 space-y-3"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium">Enquiry Details</p>
            {enquiry.procedure && (
              <div className="flex items-center gap-3">
                <Icon name="tag" className="w-4 h-4 text-white/20" />
                <span className="text-[13px] text-white/60">{enquiry.procedure}</span>
              </div>
            )}
            {enquiry.timeframe && (
              <div className="flex items-center gap-3">
                <Icon name="calendar" className="w-4 h-4 text-white/20" />
                <span className="text-[13px] text-white/50">Timeframe: {enquiry.timeframe}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Icon name="zap" className="w-4 h-4 text-white/20" />
              <span className="text-[13px] text-white/40">
                Source: {enquiry.source || "Direct"} · {enquiry.type === "chat" ? "Chat Widget" : "Contact Form"}
              </span>
            </div>
          </div>

          {/* Message */}
          {enquiry.message && (
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-3">Message</p>
              <p className="text-[14px] text-white/60 leading-relaxed whitespace-pre-wrap">
                {enquiry.message}
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {enquiry.email && (
                <a
                  href={`mailto:${enquiry.email}?subject=Re: Your enquiry about ${enquiry.procedure || "our clinic"}&body=Hi ${enquiry.name.split(" ")[0]},%0D%0A%0D%0AThank you for your interest in ${enquiry.procedure || "our services"}.%0D%0A%0D%0A`}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] text-white/45 hover:text-white/65 transition-colors"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Icon name="mail" className="w-4 h-4" />
                  Send Email
                </a>
              )}
              {enquiry.phone && (
                <a
                  href={`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] text-white/45 hover:text-white/65 transition-colors"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Icon name="message" className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
              {enquiry.phone && (
                <a
                  href={`tel:${enquiry.phone}`}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] text-white/45 hover:text-white/65 transition-colors"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Icon name="phone" className="w-4 h-4" />
                  Call
                </a>
              )}
              <button
                onClick={() => onStatusChange(enquiry.id, "archived")}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] text-white/35 hover:text-white/55 transition-colors"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <Icon name="archive" className="w-4 h-4" />
                Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════
//  ENQUIRY ROW
// ═══════════════════════════════════════

function EnquiryListRow({ enquiry, selected, onClick }) {
  const initials = enquiry.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isNew = enquiry.status === "new";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 text-left transition-all duration-150 rounded-lg group ${
        selected
          ? "bg-teal-500/[0.06] ring-1 ring-teal-500/15"
          : "hover:bg-white/[0.02]"
      }`}
    >
      {/* New dot indicator */}
      <div className="w-2 flex-shrink-0 flex justify-center">
        {isNew && <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />}
      </div>

      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isNew
            ? "bg-gradient-to-br from-teal-500/15 to-teal-600/15 border border-teal-500/20"
            : "bg-white/[0.05] border border-white/[0.06]"
        }`}
      >
        <span className={`text-[12px] font-bold ${isNew ? "text-teal-300/80" : "text-white/35"}`}>{initials}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-[14px] font-medium truncate ${isNew ? "text-white/90" : "text-white/65"}`}>
            {enquiry.name}
          </span>
          {enquiry.type === "chat" && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md text-white/25 bg-white/[0.04]">Chat</span>
          )}
        </div>
        <p className="text-[13px] text-white/30 truncate mt-0.5">
          {enquiry.procedure || enquiry.category || "General enquiry"}
          {enquiry.country_of_residence && ` · ${enquiry.country_of_residence}`}
        </p>
      </div>

      {/* Meta */}
      <div className="flex flex-col items-end flex-shrink-0 gap-1.5">
        <StatusBadge status={enquiry.status} />
        <span className="text-[11px] text-white/20">{timeAgo(enquiry.created_at)}</span>
      </div>
    </button>
  );
}

// ═══════════════════════════════════════
//  FILTER TABS
// ═══════════════════════════════════════

function FilterTabs({ active, onChange, counts }) {
  const tabs = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "contacted", label: "Contacted" },
    { id: "qualified", label: "Qualified" },
    { id: "converted", label: "Converted" },
    { id: "lost", label: "Lost" },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const count = tab.id === "all" ? counts.all : counts[tab.id] || 0;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all ${
              isActive
                ? "bg-teal-500/10 text-teal-300 ring-1 ring-teal-500/20"
                : "text-white/35 hover:text-white/55 hover:bg-white/[0.03]"
            }`}
          >
            {tab.label}
            {count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive ? "bg-teal-500/20 text-teal-300" : "bg-white/[0.06] text-white/25"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
//  MAIN ENQUIRIES PAGE
// ═══════════════════════════════════════

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState(MOCK_ENQUIRIES);
  const [selectedId, setSelectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Counts by status
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: enquiries.length };
    enquiries.forEach((e) => {
      c[e.status] = (c[e.status] || 0) + 1;
    });
    return c;
  }, [enquiries]);

  // Filtered list
  const filtered = useMemo(() => {
    let list = enquiries;
    if (statusFilter !== "all") {
      list = list.filter((e) => e.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.email && e.email.toLowerCase().includes(q)) ||
          (e.procedure && e.procedure.toLowerCase().includes(q)) ||
          (e.country_of_residence && e.country_of_residence.toLowerCase().includes(q))
      );
    }
    return list;
  }, [enquiries, statusFilter, search]);

  const selectedEnquiry = enquiries.find((e) => e.id === selectedId) || null;

  const handleStatusChange = useCallback((id, newStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
  }, []);

  const newCount = counts["new"] || 0;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] font-semibold text-white tracking-tight">Enquiries</h1>
            {newCount > 0 && (
              <span
                className="text-[12px] font-bold px-2 py-0.5 rounded-full text-teal-300"
                style={{ background: "rgba(20,184,166,0.15)" }}
              >
                {newCount} new
              </span>
            )}
          </div>
          <p className="text-white/40 text-[15px] mt-1">
            Patient enquiries from your MeetYourClinic listing.
          </p>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <FilterTabs active={statusFilter} onChange={setStatusFilter} counts={counts} />
        <div className="sm:ml-auto relative">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enquiries…"
            className="w-full sm:w-[220px] pl-9 pr-3 py-2 rounded-lg text-[13px] text-white placeholder-white/20 outline-none transition-all focus:ring-2 focus:ring-teal-500/20"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          />
        </div>
      </div>

      {/* List */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        {filtered.length > 0 ? (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((enquiry) => (
              <EnquiryListRow
                key={enquiry.id}
                enquiry={enquiry}
                selected={selectedId === enquiry.id}
                onClick={() => setSelectedId(enquiry.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <Icon name="inbox" className="w-8 h-8 text-white/10" />
            </div>
            {search || statusFilter !== "all" ? (
              <>
                <p className="text-white/45 text-[15px] mb-1">No matching enquiries</p>
                <p className="text-white/25 text-[13px] max-w-sm">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  onClick={() => { setSearch(""); setStatusFilter("all"); }}
                  className="mt-4 text-[13px] text-teal-400/60 hover:text-teal-400 transition-colors"
                >
                  Clear all filters
                </button>
              </>
            ) : (
              <>
                <p className="text-white/45 text-[15px] mb-1">No enquiries yet</p>
                <p className="text-white/25 text-[13px] max-w-sm">
                  When patients submit enquiries through your listing, they'll appear here.
                  Complete your profile to increase visibility.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Summary stats */}
      {enquiries.length > 0 && (
        <div className="mt-4 flex items-center gap-4 text-[12px] text-white/20">
          <span>{enquiries.length} total enquiries</span>
          <span>·</span>
          <span>{counts["new"] || 0} awaiting response</span>
          <span>·</span>
          <span>{counts.converted || 0} converted</span>
        </div>
      )}

      {/* Detail Drawer */}
      <DetailDrawer
        enquiry={selectedEnquiry}
        onClose={() => setSelectedId(null)}
        onStatusChange={handleStatusChange}
      />

      {/* Animations */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
