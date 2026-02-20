import type {Holiday, NewHoliday} from "../../types/holidays.types.ts";

export interface IHolidaysRepository {
    findById(id: number): Promise<Holiday | null>;

    findAll(): Promise<Holiday[]>;

    create(data: NewHoliday): Promise<Holiday>;

    update(id: number, data: Partial<NewHoliday>): Promise<Holiday>;

    delete(id: number): Promise<void>;
}