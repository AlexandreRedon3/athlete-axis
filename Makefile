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


## 📊 Monitoring et Observabilité Avancé
monitoring-up: ## Lance la stack de monitoring complète
	@echo "📊 Lancement de la stack de monitoring AthleteAxis..."
	@docker compose -f docker/monitoring/docker-compose.monitoring.yml up -d
	@echo "⏳ Attente du démarrage des services..."
	@sleep 10
	@echo "✅ Monitoring démarré!"
	@echo ""
	@echo "🎨 Grafana: http://localhost:3001"
	@echo "   👤 Utilisateur: admin"
	@echo "   🔑 Mot de passe: admin123"
	@echo ""
	@echo "📈 Prometheus: http://localhost:9090"
	@echo "📊 Node Exporter: http://localhost:9100"
	@echo "📝 Loki: http://localhost:3100"
	@echo ""
	@echo "📋 Dashboards disponibles:"
	@echo "   • AthleteAxis Business: http://localhost:3001/d/athleteaxis-main"
	@echo "   • Système & Performance: http://localhost:3001/d/athleteaxis-system"

monitoring-down: ## Arrête la stack de monitoring
	@echo "🛑 Arrêt de la stack de monitoring..."
	@docker compose -f docker/monitoring/docker-compose.monitoring.yml down

monitoring-logs: ## Affiche les logs du monitoring
	@echo "📋 Logs du monitoring..."
	@docker compose -f docker/monitoring/docker-compose.monitoring.yml logs -f

monitoring-restart: ## Redémarre la stack de monitoring
	@echo "🔄 Redémarrage du monitoring..."
	@make monitoring-down
	@sleep 3
	@make monitoring-up

monitoring-clean: ## Nettoie les données de monitoring
	@echo "🧹 Nettoyage des données de monitoring..."
	@docker compose -f docker/monitoring/docker-compose.monitoring.yml down -v
	@docker volume prune -f
	@echo "✅ Données de monitoring nettoyées"

monitoring-backup: ## Sauvegarde les dashboards Grafana
	@echo "💾 Sauvegarde des dashboards Grafana..."
	@mkdir -p backups/grafana
	@docker cp $$(docker ps -q -f name=athlete-axis-grafana):/var/lib/grafana/grafana.db backups/grafana/grafana-$(shell date +%Y%m%d-%H%M%S).db
	@echo "✅ Sauvegarde créée dans backups/grafana/"

monitoring-restore: ## Restaure une sauvegarde Grafana (usage: make monitoring-restore BACKUP=filename)
	@if [ -z "$(BACKUP)" ]; then \
		echo "❌ Veuillez spécifier le fichier de sauvegarde: make monitoring-restore BACKUP=filename"; \
		exit 1; \
	fi
	@echo "📂 Restauration de la sauvegarde $(BACKUP)..."
	@docker cp backups/grafana/$(BACKUP) $$(docker ps -q -f name=athlete-axis-grafana):/var/lib/grafana/grafana.db
	@docker restart $$(docker ps -q -f name=athlete-axis-grafana)
	@echo "✅ Sauvegarde restaurée"

monitoring-test: ## Teste les endpoints de métriques
	@echo "🧪 Test des endpoints de métriques..."
	@echo "Testing /api/metrics..."
	@curl -s -o /dev/null -w "Status: %{http_code} - Time: %{time_total}s\n" http://localhost:3000/api/metrics || echo "❌ Application non accessible"
	@echo "Testing Prometheus..."
	@curl -s -o /dev/null -w "Status: %{http_code} - Time: %{time_total}s\n" http://localhost:9090/-/healthy || echo "❌ Prometheus non accessible"
	@echo "Testing Grafana..."
	@curl -s -o /dev/null -w "Status: %{http_code} - Time: %{time_total}s\n" http://localhost:3001/api/health || echo "❌ Grafana non accessible"

monitoring-init: ## Configuration initiale du monitoring
	@echo "🏗️ Configuration initiale du monitoring..."
	@mkdir -p docker/monitoring/grafana/provisioning/dashboards/
	@mkdir -p docker/monitoring/grafana/provisioning/datasources/
	@mkdir -p docker/monitoring/grafana/provisioning/alerting/
	@mkdir -p docker/monitoring/grafana/dashboards/
	@mkdir -p docker/monitoring/prometheus/
	@mkdir -p docker/monitoring/loki/
	@mkdir -p docker/monitoring/promtail/
	@echo "✅ Structure de dossiers créée"
	@echo "💡 Copiez les fichiers de configuration dans les dossiers correspondants"

