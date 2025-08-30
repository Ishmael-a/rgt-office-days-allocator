import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ChartType = { name: string, value: number, color: string }[]

const page = () => {
  // Sample data for the charts - in a real app, this would come from props or API
  const departmentData = [
    { name: 'Engineering', value: 45, color: 'bg-slate-800 dark:bg-slate-300' },
    { name: 'Marketing', value: 25, color: 'bg-slate-600 dark:bg-slate-400' },
    { name: 'Sales', value: 15, color: 'bg-slate-400 dark:bg-slate-500' },
    { name: 'HR', value: 15, color: 'bg-slate-300 dark:bg-slate-600' }
  ];

  const workTypeData = [
    { name: 'Hybrid', value: 48, color: 'bg-slate-300 dark:bg-slate-600' },
    { name: 'On-site', value: 32, color: 'bg-slate-400 dark:bg-slate-500' },
    { name: 'Remote', value: 20, color: 'bg-slate-500 dark:bg-slate-400' }
  ];

  // Calendar data
  // const currentDate = new Date();
  const currentMonth = 'October 2024'; // Based on the image
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Calendar grid for October 2024
  const calendarDays = [
    null, null, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31
  ];

  const selectedDate = 5; // Highlighted date from the image

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
                  className={`h-full ${item.color} transition-all duration-500 ease-out`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
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
            <span className="text-xs text-muted-foreground text-center">
              {item.name}
            </span>
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
            <div className="text-3xl font-bold">250</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hybrid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">120</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              On-site
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">80</div>
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

      {/* Upcoming Schedule */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Upcoming Schedule</h2>
        
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <button className="p-1 hover:bg-muted rounded">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-medium">{currentMonth}</h3>
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
                          ${day === selectedDate 
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
    </div>
  );
};

export default page;