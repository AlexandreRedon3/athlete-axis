import { XCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function InvitationInvalidePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md text-center space-y-6 p-8">
        <div className="flex justify-center">
          <XCircle className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Invitation invalide</h1>
        <p className="text-muted-foreground">
          Le lien d'invitation que vous avez utilisé est invalide, a déjà été utilisé ou a expiré.
          Veuillez contacter votre coach pour obtenir un nouveau lien d'invitation.
        </p>
        <Button asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  )
} 