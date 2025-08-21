# Tests End-to-End avec Playwright

Ce dossier contient les tests end-to-end pour l'application Athlete Axis utilisant Playwright.

## Structure des tests

```
__test__/e2e/
├── auth/                    
│   └── authentication.spec.ts
├── coach/                   
│   └── coach-dashboard.spec.ts
├── client/                  
│   └── client-dashboard.spec.ts
├── integration/             
│   └── end-to-end-flow.spec.ts
├── accessibility/           
│   └── a11y.spec.ts
├── utils/            # Helpers de test
│   └── test-helpers.ts
└── README.md
```

## Installation

```bash
# Installer Playwright et ses dépendances
npm install --save-dev @playwright/test @axe-core/playwright

# Installer les navigateurs
npx playwright install
```

## Configuration

Le fichier `playwright.config.ts` à la racine du projet configure :
- Les navigateurs à tester (Chrome, Firefox)
- Le serveur de développement
- Les timeouts et retries
- Les captures d'écran et traces

## Scripts disponibles

```bash
# Lancer tous les tests E2E
npm run test:e2e

# Lancer les tests avec interface graphique
npm run test:e2e:ui

# Lancer les tests en mode visible
npm run test:e2e:headed

# Lancer les tests en mode debug
npm run test:e2e:debug

# Lancer un test spécifique
npx playwright test auth/authentication.spec.ts

# Générer un rapport HTML
npx playwright show-report
```

## Types de tests

### 1. Tests d'authentification (`auth/`)
- Affichage de la page d'accueil
- Navigation vers la page de connexion
- Gestion des connexions invalides
- Inscription avec token d'invitation
- Rejet des tokens invalides

### 2. Tests du dashboard coach (`coach/`)
- Affichage du dashboard
- Création de programmes d'entraînement
- Gestion des sessions
- Ajout d'exercices
- Invitation de clients
- Publication de programmes
- Navigation entre onglets

### 3. Tests du dashboard client (`client/`)
- Affichage du dashboard client
- Consultation des programmes assignés
- Démarrage de séances d'entraînement
- Suivi de la progression
- Historique des entraînements
- Mise à jour du profil

### 4. Tests d'intégration (`integration/`)
- Flux complet coach : inscription → création programme → invitation client
- Flux complet client : invitation → inscription → entraînement
- Gestion des programmes : création → édition → duplication → suppression

### 5. Tests d'accessibilité (`accessibility/`)
- Conformité WCAG 2.1 AA/AAA
- Navigation au clavier
- Contraste des couleurs
- Textes alternatifs des images
- Association des labels de formulaires

## Helpers de test

La classe `TestHelpers` dans `utils/test-helpers.ts` fournit des méthodes réutilisables :
- `login()` : Connexion utilisateur
- `createProgram()` : Création de programme
- `addSessionToProgram()` : Ajout de session
- `generateInviteLink()` : Génération d'invitation

## Data-testid

Les tests utilisent des attributs `data-testid` pour identifier les éléments. Assurez-vous que ces attributs sont présents dans vos composants :

```tsx
<button data-testid="create-program-action">
  Créer un programme
</button>
```

## Comptes de test

Les tests E2E utilisent le compte coach suivant :
- **Email** : `marie.martin@example.com`
- **Mot de passe** : `azerty123`

## Variables d'environnement

Créez un fichier `.env.test` pour les tests E2E si nécessaire :

```env
# Comptes de test
TEST_COACH_EMAIL=marie.martin@example.com
TEST_COACH_PASSWORD=azerty123

# Tokens d'invitation de test
TEST_COACH_INVITATION_TOKEN=coach-invitation-token
TEST_CLIENT_INVITATION_TOKEN=client-invitation-token
```

## Bonnes pratiques

1. **Isolation** : Chaque test doit être indépendant
2. **Données de test** : Utiliser des données spécifiques aux tests
3. **Assertions** : Vérifier les comportements attendus
4. **Timeouts** : Utiliser des timeouts appropriés pour les opérations asynchrones
5. **Accessibilité** : Inclure des tests d'accessibilité dans chaque fonctionnalité

## Dépannage

### Tests qui échouent
- Vérifier que le serveur de développement fonctionne
- Contrôler les logs du navigateur
- Utiliser `--headed` pour voir l'exécution
- Vérifier les data-testid dans les composants

### Performance
- Les tests E2E sont plus lents que les tests unitaires
- Utiliser `--workers=1` pour éviter les conflits
- Optimiser les sélecteurs pour de meilleures performances
