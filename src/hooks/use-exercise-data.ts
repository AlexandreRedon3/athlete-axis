import { useState, useEffect } from 'react';
import { useRefreshStore } from '../lib/refresh-store';

export interface Program {
  id: string;
  name: string;
  description?: string;
  type: string;
  level: string;
  status: 'published' | 'draft';
  durationWeeks: number;
  sessionsPerWeek: number;
}

export interface ExerciseLibraryItem {
  id: string;
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment?: string;
  instructions?: string;
  difficulty: string;
}

// Hook pour récupérer les programmes du coach
export const useCoachPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshKey = useRefreshStore(state => state.getRefreshKey('programs'));

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/programs');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des programmes');
        }
        const data = await response.json();
        setPrograms(data.programs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur programmes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, [refreshKey]);

  return { programs, isLoading, error, refetch: () => useRefreshStore.getState().triggerRefresh('programs') };
};

// Hook pour récupérer la bibliothèque d'exercices
export const useExerciseLibrary = (searchTerm: string = '') => {
  const [exercises, setExercises] = useState<ExerciseLibraryItem[]>([]);
  const [filters, setFilters] = useState<{ categories: string[]; difficulties: string[]; }>({ categories: [], difficulties: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        const response = await fetch(`/api/exercises/library?${params}`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement de la bibliothèque');
        }
        const data = await response.json();
        setExercises(data.exercises || []);
        setFilters(data.filters || { categories: [], difficulties: [] });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur bibliothèque:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Débounce pour la recherche
    const debounceTimer = setTimeout(fetchExercises, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return { exercises, filters, isLoading, error };
};

// Hook pour ajouter un exercice
export const useAddExercise = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const addExercise = async (exerciseData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/programs/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout de l\'exercice');
      }
      
      const result = await response.json();
      // Trigger refresh for programs to update exercise counts
      useRefreshStore.getState().triggerRefresh('programs');
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { addExercise, isSubmitting };
}; 