import { requireRole } from "@/app/_auth/require-role";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/types";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        await requireRole([ UserRole.ADMIN, UserRole.MANAGER ])


        const allUsers = await prisma.user.findMany({})

        return NextResponse.json({ 
                success: true, 
                message: `Successfully queried all users` ,
                data: {
                    data: allUsers,
                    meta: {}
                }
            }, 
            { status: 200 }
        )

    }catch(error){
        if (error instanceof NextResponse) return error
        console.error("Error getting all users: ", error)
        return NextResponse.json({ success:false, message: "Failed to get all users" }, { status: 500 })
    }
}