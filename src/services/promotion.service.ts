import type {IPromotionRepository} from "../db/repositories/interfaces/promotion.repository.interface.ts";
import {PromotionRepository} from "../db/repositories/promotion.repository.ts";
import {NotFoundError} from "../core/errors/not-found.error.ts";
import {ConflictError} from "../core/errors/conflict.error.ts";
import type {
    CreatePromotionDTO,
    ArchivePromotionDTO,
} from "./dto/promotion.dto.ts";

export class PromotionService {
    constructor(
        private readonly repository: IPromotionRepository = new PromotionRepository()
    ) {
    }

    async createPromotion(dto: CreatePromotionDTO) {
        const existing = await this.repository.findByName(dto.name);

        if (existing) {
            throw new ConflictError("Promotion name already exists");
        }

        return await this.repository.create({
            promoId: dto.promoId,
            name: dto.name,
            isArchived: false,
        });
    }

    async archivePromotion(id: string, dto: ArchivePromotionDTO) {
        const promotion = await this.repository.findById(id);

        if (!promotion) {
            throw new NotFoundError("Promotion");
        }

        await this.repository.archive(id, dto.reason);
    }

    async getActivePromotions() {
        return await this.repository.findAll(true);
    }
}