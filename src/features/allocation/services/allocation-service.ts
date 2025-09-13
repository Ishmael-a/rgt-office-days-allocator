import { prisma } from "@/lib/prisma";
import { Allocation, AllocationWithEmployee } from "../types";
import { Employee } from "@/features/employee/types";
import { AllocationQueryParam, WorkType } from "@/types";

export interface AllocationConstraints{
    noConsecutiveDays: boolean;
    maxDaysPerWeek: number;
    projectClustering: boolean;
    loadBalancing: boolean;
}

export interface WeeklyAllocation {
    userId: string;
    departmentId: string;
    weekNumber: number;
    month: number;
    year: number;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean
}

class AllocationService{
    private constraints: AllocationConstraints;

    constructor(constraints: AllocationConstraints = {
        noConsecutiveDays: true,
        maxDaysPerWeek: 2,
        projectClustering: true,
        loadBalancing: true
    }){
        this.constraints = constraints;
    }


    async generateMonthlyAllocation(month:number, year: number): Promise<Allocation[]> {
        await this.clearAllocations()

        //get active employees
        const officeEmployees = await this.getActiveOfficeEmployees();

        if(officeEmployees.length === 0) return []

        const allocations: WeeklyAllocation[] = []
        
        const weeks = this.getWeeksInMonth(month, year);

        for( const employee of officeEmployees ){
            let selectedDaysForMonth: (keyof Pick<WeeklyAllocation, 'monday'|'tuesday'|'wednesday'|'thursday'|'friday'>)[] = [];

            if(employee.workType === WorkType.HYBRID){
                const daysToAllocate = employee.officeDays || 2;
                selectedDaysForMonth = this.selectNonConsecutiveDays(daysToAllocate);
            }
            // for( const week of weeks ){

                const weeklyAlloc = this.generateWeeklyAllocation(
                    employee,
                    weeks[0], 
                    month,
                    year,
                    selectedDaysForMonth
                );

                allocations.push(weeklyAlloc);
            // }
        }

        //apply constraints
        if(this.constraints.projectClustering){
            await this.applyProjectClustering(allocations, officeEmployees);
        }

        // Apply employee preferences (soft constraint)
        await this.applyEmployeePreferences(allocations, officeEmployees);

        //save in the db
        const finalAllocations = await this.saveAllocations(allocations);

        console.log(`Generated ${finalAllocations.length} allocations`);
        
        return finalAllocations;

    }

    //save allocations to database
    private async saveAllocations(allocations: WeeklyAllocation[]): Promise<Allocation[]> {
        const savedAllocations: Allocation[] = [];

        for(const allocation of allocations){
            try{
                const saved = await prisma.allocation.upsert({
                    where: {
                        userId_departmentId_month_year_weekNumber: {
                            userId: allocation.userId,
                            departmentId: allocation.departmentId,
                            month: allocation.month,
                            year: allocation.year,
                            weekNumber: allocation.weekNumber
                        }
                    },
                    update: {
                        monday: allocation.monday,
                        tuesday: allocation.tuesday,
                        wednesday: allocation.wednesday,
                        thursday: allocation.thursday,
                        friday: allocation.friday,
                        updatedAt: new Date()
                    },
                    create: {
                        userId: allocation.userId,
                        departmentId: allocation.departmentId,
                        weekNumber: allocation.weekNumber,
                        month: allocation.month,
                        year: allocation.year,
                        monday: allocation.monday,
                        tuesday: allocation.tuesday,
                        wednesday: allocation.wednesday,
                        thursday: allocation.thursday,
                        friday: allocation.friday,
                    }
                })

                savedAllocations.push(saved)
            }catch(error){
                console.log("Error saving allocation: ", error);
            }
        }

        await this.logAllocationHistory(allocations, 'GENERATED');

        return savedAllocations;
    }

    private async logAllocationHistory(
        allocations: WeeklyAllocation[],
        action: 'GENERATED'|'RESHUFFLED'|'MANUAL_CHANGE'
    ):Promise<void> {
        if(allocations.length === 0) return;

        const { month, year } = allocations[0];

        try{
            await prisma.allocationHistory.create({
                data: {
                    month,
                    year,
                    action,
                    changedBy: 'system',
                    reason: `Monthly allocation ${action.toLowerCase()}`,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    newAllocation: allocations as any
                }
            })
        }catch(error){
            console.error('Error logging allocation history:', error);
        }
    }


