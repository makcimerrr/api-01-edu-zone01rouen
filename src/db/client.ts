import {drizzle} from "drizzle-orm/node-postgres";
import pg from "pg";

const {Pool} = pg;

/**
 * Vérification obligatoire des variables d'environnement
 */
const DATABASE_URL = Deno.env.get("DATABASE_URL");

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

/**
 * Pool PostgreSQL
 * - Optimisé pour production
 * - Réutilisable
 * - Géré proprement
 */
const pool = new Pool({
    connectionString: DATABASE_URL,
    max: 10, // max connexions simultanées
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
});

/**
 * Instance Drizzle
 */
export const db = drizzle(pool);

/**
 * Fermeture propre (utile en tests ou shutdown serveur)
 */
export async function closeDB() {
    await pool.end();
}