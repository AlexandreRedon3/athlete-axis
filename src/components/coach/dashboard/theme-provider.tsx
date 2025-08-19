"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

interface ThemeColors {
  // Couleurs de fond
  bg: string;
  cardBg: string;
  sidebarBg: string;
  
  // Couleurs de texte
  text: string;
  textSecondary: string;
  textMuted: string;
  
  // Couleurs de bordure
  border: string;
  borderLight: string;
  
  // Couleurs d'accent
  primary: string;
  primaryHover: string;
  success: string;
  warning: string;
  error: string;
  
  // Couleurs d'état
  hover: string;
  active: string;
}

interface ThemeContextType {
  theme: string | undefined;
  colors: ThemeColors;
  setTheme: (theme: string) => void;
}

const lightColors: ThemeColors = {
  bg: 'bg-gray-50',
  cardBg: 'bg-white',
  sidebarBg: 'bg-white',
  text: 'text-gray-900',
  textSecondary: 'text-gray-600',
  textMuted: 'text-gray-500',
  border: 'border-gray-200',
  borderLight: 'border-gray-100',
  primary: 'bg-blue-600',
  primaryHover: 'hover:bg-blue-700',
  success: 'bg-green-600',
  warning: 'bg-yellow-500',
  error: 'bg-red-600',
  hover: 'hover:bg-gray-50',
  active: 'bg-gray-100',
};

const darkColors: ThemeColors = {
  bg: 'bg-gray-900',
  cardBg: 'bg-gray-800',
  sidebarBg: 'bg-gray-900',
  text: 'text-gray-100',
  textSecondary: 'text-gray-300',
  textMuted: 'text-gray-400',
  border: 'border-gray-700',
  borderLight: 'border-gray-800',
  primary: 'bg-blue-500',
  primaryHover: 'hover:bg-blue-600',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  hover: 'hover:bg-gray-800',
  active: 'bg-gray-700',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function CoachThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const colors = mounted && theme === 'dark' ? darkColors : lightColors;

  const value: ThemeContextType = {
    theme: mounted ? theme : undefined,
    colors,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a CoachThemeProvider');
  }
  return context;
}

// Export par défaut pour la compatibilité
export default CoachThemeProvider;