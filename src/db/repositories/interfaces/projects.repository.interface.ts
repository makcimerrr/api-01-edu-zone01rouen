import type {Project, NewProject} from "../../types/projects.types.ts";

export interface IProjectsRepository {
    findById(id: number): Promise<Project | null>;

    findAll(): Promise<Project[]>;

    create(data: NewProject): Promise<Project>;

    update(id: number, data: Partial<NewProject>): Promise<Project>;

    delete(id: number): Promise<void>;
}