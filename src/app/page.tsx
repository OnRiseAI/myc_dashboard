"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? "/dashboard" : "/auth");
  }, [loading, router, user]);

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full" />
    </div>
  );
}
