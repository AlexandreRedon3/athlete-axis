import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { user } from "@/db/user"
import { eq } from "drizzle-orm"
import { z } from "zod"

// Schéma de validation pour la mise à jour du statut coach
const updateCoachStatusSchema = z.object({
  userId: z.string(),
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
    const result = updateCoachStatusSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { 
          error: "Données invalides", 
          details: result.error.flatten() 
        },
        { status: 400 }
      )
    }

    const { userId, isCoach } = result.data

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

    // Mettre à jour uniquement le statut coach
    const updatedUser = await db.update(user)
      .set({ 
        isCoach: isCoach,
        updatedAt: new Date()
      })
      .where(eq(user.id, userId))
      .returning()

    return NextResponse.json({
      success: true,
      message: `Statut coach mis à jour avec succès pour ${updatedUser[0].name}`,
      user: {
        id: updatedUser[0].id,
        name: updatedUser[0].name,
        email: updatedUser[0].email,
        isCoach: updatedUser[0].isCoach
      }
    })

  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut coach:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
} 