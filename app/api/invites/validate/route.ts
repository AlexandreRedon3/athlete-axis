import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { invites } from "@/db/invites"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 400 })
    }

    // Vérifier si l'invitation existe et est valide
    const invitation = await db.query.invites.findFirst({
      where: eq(invites.token, token),
    })

    if (!invitation) {
      return NextResponse.json({ error: "Invitation introuvable" }, { status: 404 })
    }

    if (invitation.used) {
      return NextResponse.json({ error: "Invitation déjà utilisée" }, { status: 400 })
    }

    if (new Date() > invitation.expiresAt) {
      return NextResponse.json({ error: "Invitation expirée" }, { status: 400 })
    }

    return NextResponse.json({ 
      valid: true, 
      coachId: invitation.coachId,
      expiresAt: invitation.expiresAt 
    })
  } catch (error) {
    console.error("Erreur lors de la validation de l'invitation:", error)
    return NextResponse.json(
      { error: "Erreur lors de la validation" },
      { status: 500 }
    )
  }
} 