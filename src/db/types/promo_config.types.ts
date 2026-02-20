import type {InferSelectModel, InferInsertModel} from "drizzle-orm";
import {promoConfig} from "../schema/promo_config.schema.ts";

export type PromoConfig = InferSelectModel<typeof promoConfig>;
export type NewPromoConfig = InferInsertModel<typeof promoConfig>;