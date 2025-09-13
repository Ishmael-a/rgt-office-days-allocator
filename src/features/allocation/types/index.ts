import { Prisma } from "../../../../generated/prisma";



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Allocation = Prisma.AllocationGetPayload<any>
export type AllocationWithEmployee = Prisma.AllocationGetPayload<{
    include: {
            employee: {
                include: {
                    user: {
                        select: {
                            name: true
                        }
                    },
                    department: {
                        select: {
                            name: true,
                            color: true,
                        }
                    },
                    project: {
                        select: {
                            name: true,
                            color: true
                        }
                    }
                }
            }
        }
    }>