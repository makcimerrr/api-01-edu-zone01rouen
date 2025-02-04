# 🚀 API Maxime Dubois

Bienvenue dans le projet d'API développé par **Maxime Dubois**. Cette API vous permet d'interagir avec différentes
données de projet, telles que les informations utilisateurs et les progrès de promotions.

---

## 🔧 Technologies utilisées

- **Deno** : 🖥 Serveur backend utilisant Deno
- **Oak** : 🚂 Framework léger pour créer l'API avec Deno
- **GraphQL** : 📊 Utilisation de GraphQL pour récupérer des données dynamiques
- **dotenv** : 🌱 Gestion des variables d'environnement avec Deno
- **fetch** : 🌐 API native pour effectuer des requêtes HTTP

---

## 🌟 Fonctionnalités

### 📜 Endpoints disponibles

1. **`GET /users`**
   🧑‍💼 Récupère la liste des utilisateurs.

   Cette route permet d'obtenir un tableau d'objets représentant les utilisateurs du système. Chaque objet contient les
   informations suivantes :

    - **`id`** : Identifiant unique de l'utilisateur
    - **`login`** : Le nom d'utilisateur (ou identifiant de connexion)

   > Réponse :
   ```json
   {
     "data": {
       "user": [
         {
           "id": 87,
           "login": "102"
         },
         {
           "id": 91,
           "login": "example"
         }
       ]
     }
   }
   ```
   **Code de statut** : `200 OK`

2. **`GET /user-info/:username`**
   🧑‍💻 Récupère les informations d'un utilisateur depuis la plateforme Zone01.

   Cette route permet de récupérer les données d'un utilisateur à partir de son `username` (identifiant) sur la
   plateforme Zone01.

   > Réponse :
   ```json
    {
        "user": [
            {
                "id": 123,
                "login": "example",
                "firstName": "John",
                "lastName": "Doe",
                "auditRatio": 0.551059615204684,
                "auditsAssigned": 1,
                "campus": "rouen",
                "email": "john.doe@example.com",
                "githubId": 1234,
                "discordId": null,
                "discordDMChannelId": null
            }
        ]
    }
   ```
   **Code de statut** : `200 OK`

3. **`GET /gitea-info/:username`**
   🚀 Récupère les informations d'un utilisateur depuis Gitea et son heatmap.

   Cette route permet de récupérer les données de l'utilisateur sur Gitea (utilisant le même `username` que sur la
   plateforme Zone01), ainsi que les informations sur son heatmap.

   **Note** : Un token d'authentification (`Bearer token`) est requis pour accéder à cette route.

   > Réponse :
   ```json
   {
    "user": {
        "id": 123,
        "login": "example",
        "full_name": "John Doe",
        "email": "john.doe@example.com",
        "avatar_url": "https://zone01normandie.org/git/avatars/0c6851068fae19ad95",
        "language": "en-US",
        "is_admin": false,
        "last_login": "2025-01-22T18:44:11Z",
        "created": "2022-12-09T10:34:50Z",
        "restricted": false,
        "active": true,
        "prohibit_login": false,
        "location": "",
        "website": "",
        "description": "",
        "visibility": "public",
        "followers_count": 3,
        "following_count": 1,
        "starred_repos_count": 2,
        "username": "example"
    },
    "heatmap": [
        {
            "timestamp": 1734604200,
            "contributions": 1
        },
        {
            "timestamp": 1734616800,
            "contributions": 2
        }
      ]
    }
   ```
   **Code de statut** : `200 OK`

4. **`GET /promotion-progress/:eventId`**
   📊 Récupère l'état de la progression d'une promotion en fonction de l'`eventId`.

   Cette route permet d'obtenir les informations sur la progression des étudiants d'une promotion spécifique (identifiée
   par `eventId`), en se basant sur les projets et les groupes associés à l'événement.

   > Réponse :
   ```json
   {
    "progress": [
        {
            "user": {
                "login": "example"
            },
            "grade": 1.6639999999999997,
            "group": {
                "status": "finished",
                "id": 123
            },
            "object": {
                "name": "ascii-art-web"
            }
        },
        {
            "user": {
                "login": "example2"
            },
            "grade": 1.8239999999999998,
            "group": {
                "status": "working",
                "id": 456
            },
            "object": {
                "name": "ascii-art-web"
            }
        }
      ]
    }
   ```
   **Code de statut** : `200 OK`

4. **`GET /user-find/:login`**
   🧑🏼‍🎓 Récupère les informations Plateforme d'un utilisateur via son `username`.

5. **`GET /user-gitea/:username`**
   📀 Récupère les informations Gitea d'un utilisateur spécifiée par son `username`.

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
deno install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet et définissez les variables suivantes :

```
DOMAIN=your-domain.com
ACCESS_TOKEN=your-access-token
```

> Remplacez `your-domain.com` et `your-access-token` par les valeurs appropriées.

---

## 🚀 Lancer le projet

Pour démarrer le serveur, utilisez la commande suivante :

```bash
deno run --allow-net --allow-env --allow-read src/server.ts
```

Cela lancera l'API avec les permissions nécessaires pour accéder au réseau et aux variables d'environnement.

---

## 📝 Tests

Les tests sont situés dans le dossier `tests` et peuvent être exécutés avec :

```bash
deno test --allow-net --allow-read --allow-env
```

---

## 🤝 Contribuer

1. Fork ce dépôt.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature-nouvelle-fonctionnalité`).
3. Commitez vos changements (`git commit -am 'Ajout d\'une nouvelle fonctionnalité'`).
4. Poussez la branche (`git push origin feature-nouvelle-fonctionnalité`).
5. Créez une Pull Request.