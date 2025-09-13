import { prisma } from "@/lib/prisma";
import { Department } from "../types";
import { FetchDepartmentQuery } from "@/types";
import { DepartmentUpsertDTO } from "../schema/department-schema";

class DepartmentService{

    async getAllDepartments({ query }: { query?: FetchDepartmentQuery }):Promise<Department[]>{
        return await prisma.department.findMany({
            include: {
                employees: query?.withEmployees ? true: false,
                manager: {
                    select: {
                        name: true,
                        id: true
                    }
                },
                _count: query?.withEmployees ? {
                    select: {
                        employees: true,
                    }
                } : false
            }
        })
    }

    async upsertDepartment(upsertDeptDto: DepartmentUpsertDTO){
      
        const upsertedDept = await prisma.department.upsert({
            where: {
                id: upsertDeptDto.departmentId ?? "",
            },
            update: {
                name: upsertDeptDto.name,
                description: upsertDeptDto.description,
                color: upsertDeptDto.color,
                managerId: upsertDeptDto.managerId ?? null,
            },
            create: {
                name: upsertDeptDto.name,
                description: upsertDeptDto.description,
                color: upsertDeptDto.color,
                managerId: upsertDeptDto.managerId ?? null,
            }
        })

        return { department: upsertedDept, created: upsertDeptDto.departmentId ? false : true  };
    }
}


export const departmentService = new DepartmentService()
