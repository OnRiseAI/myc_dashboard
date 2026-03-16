"use client";

import EnquiriesPage from "@/components/enquiries-page";
import { useAuth } from "@/lib/auth";
import { OnboardingTooltip } from "@/components/onboarding/tooltip";

export default function Enquiries() {
  const { clinicId } = useAuth();
  return (
    <OnboardingTooltip pageId="enquiries" message="Patient enquiries from your listing appear here in real time.">
      <div>
        <EnquiriesPage clinicId={clinicId} />
      </div>
    </OnboardingTooltip>
  );
}
