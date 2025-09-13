import { prisma } from "@/lib/prisma";
import { Project, ProjectWithEmployees } from "../types";
import { FetchProjectQuery } from "@/types";
import { ProjectUpsertDTO } from "../schema/project-schema";

class ProjectService{

    async getAllProjects({ query }: { query?: FetchProjectQuery }):Promise<{ projects: (Project|ProjectWithEmployees)[], meta: { count: number } }>{
        const [ projects, count ] = await prisma.$transaction([
            prisma.project.findMany({
                include: {
                    employees: query?.withEmployees ? {
                        include: {
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }: false,
                    _count: query?.withEmployees ? {
                        select: {
                            employees: true,
                        }
                    } : false
                }
            }),
            prisma.project.count()
        ])

        return {
            projects,
            meta: {
                count
            }
        }
    }


    async upsertProject(projectUpsertDTO: ProjectUpsertDTO){

        const upsertedProject = await prisma.project.upsert({
            where: {
                id: projectUpsertDTO.projectId ?? "",
            },
            update: {
                name: projectUpsertDTO.name,
                description: projectUpsertDTO.description,
                color: projectUpsertDTO.color,
                isActive: projectUpsertDTO.status,
                ...(projectUpsertDTO.memberIds ? {
                        employees: {
                            set: projectUpsertDTO.memberIds.map((id) => ({ userId: id })) || []
                        }
                    } : {} ) 
            },
            create: {
                name: projectUpsertDTO.name,
                description: projectUpsertDTO.description,
                color: projectUpsertDTO.color,
                isActive: projectUpsertDTO.status,
                ...(projectUpsertDTO.memberIds ? {
                    employees: {
                        connect: projectUpsertDTO.memberIds.map((id) => ({ userId: id }))
                    }
                } : {} ) 
            }
        })


        return { project: upsertedProject, created: !projectUpsertDTO.projectId }
    }


    async deleteProjectById(projectId: string){
        return await prisma.project.delete({
            where: {
                id: projectId
            }
        })
    }
}


export const projectService = new ProjectService()
