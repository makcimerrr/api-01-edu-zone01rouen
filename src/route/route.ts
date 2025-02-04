// routes.ts
import {Router} from "../../deps.ts";
import {API_BASE_PATH, API_VERSION} from "../../config/config.ts"; // Import des constantes
import {checkToken} from "../utils/token.ts"

const router = new Router();

// Fonction asynchrone pour gérer l'importation dynamique des contrôleurs
async function loadUserController() {
    try {
        // Dynamique en fonction de la version
        const usersController = await import(`../api/v1/user.ts`);
        const promotionsController = await import(`../api/v1/promotion.ts`);
        const giteaController = await import(`../api/v1/gitea.ts`);

        // Routes pour les utilisateurs`
        router.get(`/${API_BASE_PATH}/${API_VERSION}/users`, usersController.getUsers)
            .get(`/${API_BASE_PATH}/${API_VERSION}/user-info/:username`, usersController.getUserInfo)
            .get(`/${API_BASE_PATH}/${API_VERSION}/promotions/:eventId/students`, promotionsController.getPromotionProgress)
            .get(`/${API_BASE_PATH}/${API_VERSION}/gitea-info/:username`, checkToken, giteaController.getUserInfoFromGitea);
        /*.get(`/${API_BASE_PATH}/${API_VERSION}/users/:id`, usersController.getUserById)
        .post(`/${API_BASE_PATH}/${API_VERSION}/users`, usersController.createUser)
        .put(`/${API_BASE_PATH}/${API_VERSION}/users/:id`, usersController.updateUser)
        .delete(`/${API_BASE_PATH}/${API_VERSION}/users/:id`, usersController.deleteUser)*/
    } catch (error) {
        console.error('Error loading controllers:', error);
    }
}

loadUserController().then(r => r); // Appel de la fonction pour charger le contrôleur

export default router;