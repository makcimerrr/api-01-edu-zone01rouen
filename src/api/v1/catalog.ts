// @ts-ignore
import {RouterContext} from "https://deno.land/x/oak/mod.ts";
import {
    projects,
    optionalProjects,
    additionalProjects,
    specialties,
} from "../../services/projects.ts";

/**
 * Renvoie l'intégralité des projets connus de l'API, toutes catégories
 * confondues (tronc commun Go/JS/Rust, projets optionnels, projets
 * additionnels, projets de spécialité).
 *
 * Ce catalogue est la source de vérité utilisée par les filtres GraphQL
 * des routes `/promotions/:eventId/students*` et `/specialties/*`.
 */
export const getProjectsCatalog = (ctx: RouterContext) => {
    const all = Array.from(
        new Set([...projects, ...optionalProjects, ...additionalProjects])
    ).sort((a, b) => a.localeCompare(b));

    ctx.response.status = 200;
    ctx.response.body = {
        total: all.length,
        counts: {
            troncCommun: projects.length,
            optional: optionalProjects.length,
            additional: additionalProjects.length,
        },
        troncCommun: projects,
        optional: optionalProjects,
        additional: additionalProjects,
        specialties,
        all,
    };
};
