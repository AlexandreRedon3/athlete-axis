// src/components/coach/dashboard/ui/modern-theme-toggle.tsx
"use client"

import { Moon,Sun } from 'lucide-react';

import { Button } from '../../../../components/ui/button';
import { useTheme } from '../../../../lib/theme-provider';

export const ModernThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0 hover:bg-accent transition-all duration-300"
      title={`Basculer vers le thème ${theme === 'light' ? 'sombre' : 'clair'}`}
    >
      <div className="relative w-4 h-4">
        <Sun 
          className={`absolute transition-all duration-300 ${
            theme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
          }`} 
        />
        <Moon 
          className={`absolute transition-all duration-300 ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`} 
        />
      </div>
    </Button>
  );
};