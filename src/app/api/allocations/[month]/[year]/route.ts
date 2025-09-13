import { allocationService as AllocationService } from '@/features/allocation/services/allocation-service';
import { AllocationQueryParam } from '@/types';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ month: string; year: string }> }
) {
    const awaitedParams = await params;
    const searchParams =  req.nextUrl.searchParams;
    const query: AllocationQueryParam = { 
        userId: searchParams.get("userId") ?? undefined
    }

    try {
        // Validate inputs
        const monthNum = Number(awaitedParams.month);
        const yearNum = Number(awaitedParams.year);

        if (!monthNum || !yearNum) {
            return NextResponse.json({ error: "Month and year are required" }, { status: 400 })
        }
        if (isNaN(monthNum) || isNaN(yearNum)) {
            return NextResponse.json({
                success:false, message: 'Invalid month or year',
            },{ status: 400 });
        }
        if (monthNum < 1 || monthNum > 12) {
            return NextResponse.json({ success:false, message: "Month be between 1 and 12" }, { status: 400 })
        }
        const currentYear = new Date().getFullYear()
        if (yearNum < currentYear || yearNum > currentYear + 2) {
            return NextResponse.json({ success:false, message: "Year must be current year or up to 2 years in the future" }, { status: 400 })
        }

        const allocations = await AllocationService.getAllocations(monthNum, yearNum, query)


        return NextResponse.json({
            success: true,
            message: 'Allocations retrieved successfully',
            data: {
                data: allocations,
                meta: {
                    total: allocations.length,
                }
            }
        });
    } catch (error) {
        console.error('Allocation fetch error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to retrieve allocations',
        }, { status: 500 });
    }
}