monitoring-update-dashboards: ## Met à jour les dashboards depuis les fichiers JSON
	@echo "🔄 Mise à jour des dashboards..."
	@docker cp docker/monitoring/grafana/dashboards/. $$(docker ps -q -f name=athlete-axis-grafana):/var/lib/grafana/dashboards/
	@echo "✅ Dashboards mis à jour"

monitoring-export-dashboards: ## Exporte les dashboards actuels
	@echo "📤 Export des dashboards..."
	@mkdir -p exports/dashboards
	@docker exec $$(docker ps -q -f name=athlete-axis-grafana) grafana-cli admin export-dashboard --dashboard-uid=athleteaxis-main > exports/dashboards/main-dashboard.json
	@docker exec $$(docker ps -q -f name=athlete-axis-grafana) grafana-cli admin export-dashboard --dashboard-uid=athleteaxis-system > exports/dashboards/system-dashboard.json
	@echo "✅ Dashboards exportés dans exports/dashboards/"

monitoring-stress-test: ## Lance un test de charge pour générer des métriques
	@echo "⚡ Lancement d'un test de charge léger..."
	@echo "Génération de trafic HTTP..."
	@for i in $$(seq 1 50); do \
		curl -s http://localhost:3000/ > /dev/null & \
		curl -s http://localhost:3000/api/metrics > /dev/null & \
	done
	@wait
	@echo "✅ Test terminé - consultez Grafana pour voir les métriques"

monitoring-alerts-test: ## Teste les alertes (génère une charge CPU)
	@echo "🚨 Test des alertes - génération de charge..."
	@echo "⚠️  Ceci va générer de la charge pour tester les alertes"
	@dd if=/dev/zero of=/dev/null bs=1M count=1000 &
	@sleep 30
	@pkill dd || true
	@echo "✅ Test d'alerte terminé"

monitoring-status: ## Affiche le statut détaillé du monitoring
	@echo "📊 Statut du monitoring AthleteAxis"
	@echo "========================================="
	@echo ""
	@echo "🐳 Services Docker:"
	@docker compose -f docker/monitoring/docker-compose.monitoring.yml ps 2>/dev/null || echo "❌ Stack monitoring non démarrée"
	@echo ""
	@echo "🌐 Endpoints:"
	@curl -s -o /dev/null -w "✅ Application (métriques): %{http_code}\n" http://localhost:3000/api/metrics || echo "❌ Application inaccessible"
	@curl -s -o /dev/null -w "✅ Prometheus: %{http_code}\n" http://localhost:9090/-/healthy || echo "❌ Prometheus inaccessible"
	@curl -s -o /dev/null -w "✅ Grafana: %{http_code}\n" http://localhost:3001/api/health || echo "❌ Grafana inaccessible"
	@curl -s -o /dev/null -w "✅ Node Exporter: %{http_code}\n" http://localhost:9100/metrics || echo "❌ Node Exporter inaccessible"
	@echo ""
	@echo "📈 Métriques disponibles:"
	@curl -s http://localhost:3000/api/metrics | grep "athlete_axis" | head -5 || echo "❌ Métriques business indisponibles"

monitoring-help: ## Affiche l'aide du monitoring
	@echo "🎯 Guide de démarrage rapide du monitoring AthleteAxis"
	@echo "====================================================="
	@echo ""
	@echo "1️⃣  Initialiser: make monitoring-init"
	@echo "2️⃣  Démarrer:    make monitoring-up"
	@echo "3️⃣  Vérifier:    make monitoring-status"
	@echo "4️⃣  Tester:      make monitoring-test"
	@echo ""
	@echo "🎨 Accéder à Grafana: http://localhost:3001 (admin/admin123)"
	@echo "📈 Accéder à Prometheus: http://localhost:9090"
	@echo ""
	@echo "📊 Dashboards principaux:"
	@echo "   • Business: http://localhost:3001/d/athleteaxis-main"
	@echo "   • Système:  http://localhost:3001/d/athleteaxis-system"

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