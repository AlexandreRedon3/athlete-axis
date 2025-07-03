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

const clientSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  age: z.coerce.number().min(16, "L'âge minimum est de 16 ans").max(100, "L'âge maximum est de 100 ans"),
  weight: z.coerce.number().min(30, "Le poids minimum est de 30 kg").max(250, "Le poids maximum est de 250 kg"),
  height: z.coerce.number().min(100, "La taille minimum est de 100 cm").max(250, "La taille maximum est de 250 cm"),
  goal: z.string().min(5, "L'objectif doit comporter au moins 5 caractères"),
})

type ClientFormValues = z.infer<typeof clientSchema>

interface AddClientFormProps {
  onSubmit: (data: ClientFormValues) => void
}

export function AddClientForm({ onSubmit }: AddClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      age: undefined,
      weight: undefined,
      height: undefined,
      goal: "",
    },
  })

  const handleFormSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true)
    try {
      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSubmit(data)
    } catch (error) {
      console.error("Erreur lors de l'ajout du client:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" {...register("phone")} />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Âge</Label>
          <Input id="age" type="number" {...register("age")} />
          {errors.age && <p className="text-sm text-red-500">{errors.age.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Poids (kg)</Label>
          <Input id="weight" type="number" step="0.1" {...register("weight")} />
          {errors.weight && <p className="text-sm text-red-500">{errors.weight.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Taille (cm)</Label>
          <Input id="height" type="number" {...register("height")} />
          {errors.height && <p className="text-sm text-red-500">{errors.height.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal">Objectif</Label>
        <Textarea id="goal" {...register("goal")} />
        {errors.goal && <p className="text-sm text-red-500">{errors.goal.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Ajout en cours..." : "Ajouter le client"}
        </Button>
      </div>
    </form>
  )
}
