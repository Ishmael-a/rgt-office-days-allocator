'use client'

import React, { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEmployeesQuery } from '@/hooks/use-employee';
import { WorkType } from '@/types';
import { EmployeeWithUserAndDepartment } from '@/features/employee/types';
import { months } from '@/constants';
import { getDaysInMonth, getFirstDayOfMonth } from '@/utils/day-month-year';
import Link from 'next/link';
import { allocationsPath, calendarPath, departmentsPath, employeesPath } from '@/app/paths';

type ChartType = { name: string, value: number, color: string }[]
type WorkTypeValues = `${WorkType}`;
type CountByWorkType = { workType: WorkTypeValues, count: number };
type CountByDepartmentId = { departmentId: WorkTypeValues, count: number };

const workTypeColorData = {
  'HYBRID':'bg-slate-300 dark:bg-slate-600',
  'ONSITE': 'bg-slate-400 dark:bg-slate-500',
  'REMOTE': 'bg-slate-500 dark:bg-slate-400' 
}

export default function DashboardPage(){
  const [currentMonth] = useState(new Date().getMonth() + 1) // Months are 0-indexed
  const [currentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)

  const { data: employeesData, isLoading } = useEmployeesQuery(
    {
      query: {
        withDepartment: true,
        withCount: true
      }
    }
  )
  const employees: EmployeeWithUserAndDepartment[] = useMemo(() => employeesData?.data.data.employees || [], [employeesData])
  const departmentData:ChartType = useMemo(() => employeesData?.data?.data.countByDeptIdAndWorktype.byDepartment.map((item:CountByDepartmentId) =>{ 
    const employee = employees.find((emp) => emp.departmentId === item.departmentId);
    return ({
      name: employee?.department?.name,
      color: employee?.department?.color,
      value: item.count,
    })
  }) || [], [employees, employeesData])
  const workTypeData:ChartType = useMemo(() => employeesData?.data?.data.countByDeptIdAndWorktype.byWorkType.map((item:CountByWorkType) =>{ 
    return ({
      name: item.workType,
      color: workTypeColorData[item.workType],
      value: item.count,
    })
  }) || [], [employees, employeesData])
  const totalEmployees = useMemo(() => employeesData?.data?.meta.count ?? 0, [employeesData])
  const hybridEmployees = useMemo(() => employeesData?.data?.data.countByDeptIdAndWorktype.byWorkType.find((item:CountByWorkType) => item.workType === WorkType.HYBRID).count ?? 0, [employeesData])
  const onsiteEmployees = useMemo(() => employeesData?.data?.data.countByDeptIdAndWorktype.byWorkType.find((item:CountByWorkType) => item.workType === WorkType.ONSITE).count ?? 0, [employeesData])
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  

  const getCalendarDays = useCallback(() => {
    console.log('Calculating calendar days for', currentMonth, currentYear);
    const daysInMonth = getDaysInMonth(currentYear, currentMonth+1)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth+1)
    setSelectedDate(firstDay)
    console.log("First day of month:", firstDay);
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }, [currentMonth, currentYear])
  const calendarDays:(number|null)[] = useMemo(() => getCalendarDays(), []);


  const renderBarChart = (data: ChartType, maxValue = 50) => {
    return (
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-4">
            <div className="w-20 text-sm text-muted-foreground text-right">
              {item.name}
            </div>
            <div className="flex-1 relative">
              <div className="h-6 bg-muted rounded-sm overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ease-out`}
                  style={{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
              <span className='text-xs'>{(item.value / maxValue) * 100}%</span>
          </div>
        ))}
      </div>
    );
  };

  const renderColumnChart = (data: ChartType) => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <div className="flex items-end justify-center gap-8 h-32">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col items-center gap-2">
            <div className="flex items-end h-20">
              <div 
                className={`w-12 ${item.color} transition-all duration-500 ease-out`}
                style={{ height: `${(item.value / maxValue) * 80}px` }}
              />
            </div>
            <div className='flex flex-col justify-center'>
              <span className="text-xs text-muted-foreground text-center">
                {item.name}
              </span>
              <span className='text-center text-xs'>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of employee distribution and upcoming schedules.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ isLoading ? "Loading.." : totalEmployees  }</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hybrid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ isLoading ? "Loading.." : hybridEmployees  }</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              On-site
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ isLoading ? "Loading.." : onsiteEmployees  }</div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Distribution</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By Department */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">By Department</CardTitle>
            </CardHeader>
            <CardContent>
              {renderBarChart(departmentData)}
            </CardContent>
          </Card>

          {/* By Work Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">By Work Type</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {renderColumnChart(workTypeData)}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Upcoming Schedule */}
        <div className="space-y-6 w-full">
          <h2 className="text-xl font-semibold">Upcoming Schedule</h2>
          
          <Card className="w-full ">
            <CardHeader>
              <div className="flex items-center justify-between">
                <button className="p-1 hover:bg-muted rounded">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-medium">{months[currentMonth]}, {currentYear}</h3>
                <button className="p-1 hover:bg-muted rounded">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1">
                  {daysOfWeek.map((day, index) => (
                    <div key={index} className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div key={index} className="h-8 flex items-center justify-center">
                      {day && (
                        <button 
                          className={`
                            h-8 w-8 rounded-full text-sm transition-colors
                            ${index === selectedDate 
                              ? 'bg-primary text-primary-foreground font-medium' 
                              : 'hover:bg-muted text-foreground'
                            }
                          `}
                        >
                          {day}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className='space-y-6 '>
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <Card className=''>
            <CardContent className="space-y-2">
                  <Link href={employeesPath()} className="block w-full rounded-lg border p-3 text-sm hover:bg-accent">
                    Employees
                  </Link>
                  <Link href={departmentsPath()} className="block w-full rounded-lg border p-3 text-sm hover:bg-accent">
                    Manage Departments
                  </Link>
                  <Link href={calendarPath()} className="block w-full rounded-lg border p-3 text-sm hover:bg-accent">
                    View Calendar
                  </Link>
                  <Link href={allocationsPath()} className="block w-full rounded-lg border p-3 text-sm hover:bg-accent">
                    View Allocations
                  </Link>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};
