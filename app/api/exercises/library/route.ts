// app/api/exercises/library/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { exerciseLibrary } from "@/db";
import { like, eq, or } from "drizzle-orm";

// GET /api/exercises/library - Recherche dans la bibliothèque
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    // Construire la requête avec conditions
    let exercises;
    
    if (search && category) {
      exercises = await db
        .select()
        .from(exerciseLibrary)
        .where(or(
          like(exerciseLibrary.name, `%${search}%`),
          eq(exerciseLibrary.category, category)
        ));
    } else if (search) {
      exercises = await db
        .select()
        .from(exerciseLibrary)
        .where(like(exerciseLibrary.name, `%${search}%`));
    } else if (category) {
      exercises = await db
        .select()
        .from(exerciseLibrary)
        .where(eq(exerciseLibrary.category, category));
    } else {
      exercises = await db.select().from(exerciseLibrary);
    }

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error("Erreur GET /api/exercises/library:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}