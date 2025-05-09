up:
	docker compose -f docker/docker-compose.yml up -d --build

down:
	docker compose -f docker/docker-compose.yml down

logs:
	docker compose -f docker/docker-compose.yml logs -f

# Commandes Drizzle utilisant les scripts npm
db-generate: ## Génère les migrations Drizzle
	@echo "Génération des migrations Drizzle..."
	@npm run db:generate

db-push: ## Push le schéma directement sans migration
	@echo "Push du schéma Drizzle..."
	@npm run db:push

db-studio: ## Lance Drizzle Studio
	@echo "Lancement de Drizzle Studio..."
	@npm run db:studio

db-test: ## Teste la connexion à la base de données
	@echo "Test de connexion à PostgreSQL..."
	@node -r esm scripts/test-db.js