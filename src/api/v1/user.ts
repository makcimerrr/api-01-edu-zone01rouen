import {RouterContext} from "../../../deps.ts";
import {getClient} from "../../services/graphql.ts";

export const getUsers = async (context: RouterContext) => {
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
        context.response.body = {error: error.message};
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