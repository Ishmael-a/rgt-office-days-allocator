import { Prisma } from "../../../../generated/prisma";



// export type Department = Prisma.DepartmentGetPayload<{
//     include: {
//         manager: {
//             select: {
//                 name: true,
//                 id: true,
//             }
//         }
//     }
// }>

export type Department = Prisma.DepartmentGetPayload<{
    include: {
        employees?: boolean;
        manager: { select: { name: true, id: true } };
        _count?: { select: { employees: true } };
    }
}>
