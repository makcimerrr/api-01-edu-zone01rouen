import type {InferSelectModel, InferInsertModel} from "drizzle-orm";
import {discordUsers} from "../schema/discord_users.schema.ts";

export type DiscordUser = InferSelectModel<typeof discordUsers>;
export type NewDiscordUser = InferInsertModel<typeof discordUsers>;
