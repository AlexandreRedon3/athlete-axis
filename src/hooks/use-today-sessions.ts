"use client"

import { useState, useEffect } from 'react';

interface TodaySession {
  id: string;
  client: string;
  type: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  programName?: string;
}

interface UseTodaySessionsReturn {
  sessions: TodaySession[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTodaySessions = (): UseTodaySessionsReturn => {
  const [sessions, setSessions] = useState<TodaySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/coach/today-sessions');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des sessions du jour');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.sessions);
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      // En cas d'erreur, on utilise des données par défaut
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return {
    sessions,
    isLoading,
    error,
    refetch: fetchSessions
  };
}; 