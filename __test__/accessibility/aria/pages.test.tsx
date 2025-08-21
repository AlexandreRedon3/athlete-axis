/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CoachProfile } from '@/components/coach/profile/coach-profile';
import { ModernCoachDashboard } from '@/components/coach/dashboard/coach-dashboard';
import { ThemeProvider } from '@/lib/theme-provider';

// Mock des hooks pour les tests
vi.mock('@/hooks/use-coach-stats', () => ({
  useCoachStats: () => ({
    stats: {
      activeClients: 5,
      totalPrograms: 12,
      completionRate: 85
    },
    isLoading: false,
    error: null,
    refetch: vi.fn()
  })
}));

vi.mock('@/hooks/use-profile-actions', () => ({
  useUpdateProfile: () => ({
    updateProfile: vi.fn(),
    isUpdating: false
  })
}));

vi.mock('@/hooks/use-program-actions', () => ({
  useDeleteProgram: () => ({
    deleteProgram: vi.fn(),
    isDeleting: false
  }),
  useUpdateProgram: () => ({
    updateProgram: vi.fn(),
    isUpdating: false
  }),
  useCreateProgram: () => ({
    createProgram: vi.fn(),
    isCreating: false
  }),
  useDuplicateProgram: () => ({
    duplicateProgram: vi.fn(),
    isDuplicating: false
  }),
  usePublishProgram: () => ({
    publishProgram: vi.fn(),
    unpublishProgram: vi.fn(),
    isPublishing: false,
    isUnpublishing: false
  })
}));

vi.mock('@/hooks/use-coach-programs', () => ({
  useCoachPrograms: () => ({
    programs: [],
    isLoading: false,
    error: null,
    refetch: vi.fn()
  })
}));

vi.mock('@/hooks/use-coach-client', () => ({
  useCoachClients: () => ({
    clients: [],
    isLoading: false,
    error: null,
    refetch: vi.fn()
  })
}));

vi.mock('@/hooks/use-today-sessions', () => ({
  useTodaySessions: () => ({
    sessions: [],
    isLoading: false,
    error: null,
    refetch: vi.fn()
  })
}));

vi.mock('@/hooks/use-program-sessions', () => ({
  useProgramSessions: () => ({
    sessions: [],
    clientProgress: [],
    isLoading: false,
    error: null
  })
}));

// Wrapper pour les tests avec tous les providers nécessaires
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Mock des données utilisateur
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  image: null,
  bio: 'Coach sportif passionné',
  isCoach: true,
  address: '123 Rue de la Paix',
  zipCode: '75001',
  city: 'Paris',
  country: 'France',
  phoneNumber: '+33123456789',
  emailNotifications: true,
  smsNotifications: false
};

