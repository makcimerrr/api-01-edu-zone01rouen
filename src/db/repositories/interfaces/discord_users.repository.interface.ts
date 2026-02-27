import type {DiscordUser, NewDiscordUser} from "../../types/discord_users.types.ts";

export interface IDiscordUsersRepository {
    findByLogin(login: string): Promise<DiscordUser | null>;

    findAll(): Promise<DiscordUser[]>;

    upsert(data: NewDiscordUser): Promise<DiscordUser>;

    delete(login: string): Promise<void>;
}
