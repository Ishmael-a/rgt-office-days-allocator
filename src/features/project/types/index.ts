import { Prisma } from "../../../../generated/prisma";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Project = Prisma.ProjectGetPayload<any>
export type ProjectWithEmployees = Prisma.ProjectGetPayload<{
    include: {
        employees:  {
                        include: {
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
        _count?: {
            select: {
                employees: true,
            }
        }
    }
}>
