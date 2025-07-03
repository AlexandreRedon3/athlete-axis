import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Utensils, Calendar, ArrowRight, Plus } from "lucide-react"

interface ClientNutritionHistoryProps {
  clientId: string
}

export function ClientNutritionHistory({ clientId }: ClientNutritionHistoryProps) {
  // Simuler un appel API pour récupérer l'historique des plans nutritionnels
  const nutritionHistory = [
    {
      id: "1",
      name: "Plan nutritionnel - Perte de poids",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      status: "En cours",
      calories: 1800,
      macros: { protein: 40, carbs: 30, fat: 30 },
    },
    {
      id: "2",
      name: "Plan nutritionnel - Maintenance",
      startDate: "2023-10-01",
      endDate: "2023-12-31",
      status: "Terminé",
      calories: 2200,
      macros: { protein: 30, carbs: 40, fat: 30 },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#2F455C]">Plans nutritionnels</h3>
        <Button className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">
          <Plus className="h-4 w-4 mr-2" />
          Assigner un plan
        </Button>
      </div>

      <div className="space-y-4">
        {nutritionHistory.map((plan) => (
          <Card key={plan.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="bg-[#E2F163]/20 p-4 md:p-6 md:w-64 flex flex-col justify-center">
                  <div className="flex items-center mb-2">
                    <Utensils className="h-5 w-5 text-[#2F455C] mr-2" />
                    <h4 className="font-bold">{plan.name}</h4>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Statut</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          plan.status === "En cours" ? "bg-[#21D0B2]/20 text-[#21D0B2]" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Calories</p>
                      <p className="font-medium">{plan.calories} kcal/jour</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Macros</p>
                      <div className="flex gap-2">
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
                    </div>

                    <Button variant="outline" className="md:self-end">
                      Détails <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
