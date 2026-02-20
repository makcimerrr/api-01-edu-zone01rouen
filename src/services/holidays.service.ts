import {HolidaysRepository} from "../db/repositories/holidays.repository.ts";
import type {CreateHolidayDTO, UpdateHolidayDTO} from "./dto/holidays.dto.ts";
import {NotFoundError} from "../core/errors/not-found.error.ts";

export class HolidaysService {
    constructor(private repository = new HolidaysRepository()) {
    }

    async getAllHolidays() {
        return await this.repository.findAll();
    }

    async getHolidayById(id: number) {
        const holiday = await this.repository.findById(id);
        if (!holiday) throw new NotFoundError("Holiday");
        return holiday;
    }

    async createHoliday(dto: CreateHolidayDTO) {
        return await this.repository.create(dto);
    }

    async updateHoliday(id: number, dto: UpdateHolidayDTO) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundError("Holiday");
        return await this.repository.update(id, dto);
    }

    async deleteHoliday(id: number) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundError("Holiday");
        await this.repository.delete(id);
    }
}