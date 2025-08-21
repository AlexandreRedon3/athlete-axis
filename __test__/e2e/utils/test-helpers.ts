import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.goto('/sign-in', { timeout: 30000 });
    await this.page.waitForLoadState('networkidle');
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async loginAsCoach() {
    await this.login('marie.martin@example.com', 'azerty123');
    
    // Attendre que la connexion soit terminée et la redirection effectuée
    await this.page.waitForURL(/\/dashboard\/pro\/.*/, { timeout: 120000 });
    await this.page.waitForLoadState('networkidle');
  }

  async createProgram(name: string, description: string, type: string = 'Mixte', level: string = 'Débutant') {
    // Attendre que les actions rapides soient disponibles
    await this.page.waitForSelector('[data-testid="quick-actions-menu"]', { timeout: 10000 });
    await this.page.click('[data-testid="quick-actions-menu"]');
    
    // Cliquer sur "Créer un programme"
    await this.page.click('[data-testid="create-program-action"]');
    
    // Remplir le formulaire
    await this.page.fill('input[name="name"]', name);
    await this.page.fill('textarea[name="description"]', description);
    
    // Sélectionner le type
    await this.page.click(`input[name="type"][value="${type}"]`);
    
    // Sélectionner le niveau
    await this.page.click(`input[name="level"][value="${level}"]`);
    
    // Définir durée et fréquence
    await this.page.fill('input[name="durationWeeks"]', '4');
    await this.page.fill('input[name="sessionsPerWeek"]', '3');
    
    // Soumettre le formulaire
    await this.page.click('button[type="submit"]');
    await this.page.waitForSelector('.toast-success', { timeout: 5000 });
  }

  async addSessionToProgram(sessionName: string, type: string = 'Push') {
    // Cliquer sur "Ajouter une session"
    await this.page.click('[data-testid="add-session-button"]');
    
    // Remplir le formulaire de session
    await this.page.fill('input[name="name"]', sessionName);
    await this.page.click(`input[name="type"][value="${type}"]`);
    await this.page.fill('input[name="weekNumber"]', '1');
    await this.page.fill('input[name="dayNumber"]', '1');
    await this.page.fill('input[name="targetRPE"]', '7');
    await this.page.fill('input[name="duration"]', '60');
    
    // Soumettre
    await this.page.click('button[type="submit"]');
    await this.page.waitForSelector('.toast-success', { timeout: 5000 });
  }

  async generateInviteLink() {
    await this.page.click('[data-testid="quick-actions-menu"]');
    await this.page.click('[data-testid="invite-client-action"]');
    
    await this.page.fill('input[name="email"]', 'client-test@example.com');
    await this.page.fill('input[name="firstName"]', 'Jean');
    await this.page.fill('input[name="lastName"]', 'Dupont');
    
    await this.page.click('button[type="submit"]');
    await this.page.waitForSelector('.toast-success', { timeout: 5000 });
  }
} 