# 🚀 API Maxime Dubois

Bienvenue dans le projet d'API développé par **Maxime Dubois**. Cette API vous permet d'interagir avec différentes données de projet, telles que les informations utilisateurs et les progrès de promotions.

---

## 🔧 Technologies utilisées

- **Node.js** : 🖥 Serveur backend utilisant Node.js
- **Express.js** : 🚂 Framework léger pour créer l'API
- **GraphQL** : 📊 Utilisation de GraphQL pour récupérer des données dynamiques
- **CORS** : 🌍 Gérer les autorisations cross-origin
- **dotenv** : 🌱 Gestion des variables d'environnement
- **@01-edu/api** : 🧑‍💻 API spécifique pour l'intégration avec le système de gestion des projets

---

## 🌟 Fonctionnalités

### 📜 Endpoints disponibles

1. **`GET /`**  
   📋 Page d'accueil avec un message de bienvenue.
   
   > Réponse : `"Bienvenue sur l'API de Maxime Dubois"`

2. **`GET /user-info`**  
   🧑‍💼 Retourne les informations de l'utilisateur actuellement connecté, notamment son `login` et `id`.

3. **`GET /promotion-progress/:eventId`**  
   📊 Récupère le progrès de la promotion spécifiée par `eventId` avec des détails sur chaque projet en cours dans la promotion.

---

## ⚙️ Installation

### 1. Cloner le projet
Clonez le repository dans votre répertoire local :

```bash
git clone https://github.com/makcimerrr/api-01-edu-zone01rouen.git
```

### 2. Installer les dépendances

Placez-vous dans le répertoire du projet et exécutez la commande suivante pour installer les dépendances :

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet et définissez les variables suivantes :

```
DOMAIN=your-domain.com
ACCESS_TOKEN=your-access-token
```

> Remplacez `your-domain.com` et `your-access-token` par les valeurs appropriées.
