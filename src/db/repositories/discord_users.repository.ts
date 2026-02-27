import {eq} from "drizzle-orm";
import {db} from "../client.ts";
import {discordUsers} from "../schema/discord_users.schema.ts";
import type {IDiscordUsersRepository} from "./interfaces/discord_users.repository.interface.ts";
import type {DiscordUser, NewDiscordUser} from "../types/discord_users.types.ts";

export class DiscordUsersRepository implements IDiscordUsersRepository {
    async findByLogin(login: string): Promise<DiscordUser | null> {
        const result = await db.select().from(discordUsers).where(eq(discordUsers.login, login));
        return result[0] ?? null;
    }

    async findAll(): Promise<DiscordUser[]> {
        return await db.select().from(discordUsers).orderBy(discordUsers.login);
    }

    async upsert(data: NewDiscordUser): Promise<DiscordUser> {
        const result = await db
            .insert(discordUsers)
            .values(data)
            .onConflictDoUpdate({
                target: discordUsers.login,
                set: {
                    discord_id: data.discord_id,
                    updated_at: new Date(),
                },
            })
            .returning();
        return result[0];
    }

    async delete(login: string): Promise<void> {
        await db.delete(discordUsers).where(eq(discordUsers.login, login));
    }
}
