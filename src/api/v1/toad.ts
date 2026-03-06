// @ts-ignore
import {RouterContext} from "https://deno.land/x/oak/mod.ts";
import {getClient} from "../../services/graphql.ts";

export const getToadSessionsHandler = async (ctx: RouterContext) => {
    try {
        const client = await getClient();
        const query = `
        {
          toad_sessions {
            candidate {
              login
            }
            games {
              name
              results(order_by: { level: desc }, limit: 1) {
                level
              }
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
