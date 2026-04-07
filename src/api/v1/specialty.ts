// @ts-ignore
import {RouterContext} from "https://deno.land/x/oak/mod.ts";
import {getClient} from "../../services/graphql.ts";
import {specialties} from "../../services/projects.ts";

export const getSpecialtyStudents = async (ctx: RouterContext) => {
    const {name} = ctx.params;
    const eventId = ctx.request.url.searchParams.get("eventId");

    if (!name) {
        ctx.response.status = 400;
        ctx.response.body = {error: "Requête invalide : 'name' doit être fourni."};
        return;
    }

    const specialtyKey = name.toLowerCase();
    const specialtyProjects = specialties[specialtyKey];

    if (!specialtyProjects) {
        ctx.response.status = 404;
        ctx.response.body = {
            error: `Spécialité '${name}' introuvable.`,
            available: Object.keys(specialties),
        };
        return;
    }

    try {
        const client = await getClient();

        const eventFilter = eventId
            ? `{ event: { id: { _eq: ${eventId} } } },`
            : "";

        const query = `
        query {
          progress(
            where: {
              _and: [
                { object: { name: { _in: ${JSON.stringify(specialtyProjects.map(p => p.toLowerCase()))} } } },
                { group: { status: { _in: [finished, audit, setup, working] } } },
                ${eventFilter}
              ]
            }
          ) {
            user {
              login
              firstName
              lastName
            }
            grade
            group {
              status
              id
              captainLogin
              members {
                userLogin
              }
              createdAt
              startedWorkingAt
              auditors {
                createdAt
                auditedAt
              }
              results {
                createdAt
              }
            }
            object {
              name
            }
          }
        }
      `;

        const response = await client.run(query);
        const progressData = response?.progress ?? [];

        // Group progress entries by student
        const studentsMap: Record<string, {
            login: string;
            firstName: string;
            lastName: string;
            completedProjects: string[];
            currentProject: string | null;
            progression: { current: number; total: number };
            projects: Array<{
                name: string;
                grade: number | null;
                status: string;
            }>;
        }> = {};

        const totalProjects = specialtyProjects.length;

        for (const entry of progressData) {
            const login = entry.user.login;

            if (!studentsMap[login]) {
                studentsMap[login] = {
                    login,
                    firstName: entry.user.firstName,
                    lastName: entry.user.lastName,
                    completedProjects: [],
                    currentProject: null,
                    progression: {current: 0, total: totalProjects},
                    projects: [],
                };
            }

            const student = studentsMap[login];
            const projectName = entry.object.name;
            const status = entry.group.status;
            const grade = entry.grade;

            student.projects.push({
                name: projectName,
                grade,
                status,
            });

            if (status === "finished" && grade !== null && grade > 0) {
                student.completedProjects.push(projectName);
            } else if (status === "working" || status === "setup" || status === "audit") {
                student.currentProject = projectName;
            }
        }

        // Compute progression for each student
        const students = Object.values(studentsMap).map(student => {
            const completedCount = student.completedProjects.length;
            // progression = completed projects + 1 if currently working on one (capped at total)
            const current = student.currentProject
                ? Math.min(completedCount + 1, totalProjects)
                : completedCount;

            student.progression = {current, total: totalProjects};
            return student;
        });

        ctx.response.status = 200;
        ctx.response.body = {
            specialty: specialtyKey,
            totalProjects,
            projectsList: specialtyProjects,
            studentsCount: students.length,
            students,
        };
    } catch (error) {
        console.error("Erreur GraphQL :", error);
        ctx.response.status = 500;
        ctx.response.body = {error};
    }
};

export const getSpecialtiesList = (ctx: RouterContext) => {
    ctx.response.status = 200;
    ctx.response.body = Object.entries(specialties).map(([key, projects]) => ({
        name: key,
        totalProjects: projects.length,
        projects,
    }));
};
