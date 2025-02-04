import {RouterContext} from "https://deno.land/x/oak/mod.ts";
import {getClient} from "../../services/graphql.ts";
import {projects} from "../../services/projects.ts"

export const getPromotionProgress = async (ctx: RouterContext) => {
    const {eventId} = ctx.params;

    if (!eventId) {
        ctx.response.status = 400;
        ctx.response.body = {
            error: "Requête invalide : 'eventId' doit être fourni.",
        };
        return;
    }

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
        }
        object {
          name
        }
      }
    }
  `;

    try {
        const response = await client.run(query);
        ctx.response.status = 200;
        ctx.response.body = response;
    } catch (error) {
        console.error("Erreur GraphQL :", error.message);
        ctx.response.status = 500;
        ctx.response.body = {error: error.message};
    }
};