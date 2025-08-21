import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { user } from "@/db/user";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// Schéma de validation pour la mise à jour du profil utilisateur
const updateProfileSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères").optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  image: z.string().optional(),
  bio: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Parser le body
    const body = await req.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { 
          error: "Données invalides", 
          details: result.error.flatten() 
        },
        { status: 400 }
      );
    }

    const updateData = result.data;

    // Vérifier si l'utilisateur existe
    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await db.update(user)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))
      .returning();

    // Retourner les informations mises à jour (sans le mot de passe)
    const userWithoutPassword = updatedUser[0];
    const { password: _, ...userData } = userWithoutPassword;

    return NextResponse.json({
      success: true,
      message: "Profil mis à jour avec succès",
      user: userData
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 