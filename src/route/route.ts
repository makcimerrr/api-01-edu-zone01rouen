// routes.ts
import {Router} from "../../deps.ts";
import {API_BASE_PATH, API_VERSION} from "../../config/config.ts"; // Import des constantes
import {checkToken} from "../utils/token.ts"

const router = new Router();

// Fonction asynchrone pour gérer l'importation dynamique des contrôleurs
async function loadUserController() {
    try {
        const base = API_BASE_PATH;
        const version = API_VERSION;
        // Dynamique en fonction de la version
        const usersController = await import(`../${base}/${version}/user.ts`);
        const promotionsController = await import(`../${base}/${version}/promotion.ts`);
        const giteaController = await import(`../${base}/${version}/gitea.ts`);

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