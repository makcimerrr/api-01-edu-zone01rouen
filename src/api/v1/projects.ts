import {ProjectsService} from "../../services/projects.service.ts";

const service = new ProjectsService();

export async function getProjectsHandler(ctx: any) {
    const projects = await service.getAllProjects();
    ctx.response.status = 200;
    ctx.response.body = projects;
}

export async function getProjectHandler(ctx: any) {
    const id = Number(ctx.params.id);
    const project = await service.getProjectById(id);
    ctx.response.status = 200;
    ctx.response.body = project;
}

export async function createProjectHandler(ctx: any) {
    const body = await ctx.request.body.json();
    const project = await service.createProject(body);
    ctx.response.status = 201;
    ctx.response.body = project;
}

export async function updateProjectHandler(ctx: any) {
    const id = Number(ctx.params.id);
    const body = await ctx.request.body.json();
    const project = await service.updateProject(id, body);
    ctx.response.status = 200;
    ctx.response.body = project;
}

export async function deleteProjectHandler(ctx: any) {
    const id = Number(ctx.params.id);
    await service.deleteProject(id);
    ctx.response.status = 204;
}