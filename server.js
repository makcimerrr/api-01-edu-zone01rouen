import express from 'express';
import {createClient} from '@01-edu/api';
import dotenv from 'dotenv';
import cors from 'cors';

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
                    <li><code>/user-info</code> - Récupère les informations utilisateur</li>
                    <li><code>/promotion-progress/:eventId</code> - Récupère la progression d'une promotion par eventId</li>
                </ul>
            </main>
            <footer>
                <p>&copy; 2025 Maxime Dubois</p>
            </footer>
        </body>
        </html>
    `);
});

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

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});