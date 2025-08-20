// app/(main)/dashboard/layout.tsx
import { headers } from "next/headers"
import type React from "react"

import { DashboardHeaderClient } from "@/components/coach/dashboard/navigation/dashboard-header-client"
import { authClient } from "@/lib/auth-client"
import { ThemeProvider } from "@/lib/theme-provider"

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
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300">
        {/* Header unifié modernisé */}
        <DashboardHeaderClient user={user} />

        {/* Main content sans header supplémentaire */}
        <main className="transition-colors duration-300">{children}</main>
      </div>
    </ThemeProvider>
  )
}