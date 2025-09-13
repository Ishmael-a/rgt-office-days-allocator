import { prisma } from "@/lib/prisma";
import { Employee, EmployeeWithUser, EmployeeWithUserAndDepartment } from "../types";
import { FetchEmployeeQuery } from "@/types";
import { EmployeeUpsertDTO } from "../schema/employee-schema";
import { hash } from "bcryptjs";
import { PrismaPromise } from "../../../../generated/prisma";

class EmployeeService{

    async getAllEmployees({ query }: { query?: FetchEmployeeQuery}):Promise<{
        employees: (Employee|EmployeeWithUser|EmployeeWithUserAndDepartment)[];
        count: number;
        countByDeptIdAndWorktype?: {
            byDepartment: { departmentId: string; count: number }[] | [];
            byWorkType: { workType: string; count: number }[] | []
        }
    }>{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transactionQueries:PrismaPromise<any>[] = [
            prisma.employee.findMany({
                include: {
                    user: query?.withUser ? {
                        select: {
                            name: true,
                            role: true
                        }
                    } : false, 
                    department: query?.withDepartment ? {
                        select: {
                            name: true,
                            color: true,
                            manager: {
                                select: {
                                    name: true
                                }
                            }
                        },
                    } : false,
                    _count: true
                }
            }),
            prisma.employee.count(),
        ]
        if(query?.withCount){
            transactionQueries.push(
                prisma.employee.groupBy({
                    by: ['departmentId'],
                    _count: {
                        departmentId: true
                    },
                    orderBy:{ 
                        _count: {
                            departmentId: 'desc'
                        }
                    }
                }),
                prisma.employee.groupBy({
                    by: ['workType'],
                    _count: {
                        workType: true
                    },
                    orderBy: { 
                        _count: {
                            workType: 'desc'
                        }
                    }
                })
            )
        }
        const results = await prisma.$transaction(transactionQueries);
        const allEmployeesWithCount = results[0];
        let empsByDept = null;
        let empsByWorkType = null;
        let employeesCountByDeptIdAndWorkType;
        if(query?.withCount){
            empsByDept = results[2];
            empsByWorkType = results[3];
            

            //transform into usable format
            employeesCountByDeptIdAndWorkType = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                byDepartment: empsByDept?.map((item: any) => ({
                    departmentId: item.departmentId,
                    count: item._count.departmentId
                })) || [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                byWorkType: empsByWorkType?.map((item: any) => ({
                    workType: item.workType,
                    count: item._count.workType
                })) || [],
            }
        }


        return {
            employees: allEmployeesWithCount,
            count: results[1],
            ...(query?.withCount ? { countByDeptIdAndWorktype: employeesCountByDeptIdAndWorkType }:{}),
        }
    }



    async upsertEmployee(upsertEmpDto: EmployeeUpsertDTO){
        const preferences = upsertEmpDto?.preferences?.filter((x): x is string => x !== undefined);

        if (!upsertEmpDto.userId) {
            const passwordHash =  await hash(process.env.DEFAULT_PASSWORD as string, 10)

            const user = await prisma.user.create({
                data: {
                    name: upsertEmpDto.name!, 
                    email: upsertEmpDto.email!,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    role: upsertEmpDto.role as any, 
                    passwordHash,
                },
            })

            const employee = await prisma.employee.create({
                data: {
                    userId: user.id,
                    departmentId: upsertEmpDto.departmentId,
                    projectId: upsertEmpDto.projectId ?? null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    workType: upsertEmpDto.workType as any,
                    officeDays: upsertEmpDto.officeDays,
                    preferences,
                    isActive: upsertEmpDto.isActive ?? true,
                },
            })

            return { user, employee, created: true }
        }


        const updatedUser = await prisma.user.update({
            where: { id: upsertEmpDto.userId },
            data: {
                ...(upsertEmpDto.name ? { name: upsertEmpDto.name } : {}),
                ...(upsertEmpDto.email ? { email: upsertEmpDto.email } : {}),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(upsertEmpDto.role ? { role: upsertEmpDto.role as any } : {}),
            },
        })

        if (upsertEmpDto.previousDepartmentId && upsertEmpDto.previousDepartmentId !== upsertEmpDto.departmentId) {
            console.log("Moving Emp to new Department")
            const result = await prisma.$transaction(async (tx) => {
                await tx.employee.delete({
                    where: {
                        employeeId: {
                            userId: upsertEmpDto.userId!,
                            departmentId: upsertEmpDto.previousDepartmentId!,
                        }
                    }
                })
                const newEmp= await tx.employee.create({
                    data: {
                        userId: upsertEmpDto.userId!,
                        departmentId: upsertEmpDto.departmentId!,
                        projectId: upsertEmpDto.projectId ?? null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        workType: upsertEmpDto.workType as any,
                        officeDays: upsertEmpDto.officeDays,
                        preferences,
                        isActive: upsertEmpDto.isActive ?? true,
                    }
                })

                return newEmp

            })

            return { user: updatedUser, employee: result, created: false, movedDepartment: true }
        }
        
        const employee = await prisma.employee.upsert({
            where: {
                employeeId: {
                    userId: upsertEmpDto.userId,
                    departmentId: upsertEmpDto.departmentId
                },
            },
            update: {
                departmentId: upsertEmpDto.departmentId ?? null,
                projectId: upsertEmpDto.projectId ?? null,
                workType: upsertEmpDto.workType,
                officeDays: upsertEmpDto.officeDays,
                preferences: preferences,
                isActive: upsertEmpDto.isActive ?? true,
            },
            create: {
                userId: upsertEmpDto.userId,
                departmentId: upsertEmpDto.departmentId,
                projectId: upsertEmpDto.projectId ?? null,
                workType: upsertEmpDto.workType,
                officeDays: upsertEmpDto.officeDays,
                preferences: preferences,
                isActive: upsertEmpDto.isActive ?? true,
            }
        })

        return { user: updatedUser, employee, created: false }
    }
}


export const employeeService = new EmployeeService()
