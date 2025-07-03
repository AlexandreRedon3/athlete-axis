"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Edit, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface Food {
  name: string
  quantity: string
  calories: number
}

interface Meal {
  id: string
  name: string
  time: string
  calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  foods: Food[]
}

interface MealPlanListProps {
  meals: Meal[]
}

export function MealPlanList({ meals }: MealPlanListProps) {
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null)

  const toggleMeal = (mealId: string) => {
    if (expandedMealId === mealId) {
      setExpandedMealId(null)
    } else {
      setExpandedMealId(mealId)
    }
  }

  return (
    <div className="space-y-4">
      {meals.map((meal) => (
        <Card key={meal.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => toggleMeal(meal.id)}
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-10 h-10 rounded-full bg-[#E2F163]/30 flex items-center justify-center">
                    <span className="font-medium text-[#2F455C]">{meal.name.charAt(0)}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">{meal.name}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{meal.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 text-right">
                  <div className="font-medium">{meal.calories} kcal</div>
                  <div className="flex gap-1 text-xs">
                    <span className="text-red-800">P:{meal.macros.protein}%</span>
                    <span className="text-blue-800">G:{meal.macros.carbs}%</span>
                    <span className="text-yellow-800">L:{meal.macros.fat}%</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Action de modification
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {expandedMealId === meal.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            {expandedMealId === meal.id && (
              <div className="p-4 border-t bg-gray-50">
                <h5 className="font-medium mb-2">Aliments</h5>
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-gray-500 border-b">
                      <th className="text-left py-2">Aliment</th>
                      <th className="text-left py-2">Quantité</th>
                      <th className="text-right py-2">Calories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meal.foods.map((food, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-2">{food.name}</td>
                        <td className="py-2">{food.quantity}</td>
                        <td className="py-2 text-right">{food.calories} kcal</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-medium">
                      <td className="pt-2" colSpan={2}>
                        Total
                      </td>
                      <td className="pt-2 text-right">{meal.calories} kcal</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
