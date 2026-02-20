export interface CreatePromoConfigDTO {
    key: string;
    eventId: number;
    title: string;
    start: string;
    piscineJsStart?: string;
    piscineJsEnd?: string;
    piscineRustStart?: string;
    piscineRustEnd?: string;
    end: string;
    currentProject?: string;
}

export interface UpdatePromoConfigDTO {
    eventId?: number;
    title?: string;
    start?: string;
    piscineJsStart?: string;
    piscineJsEnd?: string;
    piscineRustStart?: string;
    piscineRustEnd?: string;
    end?: string;
    currentProject?: string;
}