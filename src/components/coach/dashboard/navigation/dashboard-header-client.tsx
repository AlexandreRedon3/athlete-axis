"use client"
import React from 'react';

import { Bell, Dumbbell, User } from "lucide-react"
import Link from "next/link"
import type React from "react"

import { ModernThemeToggle } from "@/components/coach/dashboard/ui/modern-theme-toggle"
import { QuickActionsMenu } from "@/components/coach/dashboard/ui/quick-actions-menu"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/ui/logout-button"
import { useTheme } from "@/lib/theme-provider"

interface DashboardHeaderClientProps {
  user: {
    id?: string
    name?: string | null
    isCoach?: boolean | null
  } | null
}

export const DashboardHeaderClient = ({ user }: DashboardHeaderClientProps) => {
  const { colors } = useTheme()

  return (
    <header className={`sticky top-0 z-50 w-full border-b ${colors.border} ${colors.headerBg} backdrop-blur supports-[backdrop-filter]:bg-opacity-95 transition-colors duration-300`}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo et informations utilisateur */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Dumbbell className="h-4 w-4 text-white transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div>
              <span className={`text-xl font-bold ${colors.text} transition-colors duration-200`}>
                AthleteAxis
              </span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs px-2 py-0.5 rounded-full font-medium transition-colors duration-200">
                  {user?.isCoach ? "Coach" : "Athlète"}
                </span>
                {user?.name && (
                  <span className={`text-xs ${colors.textSecondary}`}>
                    {user.name}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
        
        {/* Actions à droite */}
        <div className="flex items-center gap-3">
          {/* Menu d'actions rapides (pour les coaches) */}
          {user?.isCoach && <QuickActionsMenu />}
          
          {/* Notifications (pour les coaches) */}
          {user?.isCoach && (
            <button className={`p-2 ${colors.hover} rounded-lg transition-colors relative`}>
              <Bell className={`h-4 w-4 ${colors.textSecondary}`} />
              {/* Badge de notification */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                2
              </span>
            </button>
          )}
          
          <ModernThemeToggle />
          
          <Link href="/dashboard/profile">
            <Button 
              variant="ghost" 
              size="sm"
              className={`${colors.text} hover:text-emerald-600 ${colors.hover} transition-colors duration-200`}
            >
              <User className="h-4 w-4" />
              <span className="ml-2 hidden md:inline">Mon profil</span>
            </Button>
          </Link>
          
          <LogoutButton />
        </div>
      </div>
    </header>
  )
} 