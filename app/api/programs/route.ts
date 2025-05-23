// app/api/programs/route.ts
import { db } from "@/lib/db"
import { program } from "@/db/program"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth-client"
import { z } from "zod"
import { auth } from "@/lib"
import { headers } from "next/headers"
import { eq } from "drizzle-orm/sql"

// Définir un schéma de validation spécifique pour l'API
// body : name: 'Testtttttttttt', description: 'Testtttttttttt', level: 'Débutant', type: 'Force', durationWeeks: 4, sessionsPerWeek: 3, status: 'draft', imageUrl: ''
const apiProgramSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(10),
    level: z.enum(["Débutant", "Intermédiaire", "Avancé"]),
    durationWeeks: z.coerce.number().min(1), // Utilise .coerce pour transformer string -> number si nécessaire
    sessionsPerWeek: z.coerce.number().min(1).max(7),
    status: z.enum(["draft", "published"]),
    imageUrl: z.string().optional(),
    type: z.enum(["Cardio", "Hypertrophie", "Force", "Endurance", "Mixte"]),
})



export async function POST(req: Request) {
console.log("📡 /api/programs route hit")

const session = await auth.api.getSession({
    headers: await headers()
  })

  try {
    const body = await req.json()
   
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
    
    // Valider les données du formulaire
    console.log("body : ", body);
    const result = apiProgramSchema.safeParse(body)
    console.log("result : ", result);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.flatten() },
        { status: 400 }
      )
    }
    
    const { name, description, level, durationWeeks, sessionsPerWeek, status, imageUrl, type } = result.data
    
    console.log("data : ", result.data);
    
    const programData = {
        name,
        description,
        level,
        type,
        durationWeeks,
        sessionsPerWeek,
        status,
        imageUrl,
        coachId: session.user.id,
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
  
    await db.insert(program).values(programData)
    return NextResponse.json(
      { message: "Programme créé", program: programData },
      { status: 201 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 })
  }
}

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    // Vérifier si l'utilisateur est connecté
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    
    const programs = await db.select().from(program).where(eq(program.coachId, session.user.id));
    return NextResponse.json(programs);
}