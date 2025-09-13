import { NextRequest, NextResponse } from "next/server";
import { FetchDepartmentQuery, UserRole } from "@/types";
import { requireRole } from "@/app/_auth/require-role";
import { departmentService as DepartmentService } from "@/features/department/services/department-service";
import { departmentUpsertSchema } from "@/features/department/schema/department-schema";


export async function GET(request: NextRequest){
    try{
        await requireRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE])

        const searchParams =  request.nextUrl.searchParams;

        const query: FetchDepartmentQuery = {
            withEmployees: searchParams.get("withEmployees") === "true" ? true 
                        : searchParams.get("withEmployees") === "false" ? false 
                        : undefined,
        };

        const dbDepartments = await DepartmentService.getAllDepartments({
            query: query
        })

        return NextResponse.json({ 
                success: true, 
                message: `Successfully queried all departments` ,
                data: {
                    data: dbDepartments,
                    meta: {}
                }
            }, 
            { status: 200 }
        )

    }catch(error){
        if (error instanceof NextResponse) return error
        console.error("Error getting all departments:", error)
        return NextResponse.json({ success:false, message: "Failed to get all departments" }, { status: 500 })
    }
}


export async function POST(request: NextRequest){
    try{
        await requireRole([ UserRole.ADMIN, UserRole.MANAGER ])


        const body =  await request.json();

        const validatedBody = await departmentUpsertSchema.validate(body, { abortEarly: false })


        const result = await DepartmentService.upsertDepartment(validatedBody)
        const actionType = result.created ? "created" : "updated";

        return NextResponse.json({ 
                success: true, 
                message: `Successfully ${actionType}  department` ,
                data: {
                    data: result,
                    meta: {}
                }
            }, 
            { status: 200 }
        )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error: any){
        if (error instanceof NextResponse) return error
        if (error.name === "ValidationError") {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            )
        }
        console.error("Error upserting department: ", error)
        return NextResponse.json({ success:false, message: "Failed to upsert department" }, { status: 500 })
    }
}