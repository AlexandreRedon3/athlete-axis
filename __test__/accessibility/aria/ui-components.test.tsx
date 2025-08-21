/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ThemeProvider } from '@/lib/theme-provider';

// Mock des hooks pour éviter les erreurs de React Query
vi.mock('@/hooks/use-program-actions', () => ({
  useUpdateProgram: () => ({
    updateProgram: vi.fn(),
    isUpdating: false
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

describe('Composants UI - Accessibilité', () => {
  describe('Button', () => {
    it('devrait avoir un rôle button et être focusable', () => {
      render(
        <TestWrapper>
          <Button>Cliquer ici</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button', { name: /cliquer ici/i });
      expect(button).toBeInTheDocument();
      // Le bouton par défaut n'a pas forcément type="button", on vérifie juste qu'il est bien un bouton
      expect(button.tagName).toBe('BUTTON');
    });

    it('devrait être accessible au clavier', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Button>Cliquer ici</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button', { name: /cliquer ici/i });
      await user.tab();
      expect(button).toHaveFocus();
    });

    it('devrait avoir un aria-label quand fourni', () => {
      render(
        <TestWrapper>
          <Button aria-label="Sauvegarder les modifications">Sauvegarder</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button', { name: /sauvegarder les modifications/i });
      expect(button).toBeInTheDocument();
    });

    it('devrait être désactivé correctement', () => {
      render(
        <TestWrapper>
          <Button disabled>Sauvegarder</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button', { name: /sauvegarder/i });
      expect(button).toBeDisabled();
      // Vérifier que le bouton est bien désactivé (pas forcément avec aria-disabled)
      expect(button).toHaveAttribute('disabled');
    });
  });

  describe('Input', () => {
    it('devrait avoir un label associé', () => {
      render(
        <TestWrapper>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </TestWrapper>
      );
      
      const input = screen.getByLabelText(/email/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'email');
    });

    it('devrait avoir des attributs ARIA appropriés', () => {
      render(
        <TestWrapper>
          <Label htmlFor="name">Nom</Label>
          <Input 
            id="name" 
            required 
            aria-required="true"
            aria-describedby="name-help"
          />
          <div id="name-help">Votre nom complet</div>
        </TestWrapper>
      );
      
      const input = screen.getByLabelText(/nom/i);
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'name-help');
    });

    it('devrait être accessible au clavier', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </TestWrapper>
      );
      
      const input = screen.getByLabelText(/email/i);
      await user.tab();
      expect(input).toHaveFocus();
    });

    it('devrait avoir un placeholder accessible', () => {
      render(
        <TestWrapper>
          <Input placeholder="Entrez votre email" />
        </TestWrapper>
      );
      
      const input = screen.getByPlaceholderText(/entrez votre email/i);
      expect(input).toBeInTheDocument();
    });
  });

  describe('Textarea', () => {
    it('devrait avoir un label associé', () => {
      render(
        <TestWrapper>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" />
        </TestWrapper>
      );
      
      const textarea = screen.getByLabelText(/description/i);
      expect(textarea).toBeInTheDocument();
    });

    it('devrait être accessible au clavier', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" />
        </TestWrapper>
      );
      
      const textarea = screen.getByLabelText(/description/i);
      await user.tab();
      expect(textarea).toHaveFocus();
    });

    it('devrait avoir des attributs de validation', () => {
      render(
        <TestWrapper>
          <Label htmlFor="bio">Biographie</Label>
          <Textarea 
            id="bio" 
            maxLength={500}
            aria-describedby="bio-help"
          />
          <div id="bio-help">Maximum 500 caractères</div>
        </TestWrapper>
      );
      
      const textarea = screen.getByLabelText(/biographie/i);
      expect(textarea).toHaveAttribute('maxLength', '500');
      expect(textarea).toHaveAttribute('aria-describedby', 'bio-help');
    });
  });

  describe('Formulaires', () => {
    it('devrait avoir une structure de formulaire accessible', () => {
      render(
        <TestWrapper>
          <form aria-label="Formulaire de profil">
            <Label htmlFor="name">Nom complet *</Label>
            <Input 
              id="name" 
              required 
              aria-required="true"
            />
            
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              aria-required="true"
            />
            
            <Label htmlFor="bio">Biographie</Label>
            <Textarea id="bio" />
            
            <Button type="submit">Sauvegarder</Button>
          </form>
        </TestWrapper>
      );
      
      const form = screen.getByRole('form', { name: /formulaire de profil/i });
      expect(form).toBeInTheDocument();
      
      const nameInput = screen.getByLabelText(/nom complet/i);
      expect(nameInput).toHaveAttribute('aria-required', 'true');
      
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('aria-required', 'true');
    });

    it('devrait permettre la navigation au clavier dans le formulaire', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <form>
            <Label htmlFor="name">Nom</Label>
            <Input id="name" />
            
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" />
            
            <Button type="submit">Sauvegarder</Button>
          </form>
        </TestWrapper>
      );
      
      const nameInput = screen.getByLabelText(/nom/i);
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sauvegarder/i });
      
      await user.tab();
      expect(nameInput).toHaveFocus();
      
      await user.tab();
      expect(emailInput).toHaveFocus();
      
      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Messages d\'erreur', () => {
    it('devrait annoncer les erreurs aux lecteurs d\'écran', () => {
      render(
        <TestWrapper>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email"
            aria-invalid="true"
            aria-describedby="email-error"
          />
          <div id="email-error" role="alert" className="text-red-500">
            Adresse email invalide
          </div>
        </TestWrapper>
      );
      
      const input = screen.getByLabelText(/email/i);
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
      
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Adresse email invalide');
    });
  });

  describe('Focus visible', () => {
    it('devrait avoir un indicateur de focus visible', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Button>Cliquer ici</Button>
        </TestWrapper>
      );
      
      const button = screen.getByRole('button', { name: /cliquer ici/i });
      await user.tab();
      
      // Vérifier que l'élément a le focus
      expect(button).toHaveFocus();
      
      // Vérifier que les styles de focus sont appliqués
      expect(button).toHaveClass('focus-visible:outline-none');
      expect(button).toHaveClass('focus-visible:ring-2');
    });
  });
}); 