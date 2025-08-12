import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display landing page correctly', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toContainText('Un nouveau souffle pour ton entraînement');
    await expect(page.locator('button:has-text("Découvrir les programmes")').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Trouver mon coach")').first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to sign-in page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('a[href="/sign-in"] button');
    
    await expect(page).toHaveURL('/sign-in');
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 10000 });
  });

  test('should handle invalid login', async ({ page }) => {
    await page.goto('/sign-in');
    
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Vérifier qu'on reste sur la page de connexion ou qu'une erreur apparaît
    await expect(page).toHaveURL('/sign-in');
  });

  test('should register with valid invitation token', async ({ page }) => {
    // Ce test nécessite un token d'invitation valide
    const validToken = 'test-invitation-token-123';
    
    await page.goto(`/sign-up/${validToken}`);
    
    await expect(page.locator('h2')).toContainText('Créez votre compte');
    
    await page.fill('input[name="name"]', 'Jean Dupont');
    await page.fill('input[name="email"]', 'jean.dupont@example.com');
    await page.fill('input[name="password"]', 'motdepasse123');
    await page.fill('input[name="confirmPassword"]', 'motdepasse123');
    
    await page.click('button[type="submit"]');
    
    // Vérifier la redirection vers sign-in
    await expect(page).toHaveURL('/sign-in');
    await expect(page.locator('.toast-success')).toBeVisible();
  });

  test('should reject invalid invitation token', async ({ page }) => {
    await page.goto('/sign-up/invalid-token');
    
    await expect(page.locator('h1')).toContainText('Invitation invalide');
    await expect(page.locator('a[href="/"]')).toBeVisible();
  });
}); 