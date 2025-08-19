"use client"

import { CoachThemeProvider } from './theme-provider';
import { CoachDashboard } from './coach-dashboard';

/**
 * Wrapper pour le dashboard coach avec le theme provider personnalisé
 * Utilisez ce composant au lieu du CoachDashboard directement
 */
export function CoachDashboardWithTheme() {
  return (
    <CoachThemeProvider>
      <CoachDashboard />
    </CoachThemeProvider>
  );
}

export default CoachDashboardWithTheme;