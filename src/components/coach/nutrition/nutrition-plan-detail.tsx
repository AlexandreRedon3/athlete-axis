"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Utensils, Users, Edit, Plus } from "lucide-react"
import { MealPlanList } from "@/components/coach/nutrition/meal-plan-list"
import { AssignNutritionPlanDialog } from "@/components/coach/nutrition/assign-nutrition-plan-dialog"
import { useState } from "react"

interface NutritionPlanDetailProps {
  plan: {
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
  onBack: () => void
}

export function NutritionPlanDetail({ plan, onBack }: NutritionPlanDetailProps) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)

  // Simuler un appel API pour récupérer les repas du plan
  const meals = [
    {
      id: "1",
      name: "Petit-déjeuner",
      time: "07:00",
      calories: 450,
      macros: { protein: 30, carbs: 50, fat: 20 },
      foods: [
        { name: "Flocons d'avoine", quantity: "60g", calories: 220 },
        { name: "Lait d'amande", quantity: "250ml", calories: 80 },
        { name: "Banane", quantity: "1 moyenne", calories: 100 },
        { name: "Protéine en poudre", quantity: "15g", calories: 50 },
      ],
    },
    {
      id: "2",
      name: "Collation matinale",
      time: "10:30",
      calories: 200,
      macros: { protein: 15, carbs: 20, fat: 65 },
      foods: [
        { name: "Yaourt grec", quantity: "150g", calories: 120 },
        { name: "Noix", quantity: "15g", calories: 80 },
      ],
    },
    {
      id: "3",
      name: "Déjeuner",
      time: "13:00",
      calories: 650,
      macros: { protein: 40, carbs: 30, fat: 30 },
      foods: [
        { name: "Poulet grillé", quantity: "120g", calories: 200 },
        { name: "Riz brun", quantity: "70g", calories: 250 },
        { name: "Légumes variés", quantity: "150g", calories: 100 },
        { name: "Huile d'olive", quantity: "10g", calories: 100 },
      ],
    },
    {
      id: "4",
      name: "Collation après-midi",
      time: "16:30",
      calories: 150,
      macros: { protein: 20, carbs: 70, fat: 10 },
      foods: [
        { name: "Pomme", quantity: "1 moyenne", calories: 80 },
        { name: "Barre protéinée", quantity: "1/2", calories: 70 },
      ],
    },
    {
      id: "5",
      name: "Dîner",
      time: "19:30",
      calories: 550,
      macros: { protein: 45, carbs: 25, fat: 30 },
      foods: [
        { name: "Saumon", quantity: "120g", calories: 250 },
        { name: "Quinoa", quantity: "50g", calories: 150 },
        { name: "Légumes verts", quantity: "150g", calories: 50 },
        { name: "Avocat", quantity: "1/4", calories: 100 },
      ],
    },
  ]

  // Simuler un appel API pour récupérer les clients assignés à ce plan
  const assignedClients = [
    { id: "1", name: "Sophie Martin", adherence: 85 },
    { id: "2", name: "Thomas Dubois", adherence: 70 },
    { id: "3", name: "Julie Petit", adherence: 90 },
    { id: "4", name: "Marc Leroy", adherence: 60 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold text-[#2F455C]">Détails du plan nutritionnel</h2>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Utensils className="h-6 w-6 text-[#2F455C] mr-3" />
              <div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-gray-500">Créé le {new Date(plan.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
              <Button
                className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]"
                onClick={() => setIsAssignDialogOpen(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Assigner
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{plan.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Calories</span>
              <span className="font-bold text-lg">{plan.calories} kcal</span>
            </div>
            <div className="flex flex-col p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-500">Protéines</span>
              <span className="font-bold text-lg text-red-800">{plan.macros.protein}%</span>
            </div>
            <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-500">Glucides</span>
              <span className="font-bold text-lg text-blue-800">{plan.macros.carbs}%</span>
            </div>
            <div className="flex flex-col p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm text-gray-500">Lipides</span>
              <span className="font-bold text-lg text-yellow-800">{plan.macros.fat}%</span>
            </div>
          </div>

          <Tabs defaultValue="meals">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="meals">Repas ({meals.length})</TabsTrigger>
              <TabsTrigger value="clients">Clients assignés ({assignedClients.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="meals" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Liste des repas</h3>
                <Button className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un repas
                </Button>
              </div>
              <MealPlanList meals={meals} />
            </TabsContent>
            <TabsContent value="clients" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Clients suivant ce plan</h3>
                <Button
                  className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]"
                  onClick={() => setIsAssignDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Assigner à un client
                </Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-gray-500">Nom</th>
                        <th className="text-left p-4 font-medium text-gray-500">Adhérence</th>
                        <th className="text-left p-4 font-medium text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedClients.map((client, index) => (
                        <tr
                          key={client.id}
                          className={
                            index < assignedClients.length - 1 ? "border-b hover:bg-gray-50" : "hover:bg-gray-50"
                          }
                        >
                          <td className="p-4">{client.name}</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <div
                                  className="h-full bg-[#21D0B2] rounded-full"
                                  style={{ width: `${client.adherence}%` }}
                                ></div>
                              </div>
                              <span>{client.adherence}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm" className="text-[#21D0B2]">
                              Voir détails
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AssignNutritionPlanDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        planId={plan.id}
        planName={plan.name}
      />
    </div>
  )
}
