// @ts-ignore
import {RouterContext} from "https://deno.land/x/oak/mod.ts";
import {getClient} from "../../services/graphql.ts";
import {projects} from "../../services/projects.ts"
import {PromotionService} from "../../services/promotion.service.ts";

const service = new PromotionService();

export async function getPromotionsHandler(ctx: RouterContext) {
    try {
        const promotions = await service.getActivePromotions();
        ctx.response.status = 200;
        ctx.response.body = promotions;
    } catch (error) {
        console.error(error);
        ctx.response.status = 500;
        ctx.response.body = {error: "Internal Server Error"};
    }
}

const getPromotionProgress = async (ctx: RouterContext) => {
    const {eventId} = ctx.params;

    if (!eventId) {
        ctx.response.status = 400;
        ctx.response.body = {
            error: "Requête invalide : 'eventId' doit être fourni.",
        };
        return;
    }
    try {
        const client = await getClient();
        const query = `
        query {
          progress(
            where: {
              _and: [
                { object: { name: { _in: ${JSON.stringify(projects.map((p) => p.toLowerCase()))} } } },
                { group: { status: { _in: [finished, audit, setup, working] } } },
                { event: { id: { _eq: ${eventId} } } }
              ]
            }
          ) {
            user {
              login
            }
            grade
            group {
              status
              id
              captainLogin
            }
            object {
              name
            }
          }
        }
      `;

        const response = await client.run(query);
        ctx.response.status = 200;
        ctx.response.body = response;
    } catch (error) {
        console.error("Erreur GraphQL :", error);
        ctx.response.status = 500;
        ctx.response.body = {error: error};
    }
};

export {getPromotionProgress};