    private async applyEmployeePreferences(
        allocations: WeeklyAllocation[],
        employees: Employee[]
    ): Promise<void> {
        for(const employee of employees){
            if(!employee.preferences) continue;

            const preferences = employee.preferences as { preferredDays?: string[] };
            if(!preferences.preferredDays?.length) continue;

            const employeeAllocations = allocations.filter(alloc => alloc.userId === employee.userId);

            for(const allocation of employeeAllocations){
                this.adjustForPreferences(allocation, preferences.preferredDays);
            }
        }
    }

    private adjustForPreferences(
        allocation: WeeklyAllocation,
        preferredDays: string[]
    ): void {
        const days = ['monday','tuesday','wednesday','thursday','friday'];
        const currentDays = days.filter(day => allocation[day as keyof WeeklyAllocation]);

        // const currentScore = currentDays.filter(day => preferredDays.includes(day)).length;

        const availablePreferredDays = preferredDays.filter(day => days.includes(day) && !allocation[day as keyof WeeklyAllocation]);
        const nonPreferredAllocatedDays = currentDays.filter(day => !preferredDays.includes(day));

        if(availablePreferredDays.length > 0 && nonPreferredAllocatedDays.length > 0){
            for(const prefDay of availablePreferredDays){
                for(const nonPrefDay of nonPreferredAllocatedDays){
                    const newDays = currentDays.filter(d => d !== nonPrefDay).concat(prefDay);

                    if(!this.hasConsecutiveDays(newDays)){
                        allocation[nonPrefDay as keyof Pick<WeeklyAllocation, 'monday'|'tuesday'|'wednesday'|'thursday'|'friday'>] = false;
                        allocation[prefDay as keyof Pick<WeeklyAllocation, 'monday'|'tuesday'|'wednesday'|'thursday'|'friday'>] = true;
                        break;
                    }
                }
            }
        }

        
    }

    //group by project
    private applyProjectClustering(
        allocations: WeeklyAllocation[],
        employees: Employee[]
    ): void {
        const projectGroups = this.groupEmployeesByProject(employees);

        for(const [projId, projEmployees] of projectGroups.entries()){
            if(projEmployees.length < 2) continue;

            const projAllocations = allocations.filter((alloc) => projEmployees.some((projectEmp) => projectEmp.userId === alloc.userId));

            //group by week
            const weeklyGroups = this.groupAllocationsByWeek(projAllocations);

            for(const [weekKey, weekAllocations] of weeklyGroups.entries()){
                this.optimizeForProject(weekAllocations);
            }
            
        }
    }

    private optimizeForProject(allocations: WeeklyAllocation[]): void {
        if(allocations.length < 2) return;

        const days = ['monday','tuesday','wednesday','thursday','friday'];
        const dailyScores = days.map(day => {
            const count = allocations.filter(alloc => alloc[day as keyof WeeklyAllocation]).length;
            return { day, count };
        })

        //sort scores by days in decreasing order
        dailyScores.sort((a, b) => b.count - a.count);

        for(const allocation of allocations){
            const currentDays = days.filter(day => allocation[day as keyof WeeklyAllocation]);
            const targetDays = dailyScores.slice(0, currentDays.length).map(s => s.day);

            if(this.canSafelyReassign(allocation, currentDays, targetDays)){
                days.forEach(day => {
                    allocation[day as keyof Pick<WeeklyAllocation, 'monday'|'tuesday'|'wednesday'|'thursday'|'friday'>] = targetDays.includes(day);
                });
            }
        }
    }

    private canSafelyReassign(
        allocation: WeeklyAllocation,
        currentDays: string[],
        targetDays: string[]
    ): boolean {
        if(currentDays.length !== targetDays.length) return false;
        if(this.hasConsecutiveDays(targetDays)) return false;
        return true;
    }

    private groupAllocationsByWeek(allocations: WeeklyAllocation[]): Map<string, WeeklyAllocation[]>{
        const groups = new Map<string, WeeklyAllocation[]>();

        allocations.forEach(allocation => {
            const weekKey = `${allocation.year}-${allocation.month}-${allocation.weekNumber}`;

            if(!groups.has(weekKey)){
                groups.set(weekKey, []);
            }

            groups.get(weekKey)!.push(allocation);
        })

        return groups;
    }

