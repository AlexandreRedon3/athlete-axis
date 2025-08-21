# Tests d'Accessibilité - Athlete Axis

Ce dossier contient tous les tests d'accessibilité pour l'application Athlete Axis, conformes aux normes WCAG 2.1 et RGAA 4.1.

## Structure des tests

```
__test__/accessibility/
├── aria/                    # Tests ARIA et composants UI
│   ├── ui-components.test.tsx
│   ├── forms.test.tsx
│   └── pages.test.tsx
├── rgaa/                    # Tests conformes RGAA
│   └── navigation.test.tsx
├── e2e/                     # Tests end-to-end
│   └── a11y.spec.ts
└── README.md               # Ce fichier
```

## Types de tests

### 1. Tests ARIA (`aria/`)

Ces tests vérifient l'implémentation correcte des attributs ARIA et l'accessibilité des composants UI individuels.

**Fichiers :**
- `ui-components.test.tsx` : Tests des composants UI de base (Button, Input, Textarea, etc.)
- `forms.test.tsx` : Tests des formulaires complexes (InviteClientForm, CreateProgramForm, etc.)
- `pages.test.tsx` : Tests des pages principales (CoachProfile, ModernCoachDashboard)

**Aspects testés :**
- Rôles ARIA appropriés
- Attributs `aria-label`, `aria-describedby`, `aria-required`
- Navigation au clavier
- Messages d'erreur accessibles
- Focus visible
- Alternatives textuelles

### 2. Tests RGAA (`rgaa/`)

Ces tests sont conformes au Référentiel Général d'Amélioration de l'Accessibilité (RGAA) français.

**Fichiers :**
- `navigation.test.tsx` : Tests de navigation et structure de page

**Aspects testés :**
- Structure de page logique
- Hiérarchie des titres
- Navigation au clavier
- Contraste des couleurs
- Alternatives textuelles
- Messages d'état

### 3. Tests E2E (`e2e/`)

Ces tests vérifient l'accessibilité de l'application complète en conditions réelles.

**Fichiers :**
- `a11y.spec.ts` : Tests Playwright pour l'accessibilité complète

**Aspects testés :**
- Navigation complète au clavier
- Alternatives textuelles pour toutes les images
- Formulaires accessibles
- Messages d'erreur annoncés
- Responsive design
- Contraste suffisant
- Focus visible

## Exécution des tests

### Tests unitaires (Vitest)

```bash
# Tous les tests d'accessibilité
npm test __test__/accessibility

# Tests ARIA spécifiques
npm test __test__/accessibility/aria

# Tests RGAA spécifiques
npm test __test__/accessibility/rgaa
```

### Tests E2E (Playwright)

```bash
# Tests d'accessibilité E2E
npm run test:e2e __test__/accessibility/e2e/a11y.spec.ts

# Tests E2E avec interface graphique
npm run test:e2e:ui __test__/accessibility/e2e/a11y.spec.ts
```

## Normes respectées

### WCAG 2.1 (Web Content Accessibility Guidelines)

- **Niveau A** : Accessibilité de base
- **Niveau AA** : Accessibilité standard (recommandé)
- **Niveau AAA** : Accessibilité maximale

### RGAA 4.1 (Référentiel Général d'Amélioration de l'Accessibilité)

- Conformité au référentiel français
- Tests spécifiques aux exigences françaises

## Critères testés

### 1. Perceptibilité

- **1.1** : Alternatives textuelles pour les images
- **1.2** : Sous-titres et transcriptions pour les médias
- **1.3** : Structure sémantique
- **1.4** : Contraste des couleurs

### 2. Utilisabilité

- **2.1** : Navigation au clavier
- **2.2** : Pas de piège au clavier
- **2.3** : Pas de clignotement
- **2.4** : Navigation claire
- **2.5** : Méthodes d'entrée multiples

### 3. Compréhensibilité

- **3.1** : Langue lisible
- **3.2** : Comportement prévisible
- **3.3** : Assistance à la saisie
- **3.4** : Identification des erreurs

### 4. Robustesse

- **4.1** : Compatibilité avec les technologies d'assistance

## Bonnes pratiques implémentées

### Composants UI

- Tous les boutons ont des labels descriptifs
- Les champs de formulaire ont des labels associés
- Les messages d'erreur sont annoncés aux lecteurs d'écran
- Le focus est visible et logique

### Navigation

- Ordre de tabulation logique
- Skip links pour passer la navigation
- Raccourcis clavier pour les actions principales
- Indicateurs de position dans la navigation

### Formulaires

- Validation en temps réel
- Messages d'erreur contextuels
- Indicateurs de champs requis
- Assistance à la saisie

### Images et médias

- Alternatives textuelles descriptives
- Captions pour les vidéos
- Transcripts pour l'audio
- Graphiques avec descriptions

## Outils utilisés

- **Vitest** : Tests unitaires
- **React Testing Library** : Tests de composants
- **Playwright** : Tests E2E
- **Jest DOM** : Matchers pour les tests DOM
- **User Event** : Simulation des interactions utilisateur

## Maintenance

### Ajout de nouveaux tests

1. Identifier le composant ou la fonctionnalité à tester
2. Choisir le type de test approprié (ARIA, RGAA, E2E)
3. Créer le test en suivant les patterns existants
4. Vérifier la conformité aux normes WCAG/RGAA
5. Documenter les nouveaux tests

### Mise à jour des tests

1. Vérifier que les tests passent après les modifications
2. Mettre à jour les mocks si nécessaire
3. Ajouter des tests pour les nouvelles fonctionnalités
4. Vérifier la conformité aux nouvelles normes

## Ressources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [RGAA 4.1](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

## Contact

Pour toute question sur les tests d'accessibilité, contactez l'équipe de développement. 