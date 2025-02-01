import express from 'express';
import {createClient} from '@01-edu/api';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

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
    'https://api-01-edu.vercel.app',
    'http://localhost:3000',
];

// Calculer le répertoire actuel (équivalent de __dirname)
const __dirname = path.dirname(new URL(import.meta.url).pathname);


/*app.use((req, res, next) => {
    console.log('Request Origin:', req.headers.origin);
    next();
});*/

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Maxime Dubois',
            version: '1.0.0',
            description: 'Une API pour récupérer des informations sur les utilisateurs et la progression des promotions.',
        },
        security: [
            {
                BearerAuth: []
            }
        ],
        servers: [
            {
                url: 'https://api-01-edu.vercel.app',
            },
            {
                url: 'http://localhost:3010',
            },
        ],
    },
    apis: ['./server.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve swagger.json via l'URL /swagger.json
app.get('/swagger.json', (req, res) => {
    res.json(swaggerDocs);
});

// Serve the index.html file when accessing the root URL (/)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

/**
 * @swagger
 * tags:
 *   - name: User Information
 *     description: Routes to retrieve user information
 *   - name: Promotion Progress
 *     description: Routes for tracking promotion progress
 *   - name: Gitea User Info
 *     description: Routes for fetching Gitea user data
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /user-info:
 *   get:
 *     tags: [User Information]
 *     summary: Récupère les informations utilisateur
 *     description: Cette route retourne les informations de l'utilisateur connecté en utilisant le token passé dans l'en-tête.
 *     responses:
 *       200:
 *         description: Informations sur l'utilisateur
 *       400:
 *         description: Token manquant ou invalide
 *       500:
 *         description: Erreur interne du serveur
 */
app.get("/user-info", checkToken, async (req, res) => {
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
app.get("/user-find/:login", checkToken, async (req, res) => {
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
app.get("/promotion-progress/:eventId", checkToken, async (req, res) => {
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
app.get("/user-gitea/:username", checkToken, async (req, res) => {
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

// Middleware pour vérifier la présence du token
function checkToken(req, res, next) {
    const token = req.header('Authorization');

    // Vérifier si le token est manquant ou vide
    if (!token || token.trim() === "") {
        return res.status(400).json({error: 'Token manquant ou vide'});
    }

    // Vérifier si le token correspond à ACCESS_TOKEN défini dans l'environnement
    if (token !== `Bearer ${process.env.ACCESS_TOKEN}`) {
        return res.status(403).json({error: 'Token invalide'});
    }

    next(); // Si le token est valide, continuer la requête
}


app.use(checkToken); // Appliquer ce middleware à toutes les routes

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});