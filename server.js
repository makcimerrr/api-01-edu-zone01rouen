import express from 'express';
import {createClient} from '@01-edu/api';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

const app = express();
const PORT = 3010;

dotenv.config();

const domain = process.env.DOMAIN;
const access_token = process.env.ACCESS_TOKEN;

const client = await createClient({
    domain,
    access_token,
});

const projects = [
    "0-shell",
    "Multiplayer-FPS",
    "RT",
    "Filler",
    "Smart-Road",
    "Bomberman-Dom",
    "Mini-Framework",
    "Social-Network",
    "GraphQL",
    "Real-Time-Forum",
    "Make-your-game",
    "Forum",
    "Lem-in",
    "Groupie-tracker",
    "Ascii-art-web",
    "Ascii-art",
    "Go-reloaded",
];

const allowedOrigins = [
    'https://admin-dashboard-blue-one.vercel.app',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: `
        .swagger-ui .topbar {
            display: none;
        }
    `
}));

/**
 * @swagger
 * tags:
 *   - name: User Information
 *     description: Routes to retrieve user information
 *   - name: Promotion Progress
 *     description: Routes for tracking promotion progress
 *   - name: Gitea User Info
 *     description: Routes for fetching Gitea user data
 */

/**
 * @swagger
 * /user-info:
 *   get:
 *     tags: [User Information]
 *     summary: Récupère les informations utilisateur
 *     description: Cette route retourne les informations de l'utilisateur connecté en utilisant le token passé dans l'en-tête.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token d'authentification Bearer
 *         schema:
 *           type: string
 *           example: Bearer <user-token>
 *     responses:
 *       200:
 *         description: Informations sur l'utilisateur
 *       400:
 *         description: Token manquant ou invalide
 *       500:
 *         description: Erreur interne du serveur
 */
app.get("/user-info", async (req, res) => {
    const token = req.headers['authorization']; // Récupère le token depuis les en-têtes de la requête

    if (!token) {
        return res.status(400).json({error: "Token manquant dans l'en-tête Authorization"});
    }
    try {
        const query = `
            query {
                user {
                    id
                    login
                }
            }
        `;
        const response = await client.run(query);
        res.status(200).json(response);
    } catch (error) {
        console.error("Erreur lors de l'exécution de la requête :", error);
        res.status(500).json({error: "Une erreur est survenue."});
    }
});

/**
 * @swagger
 * /user-find/{login}:
 *   get:
 *     tags: [User Information]
 *     summary: Recherche un utilisateur par son login
 *     description: Cette route retourne les informations d'un utilisateur spécifique en fonction de son login.
 *     parameters:
 *       - in: path
 *         name: login
 *         required: true
 *         description: Login de l'utilisateur à rechercher
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *       400:
 *         description: Requête invalide, login manquant
 *       500:
 *         description: Erreur interne du serveur
 */
