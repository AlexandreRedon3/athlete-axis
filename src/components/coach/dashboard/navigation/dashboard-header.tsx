"use client"

import { Bell, Dumbbell, Plus } from 'lucide-react';

import { useTheme } from '@/lib/theme-provider';
import { ModernThemeToggle } from '../ui/modern-theme-toggle';
import { QuickActionButton } from '../ui/quick-action-button';

interface DashboardHeaderProps {
  onCreateProgram?: () => void;
  onNotificationClick?: () => void;
  coachName?: string;
}

export const DashboardHeader = ({ 
  onCreateProgram, 
  onNotificationClick,
  coachName 
}: DashboardHeaderProps) => {
  const { colors } = useTheme();

  return (
    <header className={`${colors.headerBg} shadow-sm ${colors.border} border-b`}>
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo et titre */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className={`${colors.text} text-lg font-bold`}>AthleteAxis</h1>
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  Coach
                </span>
                {coachName && (
                  <span className={`${colors.textSecondary} text-xs`}>
                    {coachName}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions à droite */}
          <div className="flex items-center space-x-3">
            <QuickActionButton 
              icon={Plus} 
              label="Créer un programme" 
              onClick={onCreateProgram}
            />
            
            <button 
              onClick={onNotificationClick}
              className={`p-2 ${colors.hover} rounded-lg transition-colors relative`}
            >
              <Bell className={`w-4 h-4 ${colors.textSecondary}`} />
              {/* Badge de notification */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                2
              </span>
            </button>
            
            <ModernThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};