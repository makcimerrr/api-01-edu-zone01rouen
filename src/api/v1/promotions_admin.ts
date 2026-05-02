// @ts-ignore
import {RouterContext} from "https://deno.land/x/oak/mod.ts";
import {PromotionService} from "../../services/promotion.service.ts";
import {NotFoundError} from "../../core/errors/not-found.error.ts";
import {ConflictError} from "../../core/errors/conflict.error.ts";

const service = new PromotionService();

export const createPromotionHandler = async (ctx: RouterContext) => {
    try {
        const body = await ctx.request.body.json();

        if (!body?.promoId || !body?.name) {
            ctx.response.status = 400;
            ctx.response.body = {
                error: "Requête invalide : 'promoId' et 'name' sont requis.",
            };
            return;
        }

        const created = await service.createPromotion({
            promoId: body.promoId,
            name: body.name,
        });

        ctx.response.status = 201;
        ctx.response.body = created;
    } catch (err) {
        if (err instanceof ConflictError) {
            ctx.response.status = 409;
            ctx.response.body = {error: err.message};
            return;
        }
        console.error(err);
        ctx.response.status = 500;
        ctx.response.body = {error: "Internal Server Error"};
    }
};

export const archivePromotionHandler = async (ctx: RouterContext) => {
    const {promoId} = ctx.params;

    if (!promoId) {
        ctx.response.status = 400;
        ctx.response.body = {error: "Requête invalide : 'promoId' est requis."};
        return;
    }

    try {
        const body = await ctx.request.body.json().catch(() => ({}));

        if (!body?.reason || typeof body.reason !== "string") {
            ctx.response.status = 400;
            ctx.response.body = {
                error: "Requête invalide : 'reason' (string) est requis.",
            };
            return;
        }

        await service.archivePromotion(promoId, {reason: body.reason});

        ctx.response.status = 204;
    } catch (err) {
        if (err instanceof NotFoundError) {
            ctx.response.status = 404;
            ctx.response.body = {error: err.message};
            return;
        }
        console.error(err);
        ctx.response.status = 500;
        ctx.response.body = {error: "Internal Server Error"};
    }
};

export const getPromotionByIdHandler = async (ctx: RouterContext) => {
    const {promoId} = ctx.params;

    if (!promoId) {
        ctx.response.status = 400;
        ctx.response.body = {error: "Requête invalide : 'promoId' est requis."};
        return;
    }

    try {
        const promotion = await service.getPromotionById(promoId);
        ctx.response.status = 200;
        ctx.response.body = promotion;
    } catch (err) {
        if (err instanceof NotFoundError) {
            ctx.response.status = 404;
            ctx.response.body = {error: err.message};
            return;
        }
        console.error(err);
        ctx.response.status = 500;
        ctx.response.body = {error: "Internal Server Error"};
    }
};
