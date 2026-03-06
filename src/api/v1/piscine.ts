// @ts-ignore
import {RouterContext} from "https://deno.land/x/oak/mod.ts";
import {getClient} from "../../services/graphql.ts";

export const getPiscineProgressHandler = async (ctx: RouterContext) => {
    try {
        const client = await getClient();
        const query = `
        {
          progress(where: {_and: [{object: {name: {_eq: "Piscine Go"}}}]}) {
            event {
              path
              createdAt
            }
            user {
              login
            }
            grade
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
