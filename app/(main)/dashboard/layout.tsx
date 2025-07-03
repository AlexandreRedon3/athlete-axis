import type React from "react"
import { Dumbbell } from "lucide-react"
import Link from "next/link"
import { LogoutButton } from "@/components/ui/logout-button"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { cookies, headers } from "next/headers"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const data = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  })
  const user = data.data?.user ? data.data.user : null
  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-200">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <Dumbbell className="h-6 w-6 text-primary transition-colors duration-200 group-hover:text-primary/80" />
              <span className="text-xl font-bold text-foreground transition-colors duration-200">AthleteAxis</span>
              <span className="ml-2 bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full font-medium transition-colors duration-200">
                {user?.isCoach ? "Coach" : "Athlète"}
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              className="text-foreground hover:text-primary hover:bg-accent transition-colors duration-200"
            >
              <User className="h-5 w-5" />
              <span className="ml-2 hidden md:inline">Mon profil</span>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="transition-colors duration-200">{children}</main>
    </div>
  )
}
