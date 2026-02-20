import type {Promotion, NewPromotion} from "../../types/promotion.types.ts";

export interface IPromotionRepository {
    findById(id: string): Promise<Promotion | null>;

    findByName(name: string): Promise<Promotion | null>;

    findAll(activeOnly?: boolean): Promise<Promotion[]>;

    create(data: NewPromotion): Promise<Promotion>;

    archive(id: string, reason: string): Promise<void>;
}