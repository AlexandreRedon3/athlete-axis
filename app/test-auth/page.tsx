"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function TestAuthPage() {
  const { data: session, isPending } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center">Test d'authentification</h1>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">État de la session :</h2>
          <p>Chargement : {isPending ? "OUI" : "NON"}</p>
          <p>Session : {session ? "OUI" : "NON"}</p>
          
          {session && (
            <div className="mt-4 space-y-2">
              <p><strong>Email :</strong> {session.user.email}</p>
              <p><strong>Nom :</strong> {session.user.name}</p>
              <p><strong>ID :</strong> {session.user.id}</p>
              <p><strong>Token :</strong> {session.session.token}</p>
              <p><strong>isCoach :</strong> {session.user.isCoach ? "OUI" : "NON"}</p>
              <p><strong>Email vérifié :</strong> {session.user.emailVerified ? "OUI" : "NON"}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Button 
            onClick={() => window.location.href = "/sign-in"}
            className="w-full"
          >
            Aller à la page de connexion
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/"}
            variant="outline"
            className="w-full"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
} 