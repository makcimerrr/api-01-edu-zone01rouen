import {eq} from "drizzle-orm";
import {db} from "../client.ts";
import {promotions} from "../schema/promotion.schema.ts";
import type {IPromotionRepository} from "./interfaces/promotion.repository.interface.ts";
import type {Promotion, NewPromotion} from "../types/promotion.types.ts";

export class PromotionRepository implements IPromotionRepository {
    async findById(id: string): Promise<Promotion | null> {
        const result = await db
            .select()
            .from(promotions)
            .where(eq(promotions.promoId, id));

        return result[0] ?? null;
    }

    async findByName(name: string): Promise<Promotion | null> {
        const result = await db
            .select()
            .from(promotions)
            .where(eq(promotions.name, name));

        return result[0] ?? null;
    }

    async findAll(activeOnly = false): Promise<Promotion[]> {
        if (activeOnly) {
            return await db
                .select()
                .from(promotions)
                .where(eq(promotions.isArchived, false));
        }

        return await db.select().from(promotions);
    }

    async create(data: NewPromotion): Promise<Promotion> {
        const result = await db.insert(promotions).values(data).returning();
        return result[0];
    }

    async archive(id: string, reason: string): Promise<void> {
        await db
            .update(promotions)
            .set({
                isArchived: true,
                archivedAt: new Date(),
                archivedReason: reason,
            })
            .where(eq(promotions.promoId, id));
    }
}