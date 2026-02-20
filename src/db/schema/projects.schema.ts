import {pgTable, serial, text, integer, index} from "drizzle-orm/pg-core";

export const projects = pgTable(
    "projects",
    {
        id: serial("id").primaryKey(),
        name: text("name").notNull(),
        projectTimeWeek: integer("project_time_week").notNull(),
        category: text("category").notNull(),
        sortIndex: integer("sort_index").default(0),
    },
    (table) => ({
        idIndex: index("projects_pkey").on(table.id),
    })
);