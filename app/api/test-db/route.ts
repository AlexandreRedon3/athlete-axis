import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET() {
  try {
    // Test avec la variable DATABASE_URL de Vercel
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return NextResponse.json({
        error: "DATABASE_URL manquante",
        env: {
          NODE_ENV: process.env.NODE_ENV,
          hasDbUrl: !!process.env.DATABASE_URL,
          appUrl: process.env.NEXT_PUBLIC_APP_URL,
        }
      }, { status: 500 });
    }

    // Connexion basique avec pg
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    // Test de connexion simple
    const client = await pool.connect();
    
    // Vérifier les tables existantes
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    // Compter les utilisateurs (si la table existe)
    let userCount = null;
    try {
      const userResult = await client.query('SELECT COUNT(*) FROM "user"');
      userCount = parseInt(userResult.rows[0].count);
    } catch (e) {
      console.log("Table user n'existe pas encore");
    }
    
    client.release();
    await pool.end();

    return NextResponse.json({
      success: true,
      message: "Connexion à la base de données réussie",
      database: {
        connected: true,
        tables: tablesResult.rows.map((row: { table_name: string }) => row.table_name),
        userCount,
        url: databaseUrl.substring(0, 50) + "...",
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        hasAuthSecret: !!process.env.BETTER_AUTH_SECRET,
        hasAdminSecret: !!process.env.ADMIN_SECRET,
      }
    });

  } catch (error) {
    console.error("Erreur de connexion DB:", error);
    
    return NextResponse.json({
      error: "Erreur de connexion à la base de données",
      details: error instanceof Error ? error.message : "Erreur inconnue",
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      }
    }, { status: 500 });
  }
}