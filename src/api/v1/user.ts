
// @ts-ignore
import {RouterContext} from "https://deno.land/x/oak/mod.ts";
import {getClient} from "../../services/graphql.ts";

const getUsers = async (context: RouterContext) => {
    try {
        const client = await getClient();
        const query = `
      query {
        user {
          id
          login
        }
      }
    `;
        const data = await client.run(query);
        context.response.status = 200;
        context.response.body = {data};
    } catch (error) {
        context.response.status = 500;
        context.response.body = {error: error};
    }
};

const getUserInfo = async (ctx: RouterContext) => {
    const {username} = ctx.params;

    if (!username) {
        ctx.response.status = 400;
        ctx.response.body = {
            error: "Requête invalide : 'username' doit être fourni.",
        };
        return;
    }
    try {
        const client = await getClient();
        const query = `
        query {
          user(where: {login: {_eq: "${username}"}}) {
            id
            login
            firstName
            lastName
            auditRatio
            auditsAssigned
            campus
            email
            githubId
            discordId
            discordDMChannelId
          }
        }`;

        const response = await client.run(query);
        ctx.response.status = 200;
        ctx.response.body = response;
    } catch (error) {
        console.error("Erreur GraphQL :", error);
        ctx.response.status = 500;
        ctx.response.body = {error: error};
    }
};

/*export const getUserById = (context: RouterContext) => {
    const {id} = context.params;
    const user = users.find((user) => user.id === parseInt(id));
    if (user) {
        context.response.body = user;
    } else {
        context.response.status = 404;
        context.response.body = {message: "Utilisateur non trouvé"};
    }
};

export const createUser = async (context: RouterContext) => {
    const body = await context.request.body().value;
    const newUser = {id: users.length + 1, ...body};
    users.push(newUser);
    context.response.body = newUser;
};

export const updateUser = async (context: RouterContext) => {
    const {id} = context.params;
    const body = await context.request.body().value;
    const userIndex = users.findIndex((user) => user.id === parseInt(id));
    if (userIndex > -1) {
        users[userIndex] = {id: parseInt(id), ...body};
        context.response.body = users[userIndex];
    } else {
        context.response.status = 404;
        context.response.body = {message: "Utilisateur non trouvé"};
    }
};

export const deleteUser = (context: RouterContext) => {
    const {id} = context.params;
    const userIndex = users.findIndex((user) => user.id === parseInt(id));
    if (userIndex > -1) {
        users.splice(userIndex, 1);
        context.response.body = {message: "Utilisateur supprimé"};
    } else {
        context.response.status = 404;
        context.response.body = {message: "Utilisateur non trouvé"};
    }
};*/

export {getUsers, getUserInfo};