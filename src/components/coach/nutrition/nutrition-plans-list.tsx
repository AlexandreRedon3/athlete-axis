"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Utensils, Users } from "lucide-react"
import { useState } from "react"

interface NutritionPlan {
  id: string
  name: string
  description: string
  calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  createdAt: string
  clients: number
}

interface NutritionPlansListProps {
  plans: NutritionPlan[]
  onSelectPlan: (id: string) => void
}

export function NutritionPlansList({ plans, onSelectPlan }: NutritionPlansListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPlans = plans.filter((plan) => plan.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher un plan nutritionnel..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-4 border-b bg-[#E2F163]/20">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Utensils className="h-5 w-5 text-[#2F455C] mr-2" />
                      <h3 className="font-bold text-[#2F455C]">{plan.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{plan.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{plan.calories} kcal</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">{plan.clients} clients</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      P: {plan.macros.protein}%
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      G: {plan.macros.carbs}%
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      L: {plan.macros.fat}%
                    </span>
                  </div>
                  <Button
                    onClick={() => onSelectPlan(plan.id)}
                    className="w-full bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]"
                  >
                    Voir les détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">Aucun plan nutritionnel trouvé</div>
        )}
      </div>
    </div>
  )
}
