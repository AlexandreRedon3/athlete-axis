"use client"

import { Activity, BarChart3, LucideIcon, Settings,Target, Users } from 'lucide-react';
import React from 'react';

import { useTheme } from '@/lib/theme-provider';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface DashboardNavProps {
  selectedTab: string;
  onTabChange: (tabId: string) => void;
  customItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'training', label: 'Entraînement', icon: Activity },
  { id: 'nutrition', label: 'Nutrition', icon: Target },
  { id: 'settings', label: 'Paramètres', icon: Settings }
];

export const DashboardNav = ({ 
  selectedTab, 
  onTabChange, 
  customItems = defaultNavItems 
}: DashboardNavProps) => {
  const { colors } = useTheme();

  return (
    <nav className={`${colors.headerBg} ${colors.border} border-b`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-6 overflow-x-auto">
          {customItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`
                flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm 
                transition-colors whitespace-nowrap relative
                ${selectedTab === id
                  ? 'border-emerald-500 text-emerald-600'
                  : `border-transparent ${colors.textSecondary} hover:text-emerald-600`
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
              {badge && badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};