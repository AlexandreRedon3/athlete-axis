"use client"

import { SectionHeader } from "@/components/dashboard/section-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CoachProfileSettings } from "@/components/coach/settings/coach-profile-settings"
import { ExerciseTemplates } from "@/components/coach/settings/exercise-templates"
import { FoodTemplates } from "@/components/coach/settings/food-templates"

export function SettingsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Paramètres" description="Gérez votre profil et vos templates" />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profil coach</TabsTrigger>
          <TabsTrigger value="exercises">Templates d'exercices</TabsTrigger>
          <TabsTrigger value="foods">Templates d'aliments</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <CoachProfileSettings />
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          <ExerciseTemplates />
        </TabsContent>

        <TabsContent value="foods" className="space-y-6">
          <FoodTemplates />
        </TabsContent>
      </Tabs>
    </div>
  )
}
