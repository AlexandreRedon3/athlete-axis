import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"

import { account } from "@/db/account"
import { coachClient } from "@/db/coach_client"
import { invites } from "@/db/invites"
import { user } from "@/db/user"
import { db } from "@/lib/db"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  inviteToken: z.string(),
  image: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, password, inviteToken, image } = result.data

    // Vérifier si l'invitation existe et est valide
    const invitation = await db.query.invites.findFirst({
      where: eq(invites.token, inviteToken),
    })

    if (!invitation || invitation.used || new Date() > invitation.expiresAt) {
      return NextResponse.json(
        { error: "Invitation invalide ou expirée" },
        { status: 400 }
      )
    }

    // Vérifier si l'email est déjà utilisé
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Cette adresse email est déjà utilisée" },
        { status: 400 }
      )
    }

    // Créer l'utilisateur via Better Auth pour avoir le hash du mot de passe
    const userId = crypto.randomUUID()
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const values = {
      id: userId,
      name: name || "",
      username: name || "",
      email: email,
      emailVerified: false,
      image: image || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      twoFactorEnabled: false,
      isCoach: false,
      onBoardingComplete: false,
      stripeId: null,
      address: null,
      zipCode: null,
      city: null,
      country: null,
      phoneNumber: null,
      emailNotifications: false,
      smsNotifications: false,
      password: hashedPassword,
      coachId: null,
    };

    await db.insert(user).values(values)

    // Créer le compte Better Auth après l'utilisateur
    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: email, // Pour les comptes credentials, utiliser l'email
      providerId: "credentials",
      userId: userId,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Créer la relation coach-client
    await db.insert(coachClient).values({
      coachId: invitation.coachId,
      clientId: userId,
    })

    // Marquer l'invitation comme utilisée
    await db.update(invites)
      .set({ used: true })
      .where(eq(invites.token, inviteToken))

    return NextResponse.json(
      { message: "Inscription réussie", user: { id: userId, email, name } },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    )
  }
} 