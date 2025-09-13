import { Prisma } from "../../../../generated/prisma";



export type EmployeeWithUser = Prisma.EmployeeGetPayload<{
    include: {
        user?: {
            select: {
                name: true,
                role: true
            }
        }
    }
}>
export type EmployeeWithUserAndDepartment = Prisma.EmployeeGetPayload<{
    include: {
        user?: {
            select: {
                name: true,
                role: true
            }
        },
        department: {
            select: {
                name: true,
                color: true,
                manager: {
                    select: {
                        name: true
                    }
                }
            }
        }
    }
}>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Employee = Prisma.EmployeeGetPayload<any>

