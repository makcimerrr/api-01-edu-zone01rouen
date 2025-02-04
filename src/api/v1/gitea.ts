import {RouterContext} from "https://deno.land/x/oak/mod.ts";

// Fonction pour récupérer les informations de l'utilisateur depuis Gitea
export const getUserInfoFromGitea = async (ctx: RouterContext) => {
    const {username} = ctx.params;
    const token = ctx.request.headers.get("Authorization")?.split(" ")[1]; // Récupère le token Bearer

    const userUrl = `https://zone01normandie.org/git/api/v1/users/${username}`;
    const heatmapUrl = `https://zone01normandie.org/git/api/v1/users/${username}/heatmap`;

    try {
        // Récupérer les deux réponses en parallèle
        const [userResponse, heatmapResponse] = await Promise.all([
            fetch(userUrl, {
                headers: {Authorization: `Bearer ${token}`},
            }),
            fetch(heatmapUrl, {
                headers: {Authorization: `Bearer ${token}`},
            }),
        ]);

        // Vérification de la validité des réponses
        if (!userResponse.ok || !heatmapResponse.ok) {
            throw new Error(`Gitea API error: User (${userResponse.status}) / Heatmap (${heatmapResponse.status})`);
        }

        // Récupérer les données des réponses
        const [userData, heatmapData] = await Promise.all([
            userResponse.json(),
            heatmapResponse.json(),
        ]);

        // Retour des données au format JSON
        ctx.response.status = 200;
        ctx.response.body = {user: userData, heatmap: heatmapData};
    } catch (error) {
        console.error("Error fetching data from Gitea:", error.message);
        ctx.response.status = 500;
        ctx.response.body = {error: "Internal Server Error", details: error.message};
    }
};