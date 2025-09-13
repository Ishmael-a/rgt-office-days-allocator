import { requireRole } from "@/app/_auth/require-role";
import { UserRole } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { allocationService as AllocationEngine } from "@/features/allocation/services/allocation-service";


export async function POST(request: NextRequest){
    try{
        await requireRole([UserRole.ADMIN, UserRole.MANAGER])

        const { month, year } = await request.json();

        if (!month || !year) {
            return NextResponse.json({ success:false, message: "Month and year are required" }, { status: 400 })
        }
        if (month < 1 || month > 12) {
            return NextResponse.json({ success:false, message: "Month be between 1 and 12" }, { status: 400 })
        }
        const currentYear = new Date().getFullYear()
        if (year < currentYear || year > currentYear + 2) {
            return NextResponse.json({ success:false, message: "Year must be current year or up to 2 years in the future" }, { status: 400 })
        }

        console.log(`[v0] Starting allocation generation for ${month}/${year}`)

        const result = await AllocationEngine.generateMonthlyAllocation(month, year)

        console.log(`[v0] Generated ${result.length} allocations`)

        return NextResponse.json({ success: true, message: `Successfully generated allocations for ${month}/${year}` }, { status: 200 })

    }catch(error){
        if (error instanceof NextResponse) return error
        console.error("Allocation generation error:", error)
        return NextResponse.json({ success:false, message: "Failed to generate allocations" }, { status: 500 })
    }

}