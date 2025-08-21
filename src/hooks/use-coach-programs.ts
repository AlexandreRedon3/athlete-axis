// src/hooks/use-coach-programs.ts
"use client"

import { useEffect,useState } from 'react';

import { useRefreshStore } from '../lib/refresh-store';

interface Program {
  id: string;
  name: string;
  description: string;
  level: string;
  type: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  status: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseCoachProgramsReturn {
  programs: Program[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCoachPrograms = (): UseCoachProgramsReturn => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Écouter les changements du store Zustand pour rafraîchir automatiquement
  const refreshKey = useRefreshStore(state => state.getRefreshKey('programs'));

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/coach/programs');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des programmes');
      }
      
      const data = await response.json();
      
      if (data.programs) {
        setPrograms(data.programs);
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial et à chaque changement du refreshKey
  useEffect(() => {
    fetchPrograms();
  }, [refreshKey]);

  return {
    programs,
    isLoading,
    error,
    refetch: fetchPrograms
  };
};