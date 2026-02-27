import {pgTable, serial, varchar, timestamp} from "drizzle-orm/pg-core";

export const discordUsers = pgTable("discord_users", {
    id: serial("id").primaryKey(),
    login: varchar("login", {length: 100}).notNull().unique(),
    discord_id: varchar("discord_id", {length: 30}).notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
