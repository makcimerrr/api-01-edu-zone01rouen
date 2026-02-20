import {
    pgTable,
    text,
    boolean,
    timestamp,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";

export const promotions = pgTable(
    "promotions",
    {
        promoId: text("promo_id").primaryKey(),
        name: text("name").notNull().unique(),
        isArchived: boolean("is_archived").default(false).notNull(),
        archivedAt: timestamp("archived_at"),
        archivedReason: text("archived_reason"),
    },
    (table) => ({
        isArchivedIdx: index("promotions_is_archived_idx").on(table.isArchived),
        nameUniqueIdx: uniqueIndex("unique_promo_name").on(table.name),
    })
);