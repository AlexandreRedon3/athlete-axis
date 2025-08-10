import { useState } from 'react';
import { useRefreshStore } from '../lib/refresh-store';

// Hook pour supprimer une session
export const useDeleteSession = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const triggerRefresh = useRefreshStore(state => state.triggerRefresh);

  const deleteSession = async (programId: string, sessionId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/programs/${programId}/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }

      // Déclencher le rafraîchissement des données
      triggerRefresh(`program-${programId}`);
      triggerRefresh('programs');

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de la session:', error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteSession, isDeleting };
};

// Hook pour dupliquer une session
export const useDuplicateSession = () => {
  const [isDuplicating, setIsDuplicating] = useState(false);
  const triggerRefresh = useRefreshStore(state => state.triggerRefresh);

  const duplicateSession = async (programId: string, sessionId: string) => {
    setIsDuplicating(true);
    try {
      const response = await fetch(`/api/programs/${programId}/sessions/${sessionId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la duplication');
      }

      const result = await response.json();

      // Déclencher le rafraîchissement des données
      triggerRefresh(`program-${programId}`);
      triggerRefresh('programs');

      return result;
    } catch (error) {
      console.error('Erreur lors de la duplication de la session:', error);
      throw error;
    } finally {
      setIsDuplicating(false);
    }
  };

  return { duplicateSession, isDuplicating };
};

// Hook pour supprimer un programme
export const useDeleteProgram = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const triggerRefresh = useRefreshStore(state => state.triggerRefresh);

  const deleteProgram = async (programId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }

      // Déclencher le rafraîchissement des données
      triggerRefresh('programs');

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression du programme:', error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteProgram, isDeleting };
};

// Hook pour dupliquer un programme
export const useDuplicateProgram = () => {
  const [isDuplicating, setIsDuplicating] = useState(false);
  const triggerRefresh = useRefreshStore(state => state.triggerRefresh);

  const duplicateProgram = async (programId: string) => {
    setIsDuplicating(true);
    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la duplication');
      }

      const result = await response.json();

      // Déclencher le rafraîchissement des données
      triggerRefresh('programs');

      return result;
    } catch (error) {
      console.error('Erreur lors de la duplication du programme:', error);
      throw error;
    } finally {
      setIsDuplicating(false);
    }
  };

  return { duplicateProgram, isDuplicating };
};

// Hook pour mettre à jour un programme
export const useUpdateProgram = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const triggerRefresh = useRefreshStore(state => state.triggerRefresh);

  const updateProgram = async (programId: string, programData: {
    name?: string;
    description?: string;
    type?: string;
    level?: string;
    durationWeeks?: number;
    sessionsPerWeek?: number;
  }) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      const result = await response.json();

      // Déclencher le rafraîchissement des données
      triggerRefresh('programs');
      triggerRefresh(`program-${programId}`);

      return result;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du programme:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateProgram, isUpdating };
}; 