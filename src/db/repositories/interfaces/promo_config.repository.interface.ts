import type {PromoConfig, NewPromoConfig} from "../../types/promo_config.types.ts";

export interface IPromoConfigRepository {
    findByKey(key: string): Promise<PromoConfig | null>;

    findAll(): Promise<PromoConfig[]>;

    create(data: NewPromoConfig): Promise<PromoConfig>;

    update(key: string, data: Partial<NewPromoConfig>): Promise<PromoConfig>;

    delete(key: string): Promise<void>;
}