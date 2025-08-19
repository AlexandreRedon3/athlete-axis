import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Hook pour supprimer une session
export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ programId, sessionId }: { programId: string; sessionId: string }) => {
      const response = await fetch(`/api/programs/${programId}/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }

      return { success: true };
    },
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['programs', programId] });
      toast.success('Session supprimée avec succès');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    },
  });

  return {
    deleteSession: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
};

// Hook pour dupliquer une session
export const useDuplicateSession = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ programId, sessionId }: { programId: string; sessionId: string }) => {
      const response = await fetch(`/api/programs/${programId}/sessions/${sessionId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la duplication');
      }

      return await response.json();
    },
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['programs', programId] });
      toast.success('Session dupliquée avec succès');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la duplication');
    },
  });

  return {
    duplicateSession: mutation.mutateAsync,
    isDuplicating: mutation.isPending,
  };
};

// Hook pour supprimer un programme
export const useDeleteProgram = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (programId: string) => {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de suppression');
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success('Programme supprimé');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur de suppression');
    },
  });

  return {
    deleteProgram: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
};

// Hook pour dupliquer un programme
export const useDuplicateProgram = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (programId: string) => {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de duplication');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast.success('Programme dupliqué');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur de duplication');
    },
  });

  return {
    duplicateProgram: mutation.mutateAsync,
    isDuplicating: mutation.isPending,
  };
};

// Hook pour mettre à jour un programme
export const useUpdateProgram = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ programId, programData }: {
      programId: string;
      programData: {
        name?: string;
        description?: string;
        type?: string;
        level?: string;
        durationWeeks?: number;
        sessionsPerWeek?: number;
      };
    }) => {
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

      return await response.json();
    },
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['programs', programId] });
      toast.success('Programme mis à jour avec succès');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
    },
  });

  return {
    updateProgram: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
};

// Hook pour publier/dépublier un programme
export const usePublishProgram = () => {
  const queryClient = useQueryClient();

  const publishMutation = useMutation({
    mutationFn: async (programId: string) => {
      const response = await fetch(`/api/programs/${programId}/publish`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de publication');
      }

      return await response.json();
    },
    onSuccess: (_, programId) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['programs', programId] });
      toast.success('Programme publié');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur de publication');
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: async (programId: string) => {
      const response = await fetch(`/api/programs/${programId}/publish`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de dépublication');
      }

      return await response.json();
    },
    onSuccess: (_, programId) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['programs', programId] });
      toast.success('Programme retiré de la publication');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur de dépublication');
    },
  });

  return {
    publishProgram: publishMutation.mutateAsync,
    unpublishProgram: unpublishMutation.mutateAsync,
    isPublishing: publishMutation.isPending,
    isUnpublishing: unpublishMutation.isPending,
  };
}; 