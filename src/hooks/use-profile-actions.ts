import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Hook pour mettre à jour le profil utilisateur
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (profileData: {
      name?: string;
      phoneNumber?: string;
      address?: string;
      zipCode?: string;
      city?: string;
      country?: string;
      image?: string;
      bio?: string;
      emailNotifications?: boolean;
      smsNotifications?: boolean;
    }) => {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du profil');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Profil mis à jour avec succès');
      // Invalider les queries liées à l'utilisateur si nécessaire
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil');
    },
  });

  return {
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}; 