"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dumbbell, User, LogOut } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CoachOverview } from "@/components/coach/coach-overview"
import { ClientsSection } from "@/components/coach/clients/clients-section"
import { TrainingSection } from "@/components/coach/training/training-section"
import { NutritionSection } from "@/components/coach/nutrition/nutrition-section"
import { SettingsSection } from "@/components/coach/settings/settings-section"

export default function CoachDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-[#2F455C]/5">
      {/* Header */}

      <main className="container py-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="training">Entraînement</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <CoachOverview />
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <ClientsSection />
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <TrainingSection />
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <NutritionSection />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
