"use client";

import DoctorsPage from "@/components/doctors-page";
import { useAuth } from "@/lib/auth";
import { OnboardingTooltip } from "@/components/onboarding/tooltip";

export default function Doctors() {
  const { clinicId } = useAuth();
  return (
    <OnboardingTooltip pageId="doctors" message="Verify the team members we imported, or add new ones to showcase your clinic's expertise.">
      <div>
        <DoctorsPage clinicId={clinicId} />
      </div>
    </OnboardingTooltip>
  );
}
