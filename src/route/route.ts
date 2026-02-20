// routes.ts
import {Router} from "../../deps.ts";
import {
    API_BASE_PATH,
    API_VERSION,
} from "../../config/config.ts";
import {checkToken} from "../utils/token.ts"

import {getUserInfo, getUsers} from "../api/v1/user.ts";
import {getPromotionProgress, getPromotionsHandler} from "../api/v1/promotion.ts";
import {getUserInfoFromGitea} from "../api/v1/gitea.ts";
import {
    getDiscordConfig,
    getDiscordTechnologies,
    getForbiddenSchools,
    getFullDiscordConfig, getJobQueries
} from "../api/v1/discord.ts";
import {
    createProjectHandler,
    deleteProjectHandler,
    getProjectHandler,
    getProjectsHandler,
    updateProjectHandler
} from "../api/v1/projects.ts";
import {
    createHolidayHandler,
    deleteHolidayHandler,
    getHolidayHandler,
    getHolidaysHandler,
    updateHolidayHandler
} from "../api/v1/holidays.ts";
import {
    createPromoConfigHandler, deletePromoConfigHandler,
    getPromoConfigHandler,
    getPromoConfigsHandler,
    updatePromoConfigHandler
} from "../api/v1/promo_config.ts";

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
        router.get(`/${API_BASE_PATH}/${API_VERSION}/promotions/:eventId/students`, getPromotionProgress)
            .get(`/${API_BASE_PATH}/${API_VERSION}/promotions`, getPromotionsHandler)
            .get(`/${API_BASE_PATH}/${API_VERSION}/promo-configs`, getPromoConfigsHandler)
            .get(`/${API_BASE_PATH}/${API_VERSION}/promo-configs/:key`, getPromoConfigHandler)
            .post(`/${API_BASE_PATH}/${API_VERSION}/promo-configs`, createPromoConfigHandler)
            .put(`/${API_BASE_PATH}/${API_VERSION}/promo-configs/:key`, updatePromoConfigHandler)
            .delete(`/${API_BASE_PATH}/${API_VERSION}/promo-configs/:key`, deletePromoConfigHandler);
    } catch (error) {
        console.error('Error loading promotion controller:', error);
    }
}

async function loadProjectsController() {
    try {
        router.get(`/${API_BASE_PATH}/${API_VERSION}/projects`, getProjectsHandler)
            .get(`/${API_BASE_PATH}/${API_VERSION}/projects/:id`, getProjectHandler)
            .post(`/${API_BASE_PATH}/${API_VERSION}/projects`, createProjectHandler)
            .put(`/${API_BASE_PATH}/${API_VERSION}/projects/:id`, updateProjectHandler)
            .delete(`/${API_BASE_PATH}/${API_VERSION}/projects/:id`, deleteProjectHandler);
    } catch (error) {
        console.error('Error loading projects controller:', error);
    }
}


async function loadGiteaController() {
    try {
        router.get(`/${API_BASE_PATH}/${API_VERSION}/gitea-info/:username`, checkToken, getUserInfoFromGitea);
    } catch (error) {
        console.error('Error loading gitea controller:', error);
    }
}

async function loadHolidaysController() {
    try {
        router.get(`/${API_BASE_PATH}/${API_VERSION}/holidays`, getHolidaysHandler)
            .get(`/${API_BASE_PATH}/${API_VERSION}/holidays/:id`, getHolidayHandler)
            .post(`/${API_BASE_PATH}/${API_VERSION}/holidays`, createHolidayHandler)
            .put(`/${API_BASE_PATH}/${API_VERSION}/holidays/:id`, updateHolidayHandler)
            .delete(`/${API_BASE_PATH}/${API_VERSION}/holidays/:id`, deleteHolidayHandler);
    } catch (error) {
        console.error('Error loading holidays controller:', error);
    }
}

async function loadDiscordController() {
    try {
        router.get(`/${API_BASE_PATH}/${API_VERSION}/discord/technologies`, getDiscordTechnologies)
            .get(`/${API_BASE_PATH}/${API_VERSION}/discord/:name/config`, getDiscordConfig)
            .get(`/${API_BASE_PATH}/${API_VERSION}/discord/config/full`, getFullDiscordConfig)
            .get(`/${API_BASE_PATH}/${API_VERSION}/discord/forbidden-schools`, getForbiddenSchools)
            .get(`/${API_BASE_PATH}/${API_VERSION}/discord/job-queries`, getJobQueries);
    } catch (error) {
        console.error('Error loading discord controller:', error);
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
loadDiscordController().then(r => r);
loadProjectsController().then(r => r);
loadHolidaysController().then(r => r);

export default router;