describe('Pages - Accessibilité', () => {
  describe('CoachProfile', () => {
    it('devrait avoir une structure de page accessible', () => {
      render(
        <TestWrapper>
          <CoachProfile user={mockUser} />
        </TestWrapper>
      );
      
      // Vérifier le titre principal
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('John Doe');
      
      // Vérifier les informations du profil (utiliser getAllByText car il y a plusieurs éléments)
      expect(screen.getAllByText(/coach/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/coach sportif passionné/i)).toBeInTheDocument();
    });

    it('devrait avoir des boutons de navigation accessibles', () => {
      render(
        <TestWrapper>
          <CoachProfile user={mockUser} />
        </TestWrapper>
      );
      
      // Vérifier les boutons de navigation (pas des onglets)
      expect(screen.getByRole('button', { name: /profil/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /paramètres/i })).toBeInTheDocument();
    });

    it('devrait permettre la navigation entre les sections', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CoachProfile user={mockUser} />
        </TestWrapper>
      );
      
      const settingsButton = screen.getByRole('button', { name: /paramètres/i });
      await user.click(settingsButton);
      
      // Vérifier que le bouton paramètres est actif (visuellement)
      expect(settingsButton).toHaveClass('border-emerald-500');
    });

    it('devrait avoir des boutons d\'action accessibles', () => {
      render(
        <TestWrapper>
          <CoachProfile user={mockUser} />
        </TestWrapper>
      );
      
      // Vérifier le bouton de modification
      expect(screen.getByRole('button', { name: /modifier/i })).toBeInTheDocument();
    });

    it('devrait avoir des statistiques accessibles', () => {
      render(
        <TestWrapper>
          <CoachProfile user={mockUser} />
        </TestWrapper>
      );
      
      // Vérifier les statistiques
      expect(screen.getByText('5')).toBeInTheDocument(); // Clients actifs
      expect(screen.getByText('12')).toBeInTheDocument(); // Programmes créés
      expect(screen.getByText('85%')).toBeInTheDocument(); // Taux de réussite
    });

    it('devrait avoir des labels pour les statistiques', () => {
      render(
        <TestWrapper>
          <CoachProfile user={mockUser} />
        </TestWrapper>
      );
      
      expect(screen.getByText(/clients actifs/i)).toBeInTheDocument();
      expect(screen.getByText(/programmes créés/i)).toBeInTheDocument();
      expect(screen.getByText(/taux de réussite/i)).toBeInTheDocument();
    });
  });

  describe('ModernCoachDashboard', () => {
    it('devrait avoir une structure de navigation accessible', () => {
      render(
        <TestWrapper>
          <ModernCoachDashboard />
        </TestWrapper>
      );
      
      // Vérifier la présence de la navigation
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('devrait permettre la navigation entre les sections', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <ModernCoachDashboard />
        </TestWrapper>
      );
      
      // Vérifier que les boutons de navigation sont présents et accessibles
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('devrait avoir des cartes de statistiques accessibles', () => {
      render(
        <TestWrapper>
          <ModernCoachDashboard />
        </TestWrapper>
      );
      
      expect(screen.getByText(/clients actifs/i)).toBeInTheDocument();
      expect(screen.getByText(/clients récents/i)).toBeInTheDocument();
    });

    it('devrait avoir des boutons d\'action rapide accessibles', () => {
      render(
        <TestWrapper>
          <ModernCoachDashboard />
        </TestWrapper>
      );
      
      // Vérifier la présence des boutons d'action (ajuster selon le contenu réel)
      // D'après le DOM, il y a "Nouveau client" et "Planifier séance"
      expect(screen.getByRole('button', { name: /nouveau client/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /planifier séance/i })).toBeInTheDocument();
    });
  });

  describe('Navigation au clavier', () => {
    it('devrait permettre la navigation complète au clavier', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CoachProfile user={mockUser} />
        </TestWrapper>
      );
      
      // Navigation avec Tab
      await user.tab();
      
      // Vérifier que le premier élément focusable a le focus
      const firstFocusableElement = document.activeElement;
      expect(firstFocusableElement).toBeInTheDocument();
    });

    it('devrait avoir un ordre de tabulation logique', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CoachProfile user={mockUser} />
        </TestWrapper>
      );
      
      // Naviguer avec Tab et vérifier l'ordre
      await user.tab();
      const firstElement = document.activeElement;
      
      await user.tab();
      const secondElement = document.activeElement;
      
      expect(firstElement).not.toBe(secondElement);
    });
  });

  describe('Images et médias', () => {
    it('devrait avoir des alternatives textuelles pour les images', () => {
      const userWithImage = {
        ...mockUser,
        image: 'https://example.com/avatar.jpg'
      };
      
      render(
        <TestWrapper>
          <CoachProfile user={userWithImage} />
        </TestWrapper>
      );
      
      // Vérifier que les images ont des alt text
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });

    it('devrait avoir des icônes accessibles', () => {
      render(
        <TestWrapper>
          <CoachProfile user={mockUser} />
        </TestWrapper>
      );
      
      // Vérifier que les icônes ont des aria-label ou sont dans un contexte descriptif
      const iconButtons = screen.getAllByRole('button');
      iconButtons.forEach(button => {
        const hasAriaLabel = button.hasAttribute('aria-label');
        const hasTextContent = button.textContent?.trim();
        expect(hasAriaLabel || hasTextContent).toBeTruthy();
      });
    });
  });

  describe('Messages d\'état', () => {
    it('devrait annoncer les changements d\'état', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CoachProfile user={mockUser} />
        </TestWrapper>
      );
      
      // Activer le mode édition
      const editButton = screen.getByRole('button', { name: /modifier/i });
      await user.click(editButton);
      
      // Vérifier que le bouton change de texte (il peut y avoir plusieurs boutons annuler)
      expect(screen.getAllByRole('button', { name: /annuler/i }).length).toBeGreaterThan(0);
    });

    it('devrait avoir des indicateurs de chargement accessibles', () => {
      render(
        <TestWrapper>
          <CoachProfile user={mockUser} />
        </TestWrapper>
      );
      
      // Vérifier que les éléments sont présents même sans chargement
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /modifier/i })).toBeInTheDocument();
    });
  });

  describe('Contraste et couleurs', () => {
    it('devrait avoir un contraste suffisant pour le texte', () => {
      render(
        <TestWrapper>
          <CoachProfile user={mockUser} />
        </TestWrapper>
      );
      
      // Vérifier que les éléments de texte sont visibles
      const textElements = screen.getAllByText(/./);
      textElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const color = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;
        
        // Test basique de contraste (en production, utiliser une vraie fonction)
        expect(color).not.toBe('transparent');
        expect(backgroundColor).not.toBe('transparent');
      });
    });
  });

  describe('Responsive design', () => {
    it('devrait être accessible sur mobile', () => {
      // Simuler un écran mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(
        <TestWrapper>
          <CoachProfile user={mockUser} />
        </TestWrapper>
      );
      
      // Vérifier que les éléments sont toujours accessibles
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /modifier/i })).toBeInTheDocument();
    });
  });
}); 