"use client";
import React, { useState } from "react";

// ═══════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════

function Icon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
    const paths: Record<string, React.ReactNode> = {
        image: <><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></>,
        plus: <><path d="M5 12h14" /><path d="M12 5v14" /></>,
        trash: <><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></>,
        star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
        upload_cloud: <><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" /></>,
        user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
        sparkles: <><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M3 5h4" /><path d="M19 17v4" /><path d="M17 19h4" /></>,
        check_circle: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
    };
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {paths[name]}
        </svg>
    );
}

// ═══════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════

const INITIAL_PHOTOS = [
    { id: "1", type: "clinic", url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80", isFeatured: true, title: "Clinic Reception" },
    { id: "2", type: "clinic", url: "https://images.unsplash.com/photo-1504439468489-c8920d786a2b?auto=format&fit=crop&w=800&q=80", isFeatured: false, title: "Operating Room" },
    { id: "5", type: "certificates", url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80", isFeatured: true, title: "JCI Accreditation" },
];

// ═══════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════

export default function PhotosPage() {
    const [activeTab, setActiveTab] = useState<"clinic" | "certificates">("clinic");
    const [photos, setPhotos] = useState(INITIAL_PHOTOS);

    // Auto-fetch simulation state
    const [isFetching, setIsFetching] = useState(false);
    const [fetchedPhotos, setFetchedPhotos] = useState<any[]>([]);

    const filteredPhotos = photos.filter(p => p.type === activeTab);

    const toggleFeatured = (id: string) => {
        setPhotos(prev => prev.map(p => {
            if (p.id === id) {
                return { ...p, isFeatured: !p.isFeatured };
            }
            return p;
        }));
    };

    const removePhoto = (id: string) => {
        setPhotos(prev => prev.filter(p => p.id !== id));
    };

    const handleAutoFetch = () => {
        setIsFetching(true);
        // Simulate a network request to Google Places / Website Scraper
        setTimeout(() => {
            setIsFetching(false);
            setFetchedPhotos([
                { id: "f1", url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80", selected: true, title: "Exterior View" },
                { id: "f2", url: "https://images.unsplash.com/photo-1538108149393-cebb47acddb2?auto=format&fit=crop&w=800&q=80", selected: true, title: "Waiting Area" },
                { id: "f3", url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80", selected: false, title: "Surgery Room" },
                { id: "f4", url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80", selected: true, title: "Front Desk" },
            ]);
        }, 2000);
    };

    const toggleFetchedSelection = (id: string) => {
        setFetchedPhotos(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
    };

    const approveFetchedPhotos = () => {
        const approved = fetchedPhotos
            .filter(p => p.selected)
            .map(p => ({
                id: `new-${p.id}`,
                type: "clinic",
                url: p.url,
                isFeatured: false,
                title: p.title
            }));

        setPhotos(prev => [...prev, ...approved]);
        setFetchedPhotos([]); // Close the approval view
    };

    if (isFetching) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                        <Icon name="sparkles" className="w-8 h-8 text-blue-400 animate-pulse" />
                    </div>
                    <h2 className="text-[20px] font-semibold text-white tracking-tight mb-2">
                        Magic is happening...
                    </h2>
                    <p className="text-white/40 text-[14px] max-w-sm">
                        We are currently scanning your Google Business Profile and website to find your best photos.
                    </p>
                </div>
            </div>
        );
    }

    if (fetchedPhotos.length > 0) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-500/10 border border-blue-500/20 p-5 rounded-xl">
                    <div>
                        <h2 className="text-[18px] font-semibold text-blue-400 tracking-tight flex items-center gap-2">
                            <Icon name="sparkles" className="w-5 h-5" />
                            We found 4 photos!
                        </h2>
                        <p className="text-white/60 text-[14px] mt-1">
                            Review the photos below. Deselect any you don't want, then click approve to add them to your gallery.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setFetchedPhotos([])}
                            className="px-4 py-2 rounded-lg text-white/50 hover:text-white transition-colors text-[14px] font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={approveFetchedPhotos}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-[14px] font-medium transition-colors"
                        >
                            Approve {fetchedPhotos.filter(p => p.selected).length} Photos
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {fetchedPhotos.map((photo) => (
                        <div
                            key={photo.id}
                            onClick={() => toggleFetchedSelection(photo.id)}
                            className={`group relative rounded-xl overflow-hidden aspect-square cursor-pointer transition-all duration-200 border-2 ${photo.selected ? "border-blue-500" : "border-transparent opacity-50 bg-white/5"
                                }`}
                        >
                            <img
                                src={photo.url}
                                alt={photo.title}
                                className="w-full h-full object-cover"
                            />
                            {photo.selected && (
                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
                                    <Icon name="check_circle" className="w-4 h-4" />
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-[13px] font-medium text-white truncate drop-shadow-md">
                                    {photo.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[24px] font-semibold text-white tracking-tight">Photos & Media</h1>
                    <p className="text-white/40 text-[15px] mt-1">
                        Upload and manage photos of your clinic facility and achievements.
                    </p>
                </div>
                {activeTab === "clinic" && (
                    <button
                        onClick={handleAutoFetch}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 text-[14px] shadow-lg shadow-blue-500/20"
                    >
                        <Icon name="sparkles" className="w-4 h-4" />
                        Auto-Fetch Photos
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-white/5 pb-px">
                <button
                    onClick={() => setActiveTab("clinic")}
                    className={`px-4 py-2.5 text-[14px] font-medium transition-colors border-b-2 ${activeTab === "clinic"
                        ? "border-teal-400 text-teal-300"
                        : "border-transparent text-white/40 hover:text-white/70"
                        }`}
                >
                    Clinic Photos
                </button>

                <button
                    onClick={() => setActiveTab("certificates")}
                    className={`px-4 py-2.5 text-[14px] font-medium transition-colors border-b-2 ${activeTab === "certificates"
                        ? "border-teal-400 text-teal-300"
                        : "border-transparent text-white/40 hover:text-white/70"
                        }`}
                >
                    Certificates & Awards
                </button>
            </div>

            {/* Upload Zone */}
            <div
                className="rounded-xl border border-dashed p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer"
                style={{
                    borderColor: "rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.01)"
                }}
                onClick={() => {
                    // Mock upload action
                    alert("Upload dialog would open here. Mocking a successful upload...");
                }}
            >
                <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mb-4">
                    <Icon name="upload_cloud" className="w-6 h-6 text-teal-400" />
                </div>
                <p className="text-[15px] font-medium text-white mb-1">
                    Click to upload {activeTab === "clinic" ? "facility photos" : "certificates or awards"}
                </p>
                <p className="text-[13px] text-white/40">
                    JPG, PNG or WEBP. Max file size 5MB.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPhotos.map((photo) => (
                    <div
                        key={photo.id}
                        className="group relative rounded-xl overflow-hidden aspect-square bg-white/5 border border-white/10"
                    >
                        {/* Image */}
                        <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity" />

                        {/* Featured Badge (Top Left) */}
                        {photo.isFeatured && (
                            <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-teal-500/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                                <Icon name="star" className="w-3 h-3 fill-current" />
                                Featured
                            </div>
                        )}

                        {/* Hover Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => removePhoto(photo.id)}
                                className="w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                title="Delete photo"
                            >
                                <Icon name="trash" className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Bottom Info & Feature Toggle */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-[13px] font-medium text-white truncate mb-2 drop-shadow-md">
                                {photo.title}
                            </p>
                            <button
                                onClick={() => toggleFeatured(photo.id)}
                                className={`w-full py-1.5 rounded-lg text-[12px] font-medium transition-colors border ${photo.isFeatured
                                    ? "bg-white/10 border-white/20 text-white"
                                    : "bg-black/40 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {photo.isFeatured ? "Unfeature" : "Set as Featured"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPhotos.length === 0 && (
                <div className="py-12 text-center text-white/30 text-[14px]">
                    No {activeTab} photos uploaded yet.
                </div>
            )}
        </div>
    );
}
