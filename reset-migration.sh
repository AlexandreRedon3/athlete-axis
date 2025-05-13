#!/bin/bash

# Stop on error
set -e
# print the current directory
echo "Current directory: $(pwd)"
MIGRATIONS_DIR="./src/drizzle"

echo "🧹 Suppression des anciennes migrations..."

if [ -d "$MIGRATIONS_DIR" ]; then
  rm -rf "$MIGRATIONS_DIR"
  echo "✅ Dossier $MIGRATIONS_DIR supprimé."
else
  echo "ℹ️ Aucun dossier de migrations trouvé."
fi

echo "📦 Génération d'une nouvelle migration à jour..."
make db-generate

echo "✅ Migration régénérée avec succès."
