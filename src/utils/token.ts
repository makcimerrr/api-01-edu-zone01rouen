export const checkToken = async (ctx: any, next: any) => {
    const token = ctx.request.headers.get('Authorization');

    // Vérifier si le token est manquant ou vide
    if (!token || token.trim() === "" || token === 'undefined') {
        ctx.response.status = 400;
        ctx.response.body = {error: 'Token manquant ou vide'};
        return;
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
            ctx.response.status = 403;
            ctx.response.body = {error: 'Token invalide'};
            return;
        }

        // Si la réponse est OK, le token est valide
        const userData = await response.json();

        if (userData.is_admin) {
            await next();
        } else {
            ctx.response.status = 403;
            ctx.response.body = {error: 'Access denied. Admins only.'};
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        ctx.response.status = 500;
        ctx.response.body = {error: 'Erreur interne lors de la vérification du token'};
    }
};