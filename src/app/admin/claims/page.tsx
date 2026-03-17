"use client";

import AdminReviewPanel from "@/components/admin-review-panel";
import { RequireAdmin } from "@/lib/auth";

export default function AdminClaims() {
  return (
    <RequireAdmin>
      <AdminReviewPanel />
    </RequireAdmin>
  );
}
