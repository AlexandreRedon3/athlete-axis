import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"

import { user } from "@/db/user"
import { authClient } from "@/lib/auth-client"
import { db } from "@/lib/db"

// Schéma de validation pour la création d'utilisateur
const createUserSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit comporter au moins 8 caractères"),
  isCoach: z.boolean().default(false),
  role: z.enum(["admin", "coach", "client"]).default("client"),
  // Champs optionnels
  image: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
})

// Clé secrète pour sécuriser l'API (à définir dans vos variables d'environnement)
const ADMIN_SECRET = process.env.ADMIN_SECRET

export async function POST(req: Request) {
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
    const result = createUserSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { 
          error: "Données invalides", 
          details: result.error.flatten() 
        },
        { status: 400 }
      )
    }
    
    const { 
      name, 
      email, 
      password, 
      isCoach, 
      role,
      image,
      address,
      zipCode,
      city,
      country,
      phoneNumber
    } = result.data

    // Vérifier si l'email existe déjà
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Cette adresse email est déjà utilisée" },
        { status: 409 }
      )
    }

    // Générer un ID unique
    const userId = crypto.randomUUID()

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer le compte Better Auth après l'utilisateur
    await authClient.signUp.email({
      name: name,
      email: email,
      password: password,
    })

    return NextResponse.json({
      success: true,
      message: `Utilisateur ${role} créé avec succès`,
    }, { status: 201 })

  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

// Route pour lister tous les utilisateurs
export async function GET(req: Request) {
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

    // Récupérer tous les utilisateurs (sans les mots de passe)
    const users = await db.query.user.findMany({
      columns: {
        password: false, // Exclure le mot de passe
      },
      orderBy: (user, { desc }) => [desc(user.createdAt)]
    })

    return NextResponse.json({
      success: true,
      users,
      count: users.length
    })

  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
} 