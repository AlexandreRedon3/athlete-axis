# Makefile pour AthleteAxis
.PHONY: help dev build test lint clean monitoring db

# Variables
DOCKER_COMPOSE_MONITORING = docker/monitoring/docker-compose.monitoring.yml
DOCKER_COMPOSE_APP = docker/docker-compose.yml

## 🚀 Commandes de développement
help: ## Affiche cette aide
	@echo "\n🏋️ AthleteAxis - Commandes disponibles:\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Lance l'application en mode développement
	@echo "🚀 Lancement de l'application en mode développement..."
	@npm run dev

build: ## Build l'application
	@echo "🔨 Build de l'application..."
	@npm run build

install: ## Installe les dépendances
	@echo "📦 Installation des dépendances..."
	@npm ci --legacy-peer-deps

## 🧪 Tests et qualité
test: ## Lance tous les tests
	@echo "🧪 Lancement des tests..."
	@npm run test

test-watch: ## Lance les tests en mode watch
	@echo "👀 Tests en mode watch..."
	@npm run test:watch

test-coverage: ## Lance les tests avec coverage
	@echo "📊 Tests avec couverture..."
	@npm run test:coverage

lint: ## Vérifie le code avec ESLint
	@echo "🔍 Vérification du code..."
	@npm run lint

lint-fix: ## Corrige automatiquement les erreurs ESLint
	@echo "🔧 Correction automatique du code..."
	@npm run lint:fix

format: ## Formate le code avec Prettier
	@echo "✨ Formatage du code..."
	@npm run format

type-check: ## Vérifie les types TypeScript
	@echo "📝 Vérification des types..."
	@npm run type-check

quality-check: ## Lance toutes les vérifications de qualité
	@echo "🎯 Vérifications complètes de qualité..."
	@npm run quality:check

quality-fix: ## Corrige automatiquement les problèmes de qualité
	@echo "🔧 Correction automatique..."
	@npm run quality:fix

unused-deps: ## Vérifie les dépendances non utilisées
	@echo "🧹 Vérification des dépendances inutiles..."
	@npm run unused-deps

audit: ## Audit de sécurité des dépendances
	@echo "🔐 Audit de sécurité..."
	@npm run audit

## 🗄️ Base de données
db-generate: ## Génère les migrations Drizzle
	@echo "📝 Génération des migrations Drizzle..."
	@npm run db:generate

db-push: ## Push le schéma directement sans migration
	@echo "🚀 Push du schéma Drizzle..."
	@npm run db:push

db-studio: ## Lance Drizzle Studio
	@echo "🎨 Lancement de Drizzle Studio..."
	@npm run db:studio

db-migrate-neon: ## Applique les migrations sur Neon
	@echo "☁️ Migration vers Neon..."
	@npm run db:migrate:neon

db-reset: ## Réinitialise complètement la base de données
	@echo "🔄 Réinitialisation de la base de données..."
	@npm run db:reset

db-seed: ## Seed la base avec des données de test
	@echo "🌱 Ajout de données de test..."
	@npm run db:seed

## 🐳 Docker et Infrastructure
up: ## Lance l'application avec Docker
	@echo "🐳 Lancement des conteneurs Docker..."
	@docker compose -f $(DOCKER_COMPOSE_APP) up -d --build

down: ## Arrête l'application Docker
	@echo "🛑 Arrêt des conteneurs Docker..."
	@docker compose -f $(DOCKER_COMPOSE_APP) down

logs: ## Affiche les logs de l'application
	@echo "📋 Affichage des logs..."
	@docker compose -f $(DOCKER_COMPOSE_APP) logs -f

## 📊 Monitoring et Observabilité
monitoring-up: ## Lance la stack de monitoring (Grafana, Prometheus, etc.)
	@echo "📊 Lancement de la stack de monitoring..."
	@docker compose -f $(DOCKER_COMPOSE_MONITORING) up -d
	@echo "✅ Monitoring démarré!"
	@echo "   🎨 Grafana: http://localhost:3001 (admin/admin123)"
	@echo "   📈 Prometheus: http://localhost:9090"
	@echo "   📊 Node Exporter: http://localhost:9100"

monitoring-down: ## Arrête la stack de monitoring
	@echo "🛑 Arrêt de la stack de monitoring..."
	@docker compose -f $(DOCKER_COMPOSE_MONITORING) down

monitoring-logs: ## Affiche les logs du monitoring
	@echo "📋 Logs du monitoring..."
	@docker compose -f $(DOCKER_COMPOSE_MONITORING) logs -f

monitoring-restart: ## Redémarre la stack de monitoring
	@echo "🔄 Redémarrage du monitoring..."
	@make monitoring-down
	@make monitoring-up

## 🧹 Nettoyage
clean: ## Nettoie les fichiers temporaires
	@echo "🧹 Nettoyage..."
	@npm run clean
	@docker system prune -f

clean-all: ## Nettoyage complet (attention: supprime tout)
	@echo "🧹 Nettoyage complet..."
	@npm run clean
	@docker compose -f $(DOCKER_COMPOSE_APP) down -v
	@docker compose -f $(DOCKER_COMPOSE_MONITORING) down -v
	@docker system prune -af --volumes

## 🚀 CI/CD et Déploiement
ci-test: ## Lance les tests comme en CI
	@echo "🤖 Tests CI..."
	@npm run ci:test

pre-commit: ## Vérifications avant commit
	@echo "✅ Vérifications pré-commit..."
	@make quality-check
	@make test
	@echo "🎉 Prêt pour le commit!"

pre-push: ## Vérifications avant push
	@echo "🚀 Vérifications pré-push..."
	@make pre-commit
	@make build
	@echo "🎉 Prêt pour le push!"

## 📋 Utilitaires
status: ## Affiche le statut des services
	@echo "📊 Statut des services:"
	@echo "\n🐳 Conteneurs Docker:"
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Aucun conteneur en cours"
	@echo "\n📊 Services de monitoring:"
	@docker compose -f $(DOCKER_COMPOSE_MONITORING) ps 2>/dev/null || echo "Monitoring non démarré"

setup: ## Configuration initiale du projet
	@echo "🏗️ Configuration initiale..."
	@make install
	@make db-push
	@cp .env.example .env
	@echo "✅ Configuration terminée!"
	@echo "📝 N'oubliez pas de configurer votre fichier .env"

health-check: ## Vérifie la santé de l'application
	@echo "🩺 Vérification de la santé..."
	@curl -f http://localhost:3000/api/health 2>/dev/null && echo "✅ Application OK" || echo "❌ Application KO"
	@curl -f http://localhost:3001 2>/dev/null && echo "✅ Grafana OK" || echo "❌ Grafana KO"
	@curl -f http://localhost:9090 2>/dev/null && echo "✅ Prometheus OK" || echo "❌ Prometheus KO"

backup-db: ## Sauvegarde la base de données
	@echo "💾 Sauvegarde de la base de données..."
	@mkdir -p backups
	@pg_dump $(DATABASE_URL) > backups/backup-$(shell date +%Y%m%d-%H%M%S).sql
	@echo "✅ Sauvegarde créée dans le dossier backups/"