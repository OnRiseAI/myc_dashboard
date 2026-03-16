"use client";

import DoctorsPage from "@/components/doctors-page";
import { useAuth } from "@/lib/auth";

export default function Doctors() {
  const { clinicId } = useAuth();
  return <DoctorsPage clinicId={clinicId} />;
}
