"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, User } from "lucide-react"

const profileSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  specialization: z.string().min(2, "La spécialisation doit comporter au moins 2 caractères"),
  bio: z.string().min(10, "La biographie doit comporter au moins 10 caractères"),
  experience: z.coerce.number().min(0, "L'expérience ne peut pas être négative"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function CoachProfileSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simuler un appel API pour récupérer les informations du coach
  const coachData = {
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    phone: "06 12 34 56 78",
    specialization: "Coach sportif spécialisé en musculation et perte de poids",
    bio: "Coach sportif certifié avec plus de 5 ans d'expérience dans l'accompagnement de clients vers leurs objectifs de forme physique. Spécialisé dans la perte de poids et la musculation, j'adapte mes programmes aux besoins spécifiques de chaque client.",
    experience: 5,
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: coachData,
  })

  const handleFormSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true)
    try {
      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Profil mis à jour:", data)
      // Ici, vous mettriez à jour le profil dans votre base de données
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du profil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-[#21D0B2]/20 flex items-center justify-center mb-4">
              <User className="h-16 w-16 text-[#21D0B2]" />
            </div>
            <Button variant="outline" className="w-full">
              Changer la photo
            </Button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 md:w-2/3">
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
                <Label htmlFor="experience">Années d'expérience</Label>
                <Input id="experience" type="number" {...register("experience")} />
                {errors.experience && <p className="text-sm text-red-500">{errors.experience.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Spécialisation</Label>
              <Input id="specialization" {...register("specialization")} />
              {errors.specialization && <p className="text-sm text-red-500">{errors.specialization.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea id="bio" rows={5} {...register("bio")} />
              {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
