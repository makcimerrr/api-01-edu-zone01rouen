// routes.ts
import {Router} from "../../deps.ts";
import {API_BASE_PATH, API_VERSION} from "../../config/config.ts"; // Import des constantes

const router = new Router();

// Fonction asynchrone pour gérer l'importation dynamique des contrôleurs
async function loadUserController() {
    // Dynamique en fonction de la version
    const usersController = await import(`../${API_BASE_PATH}/${API_VERSION}/user.ts`);

    // Routes pour les utilisateurs
    router.get(`/${API_BASE_PATH}/${API_VERSION}/users`, usersController.getUsers)
    /*.get(`/${API_BASE_PATH}/${API_VERSION}/users/:id`, usersController.getUserById)
    .post(`/${API_BASE_PATH}/${API_VERSION}/users`, usersController.createUser)
    .put(`/${API_BASE_PATH}/${API_VERSION}/users/:id`, usersController.updateUser)
    .delete(`/${API_BASE_PATH}/${API_VERSION}/users/:id`, usersController.deleteUser)*/;
}

loadUserController(); // Appel de la fonction pour charger le contrôleur

export default router;