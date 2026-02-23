"use client";
import { useState, useMemo, useCallback } from "react";


// ═══════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════

function Icon({ name, className = "w-5 h-5" }) {
  const paths = {
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>,
    shield_alert: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 8v4" /><path d="M12 16h.01" /></>,
    check: <><polyline points="20 6 9 17 4 12" /></>,
    x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    mail: <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></>,
    building: <><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" /></>,
    alert_triangle: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
    user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    map_pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
    external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></>,
    check_circle: <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>,
    x_circle: <><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></>,
    wifi: <><path d="M5 13a10 10 0 0 1 14 0" /><path d="M8.5 16.5a5 5 0 0 1 7 0" /><path d="M2 8.82a15 15 0 0 1 20 0" /><line x1="12" x2="12.01" y1="20" y2="20" /></>,
    file_text: <><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></>,
    chevron_right: <><path d="m9 18 6-6-6-6" /></>,
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function Spinner({ className = "w-5 h-5" }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ═══════════════════════════════════════
//  STATUS / VERIFICATION CONFIGS
// ═══════════════════════════════════════

const CLAIM_STATUS = {
  requires_review: { label: "Pending Review", bg: "rgba(245,158,11,0.12)", text: "text-amber-300", dot: "bg-amber-400" },
  initiated: { label: "Initiated", bg: "rgba(59,130,246,0.1)", text: "text-blue-300", dot: "bg-blue-400" },
  verified: { label: "Verified", bg: "rgba(20,184,166,0.12)", text: "text-teal-300", dot: "bg-teal-400" },
  completed: { label: "Approved", bg: "rgba(34,197,94,0.12)", text: "text-green-300", dot: "bg-green-400" },
  rejected: { label: "Rejected", bg: "rgba(239,68,68,0.1)", text: "text-red-300", dot: "bg-red-400" },
  already_claimed: { label: "Already Claimed", bg: "rgba(255,255,255,0.04)", text: "text-white/35", dot: "bg-white/25" },
};

function ClaimStatusBadge({ status }) {
  const s = CLAIM_STATUS[status] || CLAIM_STATUS.requires_review;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${s.text}`} style={{ background: s.bg }}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ═══════════════════════════════════════
//  FRAUD FLAG COMPONENT
// ═══════════════════════════════════════

function FraudFlags({ claim }) {
  const flags = [];

  if (claim.is_free_email_provider) {
    flags.push({ severity: "high", label: "Free email provider", detail: `Used ${claim.email_domain} (Gmail, Yahoo, etc.)` });
  }
  if (claim.email_domain_match === false) {
    flags.push({ severity: "high", label: "Domain mismatch", detail: `Email domain doesn't match clinic website` });
  }
  if (!claim.user_id) {
    flags.push({ severity: "medium", label: "Email not verified", detail: "User hasn't clicked the magic link yet" });
  }
  if (claim.email_domain_match === true && !claim.is_free_email_provider) {
    flags.push({ severity: "low", label: "Domain match confirmed", detail: `Email matches clinic website domain` });
  }

  if (flags.length === 0) return null;

  const severityColors = {
    high: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.15)", icon: "text-red-400/70", text: "text-red-300/70" },
    medium: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.12)", icon: "text-amber-400/70", text: "text-amber-300/70" },
    low: { bg: "rgba(34,197,94,0.06)", border: "rgba(34,197,94,0.1)", icon: "text-green-400/60", text: "text-green-300/60" },
  };

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium">Fraud Signals</p>
      {flags.map((flag, i) => {
        const c = severityColors[flag.severity];
        return (
          <div
            key={i}
            className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
          >
            <Icon
              name={flag.severity === "low" ? "check_circle" : "alert_triangle"}
              className={`w-4 h-4 flex-shrink-0 mt-0.5 ${c.icon}`}
            />
            <div>
              <p className={`text-[13px] font-medium ${c.text}`}>{flag.label}</p>
              <p className="text-[11px] text-white/30 mt-0.5">{flag.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const MOCK_CLAIMS = [
  {
    id: "c1", clinic_id: "cl1", clinic_name: "Istanbul Smile Centre", clinic_slug: "istanbul-smile-centre",
    clinic_website: "https://istanbulsmile.com", clinic_city: "Istanbul", clinic_country: "Turkey",
    user_id: "u1", email: "info@istanbulsmile.com", email_domain: "istanbulsmile.com",
    verification_status: "requires_review", status: "requires_review",
    email_domain_match: true, is_free_email_provider: false,
    ip_address: "85.105.22.44", ip_country: "TR",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    review_notes: null, reviewed_by: null, reviewed_at: null,
  },
  {
    id: "c2", clinic_id: "cl2", clinic_name: "Hairline Clinic", clinic_slug: "hairline-clinic-ankara",
    clinic_website: "https://www.hairlineclinic.com", clinic_city: "Ankara", clinic_country: "Turkey",
    user_id: "u2", email: "dr.mehmet@gmail.com", email_domain: "gmail.com",
    verification_status: "requires_review", status: "requires_review",
    email_domain_match: false, is_free_email_provider: true,
    ip_address: "31.200.15.88", ip_country: "TR",
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    review_notes: null, reviewed_by: null, reviewed_at: null,
  },
  {
    id: "c3", clinic_id: "cl3", clinic_name: "Budapest Dental Studio", clinic_slug: "budapest-dental-studio",
    clinic_website: "https://budapestdental.hu", clinic_city: "Budapest", clinic_country: "Hungary",
    user_id: null, email: "admin@budapestdental.hu", email_domain: "budapestdental.hu",
    verification_status: "requires_review", status: "initiated",
    email_domain_match: true, is_free_email_provider: false,
    ip_address: "86.101.55.12", ip_country: "HU",
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    review_notes: null, reviewed_by: null, reviewed_at: null,
  },
  {
    id: "c4", clinic_id: "cl4", clinic_name: "Clinic Center", clinic_slug: "clinic-center-istanbul",
    clinic_website: "https://cliniccenter.co.uk", clinic_city: "Istanbul", clinic_country: "Turkey",
    user_id: "u4", email: "manager@cliniccenter.co.uk", email_domain: "cliniccenter.co.uk",
    verification_status: "domain_verified", status: "completed",
    email_domain_match: true, is_free_email_provider: false,
    ip_address: "176.234.10.1", ip_country: "TR",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    review_notes: "Domain match confirmed, auto-approved", reviewed_by: null, reviewed_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "c5", clinic_id: "cl5", clinic_name: "Bangkok Beauty Med", clinic_slug: "bangkok-beauty-med",
    clinic_website: "https://bangkokbeautymed.com", clinic_city: "Bangkok", clinic_country: "Thailand",
    user_id: "u5", email: "random_person@yahoo.com", email_domain: "yahoo.com",
    verification_status: "rejected", status: "rejected",
    email_domain_match: false, is_free_email_provider: true,
    ip_address: "203.150.44.33", ip_country: "NG",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    review_notes: "Free email, domain mismatch, IP from Nigeria for Thai clinic. Suspected fraud.", reviewed_by: "admin1", reviewed_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

// ═══════════════════════════════════════
//  CLAIM ROW
// ═══════════════════════════════════════

function ClaimRow({ claim, selected, onClick }) {
  const isPending = ["requires_review", "initiated"].includes(claim.status);
  const hasFlags = claim.is_free_email_provider || claim.email_domain_match === false;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-all rounded-lg ${
        selected ? "bg-teal-500/[0.06] ring-1 ring-teal-500/15" : "hover:bg-white/[0.02]"
      }`}
    >
      {/* Priority indicator */}
      <div className="w-2 flex-shrink-0 flex justify-center">
        {isPending && hasFlags && <div className="w-2 h-2 rounded-full bg-red-400/70" />}
        {isPending && !hasFlags && <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
      </div>

      {/* Clinic icon */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isPending ? "bg-amber-500/10 border border-amber-500/15" : "bg-white/[0.04] border border-white/[0.06]"
        }`}
      >
        <Icon name="building" className={`w-5 h-5 ${isPending ? "text-amber-400/60" : "text-white/20"}`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-[14px] font-medium truncate ${isPending ? "text-white/90" : "text-white/55"}`}>
            {claim.clinic_name}
          </span>
          {hasFlags && isPending && (
            <Icon name="alert_triangle" className="w-3.5 h-3.5 text-red-400/60 flex-shrink-0" />
          )}
        </div>
        <p className="text-[12px] text-white/30 truncate mt-0.5">
          {claim.email} · {claim.clinic_city}, {claim.clinic_country}
        </p>
      </div>

      {/* Status + time */}
      <div className="flex flex-col items-end flex-shrink-0 gap-1.5">
        <ClaimStatusBadge status={claim.status} />
        <span className="text-[11px] text-white/20">{timeAgo(claim.created_at)}</span>
      </div>
    </button>
  );
}

// ═══════════════════════════════════════
//  DETAIL PANEL
// ═══════════════════════════════════════

function DetailPanel({ claim, onAction, actionLoading }) {
  const [notes, setNotes] = useState("");
  const [confirmAction, setConfirmAction] = useState(null); // "approve" | "reject" | null

  if (!claim) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 text-center">
        <Icon name="file_text" className="w-10 h-10 text-white/10 mb-4" />
        <p className="text-white/30 text-[14px]">Select a claim to review</p>
      </div>
    );
  }

  const isPending = ["requires_review", "initiated"].includes(claim.status);

  const handleAction = (action) => {
    if (!confirmAction) {
      setConfirmAction(action);
      return;
    }
    onAction(claim.id, action, notes);
    setConfirmAction(null);
    setNotes("");
  };

  return (
    <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-[18px] font-semibold text-white">{claim.clinic_name}</h2>
            <ClaimStatusBadge status={claim.status} />
          </div>
          <p className="text-[13px] text-white/35 mt-1">
            Claim submitted {timeAgo(claim.created_at)} · {claim.clinic_city}, {claim.clinic_country}
          </p>
        </div>
        <a
          href={`https://meetyourclinic.com/clinics/${claim.clinic_slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-white/35 hover:text-white/55 transition-colors flex-shrink-0"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Icon name="external" className="w-3.5 h-3.5" />
          View Listing
        </a>
      </div>

      {/* Fraud Flags */}
      <FraudFlags claim={claim} />

      {/* Claimant Info */}
      <div
        className="rounded-xl p-4 space-y-3"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium">Claimant Details</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5">
            <Icon name="mail" className="w-4 h-4 text-white/20" />
            <div>
              <p className="text-[11px] text-white/25">Email</p>
              <p className="text-[13px] text-white/60">{claim.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Icon name="globe" className="w-4 h-4 text-white/20" />
            <div>
              <p className="text-[11px] text-white/25">Email Domain</p>
              <p className="text-[13px] text-white/60">{claim.email_domain}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Icon name="wifi" className="w-4 h-4 text-white/20" />
            <div>
              <p className="text-[11px] text-white/25">IP Address</p>
              <p className="text-[13px] text-white/60">{claim.ip_address || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Icon name="map_pin" className="w-4 h-4 text-white/20" />
            <div>
              <p className="text-[11px] text-white/25">IP Country</p>
              <p className="text-[13px] text-white/60">{claim.ip_country || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clinic Info */}
      <div
        className="rounded-xl p-4 space-y-3"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium">Clinic Details</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5">
            <Icon name="building" className="w-4 h-4 text-white/20" />
            <div>
              <p className="text-[11px] text-white/25">Clinic</p>
              <p className="text-[13px] text-white/60">{claim.clinic_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Icon name="globe" className="w-4 h-4 text-white/20" />
            <div>
              <p className="text-[11px] text-white/25">Website</p>
              {claim.clinic_website ? (
                <a href={claim.clinic_website} target="_blank" rel="noopener noreferrer" className="text-[13px] text-teal-300/70 hover:text-teal-300 transition-colors truncate block max-w-[180px]">
                  {claim.clinic_website.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                <p className="text-[13px] text-white/30">No website</p>
              )}
            </div>
          </div>
        </div>

        {/* Domain comparison */}
        <div
          className="mt-3 p-3 rounded-lg"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
        >
          <p className="text-[11px] text-white/25 mb-2">Domain Comparison</p>
          <div className="flex items-center gap-3 text-[13px]">
            <span className="text-white/50">Email: <span className="text-white/70 font-mono">@{claim.email_domain}</span></span>
            <span className={claim.email_domain_match ? "text-green-400" : "text-red-400"}>
              {claim.email_domain_match ? "=" : "≠"}
            </span>
            <span className="text-white/50">
              Website: <span className="text-white/70 font-mono">
                {claim.clinic_website ? new URL(claim.clinic_website).hostname.replace("www.", "") : "none"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Previous review notes */}
      {claim.review_notes && claim.reviewed_at && (
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-2">Review Notes</p>
          <p className="text-[13px] text-white/50 leading-relaxed">{claim.review_notes}</p>
          <p className="text-[11px] text-white/20 mt-2">Reviewed {timeAgo(claim.reviewed_at)}</p>
        </div>
      )}

      {/* Action area — only for pending claims */}
      {isPending && (
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-3">Admin Action</p>

          {/* Notes input */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add review notes (optional)…"
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg text-[13px] text-white placeholder-white/20 outline-none resize-none mb-4 focus:ring-2 focus:ring-teal-500/20"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          />

          {/* Confirm dialog */}
          {confirmAction && (
            <div
              className="mb-4 p-3 rounded-lg flex items-center gap-3 animate-[fadeIn_0.15s_ease-out]"
              style={{
                background: confirmAction === "approve" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                border: `1px solid ${confirmAction === "approve" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}`,
              }}
            >
              <Icon
                name={confirmAction === "approve" ? "check_circle" : "x_circle"}
                className={`w-5 h-5 flex-shrink-0 ${confirmAction === "approve" ? "text-green-400/70" : "text-red-400/70"}`}
              />
              <p className={`text-[13px] flex-1 ${confirmAction === "approve" ? "text-green-300/70" : "text-red-300/70"}`}>
                {confirmAction === "approve"
                  ? "This will grant ownership to the claimant. Confirm?"
                  : "This will deny the claim permanently. Confirm?"}
              </p>
              <button
                onClick={() => setConfirmAction(null)}
                className="text-[12px] text-white/30 hover:text-white/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAction("approve")}
              disabled={actionLoading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-medium text-white transition-all hover:shadow-lg hover:shadow-green-500/10 disabled:opacity-50"
              style={{
                background: confirmAction === "approve"
                  ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                  : "rgba(34,197,94,0.12)",
                border: `1px solid ${confirmAction === "approve" ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.2)"}`,
                color: confirmAction === "approve" ? "#fff" : "rgb(134,239,172)",
              }}
            >
              {actionLoading && confirmAction === "approve" ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <Icon name="check" className="w-4 h-4" />
              )}
              {confirmAction === "approve" ? "Confirm Approve" : "Approve"}
            </button>
            <button
              onClick={() => handleAction("reject")}
              disabled={actionLoading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-medium transition-all hover:shadow-lg hover:shadow-red-500/10 disabled:opacity-50"
              style={{
                background: confirmAction === "reject"
                  ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                  : "rgba(239,68,68,0.08)",
                border: `1px solid ${confirmAction === "reject" ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.15)"}`,
                color: confirmAction === "reject" ? "#fff" : "rgb(252,165,165)",
              }}
            >
              {actionLoading && confirmAction === "reject" ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <Icon name="x" className="w-4 h-4" />
              )}
              {confirmAction === "reject" ? "Confirm Reject" : "Reject"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
//  STAT PILL
// ═══════════════════════════════════════

function StatPill({ label, count, color }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <span className={`text-[20px] font-bold ${color}`}>{count}</span>
      <span className="text-[12px] text-white/35">{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════
//  MAIN ADMIN PANEL
// ═══════════════════════════════════════

export default function AdminReviewPanel() {
  const [claims, setClaims] = useState(MOCK_CLAIMS);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("pending"); // "pending" | "all" | "completed" | "rejected"
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const counts = useMemo(() => ({
    pending: claims.filter((c) => ["requires_review", "initiated"].includes(c.status)).length,
    completed: claims.filter((c) => c.status === "completed").length,
    rejected: claims.filter((c) => c.status === "rejected").length,
    total: claims.length,
  }), [claims]);

  const filtered = useMemo(() => {
    let list = claims;
    if (filter === "pending") list = list.filter((c) => ["requires_review", "initiated"].includes(c.status));
    else if (filter === "completed") list = list.filter((c) => c.status === "completed");
    else if (filter === "rejected") list = list.filter((c) => c.status === "rejected");

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.clinic_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.clinic_city && c.clinic_city.toLowerCase().includes(q))
      );
    }

    // Pending first, then by date
    return list.sort((a, b) => {
      const aP = ["requires_review", "initiated"].includes(a.status) ? 0 : 1;
      const bP = ["requires_review", "initiated"].includes(b.status) ? 0 : 1;
      if (aP !== bP) return aP - bP;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [claims, filter, search]);

  const selectedClaim = claims.find((c) => c.id === selectedId) || null;

  const handleAction = useCallback(async (claimId, action, reviewNotes) => {
    setActionLoading(true);
    try {
      // In production:
      // const { data } = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-review-claim`, {
      //   method: "POST",
      //   headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
      //   body: JSON.stringify({ claim_id: claimId, action, review_notes: reviewNotes }),
      // }).then(r => r.json());

      await new Promise((r) => setTimeout(r, 1000));

      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? {
                ...c,
                status: action === "approve" ? "completed" : "rejected",
                verification_status: action === "approve" ? "domain_verified" : "rejected",
                review_notes: reviewNotes || `${action === "approve" ? "Approved" : "Rejected"} by admin`,
                reviewed_at: new Date().toISOString(),
              }
            : c
        )
      );
    } finally {
      setActionLoading(false);
    }
  }, []);

  const filterTabs = [
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "all", label: "All", count: counts.total },
    { id: "completed", label: "Approved", count: counts.completed },
    { id: "rejected", label: "Rejected", count: counts.rejected },
  ];

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <div>
                <h1 className="text-[22px] font-semibold text-white tracking-tight">Claim Review</h1>
                <p className="text-white/35 text-[13px]">Admin Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatPill label="Pending" count={counts.pending} color="text-amber-400" />
            <StatPill label="Approved" count={counts.completed} color="text-green-400" />
            <StatPill label="Rejected" count={counts.rejected} color="text-red-400/70" />
          </div>
        </div>

        {/* Main layout: list + detail */}
        <div className="grid lg:grid-cols-5 gap-5">

          {/* LEFT: Claim list */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all ${
                    filter === tab.id
                      ? "bg-teal-500/10 text-teal-300 ring-1 ring-teal-500/20"
                      : "text-white/35 hover:text-white/55 hover:bg-white/[0.03]"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      filter === tab.id ? "bg-teal-500/20 text-teal-300" : "bg-white/[0.06] text-white/25"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search claims…"
                className="w-full pl-9 pr-3 py-2 rounded-lg text-[13px] text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-teal-500/20"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              />
            </div>

            {/* List */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              {filtered.length > 0 ? (
                <div className="divide-y divide-white/[0.04]">
                  {filtered.map((claim) => (
                    <ClaimRow
                      key={claim.id}
                      claim={claim}
                      selected={selectedId === claim.id}
                      onClick={() => setSelectedId(claim.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Icon name="shield" className="w-10 h-10 text-white/10 mb-3" />
                  <p className="text-white/35 text-[14px]">
                    {filter === "pending" ? "No pending claims" : "No claims found"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Detail panel */}
          <div
            className="lg:col-span-3 rounded-xl p-6 sticky top-6 self-start"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              minHeight: "400px",
            }}
          >
            <DetailPanel
              claim={selectedClaim}
              onAction={handleAction}
              actionLoading={actionLoading}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