app.get("/user-find/:login", async (req, res) => {
    const token = req.headers['authorization']; // Récupère le token depuis les en-têtes de la requête

    if (!token) {
        return res.status(400).json({error: "Token manquant dans l'en-tête Authorization"});
    }

    const {login} = req.params;

    if (!login) {
        return res.status(400).json({
            error: "Requête invalide : 'login' doit être fourni.",
        });
    }

    const query = `query {
  user(where: {login: {_eq: ${login} }}) {
    id
    login
    firstName
    lastName
    auditRatio
    auditsAssigned
    campus
    email
    githubId
    discordId
    discordDMChannelId
  }
}`

    try {
        const response = await client.run(query);
        res.status(200).json(response);
    } catch (error) {
        console.error("Erreur GraphQL :", error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * @swagger
 * /promotion-progress/{eventId}:
 *   get:
 *     tags: [Promotion Progress]
 *     summary: Récupère les progrès d'une promotion
 *     description: Cette route retourne les informations sur les progrès d'une promotion spécifique en fonction de l'ID de l'événement.
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: ID de l'événement pour récupérer les progrès associés
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Progrès des utilisateurs dans la promotion
 *       400:
 *         description: Requête invalide, eventId manquant
 *       500:
 *         description: Erreur interne du serveur
 */
app.get("/promotion-progress/:eventId", async (req, res) => {
    const token = req.headers['authorization']; // Récupère le token depuis les en-têtes de la requête

    if (!token) {
        return res.status(400).json({error: "Token manquant dans l'en-tête Authorization"});
    }

    const {eventId} = req.params;

    if (!eventId) {
        return res.status(400).json({
            error: "Requête invalide : 'eventId' doit être fourni.",
        });
    }

    const query = `
        query {
            progress(
                where: {
                    _and: [
                        { object: { name: { _in: ${JSON.stringify(projects.map((p) => p.toLowerCase()))} } } },
                        { group: { status: { _in: [finished, audit, setup, working] } } },
                        { event: { id: { _eq: ${eventId} } } }
                    ]
                }
            ) {
                user {
                    login
                }
                grade
                group {
                    status
                    id
                }
                object {
                    name
                }
            }
        }
    `;

    try {
        const response = await client.run(query);
        res.status(200).json(response);
    } catch (error) {
        console.error("Erreur GraphQL :", error.message);
        res.status(500).json({error: error.message});
    }
});

/**
 * @swagger
 * /user-gitea/{username}:
 *   get:
 *     tags: [Gitea User Info]
 *     summary: Récupère les informations d'un utilisateur sur Gitea
 *     description: Cette route retourne les informations d'un utilisateur ainsi que ses abonnements sur Gitea.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: Nom d'utilisateur Gitea
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur et abonnements
 *       500:
 *         description: Erreur interne du serveur
 */
app.get("/user-gitea/:username", async (req, res) => {
    const token = req.headers['authorization']; // Récupère le token depuis les en-têtes de la requête

    if (!token) {
        return res.status(400).json({error: "Token manquant dans l'en-tête Authorization"});
    }

    const {username} = req.params;

    const userUrl = `https://zone01normandie.org/git/api/v1/users/${username}`;
    const subscriptionsUrl = `https://zone01normandie.org/git/api/v1/users/${username}/subscriptions`;

    try {
        const [userResponse, subscriptionsResponse] = await Promise.all([
            fetch(userUrl, {
                headers: {'Authorization': `Bearer ${access_token}`},
            }),
            fetch(subscriptionsUrl, {
                headers: {'Authorization': `Bearer ${access_token}`},
            }),
        ]);

        if (!userResponse.ok || !subscriptionsResponse.ok) {
            throw new Error(`Gitea API error: User (${userResponse.status}) / Subscriptions (${subscriptionsResponse.status})`);
        }

        const [userData, subscriptionsData] = await Promise.all([
            userResponse.json(),
            subscriptionsResponse.json(),
        ]);

        res.json({user: userData, subscriptions: subscriptionsData});
    } catch (error) {
        console.error("Error fetching data from Gitea:", error);
        res.status(500).json({error: "Internal Server Error", details: error.message});
    }
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']; // Récupère le token depuis les en-têtes de la requête

    if (!token) {
        return res.status(400).json({error: "Token manquant dans l'en-tête Authorization"});
    }

    // Tu peux ajouter ici une logique pour valider le token
    // Exemple simple de vérification, tu peux étendre cette vérification selon tes besoins
    if (token !== 'Bearer ' + process.env.ACCESS_TOKEN) {
        return res.status(401).json({error: "Token invalide"});
    }

    // Si tout est ok, passe à la suite de la requête
    next();
};

// Appliquer ce middleware sur toutes les routes où tu veux la vérification du token
app.use("/user-info", verifyToken);
app.use("/promotion-progress/:eventId", verifyToken);
app.use("/user-find/:login", verifyToken);
app.use("/user-gitea/:username", verifyToken);