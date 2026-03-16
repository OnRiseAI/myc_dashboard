"use client";

import EnquiriesPage from "@/components/enquiries-page";
import { useAuth } from "@/lib/auth";

export default function Enquiries() {
  const { clinicId } = useAuth();
  return <EnquiriesPage clinicId={clinicId} />;
}
