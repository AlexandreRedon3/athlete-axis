"use client"

import { useTheme as useNextTheme } from 'next-themes';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import React from 'react';

export type Theme = 'light' | 'dark';

interface ThemeColors {
  bg: string;
  cardBg: string;
  headerBg: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes: Record<Theme, ThemeColors> = {
  light: {
    bg: 'bg-gray-50',
    cardBg: 'bg-white',
    headerBg: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-50'
  },
  dark: {
    bg: 'bg-gray-900',
    cardBg: 'bg-gray-800',
    headerBg: 'bg-gray-800',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700'
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();
  const [theme, setTheme] = useState<Theme>('light');

  // Synchroniser avec next-themes
  useEffect(() => {
    if (nextTheme === 'light' || nextTheme === 'dark') {
      setTheme(nextTheme);
    }
  }, [nextTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setNextTheme(newTheme);
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    setNextTheme(newTheme);
  };

  const value = {
    theme,
    setTheme: handleSetTheme,
    colors: themes[theme],
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};