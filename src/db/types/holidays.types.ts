import type {InferSelectModel, InferInsertModel} from "drizzle-orm";
import {holidays} from "../schema/holidays.schema.ts";

export type Holiday = InferSelectModel<typeof holidays>;
export type NewHoliday = InferInsertModel<typeof holidays>;