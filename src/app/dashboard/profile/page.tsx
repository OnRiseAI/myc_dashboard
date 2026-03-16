"use client";

import ProfileEditPage from "@/components/profile-edit-page";
import { useClinic, useUpdateClinic } from "@/hooks/use-clinic-data";
import { OnboardingTooltip } from "@/components/onboarding/tooltip";

export default function ProfilePage() {
  const { clinic, loading, refetch } = useClinic();
  const { updateClinic, saving } = useUpdateClinic();

  if (loading) return null;

  const clinicForForm = clinic
    ? {
        id: clinic.id,
        name: clinic.name || "",
        description_short: clinic.description_short || "",
        description: clinic.description || "",
        address: clinic.address || "",
        website_url: clinic.website_url || "",
        email: clinic.email || "",
        phone: clinic.phone || "",
        whatsapp: clinic.whatsapp || "",
        year_founded: clinic.year_founded ? String(clinic.year_founded) : "",
        patients_per_year: clinic.patients_per_year ? String(clinic.patients_per_year) : "",
        num_doctors: clinic.num_doctors ? String(clinic.num_doctors) : String(clinic.doctor_count || ""),
        primary_specialty: clinic.primary_specialty || "",
        specialties: clinic.specialties || [],
        languages_spoken: clinic.languages_spoken || [],
        accepted_payment_methods: clinic.accepted_payment_methods || [],
        offers_accommodation: clinic.offers_accommodation || false,
        offers_transfers: clinic.offers_transfers || false,
        offers_translator: clinic.offers_translator || false,
        meta_title: clinic.meta_title || "",
        meta_description: clinic.meta_description || "",
      }
    : null;

  return (
    <OnboardingTooltip pageId="profile" message="Review and update the details we found for your clinic.">
      <div>
        <ProfileEditPage
          clinic={clinicForForm}
          onNavigate={() => {}}
          onSave={async (formData: Record<string, any>) => {
            await updateClinic(formData);
            await refetch();
          }}
          isSaving={saving}
        />
      </div>
    </OnboardingTooltip>
  );
}
