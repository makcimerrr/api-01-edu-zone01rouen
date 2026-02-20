import type {InferSelectModel, InferInsertModel} from "drizzle-orm";
import {promotions} from "../schema/promotion.schema.ts";

export type Promotion = InferSelectModel<typeof promotions>;
export type NewPromotion = InferInsertModel<typeof promotions>;