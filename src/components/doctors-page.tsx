"use client";
import React, { useState } from "react";

// ═══════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════

function Icon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
    const paths: Record<string, React.ReactNode> = {
        plus: <><path d="M5 12h14" /><path d="M12 5v14" /></>,
        trash: <><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></>,
        edit: <><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></>,
        camera: <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></>,
        stethoscope: <><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" /></>,
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

const INITIAL_DOCTORS = [
    {
        id: "d1",
        name: "Dr. Sarah Jenkins",
        title: "Lead Cosmetic Surgeon",
        specialisation: "Facial Reconstruction",
        yearsExperience: 12,
        photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
        bio: "Dr. Jenkins specializes in advanced facial reconstruction and rhinoplasty.",
        qualifications: "MD, Board Certified Plastic Surgeon"
    },
    {
        id: "d2",
        name: "Dr. Ahmed Ali",
        title: "Senior Dentist",
        specialisation: "Implantology",
        yearsExperience: 8,
        photoUrl: "https://images.unsplash.com/photo-1594824432258-f9b885b5465c?auto=format&fit=crop&w=400&q=80",
        bio: "Dr. Ali is an expert in full-mouth restorations and dental implants.",
        qualifications: "DDS, MSc Implantology"
    }
];

// ═══════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const removeDoctor = (id: string) => {
        if (confirm("Are you sure you want to remove this team member?")) {
            setDoctors(prev => prev.filter(d => d.id !== id));
        }
    };

    const addDoctor = () => {
        const newDoctor = {
            id: `new-${Date.now()}`,
            name: "New Doctor",
            title: "",
            specialisation: "",
            yearsExperience: 0,
            photoUrl: "",
            bio: "",
            qualifications: ""
        };
        setDoctors(prev => [...prev, newDoctor]);
        setIsEditing(newDoctor.id);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[24px] font-semibold text-white tracking-tight">Doctors & Team</h1>
                    <p className="text-white/40 text-[15px] mt-1">
                        Manage your medical staff profiles, bios, and specialties.
                    </p>
                </div>
                <button
                    onClick={addDoctor}
                    className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-[14px]"
                >
                    <Icon name="plus" className="w-4 h-4" />
                    Add Team Member
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {doctors.map((doc) => (
                    <div
                        key={doc.id}
                        className="rounded-xl border flex flex-col overflow-hidden transition-all duration-200"
                        style={{
                            background: "rgba(255,255,255,0.02)",
                            borderColor: "rgba(255,255,255,0.06)"
                        }}
                    >
                        {isEditing === doc.id ? (
                            <div className="p-5 flex flex-col gap-4">
                                <div>
                                    <label className="text-[12px] font-medium text-white/50 mb-1 block">Full Name</label>
                                    <input
                                        type="text"
                                        value={doc.name}
                                        onChange={(e) => setDoctors(prev => prev.map(d => d.id === doc.id ? { ...d, name: e.target.value } : d))}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-[14px] focus:outline-none focus:border-teal-500/50"
                                        placeholder="Dr. Jane Doe"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[12px] font-medium text-white/50 mb-1 block">Title / Role</label>
                                        <input
                                            type="text"
                                            value={doc.title}
                                            onChange={(e) => setDoctors(prev => prev.map(d => d.id === doc.id ? { ...d, title: e.target.value } : d))}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-[14px] focus:outline-none focus:border-teal-500/50"
                                            placeholder="Lead Surgeon"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[12px] font-medium text-white/50 mb-1 block">Yrs Experience</label>
                                        <input
                                            type="number"
                                            value={doc.yearsExperience}
                                            onChange={(e) => setDoctors(prev => prev.map(d => d.id === doc.id ? { ...d, yearsExperience: parseInt(e.target.value) || 0 } : d))}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-[14px] focus:outline-none focus:border-teal-500/50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[12px] font-medium text-white/50 mb-1 block">Specialisation</label>
                                    <input
                                        type="text"
                                        value={doc.specialisation}
                                        onChange={(e) => setDoctors(prev => prev.map(d => d.id === doc.id ? { ...d, specialisation: e.target.value } : d))}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-[14px] focus:outline-none focus:border-teal-500/50"
                                        placeholder="e.g. Implantology"
                                    />
                                </div>
                                <div>
                                    <label className="text-[12px] font-medium text-white/50 mb-1 block">Qualifications</label>
                                    <input
                                        type="text"
                                        value={doc.qualifications}
                                        onChange={(e) => setDoctors(prev => prev.map(d => d.id === doc.id ? { ...d, qualifications: e.target.value } : d))}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-[14px] focus:outline-none focus:border-teal-500/50"
                                        placeholder="MD, Board Certified..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[12px] font-medium text-white/50 mb-1 block">Biography</label>
                                    <textarea
                                        value={doc.bio}
                                        onChange={(e) => setDoctors(prev => prev.map(d => d.id === doc.id ? { ...d, bio: e.target.value } : d))}
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-[14px] focus:outline-none focus:border-teal-500/50 resize-none resize-y"
                                        placeholder="A short bio about the doctor's expertise..."
                                    />
                                </div>
                                <div className="pt-2 flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => setIsEditing(null)}
                                        className="px-4 py-2 rounded-lg text-white bg-teal-500 hover:bg-teal-600 font-medium text-[13px] transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* View Mode Header / Image */}
                                <div className="h-[180px] w-full bg-white/5 border-b border-white/5 relative group cursor-pointer"
                                    onClick={() => alert("Upload new headshot")}
                                >
                                    {doc.photoUrl ? (
                                        <img src={doc.photoUrl} alt={doc.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                                            <Icon name="camera" className="w-8 h-8 mb-2" />
                                            <span className="text-[12px] font-medium">Add Headshot</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-lg text-[13px] font-medium flex items-center gap-2">
                                            <Icon name="camera" className="w-4 h-4" />
                                            Change Photo
                                        </span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-[16px] font-bold text-white leading-tight">{doc.name}</h3>
                                            <p className="text-teal-400 text-[13px] font-medium mt-0.5 tracking-wide">{doc.title}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => setIsEditing(doc.id)}
                                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                                            >
                                                <Icon name="edit" className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => removeDoctor(doc.id)}
                                                className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-500 transition-colors"
                                            >
                                                <Icon name="trash" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        {/* Meta row */}
                                        <div className="flex items-center gap-4 text-[12px] text-white/40">
                                            {doc.yearsExperience > 0 && (
                                                <span className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                                    {doc.yearsExperience} yrs exp
                                                </span>
                                            )}
                                            {doc.specialisation && (
                                                <span className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                                    {doc.specialisation}
                                                </span>
                                            )}
                                        </div>

                                        {/* Qualifications */}
                                        {doc.qualifications && (
                                            <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2 text-[12px] text-white/70">
                                                <span className="text-white/40 font-medium block mb-0.5 text-[10px] uppercase tracking-wider">Qualifications</span>
                                                {doc.qualifications}
                                            </div>
                                        )}

                                        {/* Bio */}
                                        {doc.bio && (
                                            <p className="text-[13px] text-white/50 leading-relaxed line-clamp-3">
                                                {doc.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {doctors.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
                        <Icon name="stethoscope" className="w-8 h-8" />
                    </div>
                    <p className="text-white/70 font-medium text-[15px] mb-1">No team members added</p>
                    <p className="text-white/30 text-[14px]">Add doctors to showcase your clinic's expertise.</p>
                </div>
            )}
        </div>
    );
}
