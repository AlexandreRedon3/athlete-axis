// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@/db/session";

// Middleware d'authentification
export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;  
  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/invitation-invalide',
    '/pro',
    '/test-auth',
    '/api/auth',
    '/api/invites/validate',
    '/api/uploadthing',
    '/api/metrics', // Important: ne pas protéger l'endpoint de métriques
  ];
  
  // Vérifier si c'est une route publique
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  let response: NextResponse;
  
  if (isPublicRoute) {
    response = NextResponse.next();
  } else {
    
    // Vérifiez l'authentification pour les routes protégées
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
        response = NextResponse.redirect(new URL(`/sign-in`, request.url));
      } else {
        // Gérer les redirections pour le dashboard
        if (pathname === '/dashboard') {
          // Rediriger selon le type d'utilisateur
          if (session.user?.isCoach === true) {
            const redirectUrl = `/dashboard/pro/${session.user.id}`;
            response = NextResponse.redirect(new URL(redirectUrl, request.url));
          } else if (session.user?.isCoach === false) {
            const redirectUrl = `/dashboard/client/${session.user.id}`;
            response = NextResponse.redirect(new URL(redirectUrl, request.url));
          } else {
            response = NextResponse.next();
          }
        } else {
          response = NextResponse.next();
        }
        
      }
    } catch (error) {
      // En cas d'erreur, rediriger vers la page de connexion
      response = NextResponse.redirect(new URL(`/sign-in`, request.url));
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    // Excluez les fichiers statiques et les API
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};