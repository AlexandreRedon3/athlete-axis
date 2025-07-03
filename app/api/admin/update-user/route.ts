import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { user } from "@/db/user"
import { eq } from "drizzle-orm"
import { z } from "zod"
import bcrypt from "bcryptjs"

// Schéma de validation pour la mise à jour d'utilisateur
const updateUserSchema = z.object({
  userId: z.string().uuid("ID utilisateur invalide"),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  isCoach: z.boolean().optional(),
  onBoardingComplete: z.boolean().optional(),
  image: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
})

// Schéma spécifique pour mettre à jour isCoach
const updateIsCoachSchema = z.object({
  userId: z.string().uuid("ID utilisateur invalide"),
  isCoach: z.boolean(),
})

// Clé secrète pour sécuriser l'API
const ADMIN_SECRET = process.env.ADMIN_SECRET

export async function PUT(req: Request) {
  try {
    // Vérifier la clé secrète
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Clé d'authentification manquante" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    if (token !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Clé d'authentification invalide" },
        { status: 401 }
      )
    }

    // Parser le body
    const body = await req.json()
    
    // Vérifier si c'est une mise à jour spécifique de isCoach
    const isCoachUpdate = updateIsCoachSchema.safeParse(body)
    if (isCoachUpdate.success) {
      const { userId, isCoach } = isCoachUpdate.data
      
      // Vérifier si l'utilisateur existe
      const existingUser = await db.query.user.findFirst({
        where: eq(user.id, userId),
      })

      if (!existingUser) {
        return NextResponse.json(
          { error: "Utilisateur non trouvé" },
          { status: 404 }
        )
      }

      // Mettre à jour uniquement isCoach
      const updatedUser = await db.update(user)
        .set({ 
          isCoach: isCoach,
          updatedAt: new Date()
        })
        .where(eq(user.id, userId))
        .returning()

      return NextResponse.json({
        success: true,
        message: `Statut coach mis à jour avec succès`,
        user: {
          id: updatedUser[0].id,
          name: updatedUser[0].name,
          email: updatedUser[0].email,
          isCoach: updatedUser[0].isCoach
        }
      })
    }

    // Mise à jour générale
    const result = updateUserSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { 
          error: "Données invalides", 
          details: result.error.flatten() 
        },
        { status: 400 }
      )
    }

    const { userId, password, ...updateData } = result.data

    // Vérifier si l'utilisateur existe
    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      )
    }

    // Préparer les données de mise à jour
    const updateValues: any = {
      ...updateData,
      updatedAt: new Date(),
    }

    // Si un nouveau mot de passe est fourni, le hasher
    if (password) {
      updateValues.password = await bcrypt.hash(password, 12)
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await db.update(user)
      .set(updateValues)
      .where(eq(user.id, userId))
      .returning()

    // Retourner les informations mises à jour (sans le mot de passe)
    const userWithoutPassword = updatedUser[0]
    const { password: _, ...userData } = userWithoutPassword

    return NextResponse.json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      user: userData
    })

  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
} 