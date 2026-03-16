"use client";

import PhotosPage from "@/components/photos-page";
import { useAuth } from "@/lib/auth";

export default function Photos() {
  const { clinicId } = useAuth();
  return <PhotosPage clinicId={clinicId} />;
}
