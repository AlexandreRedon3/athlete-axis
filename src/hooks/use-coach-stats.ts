"use client"

import { useState, useEffect } from 'react';

interface CoachStats {
  totalClients: number;
  activeClients: number;
  totalPrograms: number;
  publishedPrograms: number;
  newClientsThisMonth: number;
  newProgramsThisMonth: number;
  completionRate: number;
  publishRate: number;
}

interface UseCoachStatsReturn {
  stats: CoachStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCoachStats = (): UseCoachStatsReturn => {
  const [stats, setStats] = useState<CoachStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/coach/stats');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats
  };
};

