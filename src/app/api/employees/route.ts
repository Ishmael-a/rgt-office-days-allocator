import { NextRequest, NextResponse } from "next/server";
import { FetchEmployeeQuery, UserRole } from "@/types";
import { requireRole } from "@/app/_auth/require-role";
import { employeeService as EmployeeService } from "@/features/employee/services/employee-service";
import { employeeUpsertSchema } from "@/features/employee/schema/employee-schema";


export async function GET(request: NextRequest){
    try{
        await requireRole([ UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE ])


        const searchParams =  request.nextUrl.searchParams;

        const query: FetchEmployeeQuery = {
            withUser: searchParams.get("withUser") === "true" ? true 
                        : searchParams.get("withUser") === "false" ? false 
                        : undefined,
            withDepartment: searchParams.get("withDepartment") === "true" ? true 
                        : searchParams.get("withDepartment") === "false" ? false 
                        : undefined,
            withCount: searchParams.get("withCount") === "true" ? true 
                        : searchParams.get("withCount") === "false" ? false 
                        : undefined,
        };


        const result = await EmployeeService.getAllEmployees({
            query: query
        })

        return NextResponse.json({ 
                success: true, 
                message: `Successfully queried all employees` ,
                data: {
                    data: result,
                    meta: {
                        count: result.count
                    }
                }
            }, 
            { status: 200 }
        )

    }catch(error){
        if (error instanceof NextResponse) return error
        console.error("Error getting all employees: ", error)
        return NextResponse.json({ success:false, message: "Failed to get all employees" }, { status: 500 })
    }
}


export async function POST(request: NextRequest){
    try{
        await requireRole([ UserRole.ADMIN, UserRole.MANAGER ])


        const body =  await request.json();

        const validatedBody = await employeeUpsertSchema.validate(body, { abortEarly: false })


        const result = await EmployeeService.upsertEmployee(validatedBody)

        return NextResponse.json({ 
                success: true, 
                message: `Successfully upserted employee` ,
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
        console.error("Error upserting employee: ", error)
        return NextResponse.json({ success:false, message: "Failed to upsert employee" }, { status: 500 })
    }
}