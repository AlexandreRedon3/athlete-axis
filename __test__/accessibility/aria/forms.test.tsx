/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { InviteClientForm } from '@/components/coach/forms/invite-client-form';
import { CreateProgramForm } from '@/components/coach/forms/create-program-form';
import { EditProgramForm } from '@/components/coach/forms/edit-program-form';
import { ThemeProvider } from '@/lib/theme-provider';

// Mock des hooks pour les tests
const mockOnClose = vi.fn();
const mockOnSuccess = vi.fn();

// Mock des hooks pour éviter les erreurs de React Query
vi.mock('@/hooks/use-program-actions', () => ({
  useUpdateProgram: () => ({
    updateProgram: vi.fn(),
    isUpdating: false
  }),
  useCreateProgram: () => ({
    createProgram: vi.fn(),
    isCreating: false
  })
}));

vi.mock('@/hooks/use-add-from-library', () => ({
  useAddFromLibrary: () => ({
    addFromLibrary: vi.fn(),
    isAdding: false
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

// Mock des données de programme pour EditProgramForm
const mockProgram = {
  id: '1',
  name: 'Programme Test',
  description: 'Description du programme test',
  type: 'Force' as const,
  level: 'Débutant' as const,
  durationWeeks: 4,
  sessionsPerWeek: 3,
  imageUrl: '',
  isPublished: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('Formulaires - Accessibilité', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('InviteClientForm', () => {
    it('devrait avoir une structure de formulaire accessible', () => {
      render(
        <TestWrapper>
          <InviteClientForm 
            isOpen={true} 
            onClose={mockOnClose} 
            onSuccess={mockOnSuccess} 
          />
        </TestWrapper>
      );
      
      // Vérifier le titre du dialogue
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/inviter un client/i)).toBeInTheDocument();
      
      // Vérifier les champs du formulaire par leur placeholder
      expect(screen.getByPlaceholderText(/client@example.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/jean/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/dupont/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/ajoutez un message personnel/i)).toBeInTheDocument();
    });

    it('devrait permettre la navigation au clavier', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <InviteClientForm 
            isOpen={true} 
            onClose={mockOnClose} 
            onSuccess={mockOnSuccess} 
          />
        </TestWrapper>
      );
      
      const emailInput = screen.getByPlaceholderText(/client@example.com/i);
      const firstNameInput = screen.getByPlaceholderText(/jean/i);
      const lastNameInput = screen.getByPlaceholderText(/dupont/i);
      
      // Tester que les éléments sont focusables
      await user.click(emailInput);
      expect(emailInput).toHaveFocus();
      
      await user.click(firstNameInput);
      expect(firstNameInput).toHaveFocus();
      
      await user.click(lastNameInput);
      expect(lastNameInput).toHaveFocus();
    });

    it('devrait avoir des boutons accessibles', async () => {
      render(
        <TestWrapper>
          <InviteClientForm 
            isOpen={true} 
            onClose={mockOnClose} 
            onSuccess={mockOnSuccess} 
          />
        </TestWrapper>
      );
      
      // Vérifier que les boutons sont présents et accessibles
      expect(screen.getByRole('button', { name: /envoyer/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
    });
  });

  describe('CreateProgramForm', () => {
    it('devrait avoir une structure de formulaire accessible', () => {
      render(
        <TestWrapper>
          <CreateProgramForm 
            isOpen={true} 
            onClose={mockOnClose} 
            onSuccess={mockOnSuccess} 
          />
        </TestWrapper>
      );
      
      // Vérifier le titre du dialogue
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/créer un programme/i)).toBeInTheDocument();
      
      // Vérifier les champs principaux par leur placeholder
      expect(screen.getByPlaceholderText(/programme force 4 semaines/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/décrivez les objectifs/i)).toBeInTheDocument();
    });

    it('devrait avoir des labels appropriés pour tous les champs', () => {
      render(
        <TestWrapper>
          <CreateProgramForm 
            isOpen={true} 
            onClose={mockOnClose} 
            onSuccess={mockOnSuccess} 
          />
        </TestWrapper>
      );
      
      // Vérifier que les labels sont présents (utiliser getAllByText pour éviter les doublons)
      expect(screen.getAllByText(/nom du programme/i)).toHaveLength(2); // Label + titre
      expect(screen.getAllByText(/description/i).length).toBeGreaterThan(0); // Il peut y en avoir plusieurs
      expect(screen.getByText(/type de programme/i)).toBeInTheDocument();
      expect(screen.getByText(/niveau/i)).toBeInTheDocument();
      // Note: Les champs durée et séances ne sont pas toujours visibles selon l'état du formulaire
    });

    it('devrait permettre la navigation au clavier', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CreateProgramForm 
            isOpen={true} 
            onClose={mockOnClose} 
            onSuccess={mockOnSuccess} 
          />
        </TestWrapper>
      );
      
      const nameInput = screen.getByPlaceholderText(/programme force 4 semaines/i);
      const descriptionTextarea = screen.getByPlaceholderText(/décrivez les objectifs/i);
      
      // Tester que les éléments sont focusables
      await user.click(nameInput);
      expect(nameInput).toHaveFocus();
      
      await user.click(descriptionTextarea);
      expect(descriptionTextarea).toHaveFocus();
    });
  });

  describe('EditProgramForm', () => {
    it('devrait avoir une structure de formulaire accessible', () => {
      render(
        <TestWrapper>
          <EditProgramForm 
            program={mockProgram}
            isOpen={true} 
            onClose={mockOnClose} 
            onSuccess={mockOnSuccess} 
          />
        </TestWrapper>
      );
      
      // Vérifier le titre du dialogue
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/modifier le programme/i)).toBeInTheDocument();
      
      // Vérifier que les champs sont pré-remplis
      const nameInput = screen.getByPlaceholderText(/programme débutant/i) as HTMLInputElement;
      expect(nameInput.value).toBe('Programme Test');
    });

    it('devrait permettre la navigation au clavier', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <EditProgramForm 
            program={mockProgram}
            isOpen={true} 
            onClose={mockOnClose} 
            onSuccess={mockOnSuccess} 
          />
        </TestWrapper>
      );
      
      const nameInput = screen.getByPlaceholderText(/programme débutant/i);
      const descriptionTextarea = screen.getByPlaceholderText(/décrivez votre programme/i);
      
      // Tester que les éléments sont focusables
      await user.click(nameInput);
      expect(nameInput).toHaveFocus();
      
      await user.click(descriptionTextarea);
      expect(descriptionTextarea).toHaveFocus();
    });
  });

  describe('Validation des formulaires', () => {
    it('devrait avoir des indicateurs de champs requis', () => {
      render(
        <TestWrapper>
          <CreateProgramForm 
            isOpen={true} 
            onClose={mockOnClose} 
            onSuccess={mockOnSuccess} 
          />
        </TestWrapper>
      );
      
      // Vérifier que les labels indiquent les champs requis avec *
      expect(screen.getByText(/nom du programme \*/i)).toBeInTheDocument();
      expect(screen.getByText(/description \*/i)).toBeInTheDocument();
      expect(screen.getByText(/type de programme \*/i)).toBeInTheDocument();
    });
  });

  describe('Boutons d\'action', () => {
    it('devrait avoir des boutons avec des labels descriptifs', () => {
      render(
        <TestWrapper>
          <CreateProgramForm 
            isOpen={true} 
            onClose={mockOnClose} 
            onSuccess={mockOnSuccess} 
          />
        </TestWrapper>
      );
      
      expect(screen.getByRole('button', { name: /créer le programme/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
    });

    it('devrait permettre la fermeture du dialogue', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CreateProgramForm 
            isOpen={true} 
            onClose={mockOnClose} 
            onSuccess={mockOnSuccess} 
          />
        </TestWrapper>
      );
      
      const cancelButton = screen.getByRole('button', { name: /annuler/i });
      await user.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Messages de statut', () => {
    it('devrait permettre la saisie dans les champs', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CreateProgramForm 
            isOpen={true} 
            onClose={mockOnClose} 
            onSuccess={mockOnSuccess} 
          />
        </TestWrapper>
      );
      
      // Remplir le formulaire
      const nameInput = screen.getByPlaceholderText(/programme force 4 semaines/i);
      const descriptionTextarea = screen.getByPlaceholderText(/décrivez les objectifs/i);
      
      await user.type(nameInput, 'Nouveau Programme');
      await user.type(descriptionTextarea, 'Description du nouveau programme');
      
      // Vérifier que les champs sont remplis
      expect(nameInput).toHaveValue('Nouveau Programme');
      expect(descriptionTextarea).toHaveValue('Description du nouveau programme');
    });
  });
}); 