    private groupEmployeesByProject(employees: Employee[]): Map<string, Employee[]> {
        const groups = new Map<string, Employee[]>();

        employees.forEach(emp => {
            const projectId = emp.projectId || 'no-project';
            if(!groups.has(projectId)){
                groups.set(projectId, [])
            }
            groups.get(projectId)!.push(emp);
        });

        return groups;
    }

    //Weekly Allocation for a single emp 
    private generateWeeklyAllocation(
        employee: Employee,
        weekNumber: number,
        month: number,
        year: number,
        preSelectedDays?: (keyof Pick<WeeklyAllocation, 'monday'|'tuesday'|'wednesday'|'thursday'|'friday'>)[]
    ): WeeklyAllocation {
        const allocation: WeeklyAllocation = {
            userId: employee.userId,
            departmentId: employee.departmentId,
            weekNumber,
            month,
            year,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false
        };
        
        if(employee.workType === WorkType.ONSITE){
            allocation.monday = true;
            allocation.tuesday = true;
            allocation.wednesday = true;
            allocation.thursday = true;
            allocation.friday = true;
        }else if(employee.workType === WorkType.HYBRID && preSelectedDays){
            // const daysToAllocate = employee.officeDays || 2;
            // const selectedDays = this.selectNonConsecutiveDays(daysToAllocate)
            preSelectedDays.forEach((day) => {
                allocation[day] = true;
            });
        }


        return allocation;
    }


    private selectNonConsecutiveDays(daysNeeded: number): (keyof Pick<WeeklyAllocation, 'monday'|'tuesday'|'wednesday'|'thursday'|'friday'>)[]{
        const weekDays:(keyof Pick<WeeklyAllocation, 'monday'|'tuesday'|'wednesday'|'thursday'|'friday'>)[] = ['monday','tuesday','wednesday','thursday','friday'];

        if(daysNeeded >= 5) return weekDays;
        if(daysNeeded <= 0) return [];

        const combinations = this.getCombinations(weekDays, daysNeeded);

        //filter out combinations with consecutive days
        const validCombinations = combinations.filter(combo => !this.hasConsecutiveDays(combo))

        //no valid combos? then return any combo or empty arr
        if(validCombinations.length === 0) return combinations[Math.floor(Math.random() * combinations.length)] || [];

        return validCombinations[Math.floor(Math.random() * validCombinations.length)] || [];

    }

    private getCombinations<T>(array: T[], length: number):T[][]{
        if(length === 1) return array.map((elmt) => [elmt]);

        const combinations:T[][] = [];

        for(let i = 0; i < array.length - length; i++){
            const first = array[i];

            const rest = this.getCombinations(array.slice(i+1), length-1);

            rest.forEach(combination => {
                combinations.push([ first, ...combination ]);
            });
        }

        return combinations;
    }

    private hasConsecutiveDays(days: string[]): boolean {
        const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const indices = days.map((day) => weekDays.indexOf(day)).sort((a,b) => a-b);

        for(let i = 1; i < indices.length; i++){
            if(indices[i] - indices[i-1] === 1) return true
        }

        return false;
    }

    private getActiveOfficeEmployees(): Promise<Employee[]>{
        return prisma.employee.findMany({
            where: { 
                isActive: true, 
                workType: {
                    in: [WorkType.HYBRID , WorkType.ONSITE]
                }
            }
        })
    }


    private getWeeksInMonth(month: number, year: number): number[]{
        const weeks: number[] = [];
        const firstDay = new Date(year, month-1, 1)
        const lastDay = new Date(year, month, 0)


        const currentDate = new Date(firstDay);
        while(currentDate <= lastDay){
            const weekNumberOfTheYear = this.getWeekNumberOFTheYear(currentDate);
            if(!weeks.includes(weekNumberOfTheYear)) weeks.push(weekNumberOfTheYear)
            currentDate.setDate(currentDate.getDate() + 7)
        }

        return weeks;
    }

    private getWeekNumberOFTheYear(date: Date): number {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
    }

    private async clearAllocations():Promise<void>{
        await prisma.allocation.deleteMany({})
    }

    async getAllocations(month: number, year: number, query: AllocationQueryParam):Promise<AllocationWithEmployee[]>{
        return prisma.allocation.findMany({
            where: {
                month,
                year,
                ...(query.userId ? { userId: query.userId } : {})
            },
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
                                color: true
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
        })
    }

}

export const allocationService = new AllocationService()