export interface CreateProjectDTO {
    name: string;
    projectTimeWeek: number;
    category: string;
    sortIndex?: number;
}

export interface UpdateProjectDTO {
    name?: string;
    projectTimeWeek?: number;
    category?: string;
    sortIndex?: number;
}