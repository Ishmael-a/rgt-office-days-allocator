"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Calendar, Eye } from "lucide-react"
import { useDepartmentsQuery } from "@/hooks/use-department"
import { useEmployeesQuery } from "@/hooks/use-employee"
import { useAllocationQuery, useAllocationQueryByUserId } from "@/hooks/use-allocation"
import { Allocation } from "@/features/allocation/types"
import { useProjectsQuery } from "@/hooks/use-projects"
import { EmployeeWithUser } from "@/features/employee/types"
import { months, weekDays } from "@/constants"
import { getDaysInMonth, getFirstDayOfMonth } from "@/utils/day-month-year"
import { User } from "@/features/users/types"
import { UserRole } from "@/types"


type ViewMode = "team" | "department" | "individual"

export  function CalendarView({user}: { user : User}) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [viewMode, setViewMode] = useState<ViewMode>("team")
  const [selectedEmployee, setSelectedEmployee] = useState<string>(user.role === UserRole.EMPLOYEE ? user.id : "")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const { data: allocationData, isLoading: isAllocationsLoading } =  useAllocationQuery({ month: currentMonth, year: currentYear})
  const { data: allocationsByUserData, isLoading: isAllocationsByUserLoading } =  useAllocationQueryByUserId({ month: currentMonth, year: currentYear, query: { userId: selectedEmployee } })
  const { data: departmentData, isLoading: isDepartmentsLoading } =  useDepartmentsQuery()
  const { data: projectData, isLoading: isProjectsLoading } =  useProjectsQuery()
  const { data: employeeData, isLoading: isEmployeesLoading } =  useEmployeesQuery({
      query: {
          withUser: true
      }
  })
  const allocationsByUser = useMemo(() => allocationsByUserData?.data.data||[], [allocationsByUserData])
  const calendarData = useMemo(() => allocationData?.data.data||[], [allocationData])
  const departments = useMemo(() => departmentData?.data.data||[], [departmentData])
  const projects = useMemo(() => projectData?.data.data||[], [projectData])
  const employees = useMemo(() => employeeData?.data.data.employees||[], [employeeData])



  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 1) {
        setCurrentMonth(12)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }



  const getFilteredAllocations = () => {
    if (!calendarData || calendarData.length <= 0) return []

    let filtered = calendarData

    if (viewMode === "individual" && selectedEmployee) {
      filtered = allocationsByUser
    } else if (viewMode === "department" && selectedDepartment) {
      filtered = filtered.filter((alloc) => alloc.departmentId === selectedDepartment)
    }

    return filtered
  }

  const getDayOfWeek = (dayOfMonth: number, year: number, month: number) => {
        const date = new Date(year, month, dayOfMonth);
        const dayIndex = date.getDay();
        
        // Adjust for JavaScript's getDay() (0 = Sunday)
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        
        return weekDays[adjustedIndex];
    }

  const getAllocationsForDate = (day: number) => {
    const dateStr = getDayOfWeek(day, currentYear, currentMonth-1)
    return getFilteredAllocations().filter((alloc) => alloc[dateStr as keyof Pick<Allocation,'monday'|'tuesday'|'wednesday'|'thursday'|'friday'>])
  }



  const renderCalendarDay = (day: number) => {
    const officeAllocations = getAllocationsForDate(day)
    const isWeekend = [0, 6].includes(new Date(currentYear, currentMonth - 1, day).getDay())
    const projectsByCount = Object.entries(officeAllocations.reduce((acc, alloc) => {
            const proj = alloc.employee.project?.name || "No Project"
            acc[proj] = (acc[proj] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    ))
    // console.log("projectsby count", projectsByCount)

    if (isWeekend) {
      return (
        <div key={day} className="min-h-[100px] p-2 bg-muted/30 border border-border">
          <div className="text-sm text-muted-foreground font-medium">{day}</div>
        </div>
      )
    }

    return (
      <div key={day} className="min-h-[100px] p-2 border border-border hover:bg-muted/50 transition-colors">
        <div className="text-sm font-medium mb-2">{day}</div>

        {viewMode === "team" && (
          <div className="space-y-1">
            {projectsByCount.slice(0, 4).map(([proj, count]) => {
              const projData = projects.find((p) => p.name === proj)
              return (
                <div
                  key={proj}
                  className="text-xs px-2 py-1 rounded-md text-white"
                  style={{ backgroundColor: projData?.color || "#8b5cf6" }}
                >
                  {proj}: {count}
                </div>
              )
            })}
            {projectsByCount.length > 4 && (
              <div className="text-xs text-muted-foreground">+{projectsByCount.length - 4} more</div>
            )}
          </div>
        )}

        {viewMode === "department" && (
          <div className="space-y-1">
            {Object.entries(
              officeAllocations.reduce(
                (acc, alloc) => {
                  const dept = alloc.employee.department.name
                  acc[dept] = (acc[dept] || 0) + 1
                  return acc
                },
                {} as Record<string, number>,
              ),
            ).map(([dept, count]) => {
              const deptData = departments.find((d) => d.name === dept)
              return (
                <div
                  key={dept}
                  className="text-xs px-2 py-1 rounded-md text-white"
                  style={{ backgroundColor: deptData?.color || "#8b5cf6" }}
                >
                  {dept}: {count}
                </div>
              )
            })}
          </div>
        )}

        {viewMode === "individual" && (
          <div className="space-y-1">
            {officeAllocations.length > 0 && (
              <div key={"idx"} className="text-xs px-2 py-1 rounded-md bg-accent text-accent-foreground">
                Office Day
              </div>
            )}
            {/* {allocations.some((alloc) => !alloc.isOfficeDay) && officeAllocations.length === 0 && (
              <div className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">Remote</div>
            )} */}
          </div>
        )}

        {/* {officeAllocations.length === 0 && allocations.length > 0 && viewMode !== "individual" && ( */}
        {officeAllocations.length === 0 && viewMode !== "individual" && (
          <div className="text-xs text-muted-foreground">All remote</div>
        )}
      </div>
    )
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[100px] border border-border bg-muted/20" />)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(renderCalendarDay(day))
    }

    return days
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Office Days Calendar
              </CardTitle>
              <CardDescription>View office days allocation across teams, departments, or individuals</CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold min-w-[140px] text-center">
                {months[currentMonth - 1]} {currentYear}
              </div>
              <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Team View</SelectItem>
                  <SelectItem value="department">Department View</SelectItem>
                  <SelectItem value="individual">Individual View</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {viewMode === "individual" && user.role != UserRole.EMPLOYEE ? (
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {(employees as EmployeeWithUser[]).map((emp) => (
                    <SelectItem key={emp.userId} value={emp.userId}>
                      {emp.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : viewMode === "individual" && user.role === UserRole.EMPLOYEE ? (
                <Button variant={"ghost"} className="rounded-lg py-1 px-3 border items-center justify-center ">{user.name}</Button>
            ) : null}

            {viewMode === "department" && (
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* {calendarData && (
              <div className="flex gap-4 ml-auto">
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {calendarData.statistics.officeDays} office days
                </Badge>
                <Badge variant="outline">{calendarData.statistics.remoteDays} remote days</Badge>
              </div>
            )} */}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {isDepartmentsLoading||isEmployeesLoading||isAllocationsLoading||isProjectsLoading||isAllocationsByUserLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading calendar...</div>
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-3 text-center font-medium bg-muted border border-border">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {renderCalendarGrid()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {viewMode === "team" && (projects.map((proj) => (
              <div key={proj.id} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: proj.color }} />
                <span className="text-sm">{proj.name}</span>
              </div>
            )))}
            {viewMode === "department" && (departments.map((dept) => (
              <div key={dept.id} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: dept.color }} />
                <span className="text-sm">{dept.name}</span>
              </div>
            )))}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <span className="text-sm">Weekend</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
