import type React from "react"
import { Dumbbell } from "lucide-react"
import Link from "next/link"
import { LogoutButton } from "@/components/ui/logout-button"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { cookies, headers } from "next/headers"

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
    <div className="min-h-screen bg-[#2F455C]/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#2F455C]/80 backdrop-blur supports-[backdrop-filter]:bg-[#2F455C]/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Dumbbell className="h-6 w-6 text-[#21D0B2]" />
              <span className="text-xl font-bold text-white">AthleteAxis</span>
              <span className="ml-2 bg-[#E2F163] text-[#2F455C] text-xs px-2 py-0.5 rounded-full font-medium">
                {user?.isCoach ? "Coach" : "Athlète"}
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white hover:text-[#21D0B2] hover:bg-white/10">
              <User className="h-5 w-5" />
              <span className="ml-2 hidden md:inline">Mon profil</span>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>
    </div>
  )
}
