import {DiscordUsersRepository} from "../db/repositories/discord_users.repository.ts";
import type {UpsertDiscordUserDTO} from "./dto/discord_users.dto.ts";
import {NotFoundError} from "../core/errors/not-found.error.ts";

export class DiscordUsersService {
    constructor(private repository = new DiscordUsersRepository()) {
    }

    async getAllDiscordUsers() {
        return await this.repository.findAll();
    }

    async getDiscordUserByLogin(login: string) {
        const user = await this.repository.findByLogin(login);
        if (!user) throw new NotFoundError("DiscordUser");
        return user;
    }

    async upsertDiscordUser(dto: UpsertDiscordUserDTO) {
        return await this.repository.upsert(dto);
    }

    async deleteDiscordUser(login: string) {
        const existing = await this.repository.findByLogin(login);
        if (!existing) throw new NotFoundError("DiscordUser");
        await this.repository.delete(login);
    }
}
