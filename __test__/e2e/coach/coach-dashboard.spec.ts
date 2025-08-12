import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Coach Dashboard', () => {
  let helpers: TestHelpers;
  
  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    // Connexion avec le compte coach Marie Martin
    await helpers.loginAsCoach();
  });

  test('should display coach dashboard correctly', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/pro\/.*/, { timeout: 120000 });
    await page.waitForLoadState('networkidle');
    
    // Vérifier que le dashboard s'affiche
    await expect(page.locator('text=Vue d\'ensemble')).toBeVisible({ timeout: 10000 });
  });

  test('should access dashboard features', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Vérifier que le dashboard est accessible
    await expect(page.locator('text=Vue d\'ensemble')).toBeVisible({ timeout: 10000 });
    
    // Vérifier la présence d'éléments de base
    await expect(page.locator('text=AthleteAxis')).toBeVisible({ timeout: 10000 });
  });

  test('should display dashboard content', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Vérifier que le contenu du dashboard s'affiche
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