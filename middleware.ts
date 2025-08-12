import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@/db/session";

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;  
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
    '/api/metrics',
  ];
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  let response: NextResponse;
  
  if (isPublicRoute) {
    response = NextResponse.next();
  } else {
    
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
        if (pathname === '/dashboard') {
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
      response = NextResponse.redirect(new URL(`/sign-in`, request.url));
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};