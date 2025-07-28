"use client"

import { create } from 'zustand';

interface RefreshStore {
  refreshTriggers: Record<string, number>;
  triggerRefresh: (key: string) => void;
  getRefreshKey: (key: string) => number;
}

export const useRefreshStore = create<RefreshStore>((set, get) => ({
  refreshTriggers: {},
  
  triggerRefresh: (key: string) => {
    set((state) => ({
      refreshTriggers: {
        ...state.refreshTriggers,
        [key]: (state.refreshTriggers[key] || 0) + 1
      }
    }));
  },
  
  getRefreshKey: (key: string) => {
    return get().refreshTriggers[key] || 0;
  }
}));

// Hook pour déclencher des rafraîchissements
export const useRefreshData = () => {
  const { triggerRefresh } = useRefreshStore();
  
  return {
    refreshPrograms: () => triggerRefresh('programs'),
    refreshClients: () => triggerRefresh('clients'),
    refreshStats: () => triggerRefresh('stats'),
    refreshAll: () => {
      triggerRefresh('programs');
      triggerRefresh('clients');
      triggerRefresh('stats');
    }
  };
};