"use client";

import ReviewsPage from "@/components/reviews-page";
import { useAuth } from "@/lib/auth";

export default function Reviews() {
  const { clinicId } = useAuth();
  return <ReviewsPage clinicId={clinicId} />;
}
