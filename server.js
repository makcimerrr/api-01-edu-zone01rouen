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
// Page d'accueil bidon
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>API Home</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    margin: 0;
                    padding: 0;
                }
                header {
                    background: #333;
                    color: white;
                    padding: 1rem 0;
                }
                main {
                    padding: 2rem;
                }
                footer {
                    background: #f1f1f1;
                    color: #333;
                    position: fixed;
                    bottom: 0;
                    width: 100%;
                    padding: 1rem;
                }
            </style>
        </head>
        <body>
            <header>
                <h1>Bienvenue sur l'API de Maxime Dubois</h1>
            </header>
            <main>
                <p>Cette API fournit des informations pour des projets et la progression des promotions.</p>
                <p>Routes disponibles :</p>
                <ul>
                    <li><code>/user-info</code> - Récupère les informations de tous les utilisateurs</li>
                    <li><code>/promotion-progress/:eventId</code> - Récupère la progression d'une promotion par eventId</li>
                    <li><code>/user-find/:login</code> - Récupère les informations Plateforme d'un utilisateur</li>
                    <li><code>/user-gitea/:username</code> - Récupère les informations Gitea d'un utilisateur</li>
                </ul>
            </main>
            <footer>
                <p>&copy; 2025 Maxime Dubois</p>
            </footer>
        </body>
        </html>
    `);
});

/**
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
app.get("/user-info", async (req, res) => {
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
 *       - in: header
 *         name: token
 *         required: true
 *         description: Token d'accès admin Gitea
 *         schema:
 *           type: bearer
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur et abonnements
 *       500:
 *         description: Erreur interne du serveur
 */
app.get("/user-gitea/:username", checkToken, async (req, res) => {
    const {username} = req.params;
    const token = req.headers.authorization?.split(" ")[1]; // Récupère le token Bearer

    if (!token || token === 'undefined') {
        return res.status(401).json({error: "Unauthorized: Missing Bearer token"});
    }

    const userUrl = `https://zone01normandie.org/git/api/v1/users/${username}`;
    const heatmapUrl = `https://zone01normandie.org/git/api/v1/users/${username}/heatmap`;

    try {
        const [userResponse, heatmapResponse] = await Promise.all([
            fetch(userUrl, {
                headers: {'Authorization': `Bearer ${token}`},
            }),
            fetch(heatmapUrl, {
                headers: {'Authorization': `Bearer ${token}`},
            }),
        ]);

        if (!userResponse.ok || !heatmapResponse.ok) {
            throw new Error(`Gitea API error: User (${userResponse.status}) / Subscriptions (${heatmapResponse.status})`);
        }

        const [userData, heatmapData] = await Promise.all([
            userResponse.json(),
            heatmapResponse.json(),
        ]);

        res.json({user: userData, heatmap: heatmapData});
    } catch (error) {
        console.error("Error fetching data from Gitea:", error);
        res.status(500).json({error: "Internal Server Error", details: error.message});
    }
});

// Middleware pour vérifier la présence du token
async function checkToken(req, res, next) {
    const token = req.header('Authorization');

    // Vérifier si le token est manquant ou vide
    if (!token || token.trim() === "" || token === 'undefined') {
        return res.status(400).json({error: 'Token manquant ou vide'});
    }

    // Extraire le token réel (après le mot "Bearer ")
    const actualToken = token.replace('Bearer ', '');

    // Vérification du token via l'API Gitea de votre organisation
    try {
        const response = await fetch('https://zone01normandie.org/git/api/v1/user', {
            headers: {
                'Authorization': `Bearer ${actualToken}`,
            },
        });

        // Si la réponse n'est pas OK, le token est invalide
        if (!response.ok) {
            return res.status(403).json({error: 'Token invalide'});
        }

        // Si la réponse est OK, le token est valide
        const userData = await response.json();

        if (userData.is_admin) {
            return next();
        }

        return res.status(403).json({error: 'Access denied. Admins only.'});
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        res.status(500).json({error: 'Erreur interne lors de la vérification du token'});
    }
}

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

