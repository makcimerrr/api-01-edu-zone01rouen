export interface CreateHolidayDTO {
    label: string;
    start: string; // yyyy-mm-dd
    end: string;   // yyyy-mm-dd
}

export interface UpdateHolidayDTO {
    label?: string;
    start?: string;
    end?: string;
}