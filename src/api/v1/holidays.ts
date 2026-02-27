import {HolidaysService} from "../../services/holidays.service.ts";

const service = new HolidaysService();

export async function getHolidaysHandler(ctx: any) {
    const holidays = await service.getAllHolidays();
    ctx.response.status = 200;
    ctx.response.body = holidays;
}

export async function getHolidayHandler(ctx: any) {
    const id = Number(ctx.params.id);
    const holiday = await service.getHolidayById(id);
    ctx.response.status = 200;
    ctx.response.body = holiday;
}

export async function createHolidayHandler(ctx: any) {
    const body = await ctx.request.body.json();
    const holiday = await service.createHoliday(body);
    ctx.response.status = 201;
    ctx.response.body = holiday;
}

export async function updateHolidayHandler(ctx: any) {
    const id = Number(ctx.params.id);
    const body = await ctx.request.body.json();
    const holiday = await service.updateHoliday(id, body);
    ctx.response.status = 200;
    ctx.response.body = holiday;
}

export async function deleteHolidayHandler(ctx: any) {
    const id = Number(ctx.params.id);
    await service.deleteHoliday(id);
    ctx.response.status = 204;
}