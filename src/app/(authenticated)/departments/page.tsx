"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Building2 } from "lucide-react"
import { toast } from "sonner"
import { useDepartmentsQuery } from "@/hooks/use-department"
import { useEmployeesQuery } from "@/hooks/use-employee"
import { useProjectsQuery } from "@/hooks/use-projects"
import { Department } from "@/features/department/types"
import UpsertDepartmentModal, { InitialDepartmentData } from "@/components/departments/create-department-modal"

export default function DepartmentsPage() {
    const { data: departmentData } = useDepartmentsQuery({
        query: {
            withEmployees: true
        }
    })
    const departments = useMemo(() => departmentData?.data.data || [], [departmentData])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [initialData, setInitialData] = useState<InitialDepartmentData|undefined>(undefined)
  
    const handleClose = () =>{
      if(initialData){
        setInitialData(undefined)
      } 
      setIsDialogOpen(false)
    }

    const handleEdit = (department: Department) => {
      const initData: InitialDepartmentData = {
        departmentId: department.id,
        name: department.name,
        description: department.description || undefined,
        color: department.color || undefined,
        managerId: department.managerId || undefined
      }
      setInitialData(initData);
      setIsDialogOpen(true)
    }

    const handleDelete = () => {
      // const employeeCount = employees.filter((emp) => emp.department?.id === departmentId).length
      // const projectCount = projects.filter((proj) => proj.department?.id === departmentId).length

      // if (employeeCount > 0 || projectCount > 0) {
      //   toast(`Department has ${employeeCount} employees and ${projectCount} projects. Please reassign them first.`)
      //   return
      // }

      // setDepartments((prev) => prev.filter((d) => d.id !== departmentId))
      toast("Department deleted successfully")
    }

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Departments Management</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => {
          return (
            <Card key={department.id} className="gap-2.5">
              <CardHeader className="">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: department.color || "#1f2937" }}
                      />
                      {department.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Department
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2.5">
                {department.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{department.description}</p>
                )}

                <div className="flex justify-between items-center text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-blue-600">{department._count.employees}</div>
                    <div className="text-xs text-muted-foreground">Employees</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold ">{department.manager?.name}</div>
                    <div className="text-xs text-muted-foreground">Manager(s)</div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(department)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <UpsertDepartmentModal initialData={initialData} isOpen={isDialogOpen} onClose={handleClose}/>
    </div>
  )
}
