"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2, Utensils } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FoodTemplate {
  id: string
  name: string
  category: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
}

export function FoodTemplates() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false)
  const [selectedFood, setSelectedFood] = useState<FoodTemplate | null>(null)

  // Simuler un appel API pour récupérer les templates d'aliments
  const foodTemplates: FoodTemplate[] = [
    {
      id: "1",
      name: "Poulet grillé",
      category: "Protéines",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      servingSize: "100g",
    },
    {
      id: "2",
      name: "Riz brun",
      category: "Glucides",
      calories: 112,
      protein: 2.6,
      carbs: 23.5,
      fat: 0.9,
      servingSize: "100g",
    },
    {
      id: "3",
      name: "Avocat",
      category: "Lipides",
      calories: 160,
      protein: 2,
      carbs: 8.5,
      fat: 14.7,
      servingSize: "100g",
    },
    {
      id: "4",
      name: "Brocoli",
      category: "Légumes",
      calories: 34,
      protein: 2.8,
      carbs: 6.6,
      fat: 0.4,
      servingSize: "100g",
    },
    {
      id: "5",
      name: "Yaourt grec",
      category: "Produits laitiers",
      calories: 59,
      protein: 10,
      carbs: 3.6,
      fat: 0.4,
      servingSize: "100g",
    },
  ]

  const filteredFoods = foodTemplates.filter(
    (food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEditFood = (food: FoodTemplate) => {
    setSelectedFood(food)
    setIsAddFoodOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un aliment..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]"
          onClick={() => {
            setSelectedFood(null)
            setIsAddFoodOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un aliment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates d'aliments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFoods.length > 0 ? (
              filteredFoods.map((food) => (
                <Card key={food.id} className="overflow-hidden">
                  <CardHeader className="bg-[#E2F163]/20 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Utensils className="h-5 w-5 text-[#2F455C] mr-2" />
                        <CardTitle className="text-base">{food.name}</CardTitle>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{food.category}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Calories</p>
                        <p className="font-medium">{food.calories} kcal</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Portion</p>
                        <p className="font-medium">{food.servingSize}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">P: {food.protein}g</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">G: {food.carbs}g</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        L: {food.fat}g
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          // Logique de suppression
                          console.log("Supprimer", food.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#21D0B2] hover:text-[#1DCFE0] hover:bg-[#21D0B2]/10"
                        onClick={() => handleEditFood(food)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                Aucun aliment trouvé. Ajoutez-en un nouveau !
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddFoodOpen} onOpenChange={setIsAddFoodOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedFood ? "Modifier l'aliment" : "Ajouter un nouvel aliment"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'aliment</Label>
                <Input id="name" defaultValue={selectedFood?.name || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select defaultValue={selectedFood?.category || ""}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Protéines">Protéines</SelectItem>
                    <SelectItem value="Glucides">Glucides</SelectItem>
                    <SelectItem value="Lipides">Lipides</SelectItem>
                    <SelectItem value="Légumes">Légumes</SelectItem>
                    <SelectItem value="Fruits">Fruits</SelectItem>
                    <SelectItem value="Produits laitiers">Produits laitiers</SelectItem>
                    <SelectItem value="Boissons">Boissons</SelectItem>
                    <SelectItem value="Snacks">Snacks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories (kcal)</Label>
                <Input id="calories" type="number" defaultValue={selectedFood?.calories || 0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servingSize">Taille de portion</Label>
                <Input id="servingSize" defaultValue={selectedFood?.servingSize || "100g"} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="protein" className="text-red-800">
                  Protéines (g)
                </Label>
                <Input id="protein" type="number" step="0.1" defaultValue={selectedFood?.protein || 0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs" className="text-blue-800">
                  Glucides (g)
                </Label>
                <Input id="carbs" type="number" step="0.1" defaultValue={selectedFood?.carbs || 0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat" className="text-yellow-800">
                  Lipides (g)
                </Label>
                <Input id="fat" type="number" step="0.1" defaultValue={selectedFood?.fat || 0} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddFoodOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">
                {selectedFood ? "Mettre à jour" : "Ajouter"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
