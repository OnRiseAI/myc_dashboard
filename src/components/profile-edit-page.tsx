"use client";
import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════

function Icon({ name, className = "w-5 h-5" }) {
  const paths = {
    building: <><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" /></>,
    map_pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></>,
    mail: <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></>,
    heart: <><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
    languages: <><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></>,
    credit_card: <><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></>,
    plane: <><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></>,
    car: <><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" /><circle cx="6.5" cy="16.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" /></>,
    message_circle: <><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></>,
    check: <><polyline points="20 6 9 17 4 12" /></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></>,
    x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
    plus: <><path d="M5 12h14" /><path d="M12 5v14" /></>,
    info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>,
    eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    loader: <><line x1="12" x2="12" y1="2" y2="6" /><line x1="12" x2="12" y1="18" y2="22" /><line x1="4.93" x2="7.76" y1="4.93" y2="7.76" /><line x1="16.24" x2="19.07" y1="16.24" y2="19.07" /><line x1="2" x2="6" y1="12" y2="12" /><line x1="18" x2="22" y1="12" y2="12" /><line x1="4.93" x2="7.76" y1="19.07" y2="16.24" /><line x1="16.24" x2="19.07" y1="7.76" y2="4.93" /></>,
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

// ═══════════════════════════════════════
//  FORM COMPONENTS
// ═══════════════════════════════════════

function SectionHeader({ icon, title, description }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.12)" }}
      >
        <Icon name={icon} className="w-[18px] h-[18px] text-teal-400/60" />
      </div>
      <div>
        <h2 className="text-[16px] font-semibold text-white">{title}</h2>
        <p className="text-[13px] text-white/35 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function Field({ label, hint = undefined, children, required = false, span = 1 }) {
  return (
    <div className={span === 2 ? "sm:col-span-2" : ""}>
      <label className="block text-[13px] font-medium text-white/50 mb-1.5">
        {label}
        {required && <span className="text-teal-400/60 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[11px] text-white/25">{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", ...props }) {
  return (
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-lg text-[14px] text-white placeholder-white/20 outline-none transition-all duration-150 focus:ring-2 focus:ring-teal-500/25"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      {...props}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 4, maxLength, ...props }) {
  return (
    <div className="relative">
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-3.5 py-2.5 rounded-lg text-[14px] text-white placeholder-white/20 outline-none transition-all duration-150 resize-none focus:ring-2 focus:ring-teal-500/25"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
        {...props}
      />
      {maxLength && (
        <span className="absolute bottom-2.5 right-3 text-[11px] text-white/15">
          {(value || "").length}/{maxLength}
        </span>
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 py-2 group"
    >
      <div
        className={`w-10 h-[22px] rounded-full relative transition-colors duration-200 ${
          checked ? "bg-teal-500/30" : "bg-white/[0.08]"
        }`}
      >
        <div
          className={`absolute top-[3px] w-4 h-4 rounded-full transition-all duration-200 ${
            checked ? "left-[22px] bg-teal-400" : "left-[3px] bg-white/30"
          }`}
        />
      </div>
      <span className="text-[13px] text-white/50 group-hover:text-white/70 transition-colors">{label}</span>
    </button>
  );
}

function TagInput({ tags, onChange, placeholder, suggestions = [] }) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
    setShowSuggestions(false);
  };

  const removeTag = (idx) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  );

  return (
    <div className="relative">
      <div
        className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg min-h-[42px]"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[12px] font-medium text-teal-300"
            style={{ background: "rgba(20,184,166,0.12)", border: "1px solid rgba(20,184,166,0.2)" }}
          >
            {tag}
            <button onClick={() => removeTag(i)} className="hover:text-white transition-colors">
              <Icon name="x" className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) { e.preventDefault(); addTag(input); }
            if (e.key === "Backspace" && !input && tags.length) removeTag(tags.length - 1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={tags.length ? "" : placeholder}
          className="flex-1 min-w-[100px] bg-transparent text-[13px] text-white placeholder-white/20 outline-none py-1 px-1"
        />
      </div>
      {showSuggestions && input && filtered.length > 0 && (
        <div
          className="absolute z-10 mt-1 w-full rounded-lg overflow-hidden max-h-[160px] overflow-y-auto"
          style={{
            background: "rgba(15,25,45,0.98)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
          }}
        >
          {filtered.slice(0, 6).map((s) => (
            <button
              key={s}
              onMouseDown={() => addTag(s)}
              className="w-full text-left px-3 py-2 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
//  SAVE BAR
// ═══════════════════════════════════════

function SaveBar({ hasChanges, saving, onSave, onDiscard }) {
  if (!hasChanges) return null;

  return (
    <div
      className="fixed bottom-0 left-0 lg:left-[260px] right-0 z-20 animate-[slideUp_0.3s_ease-out]"
      style={{
        background: "rgba(10,22,40,0.95)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(20,184,166,0.15)",
      }}
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[13px] text-white/50">Unsaved changes</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onDiscard}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-white/50 hover:text-white/70 transition-colors disabled:opacity-40"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Discard
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-[13px] font-medium text-white flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-teal-500/15 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
              border: "1px solid rgba(20,184,166,0.3)",
            }}
          >
            {saving ? (
              <>
                <Icon name="loader" className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Icon name="save" className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  SUCCESS TOAST
// ═══════════════════════════════════════

function Toast({ message, visible }) {
  if (!visible) return null;
  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl animate-[slideDown_0.3s_ease-out] shadow-xl"
      style={{
        background: "rgba(20,184,166,0.15)",
        border: "1px solid rgba(20,184,166,0.25)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Icon name="check" className="w-4 h-4 text-teal-400" />
      <span className="text-[13px] text-teal-200 font-medium">{message}</span>
    </div>
  );
}

// ═══════════════════════════════════════
//  COMMON DATA
// ═══════════════════════════════════════

const LANGUAGE_SUGGESTIONS = [
  "English", "Turkish", "Arabic", "German", "French", "Spanish", "Russian",
  "Chinese", "Japanese", "Korean", "Portuguese", "Italian", "Dutch", "Polish",
  "Hindi", "Persian", "Hebrew", "Thai", "Vietnamese", "Romanian", "Hungarian"
];

const PAYMENT_SUGGESTIONS = [
  "Credit Card", "Debit Card", "Bank Transfer", "Cash", "PayPal",
  "Medical Finance", "Insurance", "Cryptocurrency", "Apple Pay", "Google Pay"
];

const SPECIALTY_SUGGESTIONS = [
  "Hair Transplant", "Dental", "Cosmetic Surgery", "Rhinoplasty", "Breast Surgery",
  "Liposuction", "BBL", "Bariatric Surgery", "LASIK", "IVF", "Orthopaedics",
  "Cardiology", "Dermatology", "Oncology", "Veneers", "Dental Implants",
  "Facelift", "Tummy Tuck", "Weight Loss Surgery", "Spine Surgery"
];

// ═══════════════════════════════════════
//  MAIN PROFILE EDIT PAGE
// ═══════════════════════════════════════

export default function ProfileEditPage({ clinic: initialClinic, onNavigate }) {
  // In production, `initialClinic` is passed from the dashboard parent
  // or fetched via Supabase using the owner's clinic_id

  const [form, setForm] = useState({
    name: "",
    description_short: "",
    description: "",
    address: "",
    website_url: "",
    email: "",
    phone: "",
    whatsapp: "",
    year_founded: "",
    patients_per_year: "",
    num_doctors: "",
    primary_specialty: "",
    specialties: [],
    languages_spoken: [],
    accepted_payment_methods: [],
    offers_accommodation: false,
    offers_transfers: false,
    offers_translator: false,
    meta_title: "",
    meta_description: "",
  });

  const [originalForm, setOriginalForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);
  const formRef = useRef(null);

  // Initialize from clinic data
  useEffect(() => {
    if (initialClinic) {
      const loaded = {
        name: initialClinic.name || "",
        description_short: initialClinic.description_short || "",
        description: initialClinic.description || "",
        address: initialClinic.address || "",
        website_url: initialClinic.website_url || "",
        email: initialClinic.email || "",
        phone: initialClinic.phone || "",
        whatsapp: initialClinic.whatsapp || "",
        year_founded: initialClinic.year_founded || "",
        patients_per_year: initialClinic.patients_per_year || "",
        num_doctors: initialClinic.num_doctors || "",
        primary_specialty: initialClinic.primary_specialty || "",
        specialties: initialClinic.specialties || [],
        languages_spoken: initialClinic.languages_spoken || [],
        accepted_payment_methods: initialClinic.accepted_payment_methods || [],
        offers_accommodation: initialClinic.offers_accommodation || false,
        offers_transfers: initialClinic.offers_transfers || false,
        offers_translator: initialClinic.offers_translator || false,
        meta_title: initialClinic.meta_title || "",
        meta_description: initialClinic.meta_description || "",
      };
      setForm(loaded);
      setOriginalForm(loaded);
    }
  }, [initialClinic]);

  const update = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const hasChanges = originalForm && JSON.stringify(form) !== JSON.stringify(originalForm);

  const handleSave = async () => {
    setSaving(true);
    try {
      // In production: call Supabase to update the clinic
      // const { error } = await supabase
      //   .from('clinics')
      //   .update({ ...form, updated_at: new Date().toISOString() })
      //   .eq('id', initialClinic.id);

      // Simulate save
      await new Promise((r) => setTimeout(r, 1200));
      setOriginalForm({ ...form });
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (originalForm) setForm({ ...originalForm });
  };

  return (
    <div className="pb-20" ref={formRef}>
      <Toast message="Profile saved successfully" visible={toast} />

      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-semibold text-white tracking-tight">Clinic Profile</h1>
          <p className="text-white/40 text-[15px] mt-1">
            Manage your clinic's public information and details.
          </p>
        </div>
        <a
          href={`https://meetyourclinic.com/clinics/${initialClinic?.slug || ""}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] text-white/45 hover:text-white/65 transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Icon name="eye" className="w-4 h-4" />
          Preview Listing
        </a>
      </div>

      <div className="space-y-8">

        {/* ── Section 1: Basic Information ── */}
        <section
          className="rounded-xl p-6"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <SectionHeader
            icon="building"
            title="Basic Information"
            description="Your clinic's name and descriptions displayed on your public listing."
          />
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Clinic Name" required span={2}>
              <TextInput value={form.name} onChange={(v) => update("name", v)} placeholder="e.g. Istanbul Smile Centre" />
            </Field>
            <Field label="Short Description" hint="Displayed on search results and cards. Max 180 chars." span={2}>
              <TextArea
                value={form.description_short}
                onChange={(v) => update("description_short", v)}
                placeholder="A brief summary of your clinic's expertise…"
                rows={2}
                maxLength={180}
              />
            </Field>
            <Field label="Full Description" hint="Your detailed clinic overview. Shown on your listing page." span={2}>
              <TextArea
                value={form.description}
                onChange={(v) => update("description", v)}
                placeholder="Describe your clinic's history, facilities, technology, patient experience…"
                rows={6}
                maxLength={2000}
              />
            </Field>
          </div>
        </section>

        {/* ── Section 2: Location & Contact ── */}
        <section
          className="rounded-xl p-6"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <SectionHeader
            icon="map_pin"
            title="Location & Contact"
            description="How patients can find and reach your clinic."
          />
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Address" span={2}>
              <TextInput value={form.address} onChange={(v) => update("address", v)} placeholder="Full clinic address" />
            </Field>
            <Field label="Email">
              <TextInput value={form.email} onChange={(v) => update("email", v)} placeholder="info@yourclinic.com" type="email" />
            </Field>
            <Field label="Phone">
              <TextInput value={form.phone} onChange={(v) => update("phone", v)} placeholder="+90 212 555 0000" type="tel" />
            </Field>
            <Field label="WhatsApp" hint="Patients in medical tourism prefer WhatsApp for enquiries.">
              <TextInput value={form.whatsapp} onChange={(v) => update("whatsapp", v)} placeholder="+90 555 000 0000" type="tel" />
            </Field>
            <Field label="Website">
              <TextInput value={form.website_url} onChange={(v) => update("website_url", v)} placeholder="https://yourclinic.com" type="url" />
            </Field>
          </div>
        </section>

        {/* ── Section 3: Specialties & Expertise ── */}
        <section
          className="rounded-xl p-6"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <SectionHeader
            icon="star"
            title="Specialties & Expertise"
            description="Help patients find you for the right procedures."
          />
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Primary Specialty">
              <TextInput
                value={form.primary_specialty}
                onChange={(v) => update("primary_specialty", v)}
                placeholder="e.g. Hair Restoration"
              />
            </Field>
            <Field label="Year Founded">
              <TextInput
                value={form.year_founded}
                onChange={(v) => update("year_founded", v)}
                placeholder="e.g. 2013"
                type="number"
              />
            </Field>
            <Field label="All Specialties" hint="Type to add or select from suggestions." span={2}>
              <TagInput
                tags={form.specialties}
                onChange={(v) => update("specialties", v)}
                placeholder="Add specialties…"
                suggestions={SPECIALTY_SUGGESTIONS}
              />
            </Field>
          </div>
        </section>

        {/* ── Section 4: Clinic Stats ── */}
        <section
          className="rounded-xl p-6"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <SectionHeader
            icon="heart"
            title="Clinic Statistics"
            description="Numbers that build trust with prospective patients."
          />
          <div className="grid sm:grid-cols-3 gap-5">
            <Field label="Patients Per Year" hint="Approximate number of patients treated annually.">
              <TextInput
                value={form.patients_per_year}
                onChange={(v) => update("patients_per_year", v)}
                placeholder="e.g. 5000"
                type="number"
              />
            </Field>
            <Field label="Number of Doctors">
              <TextInput
                value={form.num_doctors}
                onChange={(v) => update("num_doctors", v)}
                placeholder="e.g. 12"
                type="number"
              />
            </Field>
            <Field label="Languages Spoken" span={2}>
              <TagInput
                tags={form.languages_spoken}
                onChange={(v) => update("languages_spoken", v)}
                placeholder="Add languages…"
                suggestions={LANGUAGE_SUGGESTIONS}
              />
            </Field>
            <Field label="Payment Methods">
              <TagInput
                tags={form.accepted_payment_methods}
                onChange={(v) => update("accepted_payment_methods", v)}
                placeholder="Add payment methods…"
                suggestions={PAYMENT_SUGGESTIONS}
              />
            </Field>
          </div>
        </section>

        {/* ── Section 5: Patient Services ── */}
        <section
          className="rounded-xl p-6"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <SectionHeader
            icon="plane"
            title="Patient Services"
            description="Medical tourism amenities you offer."
          />
          <div className="space-y-1">
            <Toggle
              checked={form.offers_accommodation}
              onChange={(v) => update("offers_accommodation", v)}
              label="Accommodation / hotel packages included"
            />
            <Toggle
              checked={form.offers_transfers}
              onChange={(v) => update("offers_transfers", v)}
              label="Airport transfers provided"
            />
            <Toggle
              checked={form.offers_translator}
              onChange={(v) => update("offers_translator", v)}
              label="Translator / interpreter available"
            />
          </div>
        </section>

        {/* ── Section 6: SEO ── */}
        <section
          className="rounded-xl p-6"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <SectionHeader
            icon="globe"
            title="SEO & Metadata"
            description="Optimise how your clinic appears in search engines."
          />
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Meta Title" hint="Recommended: 50-60 characters." span={2}>
              <TextInput
                value={form.meta_title}
                onChange={(v) => update("meta_title", v)}
                placeholder="e.g. Clinic Center Istanbul | Hair Transplant & Cosmetic Surgery"
              />
            </Field>
            <Field label="Meta Description" hint="Recommended: 150-160 characters." span={2}>
              <TextArea
                value={form.meta_description}
                onChange={(v) => update("meta_description", v)}
                placeholder="Describe your clinic for search engine results…"
                rows={3}
                maxLength={160}
              />
            </Field>
          </div>

          {/* SEO Preview */}
          {(form.meta_title || form.name) && (
            <div className="mt-5 pt-5 border-t border-white/[0.05]">
              <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-3">Search Preview</p>
              <div
                className="rounded-lg p-4"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <p className="text-[16px] text-blue-400 font-medium truncate">
                  {form.meta_title || form.name}
                </p>
                <p className="text-[13px] text-green-400/70 truncate mt-0.5">
                  meetyourclinic.com › clinics › {initialClinic?.slug || "your-clinic"}
                </p>
                <p className="text-[13px] text-white/40 mt-1 line-clamp-2">
                  {form.meta_description || form.description_short || "No description set."}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Sticky save bar */}
      <SaveBar
        hasChanges={hasChanges}
        saving={saving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />

      {/* Animations */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
