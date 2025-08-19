// src/hooks/use-program-sessions.ts
import { useEffect,useState } from 'react';

import { useRefreshStore } from '../lib/refresh-store';

export interface ProgramSession {
  id: string;
  name: string;
  weekNumber: number;
  dayNumber: number;
  type: string;
  targetRPE: number;
  duration: number;
  exercises: ProgramExercise[];
  notes?: string;
  exerciseCount: number;
}

export interface ProgramExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rpe?: number;
  restSeconds?: number;
  order: number;
  category?: string;
}

export interface ClientProgress {
  clientId: string;
  clientName: string;
  completedSessions: number;
  totalSessions: number;
  averageRPE: number;
  lastSessionDate?: Date;
  notes?: string;
}

export const useProgramSessions = (programId: string | null) => {
  const [sessions, setSessions] = useState<ProgramSession[]>([]);
  const [clientProgress, setClientProgress] = useState<ClientProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const refreshKey = useRefreshStore(state => state.getRefreshKey(`program-${programId}`));

  useEffect(() => {
    if (!programId) {
      setSessions([]);
      setClientProgress(null);
      return;
    }

    const fetchProgramData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const sessionsResponse = await fetch(`/api/programs/${programId}/sessions`);
        if (!sessionsResponse.ok) {
          throw new Error('Erreur lors du chargement des sessions');
        }
        const sessionsData = await sessionsResponse.json();
        
        // Transformer les données pour correspondre à l'interface
        const transformedSessions: ProgramSession[] = sessionsData.sessions.map((session: any) => ({
          id: session.id,
          name: session.name,
          weekNumber: session.weekNumber || 1,
          dayNumber: session.dayNumber || session.order,
          type: session.type || 'Push', // Valeur par défaut
          targetRPE: session.targetRPE || 7, // Valeur par défaut
          duration: session.duration || 60, // Valeur par défaut
          exercises: session.exercises || [],
          notes: session.notes,
          exerciseCount: session.exerciseCount || 0
        }));

        setSessions(transformedSessions);

        // Récupérer les exercices pour chaque session
        const sessionsWithExercises = await Promise.all(
          transformedSessions.map(async (session) => {
            try {
              const exercisesResponse = await fetch(`/api/programs/exercises?programId=${programId}&sessionId=${session.id}`);
              if (exercisesResponse.ok) {
                const exercisesData = await exercisesResponse.json();
                return {
                  ...session,
                  exercises: exercisesData.exercises || []
                };
              }
              return session;
            } catch (error) {
              console.error(`Erreur lors du chargement des exercices pour la session ${session.id}:`, error);
              return session;
            }
          })
        );

        setSessions(sessionsWithExercises);

        // Récupérer les données de progression client (si le programme est publié)
        try {
          const progressResponse = await fetch(`/api/programs/${programId}/progress`);
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            setClientProgress(progressData.progress);
          }
        } catch (error) {
          // Pas de progression disponible, c'est normal pour les programmes non publiés
          console.log('Aucune progression client disponible pour ce programme');
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur sessions programme:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgramData();
  }, [programId, refreshKey]);

  const refetch = () => {
    useRefreshStore.getState().triggerRefresh(`program-${programId}`);
  };

  return { 
    sessions, 
    clientProgress,
    isLoading, 
    error, 
    refetch 
  };
}; 