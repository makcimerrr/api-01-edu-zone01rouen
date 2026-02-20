import {eq} from "drizzle-orm";
import {db} from "../client.ts";
import {projects} from "../schema/projects.schema.ts";
import type {IProjectsRepository} from "./interfaces/projects.repository.interface.ts";
import type {Project, NewProject} from "../types/projects.types.ts";

export class ProjectsRepository implements IProjectsRepository {
    async findById(id: number): Promise<Project | null> {
        const result = await db.select().from(projects).where(eq(projects.id, id));
        return result[0] ?? null;
    }

    async findAll(): Promise<Project[]> {
        return await db.select().from(projects).orderBy(projects.sortIndex);
    }

    async create(data: NewProject): Promise<Project> {
        const result = await db.insert(projects).values(data).returning();
        return result[0];
    }

    async update(id: number, data: Partial<NewProject>): Promise<Project> {
        const result = await db.update(projects).set(data).where(eq(projects.id, id)).returning();
        return result[0];
    }

    async delete(id: number): Promise<void> {
        await db.delete(projects).where(eq(projects.id, id));
    }
}