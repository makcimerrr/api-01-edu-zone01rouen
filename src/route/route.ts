// routes.ts
import {Router} from "../../deps.ts";
import {
    API_BASE_PATH,
    API_VERSION,
} from "../../config/config.ts";
import {checkToken} from "../utils/token.ts"
import {getUserInfo, getUsers} from "api/v1/user.ts";
import {getPromotionProgress} from "api/v1/promotion.ts";
import {getUserInfoFromGitea} from "api/v1/gitea.ts";

const router = new Router();

async function loadUserController() {
    try {
        // Routes pour les utilisateurs
        router.get(`/${API_BASE_PATH}/${API_VERSION}/users`, getUsers)
            .get(`/${API_BASE_PATH}/${API_VERSION}/user-info/:username`, getUserInfo);
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
        router.get(`/${API_BASE_PATH}/${API_VERSION}/promotions/:eventId/students`, getPromotionProgress);
    } catch (error) {
        console.error('Error loading promotion controller:', error);
    }
}

async function loadGiteaController() {
    try {
        router.get(`/${API_BASE_PATH}/${API_VERSION}/gitea-info/:username`, checkToken, getUserInfoFromGitea);
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
/*loadPromotionController().then(r => r);
loadGiteaController().then(r => r);*/

export default router;