// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@/db/session";

// Middleware d'authentification
export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  console.log("🔍 Middleware - Pathname:", pathname);
  
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
    console.log("✅ Route publique, passage libre");
    response = NextResponse.next();
  } else {
    console.log("🔐 Route protégée, vérification de l'authentification");
    
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
          
      console.log("📊 Session récupérée:", session ? "OUI" : "NON");

      if (!session) {
        console.log("❌ Pas de session, redirection vers /sign-in");
        response = NextResponse.redirect(new URL(`/sign-in`, request.url));
      } else {
        console.log("👤 Utilisateur:", session.user?.email, "isCoach:", session.user?.isCoach);

        // Gérer les redirections pour le dashboard
        if (pathname === '/dashboard') {
          console.log("🎯 Redirection dashboard selon le type d'utilisateur");
          // Rediriger selon le type d'utilisateur
          if (session.user?.isCoach === true) {
            const redirectUrl = `/dashboard/pro/${session.user.id}`;
            console.log("🏋️ Redirection vers:", redirectUrl);
            console.log("📍 URL complète:", new URL(redirectUrl, request.url).toString());
            response = NextResponse.redirect(new URL(redirectUrl, request.url));
          } else if (session.user?.isCoach === false) {
            const redirectUrl = `/dashboard/client/${session.user.id}`;
            console.log("🏃 Redirection vers:", redirectUrl);
            console.log("📍 URL complète:", new URL(redirectUrl, request.url).toString());
            response = NextResponse.redirect(new URL(redirectUrl, request.url));
          } else {
            console.log("⚠️ isCoach n'est ni true ni false, passage libre");
            response = NextResponse.next();
          }
          console.log("🔄 Réponse de redirection créée");
        } else {
          console.log("📄 Page normale, pas de redirection");
          response = NextResponse.next();
        }
        
        console.log("✅ Authentification réussie, passage libre");
      }
    } catch (error) {
      console.error("💥 Erreur lors de la vérification de la session:", error);
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