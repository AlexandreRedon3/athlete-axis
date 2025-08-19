# 🏃‍♂️ Athlete Axis - Plateforme de Coaching Sportif

[![CI/CD Pipeline](https://github.com/your-username/athlete-axis/actions/workflows/main.yml/badge.svg)](https://github.com/your-username/athlete-axis/actions/workflows/main.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 📋 Description

Athlete Axis est une plateforme moderne de coaching sportif qui connecte les coachs professionnels avec leurs clients. L'application offre une gestion complète des programmes d'entraînement, un suivi des performances, et une interface intuitive pour optimiser l'expérience utilisateur.

## ✨ Fonctionnalités Principales

### 🎯 Pour les Coachs
- **Dashboard personnalisé** avec statistiques en temps réel
- **Gestion des clients** et invitations
- **Création de programmes** d'entraînement personnalisés
- **Suivi des performances** avec graphiques interactifs
- **Planification des séances** avec calendrier intégré

### 🏋️‍♂️ Pour les Athlètes
- **Interface client** intuitive et responsive
- **Accès aux programmes** assignés par le coach
- **Suivi des séances** et progression
- **Historique des entraînements** détaillé

### 🔧 Fonctionnalités Techniques
- **Authentification sécurisée** avec Better Auth
- **Base de données** PostgreSQL avec Drizzle ORM
- **API REST** complète avec validation Zod
- **Tests automatisés** (unitaires, intégration, e2e)
- **Monitoring** avec Prometheus et Grafana
- **Accessibilité** RGAA/WCAG 2.1

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ 
- PostgreSQL 15+
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/your-username/athlete-axis.git
cd athlete-axis
```

2. **Installer les dépendances**
```bash
npm install --legacy-peer-deps
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env.local
```

Remplir les variables d'environnement dans `.env.local` :
```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/athlete_axis"

# Authentification
BETTER_AUTH_SECRET="your-secret-key"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Migration de la base de données**
```bash
npm run db:push
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🧪 Tests

### Exécuter tous les tests
```bash
npm run test
```

### Tests spécifiques
```bash
# Tests unitaires
npm run test:unit

# Tests d'intégration
npm run test:integration

# Tests de sécurité
npm run test:security

# Tests d'accessibilité
npm run test:accessibility

# Tests e2e avec Playwright
npm run test:e2e
```

### Couverture de code
```bash
npm run test:coverage
```

## 🏗️ Architecture

```
athlete-axis/
├── app/                    # App Router Next.js 15
│   ├── (auth)/            # Routes d'authentification
│   ├── (main)/            # Routes principales
│   └── api/               # API Routes
├── src/
│   ├── components/        # Composants React
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilitaires et configuration
│   └── db/               # Schémas de base de données
├── __test__/             # Tests automatisés
├── docker/               # Configuration Docker
└── scripts/              # Scripts utilitaires
```

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 15** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **HeroUI** - Composants UI modernes
- **Framer Motion** - Animations

### Backend
- **Next.js API Routes** - API REST
- **Drizzle ORM** - ORM TypeScript-first
- **PostgreSQL** - Base de données relationnelle
- **Better Auth** - Authentification sécurisée
- **Zod** - Validation de schémas

### Tests & Qualité
- **Vitest** - Framework de tests
- **Playwright** - Tests e2e
- **ESLint** - Linting
- **Prettier** - Formatage de code

### DevOps
- **GitHub Actions** - CI/CD
- **Docker** - Containerisation
- **Prometheus** - Monitoring
- **Grafana** - Visualisation

## 📊 Monitoring

Le projet inclut un stack de monitoring complet :

```bash
# Démarrer le monitoring
npm run monitoring:up

# Voir les logs
npm run monitoring:logs

# Arrêter le monitoring
npm run monitoring:down
```

- **Grafana** : [http://localhost:3001](http://localhost:3001)
- **Prometheus** : [http://localhost:9090](http://localhost:9090)

## 🔒 Sécurité

- Authentification sécurisée avec Better Auth
- Validation des données avec Zod
- Tests de sécurité automatisés
- Audit de dépendances régulier
- Conformité RGAA/WCAG 2.1

## 📈 Déploiement

### Vercel (Recommandé)
1. Connecter le repository GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement sur push vers `main`

### Docker
```bash
# Build de l'image
docker build -t athlete-axis .

# Lancer le container
docker run -p 3000:3000 athlete-axis
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build            # Build de production
npm run start            # Serveur de production

# Tests
npm run test             # Tous les tests
npm run test:watch       # Tests en mode watch
npm run test:coverage    # Couverture de code

# Qualité
npm run lint             # Linting
npm run lint:fix         # Correction automatique
npm run format           # Formatage
npm run type-check       # Vérification TypeScript

# Base de données
npm run db:generate      # Générer les migrations
npm run db:push          # Appliquer les migrations
npm run db:studio        # Interface Drizzle Studio

# Monitoring
npm run monitoring:up    # Démarrer le monitoring
npm run monitoring:down  # Arrêter le monitoring
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

- **Documentation API** : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Issues** : [GitHub Issues](https://github.com/your-username/athlete-axis/issues)
- **Discussions** : [GitHub Discussions](https://github.com/your-username/athlete-axis/discussions)

---

**Développé avec ❤️ par l'équipe Athlete Axis**
