// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";

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

    if (!session) {
      return NextResponse.redirect(new URL(`/sign-in`, request.url));
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