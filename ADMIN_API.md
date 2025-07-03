# API d'Administration - AthleteAxis

Cette API permet aux administrateurs de gérer les utilisateurs de manière sécurisée via Postman ou d'autres outils API.

## Configuration

1. **Ajouter la variable d'environnement** dans votre fichier `.env` :
```env
ADMIN_SECRET=votre_clé_secrète_très_longue_et_complexe
```

2. **Utiliser l'en-tête d'autorisation** dans toutes les requêtes :
```
Authorization: Bearer votre_clé_secrète_très_longue_et_complexe
```

## Routes disponibles

### 1. Créer un utilisateur
**POST** `/api/admin/create-user`

**Body :**
```json
{
  "name": "Nom de l'utilisateur",
  "email": "email@example.com",
  "password": "motdepasse123",
  "role": "admin", // "admin", "coach", ou "client"
  "isCoach": true, // optionnel, automatiquement true pour les admins
  "image": "https://example.com/avatar.jpg", // optionnel
  "address": "123 Rue Example", // optionnel
  "zipCode": "75001", // optionnel
  "city": "Paris", // optionnel
  "country": "France", // optionnel
  "phoneNumber": "+33123456789" // optionnel
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Utilisateur admin créé avec succès",
  "user": {
    "id": "uuid",
    "name": "Nom de l'utilisateur",
    "email": "email@example.com",
    "isCoach": true,
    "role": "admin",
    // ... autres champs
  }
}
```

### 2. Lister tous les utilisateurs
**GET** `/api/admin/create-user`

**Réponse :**
```json
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "name": "Nom",
      "email": "email@example.com",
      "isCoach": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
      // ... autres champs (sans le mot de passe)
    }
  ],
  "count": 1
}
```

### 3. Supprimer un utilisateur
**DELETE** `/api/admin/delete-user`

**Body :**
```json
{
  "userId": "uuid-de-l-utilisateur"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Utilisateur supprimé avec succès",
  "deletedUser": {
    "id": "uuid",
    "email": "email@example.com",
    "name": "Nom de l'utilisateur"
  }
}
```

### 4. Mettre à jour un utilisateur
**PUT** `/api/admin/update-user`

**Body :**
```json
{
  "userId": "uuid-de-l-utilisateur",
  "name": "Nouveau nom", // optionnel
  "email": "nouveau@email.com", // optionnel
  "password": "nouveaumotdepasse", // optionnel
  "isCoach": true, // optionnel
  "onBoardingComplete": true, // optionnel
  "image": "https://example.com/nouveau-avatar.jpg", // optionnel
  "address": "Nouvelle adresse", // optionnel
  "zipCode": "75002", // optionnel
  "city": "Lyon", // optionnel
  "country": "France", // optionnel
  "phoneNumber": "+33987654321", // optionnel
  "emailNotifications": true, // optionnel
  "smsNotifications": false // optionnel
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Utilisateur mis à jour avec succès",
  "user": {
    "id": "uuid",
    "name": "Nouveau nom",
    "email": "nouveau@email.com",
    // ... autres champs mis à jour
  }
}
```

### 5. Mettre à jour le statut coach (spécialisé)
**PUT** `/api/admin/update-coach-status`

**Body :**
```json
{
  "userId": "uuid-de-l-utilisateur",
  "isCoach": true
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Statut coach mis à jour avec succès pour Marie Martin",
  "user": {
    "id": "uuid",
    "name": "Marie Martin",
    "email": "marie.martin@example.com",
    "isCoach": true
  }
}
```

## Exemples d'utilisation avec Postman

### Créer votre premier compte admin
1. Ouvrez Postman
2. Créez une nouvelle requête POST vers `http://localhost:3000/api/admin/create-user`
3. Dans l'onglet "Headers", ajoutez :
   - Key: `Authorization`
   - Value: `Bearer votre_clé_secrète`
4. Dans l'onglet "Body", sélectionnez "raw" et "JSON", puis ajoutez :
```json
{
  "name": "Alexandre Redon",
  "email": "alexandreredon.pro@gmail.com",
  "password": "motdepasse123",
  "role": "admin"
}
```
5. Envoyez la requête

### Lister tous les utilisateurs
1. Créez une requête GET vers `http://localhost:3000/api/admin/create-user`
2. Ajoutez le même header d'autorisation
3. Envoyez la requête

## Sécurité

- ✅ Toutes les routes nécessitent une clé secrète
- ✅ Les mots de passe sont hashés avec bcrypt
- ✅ Validation des données avec Zod
- ✅ Gestion des erreurs sécurisée
- ✅ Pas d'exposition des mots de passe dans les réponses

## Notes importantes

1. **Clé secrète** : Utilisez une clé très longue et complexe (minimum 32 caractères)
2. **Environnement** : Cette API ne doit être utilisée qu'en développement ou avec des précautions en production
3. **Backup** : Faites toujours un backup de votre base de données avant de supprimer des utilisateurs
4. **Logs** : Toutes les actions sont loggées côté serveur pour audit

## Création de votre premier compte

Pour créer votre premier compte admin :

1. Ajoutez `ADMIN_SECRET=ma_clé_super_secrète_et_très_longue_123456789` dans votre `.env`
2. Utilisez Postman avec l'exemple ci-dessus
3. Une fois créé, vous pourrez vous connecter normalement via l'interface web 