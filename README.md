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