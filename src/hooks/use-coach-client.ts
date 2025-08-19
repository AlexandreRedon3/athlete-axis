"use client"

import { useEffect,useState } from 'react';

interface Client {
  id: string;
  name: string;
  email: string;
  program?: {
    id: string;
    name: string;
    level: string;
  };
  progress: number;
  joinedAt: string;
  isActive: boolean;
}

interface UseCoachClientsReturn {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCoachClients = (): UseCoachClientsReturn => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/coach/clients');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des clients');
      }
      
      const data = await response.json();
      
      if (data.clients !== undefined) {
        setClients(data.clients);
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
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    error,
    refetch: fetchClients
  };
};