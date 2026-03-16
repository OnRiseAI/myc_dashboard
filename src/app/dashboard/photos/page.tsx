"use client";

import PhotosPage from "@/components/photos-page";
import { useAuth } from "@/lib/auth";
import { OnboardingTooltip } from "@/components/onboarding/tooltip";

export default function Photos() {
  const { clinicId } = useAuth();
  return (
    <OnboardingTooltip pageId="photos" message="Upload high-quality photos to make your listing stand out to patients.">
      <div>
        <PhotosPage clinicId={clinicId} />
      </div>
    </OnboardingTooltip>
  );
}
