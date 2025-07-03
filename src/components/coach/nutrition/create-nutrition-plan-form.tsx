"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

const nutritionPlanSchema = z
  .object({
    name: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
    description: z.string().min(10, "La description doit comporter au moins 10 caractères"),
    calories: z.coerce.number().min(1000, "Minimum 1000 calories").max(5000, "Maximum 5000 calories"),
    proteinPercentage: z.coerce.number().min(10, "Minimum 10%").max(60, "Maximum 60%"),
    carbsPercentage: z.coerce.number().min(10, "Minimum 10%").max(70, "Maximum 70%"),
    fatPercentage: z.coerce.number().min(10, "Minimum 10%").max(60, "Maximum 60%"),
  })
  .refine(
    (data) => {
      const total = data.proteinPercentage + data.carbsPercentage + data.fatPercentage
      return total === 100
    },
    {
      message: "La somme des pourcentages doit être égale à 100%",
      path: ["proteinPercentage"],
    },
  )

type NutritionPlanFormValues = z.infer<typeof nutritionPlanSchema>

interface CreateNutritionPlanFormProps {
  onSubmit: (data: NutritionPlanFormValues) => void
}

export function CreateNutritionPlanForm({ onSubmit }: CreateNutritionPlanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NutritionPlanFormValues>({
    resolver: zodResolver(nutritionPlanSchema),
    defaultValues: {
      name: "",
      description: "",
      calories: 2000,
      proteinPercentage: 30,
      carbsPercentage: 40,
      fatPercentage: 30,
    },
  })

  const proteinPercentage = watch("proteinPercentage")
  const carbsPercentage = watch("carbsPercentage")
  const fatPercentage = watch("fatPercentage")
  const totalPercentage = proteinPercentage + carbsPercentage + fatPercentage

  const handleFormSubmit = async (data: NutritionPlanFormValues) => {
    setIsSubmitting(true)
    try {
      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSubmit(data)
    } catch (error) {
      console.error("Erreur lors de la création du plan nutritionnel:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du plan</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="calories">Calories journalières (kcal)</Label>
        <Input id="calories" type="number" {...register("calories")} />
        {errors.calories && <p className="text-sm text-red-500">{errors.calories.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Répartition des macronutriments (total: {totalPercentage}%)</Label>
        {totalPercentage !== 100 && (
          <p className="text-sm text-amber-500">La somme des pourcentages doit être égale à 100%</p>
        )}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="proteinPercentage" className="text-red-800">
              Protéines (%)
            </Label>
            <Input id="proteinPercentage" type="number" {...register("proteinPercentage")} />
            {errors.proteinPercentage && <p className="text-sm text-red-500">{errors.proteinPercentage.message}</p>}
          </div>
          <div>
            <Label htmlFor="carbsPercentage" className="text-blue-800">
              Glucides (%)
            </Label>
            <Input id="carbsPercentage" type="number" {...register("carbsPercentage")} />
            {errors.carbsPercentage && <p className="text-sm text-red-500">{errors.carbsPercentage.message}</p>}
          </div>
          <div>
            <Label htmlFor="fatPercentage" className="text-yellow-800">
              Lipides (%)
            </Label>
            <Input id="fatPercentage" type="number" {...register("fatPercentage")} />
            {errors.fatPercentage && <p className="text-sm text-red-500">{errors.fatPercentage.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Création en cours..." : "Créer le plan"}
        </Button>
      </div>
    </form>
  )
}
