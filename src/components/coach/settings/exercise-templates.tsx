"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, Dumbbell } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExerciseTemplate {
  id: string
  name: string
  category: string
  description: string
  instructions: string
  targetMuscles: string[]
}

export function ExerciseTemplates() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<ExerciseTemplate | null>(null)

  // Simuler un appel API pour récupérer les templates d'exercices
  const exerciseTemplates: ExerciseTemplate[] = [
    {
      id: "1",
      name: "Squat",
      category: "Jambes",
      description: "Exercice de base pour les jambes",
      instructions:
        "1. Tenez-vous debout, pieds écartés à la largeur des épaules\n2. Pliez les genoux comme si vous vous asseyiez\n3. Descendez jusqu'à ce que vos cuisses soient parallèles au sol\n4. Remontez en poussant à travers vos talons",
      targetMuscles: ["Quadriceps", "Ischio-jambiers", "Fessiers"],
    },
    {
      id: "2",
      name: "Développé couché",
      category: "Poitrine",
      description: "Exercice de base pour la poitrine",
      instructions:
        "1. Allongez-vous sur un banc plat\n2. Saisissez la barre avec une prise légèrement plus large que la largeur des épaules\n3. Abaissez la barre jusqu'à ce qu'elle touche votre poitrine\n4. Poussez la barre vers le haut jusqu'à l'extension complète des bras",
      targetMuscles: ["Pectoraux", "Triceps", "Épaules"],
    },
    {
      id: "3",
      name: "Traction",
      category: "Dos",
      description: "Exercice de base pour le dos",
      instructions:
        "1. Saisissez la barre avec une prise plus large que la largeur des épaules\n2. Suspendez-vous avec les bras tendus\n3. Tirez votre corps vers le haut jusqu'à ce que votre menton dépasse la barre\n4. Redescendez de manière contrôlée",
      targetMuscles: ["Dorsaux", "Biceps", "Avant-bras"],
    },
    {
      id: "4",
      name: "Curl biceps",
      category: "Bras",
      description: "Exercice d'isolation pour les biceps",
      instructions:
        "1. Tenez-vous debout avec un haltère dans chaque main\n2. Gardez les coudes près du corps\n3. Pliez les coudes pour amener les haltères vers vos épaules\n4. Redescendez lentement",
      targetMuscles: ["Biceps", "Avant-bras"],
    },
  ]

  const filteredExercises = exerciseTemplates.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEditExercise = (exercise: ExerciseTemplate) => {
    setSelectedExercise(exercise)
    setIsAddExerciseOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un exercice..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]"
          onClick={() => {
            setSelectedExercise(null)
            setIsAddExerciseOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un exercice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates d'exercices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.length > 0 ? (
              filteredExercises.map((exercise) => (
                <Card key={exercise.id} className="overflow-hidden">
                  <CardHeader className="bg-[#21D0B2]/10 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Dumbbell className="h-5 w-5 text-[#21D0B2] mr-2" />
                        <CardTitle className="text-base">{exercise.name}</CardTitle>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{exercise.category}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {exercise.targetMuscles.map((muscle, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-[#21D0B2]/10 rounded-full">
                          {muscle}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          // Logique de suppression
                          console.log("Supprimer", exercise.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#21D0B2] hover:text-[#1DCFE0] hover:bg-[#21D0B2]/10"
                        onClick={() => handleEditExercise(exercise)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                Aucun exercice trouvé. Ajoutez-en un nouveau !
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddExerciseOpen} onOpenChange={setIsAddExerciseOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedExercise ? "Modifier l'exercice" : "Ajouter un nouvel exercice"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'exercice</Label>
                <Input id="name" defaultValue={selectedExercise?.name || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select defaultValue={selectedExercise?.category || ""}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jambes">Jambes</SelectItem>
                    <SelectItem value="Poitrine">Poitrine</SelectItem>
                    <SelectItem value="Dos">Dos</SelectItem>
                    <SelectItem value="Épaules">Épaules</SelectItem>
                    <SelectItem value="Bras">Bras</SelectItem>
                    <SelectItem value="Abdominaux">Abdominaux</SelectItem>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" defaultValue={selectedExercise?.description || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                rows={4}
                defaultValue={selectedExercise?.instructions || ""}
                placeholder="Décrivez les étapes de l'exercice"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetMuscles">Muscles ciblés (séparés par des virgules)</Label>
              <Input
                id="targetMuscles"
                defaultValue={selectedExercise?.targetMuscles.join(", ") || ""}
                placeholder="Ex: Quadriceps, Ischio-jambiers, Fessiers"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddExerciseOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">
                {selectedExercise ? "Mettre à jour" : "Ajouter"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
