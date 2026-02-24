"use client";
import React, { useState } from "react";

// ═══════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════

function Icon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
    const paths: Record<string, React.ReactNode> = {
        bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>,
        shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></>,
        google: <><path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" /></>,
        users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
        credit_card: <><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></>
    };
    return (
        <svg className={className} viewBox="0 0 24 24" fill={name === 'google' ? "currentColor" : "none"} stroke="currentColor" strokeWidth={name === 'google' ? "0" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
            {paths[name]}
        </svg>
    );
}

// ═══════════════════════════════════════
//  TOGGLE SWITCH
// ═══════════════════════════════════════

function Toggle({ checked, onChange }: { checked: boolean, onChange: () => void }) {
    return (
        <button
            type="button"
            className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${checked ? 'bg-teal-500' : 'bg-white/10'}`}
            onClick={onChange}
        >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm ${checked ? 'left-5' : 'left-0.5'}`} />
        </button>
    );
}

// ═══════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"notifications" | "integrations" | "team" | "security">("notifications");

    // Notification State
    const [emailNewLead, setEmailNewLead] = useState(true);
    const [smsNewLead, setSmsNewLead] = useState(false);
    const [emailWeekly, setEmailWeekly] = useState(true);

    // Settings Configuration
    const TABS = [
        { id: "notifications", label: "Notifications", icon: "bell" },
        { id: "integrations", label: "Integrations & Sync", icon: "google" },
        { id: "team", label: "Team Access", icon: "users" },
        { id: "security", label: "Security & Billing", icon: "shield" },
    ] as const;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div>
                <h1 className="text-[24px] font-semibold text-white tracking-tight">Clinic Settings</h1>
                <p className="text-white/40 text-[15px] mt-1">
                    Manage your preferences, integrations, and operational rules.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Sidebar Menu */}
                <div className="w-full md:w-64 shrink-0 space-y-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors text-[14px] font-medium ${activeTab === tab.id
                                ? "bg-white/[0.08] text-white"
                                : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                                }`}
                        >
                            <Icon name={tab.icon} className={`w-4 h-4 ${activeTab === tab.id ? "text-teal-400" : "text-white/30"}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 w-full bg-white/[0.01] border border-white/[0.06] rounded-xl p-6 md:p-8 min-h-[400px]">

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === "notifications" && (
                        <div className="space-y-8 animate-in fade-in">
                            <div>
                                <h2 className="text-[18px] font-semibold text-white mb-1">Alert Preferences</h2>
                                <p className="text-[14px] text-white/40 mb-6">Choose how and when you want to be notified about patient activity.</p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                                        <div>
                                            <p className="text-[14px] font-medium text-white">Email alerts for new enquiries</p>
                                            <p className="text-[12px] text-white/40 mt-0.5">Receive an email immediately when a patient submits a lead.</p>
                                        </div>
                                        <Toggle checked={emailNewLead} onChange={() => setEmailNewLead(!emailNewLead)} />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                                        <div>
                                            <p className="text-[14px] font-medium text-white">SMS alerts for new enquiries</p>
                                            <p className="text-[12px] text-white/40 mt-0.5">Get a text message on your primary phone (Standard rates apply).</p>
                                        </div>
                                        <Toggle checked={smsNewLead} onChange={() => setSmsNewLead(!smsNewLead)} />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                                        <div>
                                            <p className="text-[14px] font-medium text-white">Weekly Performance Digest</p>
                                            <p className="text-[12px] text-white/40 mt-0.5">A summary of your profile views and competitive ranking sent every Monday.</p>
                                        </div>
                                        <Toggle checked={emailWeekly} onChange={() => setEmailWeekly(!emailWeekly)} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-lg text-[13px] font-medium transition-colors">
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    )}

                    {/* INTEGRATIONS TAB */}
                    {activeTab === "integrations" && (
                        <div className="space-y-8 animate-in fade-in">
                            <div>
                                <h2 className="text-[18px] font-semibold text-white mb-1">External Integrations</h2>
                                <p className="text-[14px] text-white/40 mb-6">Connect external services to automate your MeetYourClinic profile.</p>

                                {/* Google Reviews Sync Widget */}
                                <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                        <Icon name="google" className="w-32 h-32" />
                                    </div>

                                    <div className="flex items-center gap-3 mb-4 relative z-10">
                                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                            <Icon name="google" className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-[15px] font-semibold text-white">Google Business Profile Sync</h3>
                                            <p className="text-[13px] text-white/50">Automatically import reviews and facility photos.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 relative z-10 mt-6">
                                        <label className="text-[12px] font-medium text-white/50 block">Your Google Maps URL or Place ID</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                defaultValue="https://www.google.com/maps/place/..."
                                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-[14px] focus:outline-none focus:border-teal-500/50"
                                            />
                                            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-colors">
                                                Verify
                                            </button>
                                        </div>
                                        <p className="text-[11px] text-teal-400 mt-1 flex items-center gap-1">
                                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                            Currently actively syncing reviews
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TEAM TAB */}
                    {activeTab === "team" && (
                        <div className="space-y-8 animate-in fade-in">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-[18px] font-semibold text-white mb-1">Team Access</h2>
                                    <p className="text-[14px] text-white/40">Manage who can view enquiries and edit your clinic profile.</p>
                                </div>
                                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-colors">
                                    Invite Member
                                </button>
                            </div>

                            <div className="rounded-lg border border-white/10 overflow-x-auto text-[14px]">
                                <table className="w-full text-left min-w-[500px]">
                                    <thead className="bg-white/[0.03] border-b border-white/5">
                                        <tr>
                                            <th className="px-4 py-3 font-medium text-white/50">Name</th>
                                            <th className="px-4 py-3 font-medium text-white/50">Role</th>
                                            <th className="px-4 py-3 font-medium text-white/50">Status</th>
                                            <th className="px-4 py-3 font-medium text-white/50 w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 bg-white/[0.01]">
                                        <tr>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-white">Dr. Sarah Jenkins</div>
                                                <div className="text-[12px] text-white/40">sarah@clinic.com</div>
                                            </td>
                                            <td className="px-4 py-3 text-white/80">Admin (Owner)</td>
                                            <td className="px-4 py-3 text-teal-400">Active</td>
                                            <td className="px-4 py-3"></td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-white">Jessica Martinez</div>
                                                <div className="text-[12px] text-white/40">frontdesk@clinic.com</div>
                                            </td>
                                            <td className="px-4 py-3 text-white/80">Receptionist</td>
                                            <td className="px-4 py-3 text-teal-400">Active</td>
                                            <td className="px-4 py-3">
                                                <button className="text-white/30 hover:text-white">Edit</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === "security" && (
                        <div className="space-y-8 animate-in fade-in flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
                                <Icon name="shield" className="w-8 h-8" />
                            </div>
                            <h2 className="text-[18px] font-semibold text-white mb-2">Advanced Security & Billing</h2>
                            <p className="text-[14px] text-white/40 max-w-sm">
                                Standard security features are active on your account. To change billing details or delete your clinic profile, please contact support.
                            </p>
                            <button className="mt-4 border border-white/10 hover:bg-white/5 text-white px-5 py-2 rounded-lg text-[13px] font-medium transition-colors">
                                Contact Support
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
