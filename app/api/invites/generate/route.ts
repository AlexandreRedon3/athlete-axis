import { NextResponse } from "next/server"
import { auth } from "@/lib"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { invites } from "@/db/invites"
import { nanoid } from "nanoid"

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Générer un token unique
    const token = nanoid(32)
    
    // Créer une invitation dans la base de données
    await db.insert(invites).values({
      id: crypto.randomUUID(),
      token,
      coachId: session.user.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expire dans 24h
      used: false
    })

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Erreur lors de la génération de l'invitation:", error)
    return NextResponse.json(
      { error: "Erreur lors de la génération de l'invitation" },
      { status: 500 }
    )
  }
} 