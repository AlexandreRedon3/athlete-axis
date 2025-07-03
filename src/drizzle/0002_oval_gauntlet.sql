-- Ajouter les nouvelles colonnes sans contrainte NOT NULL
ALTER TABLE "accounts" ADD COLUMN "provider" text;
ALTER TABLE "accounts" ADD COLUMN "providerAccountId" text;

-- Mettre à jour les données existantes
UPDATE "accounts" SET "provider" = 'credentials', "providerAccountId" = "accountId";

-- Ajouter les contraintes NOT NULL
ALTER TABLE "accounts" ALTER COLUMN "provider" SET NOT NULL;
ALTER TABLE "accounts" ALTER COLUMN "providerAccountId" SET NOT NULL;

-- Supprimer les anciennes colonnes
ALTER TABLE "accounts" DROP COLUMN "accountId";
ALTER TABLE "accounts" DROP COLUMN "providerId";