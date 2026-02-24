"use client";
import React, { useState } from "react";

// ═══════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════

function Icon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
    const paths: Record<string, React.ReactNode> = {
        star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
        star_half: <><path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2v15.8z" /></>,
        refresh: <><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21v-5h5" /></>,
        google: <><path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" /></>,
        message: <><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></>,
        link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>
    };
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={name === 'google' || name.startsWith('star') ? "0" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
            {paths[name]}
        </svg>
    );
}

// ═══════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════

const MOCK_REVIEWS = {
    rating: 4.8,
    review_count: 124,
    last_fetched: "2023-10-27T14:32:00Z",
    source_url: "https://google.com/maps/place/...",
    reviews: [
        {
            id: "r1",
            author_name: "Emma Thompson",
            profile_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop",
            rating: 5,
            text: "Incredible experience from start to finish. The team made me feel completely at ease about traveling for my procedure. The facility was spotless, and the staff's English was perfect. Highly recommend!",
            relative_time_description: "2 weeks ago"
        },
        {
            id: "r2",
            author_name: "James Wilson",
            profile_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop",
            rating: 5,
            text: "Dr. Jenkins is an absolute artist. I couldn't be happier with my results. The aftercare was also exceptional, with daily check-ins via WhatsApp.",
            relative_time_description: "1 month ago"
        },
        {
            id: "r3",
            author_name: "Sophia Martinez",
            profile_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop",
            rating: 4,
            text: "Very professional clinic. The only reason for 4 stars instead of 5 is that my initial consultation was delayed by 30 minutes. Once seen, the service was excellent.",
            relative_time_description: "2 months ago"
        },
        {
            id: "r4",
            author_name: "Oliver Brown",
            profile_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop",
            rating: 5,
            text: "Traveling abroad for dental implants was daunting, but MeetYourClinic connected me with this amazing team. Saved thousands and got top-tier care.",
            relative_time_description: "3 months ago"
        }
    ]
};

// ═══════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════

export default function ReviewsPage() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState(MOCK_REVIEWS.last_fetched);

    const handleSync = () => {
        if (isSyncing) return;
        setIsSyncing(true);
        // Simulate network request
        setTimeout(() => {
            setIsSyncing(false);
            setLastSynced(new Date().toISOString());
        }, 1500);
    };

    // Helper to render stars
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => {
                    const isFull = i < Math.floor(rating);
                    const isHalf = !isFull && i < Math.ceil(rating);
                    return (
                        <Icon
                            key={i}
                            name={isFull ? "star" : isHalf ? "star_half" : "star"}
                            className={`w-[14px] h-[14px] ${isFull || isHalf ? "text-amber-400" : "text-white/10"}`}
                        />
                    );
                })}
            </div>
        );
    };

    // Format relative time for the "last synced" display
    const timeSinceSync = () => {
        const syncDate = new Date(lastSynced);
        const now = new Date();
        const diffHours = Math.floor((now.getTime() - syncDate.getTime()) / (1000 * 60 * 60));

        if (diffHours < 1) return "Just now";
        if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
        return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) === 1 ? '' : 's'} ago`;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-[24px] font-semibold text-white tracking-tight">Patient Reviews</h1>
                    <p className="text-white/40 text-[15px] mt-1 max-w-xl">
                        Monitor your public reputation. We automatically sync your reviews from Google Business Profile to display on your MeetYourClinic listing.
                    </p>
                </div>

                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    <Icon name="refresh" className={`w-4 h-4 text-white/70 ${isSyncing ? "animate-spin" : ""}`} />
                    {isSyncing ? "Syncing..." : "Sync with Google"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

                {/* Left Column: Review Feed */}
                <div className="space-y-4 rounded-xl border p-1" style={{ background: "rgba(255,255,255,0.01)", borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-[15px] font-medium text-white flex items-center gap-2">
                            <Icon name="message" className="w-4 h-4 text-white/40" />
                            Latest Patient Reviews
                        </h2>
                        <span className="text-[12px] text-white/40 font-medium bg-white/5 px-2 py-1 rounded-md">
                            Showing {MOCK_REVIEWS.reviews.length} of {MOCK_REVIEWS.review_count}
                        </span>
                    </div>

                    <div className="p-2 space-y-2">
                        {MOCK_REVIEWS.reviews.map((review) => (
                            <div key={review.id} className="p-5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={review.profile_photo_url}
                                            alt={review.author_name}
                                            className="w-10 h-10 rounded-full bg-white/10 object-cover"
                                        />
                                        <div>
                                            <p className="text-[14px] font-medium text-white/90">{review.author_name}</p>
                                            <p className="text-[12px] text-white/40">{review.relative_time_description}</p>
                                        </div>
                                    </div>

                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Icon name="google" className="w-4 h-4 text-white/30" />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    {renderStars(review.rating)}
                                </div>

                                <p className="text-[14px] text-white/70 leading-relaxed italic">
                                    "{review.text}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Stats & Setup */}
                <div className="space-y-4">
                    {/* Stats Card */}
                    <div className="rounded-xl border p-5 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                        {/* Decorative background logo */}
                        <Icon name="google" className="w-40 h-40 absolute -bottom-10 -right-10 text-white/[0.02] pointer-events-none" />

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                <Icon name="google" className="w-5 h-5 text-white/80" />
                            </div>
                            <span className="text-[11px] font-medium text-white/40 flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? "bg-amber-400 animate-pulse" : "bg-teal-400"}`} />
                                {isSyncing ? "Syncing..." : `Synced: ${timeSinceSync()}`}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[12px] text-white/40 uppercase tracking-widest font-semibold mb-1">Average Rating</p>
                                <div className="flex items-end gap-3">
                                    <span className="text-[36px] font-bold text-white leading-none tracking-tighter">{MOCK_REVIEWS.rating}</span>
                                    <div className="pb-1">
                                        {renderStars(MOCK_REVIEWS.rating)}
                                    </div>
                                </div>
                            </div>

                            <div className="h-px w-full bg-white/5" />

                            <div>
                                <p className="text-[12px] text-white/40 uppercase tracking-widest font-semibold mb-1">Total Reviews</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[24px] font-semibold text-white leading-none tracking-tight">{MOCK_REVIEWS.review_count}</span>
                                    <span className="text-[12px] text-white/40">Verified Patients</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Source Link Card */}
                    <div className="rounded-xl border p-5" style={{ background: "rgba(255,255,255,0.01)", borderColor: "rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center gap-2 mb-3">
                            <Icon name="link" className="w-4 h-4 text-white/40" />
                            <h3 className="text-[14px] font-medium text-white">Review Source</h3>
                        </div>
                        <p className="text-[13px] text-white/50 mb-4 leading-relaxed">
                            Your reviews are currently being pulled from your connected Google Business Profile.
                        </p>
                        <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between group cursor-pointer border border-transparent hover:border-white/10 transition-colors">
                            <div className="min-w-0 pr-4">
                                <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-0.5">Connected Account</p>
                                <p className="text-[13px] font-medium text-white/80 truncate">Google Maps Profile</p>
                            </div>
                            <span className="text-teal-400 text-[12px] font-medium shrink-0">Connected</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
