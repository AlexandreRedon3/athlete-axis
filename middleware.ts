// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@/db/session";

// Middleware d'authentification
export default async function middleware(request: NextRequest) {
  // Vérifiez si c'est une route d'authentification
  const pathname = request.nextUrl.pathname;
  if (pathname.includes('/sign-in') || pathname.includes('/sign-up')) {
    return NextResponse.next();
  }
  
  // Vérifiez l'authentification pour les autres routes
  try {
    const { data: session } = await betterFetch<Session>(
      `/api/auth/get-session`,
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    );
    
    console.log("session", session?.user);
    

    if (!session) {
      return NextResponse.redirect(new URL(`/sign-in`, request.url));
    }

    // Ajoute une vérification pour la route /dashboard spécifiquement
  if (pathname === '/dashboard') {
    // Rediriger selon le type d'utilisateur
    if (session.user?.isCoach === true) {
      return NextResponse.redirect(new URL(`/dashboard/pro/${session.user.id}`, request.url));
    }
    
    if (session.user?.isCoach === false) {
      return NextResponse.redirect(new URL(`/dashboard/client/${session.user.id}`, request.url));
    }
  }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Erreur lors de la vérification de la session:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Excluez les fichiers statiques et les API
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};