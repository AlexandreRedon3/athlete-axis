"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary" | "white" | "dark"
  showText?: boolean
}

export function LogoutButton({ variant = "outline", showText = true }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await authClient.signOut()
      toast.success("Déconnexion réussie")
      router.push("/sign-in")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      disabled={isLoading}
      className="text-white border-white hover:bg-white/10 hover:text-[#21D0B2]"
    >
      {isLoading ? (
        <>
          <span className="h-5 w-5 mr-2 animate-spin">⟳</span>
          {showText && <span>Déconnexion...</span>}
        </>
      ) : (
        <>
          <LogOut className="h-5 w-5 mr-2" />
          {showText && <span className="hidden md:inline">Déconnexion</span>}
        </>
      )}
    </Button>
  )
}
