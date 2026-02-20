import {ProjectsRepository} from "../db/repositories/projects.repository.ts";
import type {CreateProjectDTO, UpdateProjectDTO} from "./dto/projects.dto.ts";
import {NotFoundError} from "../core/errors/not-found.error.ts";

export class ProjectsService {
    constructor(private repository = new ProjectsRepository()) {
    }

    async getAllProjects() {
        return await this.repository.findAll();
    }

    async getProjectById(id: number) {
        const project = await this.repository.findById(id);
        if (!project) throw new NotFoundError("Project");
        return project;
    }

    async createProject(dto: CreateProjectDTO) {
        return await this.repository.create(dto);
    }

    async updateProject(id: number, dto: UpdateProjectDTO) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundError("Project");
        return await this.repository.update(id, dto);
    }

    async deleteProject(id: number) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundError("Project");
        await this.repository.delete(id);
    }
}