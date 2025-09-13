"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, RefreshCw, TrendingUp, Edit3, Settings, UserCheck } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeReassignment } from "./employee-reassignment"
import { EmployeePreferences } from "./employee-preferences"
import { useAllocationQuery, useGenerateAllocation } from "@/hooks/use-allocation"
import { AllocationWithEmployee } from "@/features/allocation/types"
import { DataTable, TableColumn } from "../common/data-table"

export function AllocationManager() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const { data: allocationData } =  useAllocationQuery({ month: selectedMonth, year: selectedYear})
  const allocations =useMemo(() => allocationData?.data.data || [], [allocationData])
  const [filteredAllocations, setFilteredAllocations] = useState(allocations)
  
  // const [statistics, setStatistics] = useState(null)
  const [currentAllocations] = useState([])
  const [activeTab, setActiveTab] = useState("generate")
  const { generateAllocation, isPending: isGenerating } = useGenerateAllocation()

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredAllocations(allocations);
      return;
    }

    const filtered:AllocationWithEmployee[] = allocations.filter((alloc:AllocationWithEmployee) =>
      alloc.employee.user.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredAllocations(filtered);
  };

  const columns: TableColumn<AllocationWithEmployee>[] = [
    {
      key: 'name',
      header: 'Name',
      accessor: (alloc) => alloc.employee.user.name,
      className: 'font-medium text-foreground'
    },
    {
      key: 'monday',
      header: 'Monday',
      accessor: (alloc) => <p className="text-center">{alloc.monday === true && "X"}</p>,
      className: 'text-muted-foreground'
    },
    {
      key: 'tuesday',
      header: 'Tuesday',
      accessor: (alloc) => <p className="text-center">{alloc.tuesday === true && "X"}</p>,
      className: 'text-muted-foreground'
    },
    {
      key: 'wednesday',
      header: 'Wednesday',
      accessor: (alloc) => <p className="text-center ">{alloc.wednesday === true && "X"}</p>,
      className: 'text-muted-foreground'
    },
    {
      key: 'thursday',
      header: 'Thursday',
      accessor: (alloc) => <p className="text-center">{alloc.thursday === true && "X"}</p>,
      className: 'text-muted-foreground'
    },
    {
      key: 'friday',
      header: 'Friday',
      accessor: (alloc) => <p className="text-center">{alloc.friday === true && "X"}</p>,
      className: 'text-muted-foreground'
    }
  ];

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ]

  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear + 1, currentYear + 2]



  const handleGenerateAllocations = async () => {
    try {
      await generateAllocation({ month: selectedMonth, year: selectedYear})
    } catch (error) {
      console.log("An error occurred while generating allocations", error)
    } 
  }

  const handleReassignmentComplete = () => {
    // fetchAllocations()
    toast("Employee schedule updated and system reshuffled")
  }

  useEffect(() => {
    setFilteredAllocations(allocations);
  }, [allocations]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="reassign" className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Reassign
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Generate Monthly Allocation
              </CardTitle>
              <CardDescription>
                Automatically generate office days allocation for all employees based on their work type and project
                collaborations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Month</label>
                  <Select
                    value={selectedMonth.toString()}
                    onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Year</label>
                  <Select
                    value={selectedYear.toString()}
                    onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  The algorithm ensures no consecutive office days, optimizes for project team collaboration, and
                  maintains fair distribution across departments.
                </AlertDescription>
              </Alert>

              <Button onClick={handleGenerateAllocations} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Allocations...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Generate Allocations for {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* {statistics && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics?.totalEmployees||0}</div>
                  <p className="text-xs text-muted-foreground">Allocated employees</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Working Days</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.totalWorkingDays}</div>
                  <p className="text-xs text-muted-foreground">Days in month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Office Days</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.totalOfficeDays}</div>
                  <p className="text-xs text-muted-foreground">Allocated office days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average per Employee</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.averageOfficeDaysPerEmployee.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Days per employee</p>
                </CardContent>
              </Card>
            </div>
          )} */}

          {/* {statistics?.departmentDistribution && (
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Office days allocated by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(statistics.departmentDistribution).map(([dept, days]) => (
                    <div key={dept} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{dept}</span>
                      <Badge variant="secondary">{days} days</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )} */}
        </TabsContent>

        <TabsContent value="reassign" className="space-y-6">
          <EmployeeReassignment
            month={selectedMonth}
            year={selectedYear}
            allocations={currentAllocations}
            onReassignmentComplete={handleReassignmentComplete}
          />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <EmployeePreferences month={selectedMonth} year={selectedYear} />
        </TabsContent>

        <TabsContent value="overview" className="">
            <DataTable
              data={filteredAllocations}
              columns={columns}
              searchable
              searchPlaceholder="Search employee allocation"
              onSearch={handleSearch}
              className="p-6"
              showCount={true}
            />
        </TabsContent>
      </Tabs>
    </div>
  )
}
