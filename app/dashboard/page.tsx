"use client";

import { useAuthRedirect } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  useAuthRedirect();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Redirection en cours...</p>
      </div>
    </div>
  );
} 