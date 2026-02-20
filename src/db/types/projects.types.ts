import type {InferSelectModel, InferInsertModel} from "drizzle-orm";
import {projects} from "../schema/projects.schema.ts";

export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;