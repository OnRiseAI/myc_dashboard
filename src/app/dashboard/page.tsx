"use client";

import { useClinic } from "@/hooks/use-clinic-data";
import { useRouter } from "next/navigation";

// ═══════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════

function Icon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    eye: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>),
    inbox: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>),
    stethoscope: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" /></svg>),
    users: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>),
    check: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>),
    chevron_right: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>),
    building: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" /></svg>),
    image: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>),
    bar_chart: (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></svg>),
  };
  return <>{icons[name] || null}</>;
}

// ═══════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════

function StatCard({ label, value, icon, trend, accent = "teal" }: { label: string; value: string | number; icon: string; trend?: string; accent?: "teal" | "amber" | "blue" | "purple" }) {
  const accentMap = {
    teal: { bg: "rgba(20,184,166,0.08)", border: "rgba(20,184,166,0.12)", text: "text-teal-400", icon: "text-teal-400/60" },
    amber: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.12)", text: "text-amber-400", icon: "text-amber-400/60" },
    blue: { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.12)", text: "text-blue-400", icon: "text-blue-400/60" },
    purple: { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.12)", text: "text-purple-400", icon: "text-purple-400/60" },
  };
  const a = accentMap[accent];
  return (
    <div className="rounded-xl p-5 transition-all duration-200 hover:translate-y-[-1px]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: a.bg, border: `1px solid ${a.border}` }}>
          <Icon name={icon} className={`w-[18px] h-[18px] ${a.icon}`} />
        </div>
        {trend && <span className={`text-[12px] font-medium ${a.text}`}>{trend}</span>}
      </div>
      <p className="text-[26px] font-semibold text-white tracking-tight">{value}</p>
      <p className="text-[13px] text-white/40 mt-0.5">{label}</p>
    </div>
  );
}

function CompletenessRing({ percentage }: { percentage: number }) {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 80 ? "#14b8a6" : percentage >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[22px] font-bold text-white">{percentage}%</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  OVERVIEW PAGE
// ═══════════════════════════════════════

export default function OverviewPage() {
  const { clinic } = useClinic();
  const router = useRouter();

  if (!clinic) return null;

  const fields = [
    { label: "Clinic description", done: !!clinic.description, page: "/dashboard/profile" },
    { label: "Contact phone number", done: !!clinic.phone, page: "/dashboard/profile" },
    { label: "Contact email", done: !!clinic.email, page: "/dashboard/profile" },
    { label: "Clinic address", done: !!clinic.address, page: "/dashboard/profile" },
    { label: "At least one doctor", done: (clinic.doctor_count || 0) > 0, page: "/dashboard/doctors" },
    { label: "At least one photo", done: false, page: "/dashboard/photos" },
    { label: "Website URL", done: !!clinic.website_url, page: "/dashboard/profile" },
    { label: "Specialties listed", done: (clinic.specialties?.length || 0) > 0, page: "/dashboard/profile" },
  ];
  const doneCount = fields.filter((f) => f.done).length;
  const percentage = Math.round((doneCount / fields.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-semibold text-white tracking-tight">Welcome back</h1>
        <p className="text-white/40 text-[15px] mt-1">Here&apos;s an overview of your clinic&apos;s performance and profile.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Profile Views" value="—" icon="eye" accent="teal" />
        <StatCard label="Enquiries" value={clinic.enquiry_count || clinic.lead_count || 0} icon="inbox" accent="blue" />
        <StatCard label="Listed Procedures" value={clinic.procedure_count || 0} icon="stethoscope" accent="purple" />
        <StatCard label="Team Members" value={clinic.doctor_count || 0} icon="users" accent="amber" />
      </div>

      {/* Completeness + Quick Actions */}
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 rounded-xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="text-[16px] font-semibold text-white mb-5">Profile Completeness</h2>
          <div className="flex items-center gap-6 mb-5">
            <CompletenessRing percentage={percentage} />
            <div>
              <p className="text-[14px] text-white/60">{doneCount} of {fields.length} completed</p>
              <p className="text-[12px] text-white/30 mt-1">
                {percentage >= 80 ? "Your profile is looking great!" : "Complete your profile to attract more patients."}
              </p>
            </div>
          </div>
          <div className="space-y-0.5">
            {fields.map((f, i) => (
              <button
                key={i}
                onClick={() => !f.done && router.push(f.page)}
                className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors hover:bg-white/[0.03] text-left group"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${f.done ? "bg-teal-500/20 border border-teal-500/30" : "border border-white/10 group-hover:border-white/20"}`}>
                  {f.done && <Icon name="check" className="w-3 h-3 text-teal-400" />}
                </div>
                <span className={`text-[13px] ${f.done ? "text-white/40 line-through" : "text-white/60"}`}>{f.label}</span>
                {!f.done && <Icon name="chevron_right" className="w-3.5 h-3.5 text-white/15 ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="lg:col-span-3 rounded-xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="text-[16px] font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Edit Profile", icon: "building", page: "/dashboard/profile" },
              { label: "Add Photos", icon: "image", page: "/dashboard/photos" },
              { label: "Manage Doctors", icon: "stethoscope", page: "/dashboard/doctors" },
              { label: "View Analytics", icon: "bar_chart", page: "/dashboard/analytics" },
            ].map((action) => (
              <button
                key={action.page}
                onClick={() => router.push(action.page)}
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
  );
}
