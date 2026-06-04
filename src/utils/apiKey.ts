// Middleware d'autorisation pour les MUTATIONS (POST/PUT/DELETE).
//
// Les routes de mutation (projets, vacances, promo-configs, promotions,
// discord-users) n'étaient protégées que par CORS — donc ouvertes à tout
// client non-navigateur. On exige désormais une clé partagée `API_ADMIN_KEY`,
// envoyée par l'appelant via l'en-tête `X-Api-Key` (ou `Authorization: Bearer`).
//
// Fail-closed : si `API_ADMIN_KEY` n'est pas configurée côté serveur, on refuse
// (503) — il faut explicitement provisionner la clé avant d'exposer ces routes.
export const requireApiKey = async (ctx: any, next: any) => {
    const expected = Deno.env.get("API_ADMIN_KEY");

    if (!expected || expected.trim() === "") {
        ctx.response.status = 503;
        ctx.response.body = { error: "API_ADMIN_KEY non configurée côté serveur" };
        return;
    }

    const provided =
        ctx.request.headers.get("X-Api-Key") ??
        (ctx.request.headers.get("Authorization") ?? "").replace("Bearer ", "");

    if (provided !== expected) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Clé API invalide ou manquante" };
        return;
    }

    await next();
};
