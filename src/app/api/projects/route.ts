import { NextRequest, NextResponse } from "next/server";
import { FetchProjectQuery, UserRole } from "@/types";
import { requireRole } from "@/app/_auth/require-role";
import { projectService as ProjectService } from "@/features/project/services/project-service";
import { projectUpsertSchema } from "@/features/project/schema/project-schema";


export async function GET(request: NextRequest){
    try{
        await requireRole([ UserRole.ADMIN, UserRole.MANAGER ])

        const searchParams =  request.nextUrl.searchParams;

        const query: FetchProjectQuery = {
            withEmployees: searchParams.get("withEmployees") === "true" ? true 
                        : searchParams.get("withEmployees") === "false" ? false 
                        : undefined,
        };

        const { projects, meta} = await ProjectService.getAllProjects({
            query: query
        })

        return NextResponse.json({ 
                success: true, 
                message: `Successfully queried all projects` ,
                data: {
                    data: projects,
                    meta: {...meta}
                }
            }, 
            { status: 200 }
        )

    }catch(error){
        if (error instanceof NextResponse) return error
        console.error("Error getting all projects: ", error)
        return NextResponse.json({ success:false, message: "Failed to get all projects" }, { status: 500 })
    }
}



export async function POST(request: NextRequest){
    try{
        await requireRole([ UserRole.ADMIN, UserRole.MANAGER ])


        const body =  await request.json();

        const validatedBody = await projectUpsertSchema.validate(body, { abortEarly: false })


        const result = await ProjectService.upsertProject(validatedBody)
        const actionType = result.created ? "created" : "updated";

        return NextResponse.json({ 
                success: true, 
                message: `Successfully ${actionType}  project` ,
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
        console.error("Error upserting project: ", error)
        return NextResponse.json({ success:false, message: "Failed to upsert project" }, { status: 500 })
    }
}