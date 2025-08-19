import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Complete User Journey', () => {

  test('complete coach workflow: login -> access dashboard', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // 1. Connexion avec le coach existant
    await helpers.loginAsCoach();
    
    // 2. Vérifier l'accès au dashboard avec un timeout plus long
    await expect(page).toHaveURL(/\/dashboard\/pro\/.*/, { timeout: 120000 });
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Vue d\'ensemble')).toBeVisible({ timeout: 10000 });
  });

  // OK
  test('complete client workflow: landing page -> signup flow', async ({ page }) => {
    // 1. Accéder à la page d'accueil
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 2. Vérifier les éléments pour les clients
    await expect(page.locator('h1')).toContainText('Un nouveau souffle pour ton entraînement');

    await expect(page.locator('button:has-text("Découvrir les programmes")').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Trouver mon coach")').first()).toBeVisible({ timeout: 10000 });
    
    // 3. Naviguer vers la page de connexion
    await page.goto('/sign-in');
    await expect(page).toHaveURL('/sign-in');
    
    // 4. Attendre que la page soit chargée et vérifier le formulaire de connexion
    await page.waitForLoadState('networkidle');
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 10000 });
  });

  test('program management workflow: basic access', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Connexion coach
    await helpers.loginAsCoach();
    
    // Vérifier l'accès de base
    await expect(page).toHaveURL(/\/dashboard\/pro\/.*/, { timeout: 120000 });
    await page.waitForLoadState('networkidle');
    // Attendre un peu plus pour que le contenu soit chargé
    await page.waitForTimeout(2000);
    
    // Vérifier que le dashboard est chargé en cherchant des éléments sûrement présents
    await expect(page.locator('text=AthleteAxis')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Vue d\'ensemble')).toBeVisible({ timeout: 10000 });
    
    // Essayer de trouver le nom du coach
    try {
      await expect(page.locator('text=Coach Marie Martin')).toBeVisible({ timeout: 5000 });
    } catch (error) {
      // Si le texte exact ne fonctionne pas, essayer avec un sélecteur plus large
      await expect(page.locator('span:has-text("Marie Martin")')).toBeVisible({ timeout: 5000 });
    }
  });
}); 