import { nanoid } from "nanoid"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { invites } from "@/db/invites"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
    // Vérifier que l'utilisateur est coach
    if (!session.user.isCoach) {
      return NextResponse.json({ error: "Seuls les coachs peuvent inviter" }, { status: 403 })
    }
    // Récupérer l'email du body
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 })
    }
    // Générer un token unique
    const token = nanoid(32)
    // Créer une invitation dans la base de données
    await db.insert(invites).values({
      id: crypto.randomUUID(),
      token,
      coachId: session.user.id,
      email,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      used: false
    })
    // Construire le lien d'invitation
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const inviteLink = `${baseUrl}/sign-up/${token}`
    return NextResponse.json({ token, inviteLink })
  } catch (error) {
    console.error("Erreur lors de la génération de l'invitation:", error)
    return NextResponse.json(
      { error: "Erreur lors de la génération de l'invitation" },
      { status: 500 }
    )
  }
} 