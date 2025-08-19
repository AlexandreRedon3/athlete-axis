# 🚀 CI/CD Pipeline - AthleteAxis

## 📋 Vue d'ensemble

Notre pipeline CI/CD utilise GitHub Actions pour automatiser les tests, la qualité du code et le déploiement.

## 🔧 Jobs de la Pipeline

### 1. **Code Quality & Linting**
- ✅ Vérification TypeScript
- ✅ ESLint
- ✅ Audit de sécurité npm
- ✅ Vérification des dépendances inutilisées

### 2. **Tests (Unit/Integration/Security)**
- ✅ Tests unitaires (`__test__/units/`)
- ✅ Tests d'intégration (`__test__/integration/`)
- ✅ Tests de sécurité (`__test__/security/`)
- ✅ Base de données PostgreSQL pour les tests
- ✅ Coverage reports

### 3. **Build Check**
- ✅ Build de l'application Next.js
- ✅ Vérification de la taille du build

### 4. **Accessibility Tests** (Optionnel)
- ✅ Tests d'accessibilité avec Playwright
- ✅ Déclenché avec le label `accessibility` sur les PR

## 🎯 Scripts NPM

```bash
# Tests
npm run test:unit          # Tests unitaires uniquement
npm run test:integration   # Tests d'intégration uniquement
npm run test:security      # Tests de sécurité uniquement
npm run test:accessibility # Tests d'accessibilité uniquement
npm run test:all          # Tous les tests (sauf E2E)

# E2E Tests (locaux uniquement)
npm run test:e2e          # Tests E2E complets
npm run test:e2e:ui       # Interface Playwright
npm run test:e2e:headed   # Mode visible
npm run test:e2e:debug    # Mode debug
```

## 🔄 Déclencheurs

- **Push** sur `main` et `develop`
- **Pull Request** sur `main` et `develop`
- **Workflow Dispatch** (manuel)

## 🏷️ Labels pour PR

- `accessibility` : Lance les tests d'accessibilité
- `run-integration-tests` : (déprécié, maintenant automatique)

## 📊 Variables d'environnement

### Production
```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
NEXT_PUBLIC_APP_URL=https://...
```

### Tests
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/test
BETTER_AUTH_SECRET=test-secret-key-for-ci
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚨 Tests exclus de la CI/CD

- **Tests E2E** : Trop lents et nécessitent un navigateur
- **Tests de performance** : Nécessitent des ressources spécifiques

## 📈 Métriques

- Coverage des tests
- Temps d'exécution
- Violations de sécurité
- Qualité du code

## 🔍 Debugging

En cas d'échec :
1. Vérifier les logs GitHub Actions
2. Tester localement avec `npm run test:all`
3. Vérifier les variables d'environnement
4. Contacter l'équipe de développement 