"use client";
import React, { useState } from "react";

// ═══════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════

function Icon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
    const paths: Record<string, React.ReactNode> = {
        arrow_up: <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>,
        arrow_down: <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>,
        users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
        mouse_pointer: <><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /><path d="m13 13 6 6" /></>,
        calendar: <><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></>,
        globe: <><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></>
    };
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {paths[name]}
        </svg>
    );
}

// ═══════════════════════════════════════
//  MOCK DATA & CHART UTILS
// ═══════════════════════════════════════

const MOCK_TRAFFIC_DATA = [
    { day: "01", views: 120, enquiries: 4 },
    { day: "04", views: 132, enquiries: 5 },
    { day: "07", views: 101, enquiries: 2 },
    { day: "10", views: 164, enquiries: 8 },
    { day: "13", views: 190, enquiries: 11 },
    { day: "16", views: 230, enquiries: 15 },
    { day: "19", views: 210, enquiries: 12 },
    { day: "22", views: 250, enquiries: 18 },
    { day: "25", views: 280, enquiries: 22 },
    { day: "28", views: 310, enquiries: 25 },
    { day: "30", views: 350, enquiries: 29 },
];

const MOCK_COUNTRIES = [
    { name: "United Kingdom", percentage: 45, color: "bg-teal-400" },
    { name: "United States", percentage: 25, color: "bg-blue-400" },
    { name: "Germany", percentage: 15, color: "bg-purple-400" },
    { name: "Canada", percentage: 10, color: "bg-amber-400" },
    { name: "Other", percentage: 5, color: "bg-white/20" },
];

function StatCard({ label, value, trend, isPositive, icon, accentColor }: any) {
    return (
        <div className="rounded-xl border p-5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors border-white/[0.06]">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}>
                    <Icon name={icon} className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-[12px] font-medium px-2 py-1 rounded-full ${isPositive ? 'text-teal-400 bg-teal-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    <Icon name={isPositive ? "arrow_up" : "arrow_down"} className="w-3 h-3" />
                    {trend}
                </div>
            </div>
            <p className="text-[28px] font-bold text-white tracking-tight leading-none mb-1">{value}</p>
            <p className="text-[13px] text-white/40 font-medium">{label}</p>
        </div>
    );
}

// ═══════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("30d");

    // Calculate max values for the chart
    const maxViews = Math.max(...MOCK_TRAFFIC_DATA.map(d => d.views));
    const maxEnquiries = Math.max(...MOCK_TRAFFIC_DATA.map(d => d.enquiries));

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[24px] font-semibold text-white tracking-tight">Analytics Dashboard</h1>
                    <p className="text-white/40 text-[15px] mt-1">
                        Track your profile performance and passenger conversions.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                    <button onClick={() => setTimeRange("7d")} className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${timeRange === "7d" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}>7 Days</button>
                    <button onClick={() => setTimeRange("30d")} className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${timeRange === "30d" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}>30 Days</button>
                    <button onClick={() => setTimeRange("all")} className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${timeRange === "all" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}>All Time</button>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    label="Profile Views"
                    value="2,341"
                    trend="12.5%"
                    isPositive={true}
                    icon="mouse_pointer"
                    accentColor="#3b82f6"
                />
                <StatCard
                    label="Total Enquiries"
                    value="151"
                    trend="24.1%"
                    isPositive={true}
                    icon="users"
                    accentColor="#14b8a6"
                />
                <StatCard
                    label="Conversion Rate"
                    value="6.4%"
                    trend="1.2%"
                    isPositive={false}
                    icon="calendar"
                    accentColor="#a855f7"
                />
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Traffic Overview Chart (Takes up 2/3) */}
                <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.01] p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-[16px] font-medium text-white">Traffic & Conversions</h3>
                            <p className="text-[13px] text-white/40 mt-1">Daily profile views vs enquiries received.</p>
                        </div>
                        <div className="flex items-center gap-4 text-[12px] font-medium">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-white/60">Views</span></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-400"></div><span className="text-white/60">Enquiries</span></div>
                        </div>
                    </div>

                    {/* CSS Box Chart Implementation */}
                    <div className="h-[250px] mt-4 flex items-end justify-between gap-2 relative">
                        {/* Y-Axis Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            <div className="border-t border-white/5 w-full h-0"></div>
                            <div className="border-t border-white/5 w-full h-0"></div>
                            <div className="border-t border-white/5 w-full h-0"></div>
                            <div className="border-t border-white/5 w-full h-0"></div>
                        </div>

                        {/* Bars */}
                        {MOCK_TRAFFIC_DATA.map((data, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1 group relative h-full z-10">
                                {/* Tooltip */}
                                <div className="absolute -top-10 bg-gray-900 border border-white/10 text-white rounded px-2 py-1 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-xl">
                                    {data.views} views • {data.enquiries} enq
                                </div>

                                <div className="w-full flex items-end justify-center gap-[2px] h-[90%]">
                                    <div
                                        className="w-1/2 bg-blue-500/80 rounded-t-sm transition-all duration-500 group-hover:bg-blue-400"
                                        style={{ height: `${(data.views / maxViews) * 100}%` }}
                                    ></div>
                                    <div
                                        className="w-1/2 bg-teal-400/80 rounded-t-sm transition-all duration-500 group-hover:bg-teal-300"
                                        style={{ height: `${(data.enquiries / maxViews) * 100}%` }} // Share the same Y axis scale roughly
                                    ></div>
                                </div>
                                <span className="text-[11px] text-white/30 font-medium mt-2">Oct {data.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Patient Demographics (Takes up 1/3) */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <Icon name="globe" className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-[16px] font-medium text-white">Patient Demographics</h3>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <div className="space-y-5">
                            {MOCK_COUNTRIES.map((country, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-1.5">
                                        <span className="text-[13px] font-medium text-white/80">{country.name}</span>
                                        <span className="text-[12px] font-bold text-white">{country.percentage}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${country.color}`}
                                            style={{ width: `${country.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
