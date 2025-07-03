import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/db/user";
import { coachClient } from "@/db/coach_client";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Récupérer le coach connecté
    const coach = await db.query.user.findFirst({
      where: eq(user.email, session.user.email),
    });

    if (!coach || !coach.isCoach) {
      return NextResponse.json(
        { error: "Accès réservé aux coaches" },
        { status: 403 }
      );
    }

    // Récupérer tous les clients du coach
    const clients = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        displayUsername: user.displayUsername,
        image: user.image,
        onBoardingComplete: user.onBoardingComplete,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        address: user.address,
        zipCode: user.zipCode,
        city: user.city,
        country: user.country,
        phoneNumber: user.phoneNumber,
        emailNotifications: user.emailNotifications,
        smsNotifications: user.smsNotifications,
      })
      .from(user)
      .innerJoin(coachClient, eq(coachClient.clientId, user.id))
      .where(eq(coachClient.coachId, coach.id));

    return NextResponse.json({
      success: true,
      clients,
      total: clients.length,
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 