# Documentation de l'API de Harjot
L'API permet de gérer l'authentification des utilisateurs et les informations sur les produits. Elle utilise des tokens JWT pour sécuriser l'accès.

## URL de base
Serveur : https://localhost:3000

## Installation
1. **Vérifiez que Node.js est installé :**
Assurez-vous que vous avez installé Node.js sur votre machine.

2. **Clonez le projet :**
Ouvrez votre terminal et exécutez la commande suivante :

   ```bash
   git clone https://github.com/hasilon88/tp-express.git
   ```

3. **Accédez au dossier du projet :** Allez dans le dossier du projet cloné :

   ```bash
   cd tp-express
   ```

4. **Installez les dépendances :**
Installez toutes les dépendances requises par le projet :

   ```bash
   npm install
   ```
5. **Démarrez le serveur :**
Lancez l’API

   ```bash
   npm start
   ```

6. **Accédez à l’API :**
Une fois le serveur démarré, vous pouvez accéder à l’API via https://localhost:3000.

## Authentification
Pour accéder à l’API, vous devez vous connecter et obtenir un token JWT.

- `POST /api/v1/login` : Connexion avec email et mot de passe.

- `POST /api/v1/register` : Inscription d’un nouvel utilisateur avec nom, email, mot de passe et rôle.

## Gestion des Produits
Les produits peuvent être créés, consultés, modifiés ou supprimés via les points de terminaison suivants :

- `POST /api/v1/products` : Ajouter un nouveau produit.

- `GET /api/v1/products` : Récupérer la liste des produits.

- `PUT /api/v1/products/{id}` : Mettre à jour un produit existant.

- `DELETE /api/v1/products/{id}` : Supprimer un produit par son ID.

## Sécurité
Inclure le token JWT dans l’en-tête Authorization pour toutes les requêtes suivantes: `POST`, `PUT`, `DELETE`