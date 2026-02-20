import {PromoConfigRepository} from "../db/repositories/promo_config.repository.ts";
import type {CreatePromoConfigDTO, UpdatePromoConfigDTO} from "./dto/promo_config.dto.ts";
import {NotFoundError} from "../core/errors/not-found.error.ts";

export class PromoConfigService {
    constructor(private repository = new PromoConfigRepository()) {
    }

    async getAllConfigs() {
        return await this.repository.findAll();
    }

    async getConfigByKey(key: string) {
        const config = await this.repository.findByKey(key);
        if (!config) throw new NotFoundError("PromoConfig");
        return config;
    }

    async createConfig(dto: CreatePromoConfigDTO) {
        return await this.repository.create(dto);
    }

    async updateConfig(key: string, dto: UpdatePromoConfigDTO) {
        const existing = await this.repository.findByKey(key);
        if (!existing) throw new NotFoundError("PromoConfig");
        return await this.repository.update(key, dto);
    }

    async deleteConfig(key: string) {
        const existing = await this.repository.findByKey(key);
        if (!existing) throw new NotFoundError("PromoConfig");
        await this.repository.delete(key);
    }
}