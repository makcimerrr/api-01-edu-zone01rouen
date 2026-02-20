import {pgTable, serial, text, date, index} from "drizzle-orm/pg-core";

export const holidays = pgTable(
    "holidays",
    {
        id: serial("id").primaryKey(),
        label: text("label").notNull(),
        start: date("start").notNull(),
        end: date("end").notNull(),
    },
    (table) => ({
        idIndex: index("holidays_pkey").on(table.id),
    })
);