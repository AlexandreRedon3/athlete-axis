# Configuration Neon.tech pour Athlete Axis

## 🚀 Étapes de configuration

### 1. Créer un compte Neon.tech
1. Allez sur [console.neon.tech](https://console.neon.tech)
2. Créez un compte ou connectez-vous
3. Créez un nouveau projet

### 2. Obtenir l'URL de connexion
1. Dans votre projet Neon, allez dans "Connection Details"
2. Copiez l'URL de connexion qui ressemble à :
   ```
   postgresql://user:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require
   ```

### 3. Configurer les variables d'environnement
Créez un fichier `.env.local` avec :
```env
DATABASE_URL="votre-url-neon-ici"
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Exécuter les migrations
```bash
# Générer les migrations (si nécessaire)
npm run db:generate

# Appliquer les migrations sur Neon
npm run db:migrate:neon
```

### 5. Vérifier la connexion
```bash
# Ouvrir Drizzle Studio pour vérifier
npm run db:studio
```

## 🔧 Scripts disponibles

- `npm run db:migrate:neon` - Appliquer les migrations sur Neon
- `npm run db:reset` - Réinitialiser complètement la base de données
- `npm run db:studio` - Ouvrir Drizzle Studio
- `npm run db:generate` - Générer de nouvelles migrations

## 📊 Avantages de Neon

- **Serverless** : Pas de gestion d'infrastructure
- **Auto-scaling** : S'adapte automatiquement à la charge
- **Branching** : Possibilité de créer des branches de base de données
- **Performance** : Optimisé pour les applications modernes
- **Gratuit** : Tier gratuit généreux pour commencer

## 🚨 Notes importantes

1. **SSL requis** : Neon nécessite SSL, c'est automatiquement inclus dans l'URL
2. **Connection pooling** : Neon gère automatiquement le pooling de connexions
3. **Cold starts** : Première connexion peut être lente, mais les suivantes sont rapides
4. **Limites** : Vérifiez les limites de votre plan sur la console Neon

## 🔍 Dépannage

### Erreur de connexion
- Vérifiez que l'URL DATABASE_URL est correcte
- Assurez-vous que le projet Neon est actif
- Vérifiez les paramètres de sécurité (IP allowlist si configurée)

### Erreur de migration
- Vérifiez que vous avez les permissions nécessaires
- Essayez de réinitialiser avec `npm run db:reset`

### Performance lente
- Vérifiez que vous utilisez la région la plus proche
- Considérez l'upgrade vers un plan payant pour plus de ressources 