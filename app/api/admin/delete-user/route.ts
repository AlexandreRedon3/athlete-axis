import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"

import { account } from "@/db/account"
import { user } from "@/db/user"
import { db } from "@/lib/db"

// Schéma de validation pour la suppression d'utilisateur
const deleteUserSchema = z.object({
  userId: z.string().uuid("ID utilisateur invalide"),
})

// Clé secrète pour sécuriser l'API
const ADMIN_SECRET = process.env.ADMIN_SECRET

export async function DELETE(req: Request) {
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
    const result = deleteUserSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { 
          error: "Données invalides", 
          details: result.error.flatten() 
        },
        { status: 400 }
      )
    }

    const { userId } = result.data

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

    // Supprimer les comptes associés (Better Auth)
    await db.delete(account).where(eq(account.userId, userId))

    // Supprimer l'utilisateur
    await db.delete(user).where(eq(user.id, userId))

    return NextResponse.json({
      success: true,
      message: "Utilisateur supprimé avec succès",
      deletedUser: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name
      }
    })

  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
} 