import {RouterContext} from "https://deno.land/x/oak/mod.ts";
import {Client} from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import {DATABASE_URL} from "../../../config/config.ts";

const getDiscordTechnologies = async (ctx: RouterContext) => {
    const client = new Client(DATABASE_URL);

    try {
        await client.connect();

        const result = await client.queryObject<{ id: number; name: string }>(
            "SELECT id, name FROM discord_technologies ORDER BY name ASC"
        );

        ctx.response.status = 200;
        ctx.response.body = {
            success: true,
            technologies: result.rows,
        };
    } catch (error) {
        console.error("Database error:", error);
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: "Failed to fetch technologies",
        };
    } finally {
        await client.end();
    }
};

function convertBigInts(obj: Record<string, unknown>) {
    const converted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
        converted[key] = typeof value === "bigint" ? Number(value) : value;
    }
    return converted;
}

const getDiscordConfig = async (ctx: RouterContext) => {
    const name = ctx.params.name;

    // Vérification de base
    if (!name) {
        ctx.response.status = 400;
        ctx.response.body = {
            success: false,
            message: "Le paramètre 'name' est requis.",
        };
        return;
    }

    // Liste blanche des champs autorisés pour éviter l'injection SQL
    const allowedFields = [
        "channel_inter_promo",
        "forum_channel_id",
        "forum_channel_id_cdi",
        "role_ping_cdi",
        "role_ping_alternance",
        "guild_id",
        "role_p1_2023",
        "role_p2_2023",
        "role_p1_2024",
        "role_help",
        "channel_progress_p1_2022",
        "channel_progress_p1_2023",
        "channel_progress_p2_2023",
        "channel_progress_p1_2024",
        "channel_progress_p1_2025",
    ];

    if (!allowedFields.includes(name)) {
        ctx.response.status = 400;
        ctx.response.body = {
            success: false,
            message: `Le champ '${name}' n'est pas autorisé.`,
        };
        return;
    }

    const client = new Client(DATABASE_URL);

    try {
        await client.connect();

        const result = await client.queryObject<{ value: number }>(
            `SELECT ${name} as value FROM discord_config LIMIT 1`
        );

        const value = result.rows[0]?.value;
        const safeValue = typeof value === "bigint" ? Number(value) : value;
        ctx.response.status = 200;
        ctx.response.body = {
            success: true,
            name,
            value: safeValue,
        };
    } catch (err) {
        console.error("Erreur DB:", err);
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: "Erreur lors de la récupération de la configuration.",
        };
    } finally {
        await client.end();
    }
};

const getFullDiscordConfig = async (ctx: RouterContext) => {
    const client = new Client(DATABASE_URL);
    try {
        await client.connect();

        const result = await client.queryObject(`SELECT * FROM discord_config LIMIT 1`);

        if (result.rows.length === 0) {
            ctx.response.status = 404;
            ctx.response.body = {success: false, message: "Aucune configuration trouvée."};
            return;
        }

        const config = convertBigInts(result.rows[0]);

        ctx.response.status = 200;
        ctx.response.body = {
            success: true,
            config,
        };
    } catch (err) {
        console.error("Erreur DB:", err);
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: "Erreur lors de la récupération de la configuration complète.",
        };
    } finally {
        await client.end();
    }
};

const getForbiddenSchools = async (ctx: RouterContext) => {
    const client = new Client(DATABASE_URL);
    try {
        await client.connect();

        const result = await client.queryObject<{ id: number; name: string }>(
            "SELECT id, name FROM forbidden_schools ORDER BY name ASC"
        );

        ctx.response.status = 200;
        ctx.response.body = {
            success: true,
            schools: result.rows,
        };
    } catch (err) {
        console.error("Erreur récupération écoles interdites:", err);
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: "Erreur lors de la récupération des écoles interdites.",
        };
    } finally {
        await client.end();
    }
};


const getJobQueries = async (ctx: RouterContext) => {
    const client = new Client(DATABASE_URL);
    try {
        await client.connect();

        const result = await client.queryObject<Record<string, unknown>>(
            "SELECT * FROM job_queries ORDER BY query ASC"
        );

        // Conversion BigInt si besoin
        const sanitized = result.rows.map((row) => {
            const converted: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(row)) {
                converted[key] = typeof value === "bigint" ? Number(value) : value;
            }
            return converted;
        });

        ctx.response.status = 200;
        ctx.response.body = {
            success: true,
            queries: sanitized,
        };
    } catch (err) {
        console.error("Erreur récupération job_queries:", err);
        ctx.response.status = 500;
        ctx.response.body = {
            success: false,
            message: "Erreur lors de la récupération des requêtes d'emploi.",
        };
    } finally {
        await client.end();
    }
};

export {getDiscordTechnologies, getDiscordConfig, getFullDiscordConfig, getForbiddenSchools, getJobQueries};