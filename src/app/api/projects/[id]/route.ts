import { requireRole } from "@/app/_auth/require-role";
import { projectService as ProjectService } from "@/features/project/services/project-service";
import { NextRequest, NextResponse } from "next/server";




export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) { 
    try{
        await requireRole(['ADMIN', 'MANAGER'])
        const awaitedParams = await params;
        const projectId = awaitedParams.id;

        if(!projectId){
            return NextResponse.json({
                success: false,
                message: "Project ID is required"
            })
        }

        const deletedProj = await ProjectService.deleteProjectById(projectId);

        return NextResponse.json({
            success: true,
            message: deletedProj.name + " Project deleted successfully"
        }, { status: 200 })

    }catch (error) {
        console.error('Project delete error:', error);
        if (error instanceof NextResponse) return error
        return NextResponse.json({
            success: false,
            message: 'Failed to delete project',
        }, { status: 500 });
    }

}