import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Client Dashboard', () => {
  test('should display client dashboard correctly', async ({ page }) => {
    // Test basique de la page d'accueil pour les clients
    await page.goto('/');
    
    // Vérifier que la page d'accueil s'affiche correctement
    await expect(page.locator('h1')).toContainText('Un nouveau souffle pour ton entraînement');
    await expect(page.locator('button:has-text("Découvrir les programmes")').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Trouver mon coach")').first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to client signup', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('a[href="/sign-in"] button');
    
    await expect(page).toHaveURL('/sign-in');
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
  });

  test('should show client features on landing page', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier les sections pour les clients
    await expect(page.locator('text=Programmes')).toBeVisible();
    await expect(page.locator('text=Coaching')).toBeVisible();
  });
}); 