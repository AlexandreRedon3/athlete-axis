"use client"
import { ModernCoachDashboard } from "@/components/coach/dashboard/coach-dashboard"
import { useEffect } from "react"

export default function CoachDashboard() {
  useEffect(() => {
    console.log("🎯 Page CoachDashboard chargée");
  }, []);
  
  return (
    <div>
      <ModernCoachDashboard />
    </div>
  )
}
