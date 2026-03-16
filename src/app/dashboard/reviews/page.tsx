"use client";

import ReviewsPage from "@/components/reviews-page";
import { useAuth } from "@/lib/auth";
import { OnboardingTooltip } from "@/components/onboarding/tooltip";

export default function Reviews() {
  const { clinicId } = useAuth();
  return (
    <OnboardingTooltip pageId="reviews" message="Monitor patient feedback from Google and other platforms.">
      <div>
        <ReviewsPage clinicId={clinicId} />
      </div>
    </OnboardingTooltip>
  );
}
