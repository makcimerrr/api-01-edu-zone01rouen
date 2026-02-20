import {PromoConfigService} from "../../services/promo_config.service.ts";

const service = new PromoConfigService();

export async function getPromoConfigsHandler(ctx: any) {
    const configs = await service.getAllConfigs();
    ctx.response.status = 200;
    ctx.response.body = configs;
}

export async function getPromoConfigHandler(ctx: any) {
    const key = ctx.params.key;
    const config = await service.getConfigByKey(key);
    ctx.response.status = 200;
    ctx.response.body = config;
}

export async function createPromoConfigHandler(ctx: any) {
    const body = await ctx.request.body().value;
    const config = await service.createConfig(body);
    ctx.response.status = 201;
    ctx.response.body = config;
}

export async function updatePromoConfigHandler(ctx: any) {
    const key = ctx.params.key;
    const body = await ctx.request.body().value;
    const config = await service.updateConfig(key, body);
    ctx.response.status = 200;
    ctx.response.body = config;
}

export async function deletePromoConfigHandler(ctx: any) {
    const key = ctx.params.key;
    await service.deleteConfig(key);
    ctx.response.status = 204;
}