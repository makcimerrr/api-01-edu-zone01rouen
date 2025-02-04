// routes.ts
import {Router} from "../../deps.ts";
import {
    API_BASE_PATH,
    API_VERSION,
    usersControllerPath,
    promotionsControllerPath,
    giteaControllerPath
} from "../../config/config.ts"; // Import des constantes
import {checkToken} from "../utils/token.ts"

const router = new Router();

async function loadUserController() {
    try {
        /*const usersController = await import(usersControllerPath);*/

        const usersController = await import (`../${API_BASE_PATH}/${API_VERSION}/user.ts`)
        // Routes pour les utilisateurs
        router.get(`/${API_BASE_PATH}/${API_VERSION}/users`, usersController.getUsers)
            .get(`/${API_BASE_PATH}/${API_VERSION}/user-info/:username`, usersController.getUserInfo);
        /*.get(`/${API_BASE_PATH}/${API_VERSION}/users/:id`, usersController.getUserById)
        .post(`/${API_BASE_PATH}/${API_VERSION}/users`, usersController.createUser)
        .put(`/${API_BASE_PATH}/${API_VERSION}/users/:id`, usersController.updateUser)
        .delete(`/${API_BASE_PATH}/${API_VERSION}/users/:id`, usersController.deleteUser)*/
    } catch (error) {
        console.error('Error loading user controller:', error);
    }
}

async function loadPromotionController() {
    try {
        const promotionsController = await import(promotionsControllerPath);

        router.get(`/${API_BASE_PATH}/${API_VERSION}/promotions/:eventId/students`, promotionsController.getPromotionProgress);
    } catch (error) {
        console.error('Error loading promotion controller:', error);
    }
}

async function loadGiteaController() {
    try {
        const giteaController = await import(giteaControllerPath);

        router.get(`/${API_BASE_PATH}/${API_VERSION}/gitea-info/:username`, checkToken, giteaController.getUserInfoFromGitea);
    } catch (error) {
        console.error('Error loading gitea controller:', error);
    }
}

// Route d'accueil de l'API
router.get("/", (ctx: {
    response: { body: { message: string; documentation: string; status: string; version: string; }; };
}) => {
    ctx.response.body = {
        message: "Bienvenue sur l'API 01 Edu!",
        documentation: "https://zone01normandie.org/docs",
        status: "OK",
        version: API_VERSION,
    };
});

loadUserController().then(r => r);
loadPromotionController().then(r => r);
loadGiteaController().then(r => r);

export default router;