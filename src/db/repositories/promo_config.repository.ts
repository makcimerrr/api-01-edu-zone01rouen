import {eq} from "drizzle-orm";
import {db} from "../client.ts";
import {promoConfig} from "../schema/promo_config.schema.ts";
import type {IPromoConfigRepository} from "./interfaces/promo_config.repository.interface.ts";
import type {PromoConfig, NewPromoConfig} from "../types/promo_config.types.ts";

export class PromoConfigRepository implements IPromoConfigRepository {
    async findByKey(key: string): Promise<PromoConfig | null> {
        const result = await db.select().from(promoConfig).where(eq(promoConfig.key, key));
        return result[0] ?? null;
    }

    async findAll(): Promise<PromoConfig[]> {
        return await db.select().from(promoConfig).orderBy(promoConfig.start);
    }

    async create(data: NewPromoConfig): Promise<PromoConfig> {
        const result = await db.insert(promoConfig).values(data).returning();
        return result[0];
    }

    async update(key: string, data: Partial<NewPromoConfig>): Promise<PromoConfig> {
        const result = await db.update(promoConfig).set(data).where(eq(promoConfig.key, key)).returning();
        return result[0];
    }

    async delete(key: string): Promise<void> {
        await db.delete(promoConfig).where(eq(promoConfig.key, key));
    }
}