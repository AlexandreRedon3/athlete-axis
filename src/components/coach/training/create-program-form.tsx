"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const programSchema = z.object({
  name: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
  description: z.string().min(10, "La description doit comporter au moins 10 caractères"),
  level: z.enum(["Débutant", "Intermédiaire", "Avancé"], {
    required_error: "Veuillez sélectionner un niveau",
  }),
  type: z.enum(["Cardio", "Hypertrophie", "Force", "Endurance", "Mixte"], {
    required_error: "Veuillez sélectionner un type",
  }),
  durationWeeks: z.coerce
    .number()
    .min(1, "La durée minimum est de 1 semaine")
    .max(52, "La durée maximum est de 52 semaines"),
  sessionsPerWeek: z.coerce.number().min(1, "Minimum 1 séance par semaine").max(7, "Maximum 7 séances par semaine"),
  status: z.enum(["draft", "published"]),
  imageUrl: z.string().optional(),
})

type ProgramFormValues = z.infer<typeof programSchema>

interface CreateProgramFormProps {
  onSubmit: (data: ProgramFormValues) => void
}

export function CreateProgramForm({ onSubmit }: CreateProgramFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: "",
      description: "",
      level: undefined,
      type: undefined,
      durationWeeks: 4,
      sessionsPerWeek: 3,
      status: "draft",
      imageUrl: "",
    },
  })

  const status = watch("status")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Dans un cas réel, vous téléchargeriez l'image sur un service comme Cloudinary ou AWS S3
      // et utiliseriez l'URL retournée
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setImagePreview(result)
        setValue("imageUrl", "https://example.com/placeholder-image.jpg") // URL factice pour la démonstration
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFormSubmit = async (data: ProgramFormValues) => {
    setIsSubmitting(true)
    try {
        const response = await fetch("/api/programs", {
            method: "POST",
            body: JSON.stringify(data),
        })
        const newProgram = await response.json()
        console.log("Nouveau programme:", newProgram)
        onSubmit(newProgram)
    } catch (error) {
      console.error("Erreur lors de la création du programme:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du programme</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="level">Niveau</Label>
          <Select onValueChange={(value) => setValue("level", value as "Débutant" | "Intermédiaire" | "Avancé")}>
            <SelectTrigger id="level">
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Débutant">Débutant</SelectItem>
              <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
              <SelectItem value="Avancé">Avancé</SelectItem>
            </SelectContent>
          </Select>
          {errors.level && <p className="text-sm text-red-500">{errors.level.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            onValueChange={(value) =>
              setValue("type", value as "Cardio" | "Hypertrophie" | "Force" | "Endurance" | "Mixte")
            }
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cardio">Cardio</SelectItem>
              <SelectItem value="Hypertrophie">Hypertrophie</SelectItem>
              <SelectItem value="Force">Force</SelectItem>
              <SelectItem value="Endurance">Endurance</SelectItem>
              <SelectItem value="Mixte">Mixte</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="durationWeeks">Durée (semaines)</Label>
          <Input id="durationWeeks" type="number" min="1" max="52" {...register("durationWeeks")} />
          {errors.durationWeeks && <p className="text-sm text-red-500">{errors.durationWeeks.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sessionsPerWeek">Séances par semaine</Label>
          <Input id="sessionsPerWeek" type="number" min="1" max="7" {...register("sessionsPerWeek")} />
          {errors.sessionsPerWeek && <p className="text-sm text-red-500">{errors.sessionsPerWeek.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Image du programme</Label>
        <div className="flex items-center gap-4">
          {imagePreview && (
            <div className="w-24 h-24 rounded-md overflow-hidden">
              <img src={imagePreview || "/placeholder.svg"} alt="Aperçu" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-2 bg-[#21D0B2]/10 text-[#21D0B2] rounded-md cursor-pointer hover:bg-[#21D0B2]/20 transition-colors">
            <Upload className="h-4 w-4" />
            <span>Télécharger une image</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Statut</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="draft"
              checked={status === "draft"}
              onChange={() => setValue("status", "draft")}
              className="h-4 w-4 text-[#21D0B2] focus:ring-[#21D0B2]"
            />
            <span>Brouillon</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="published"
              checked={status === "published"}
              onChange={() => setValue("status", "published")}
              className="h-4 w-4 text-[#21D0B2] focus:ring-[#21D0B2]"
            />
            <span>Publié</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="bg-[#21D0B2] text-[#2F455C] hover:bg-[#1DCFE0]">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Création en cours..." : "Créer le programme"}
        </Button>
      </div>
    </form>
  )
}
