"use client"

import { useState } from "react"
import { SectionHeader } from "@/components/dashboard/section-header"
import { NutritionPlansList } from "@/components/coach/nutrition/nutrition-plans-list"
import { NutritionPlanDetail } from "@/components/coach/nutrition/nutrition-plan-detail"
import { CreateNutritionPlanForm } from "@/components/coach/nutrition/create-nutrition-plan-form"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function NutritionSection() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false)

  // Simuler un appel API pour récupérer les plans nutritionnels
  const nutritionPlans = [
    {
      id: "1",
      name: "Plan nutritionnel - Perte de poids",
      description: "Plan alimentaire pour favoriser la perte de poids progressive",
      calories: 1800,
      macros: { protein: 40, carbs: 30, fat: 30 },
      createdAt: "2023-12-15",
      clients: 4,
    },
    {
      id: "2",
      name: "Plan nutritionnel - Prise de masse",
      description: "Plan alimentaire pour favoriser la prise de masse musculaire",
      calories: 2800,
      macros: { protein: 35, carbs: 45, fat: 20 },
      createdAt: "2024-01-10",
      clients: 3,
    },
    {
      id: "3",
      name: "Plan nutritionnel - Maintenance",
      description: "Plan alimentaire équilibré pour maintenir le poids actuel",
      calories: 2200,
      macros: { protein: 30, carbs: 40, fat: 30 },
      createdAt: "2024-02-05",
      clients: 6,
    },
  ]

  const selectedPlan = nutritionPlans.find((plan) => plan.id === selectedPlanId)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Gestion nutritionnelle"
        description="Créez et gérez vos plans alimentaires"
        buttonText="Créer un plan"
        buttonIcon={Plus}
        onButtonClick={() => setIsCreatePlanOpen(true)}
      />

      {selectedPlanId ? (
        <NutritionPlanDetail plan={selectedPlan!} onBack={() => setSelectedPlanId(null)} />
      ) : (
        <NutritionPlansList plans={nutritionPlans} onSelectPlan={(id) => setSelectedPlanId(id)} />
      )}

      <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau plan nutritionnel</DialogTitle>
          </DialogHeader>
          <CreateNutritionPlanForm
            onSubmit={(data) => {
              console.log("Nouveau plan nutritionnel:", data)
              setIsCreatePlanOpen(false)
              // Ici, vous ajouteriez le plan à votre base de données
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
