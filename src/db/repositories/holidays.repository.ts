import {eq} from "drizzle-orm";
import {db} from "../client.ts";
import {holidays} from "../schema/holidays.schema.ts";
import type {IHolidaysRepository} from "./interfaces/holidays.repository.interface.ts";
import type {Holiday, NewHoliday} from "../types/holidays.types.ts";

export class HolidaysRepository implements IHolidaysRepository {
    async findById(id: number): Promise<Holiday | null> {
        const result = await db.select().from(holidays).where(eq(holidays.id, id));
        return result[0] ?? null;
    }

    async findAll(): Promise<Holiday[]> {
        return await db.select().from(holidays).orderBy(holidays.start);
    }

    async create(data: NewHoliday): Promise<Holiday> {
        const result = await db.insert(holidays).values(data).returning();
        return result[0];
    }

    async update(id: number, data: Partial<NewHoliday>): Promise<Holiday> {
        const result = await db.update(holidays).set(data).where(eq(holidays.id, id)).returning();
        return result[0];
    }

    async delete(id: number): Promise<void> {
        await db.delete(holidays).where(eq(holidays.id, id));
    }
}