import {DiscordUsersService} from "../../services/discord_users.service.ts";

const service = new DiscordUsersService();

export async function getDiscordUsersHandler(ctx: any) {
    const users = await service.getAllDiscordUsers();
    ctx.response.status = 200;
    ctx.response.body = users;
}

export async function getDiscordUserHandler(ctx: any) {
    const login = ctx.params.login;
    const user = await service.getDiscordUserByLogin(login);
    ctx.response.status = 200;
    ctx.response.body = user;
}

export async function upsertDiscordUserHandler(ctx: any) {
    const body = await ctx.request.body.json();
    const user = await service.upsertDiscordUser(body);
    ctx.response.status = 200;
    ctx.response.body = user;
}

export async function deleteDiscordUserHandler(ctx: any) {
    const login = ctx.params.login;
    await service.deleteDiscordUser(login);
    ctx.response.status = 204;
}
