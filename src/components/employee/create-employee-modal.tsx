"use client"

import { Formik, Form as FormikForm, ErrorMessage } from "formik"
import { useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Plus, Save } from "lucide-react"
import { EmployeeUpsertDTO, employeeUpsertSchema, USER_ROLES, WORK_TYPES } from "@/features/employee/schema/employee-schema"
import { useUpsertEmployee } from "@/hooks/use-employee"
import { useUsersQuery } from "@/hooks/use-users"
import { useDepartmentsQuery } from "@/hooks/use-department"

interface CreateEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: InitialData
}

export type InitialData = Partial<EmployeeUpsertDTO> & {
  previousDepartmentId?: string | null
}


export default function CreateEmployeeModal({ isOpen, onClose, initialData }: CreateEmployeeModalProps) {
  const { data: departments } = useDepartmentsQuery()
  const mutation = useUpsertEmployee()
  const mode: "create" | "edit" = initialData?.userId ? "edit" : "create"

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  const initialVals: EmployeeUpsertDTO = useMemo(
      () => ({
        userId: initialData?.userId ?? undefined,
        name: initialData?.name ?? "",
        email: initialData?.email ?? "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: (initialData?.role as any) ?? "EMPLOYEE",
        departmentId: initialData?.departmentId ?? "",
        previousDepartmentId: initialData?.previousDepartmentId ?? null,
        projectId: initialData?.projectId ?? null,
        // managerId: initialData?.managerId ?? null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        workType: (initialData?.workType as any) ?? "HYBRID",
        officeDays: initialData?.officeDays ?? 2,
        preferences: initialData?.preferences ?? [],
        isActive: initialData?.isActive ?? true,
      }),
      [initialData]
    )

  const handleSubmit = async (values: EmployeeUpsertDTO) => {
    try {
      const dept = departments?.data.data.find((dep) => dep.id === values.departmentId)
      const finalValues = {
        ...values,
        managerId: initialData?.managerId ?? dept?.managerId ?? null
      }

      console.log("Final Values", finalValues)
      await mutation.mutateAsync(finalValues)
      onClose()
    } catch (err) {
      console.error("Failed to upsert employee", err)
    }
  }




  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Employee" : "Edit Employee"}</DialogTitle>
        </DialogHeader>

        <Formik
          initialValues = {initialVals}
          validationSchema= {employeeUpsertSchema}
          onSubmit= {handleSubmit}
        >
         {({ setFieldValue, values, getFieldProps }) => (
        <FormikForm  className="space-y-4">
           {/* User fields (required only on CREATE) */}
          <div className="flex justify-between items-center gap-2">
            <div className={`w-full space-y-1 ${mode === "edit" ? "opacity-70" : ""}`}>
              <Label>Name</Label>
              <Input
                placeholder="Jane Doe"
                disabled={mode === "edit" && !values.name}
                {...getFieldProps("name")}
                className="w-full"
              />
              <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
              />
            </div>

            <div className={`w-full space-y-1  ${mode === "edit" ? "opacity-70" : ""}`}>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="jane@example.com"
                disabled={mode === "edit" && !values.email}
                {...getFieldProps("email")}
                className="w-full"
              />
              <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
              />
            </div>

          </div>

          <div className="flex justify-between items-center gap-2">

            <div className="w-full space-y-1 ">
              <Label>Role</Label>
              <Select
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={(values.role as any) || ""}
                onValueChange={(v) => setFieldValue("role", v)}
              >
                <SelectTrigger className={"w-full"}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorMessage
                  name="role"
                  component="div"
                  className="text-red-500 text-sm"
              />
            </div>


            {/* Department */}
            <div className="w-full space-y-1 ">
              <Label>Department</Label>
              <Select
                value={values.departmentId}
                onValueChange={(v) => setFieldValue("departmentId", v)}
              >
                <SelectTrigger className={"w-full"}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {(departments?.data.data ?? []).map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                <ErrorMessage
                    name="departmentId"
                    component="div"
                    className="text-red-500 text-sm"
                />
            </div>
          </div>

          {/* Work Type + Office Days */}
          <div className="flex justify-between items-center  gap-2">
            <div className="w-full space-y-1 ">
              <Label>Work Type</Label>
              <Select
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={values.workType as any}
                onValueChange={(v) => setFieldValue("workType", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent>
                  {WORK_TYPES.map((w) => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorMessage
                  name="workType"
                  component="div"
                  className="text-red-500 text-sm"
              />
            </div>

            <div className="w-full space-y-1 ">
              <Label>Office Days (per week)</Label>
              <Input type="number" min={0} max={5} {...getFieldProps("officeDays")} />
              <ErrorMessage
                  name="officeDays"
                  component="div"
                  className="text-red-500 text-sm"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-1">
            <Label>Preferred Days</Label>
            <div className="grid grid-cols-3 gap-2">
              {days.map((day) => {
                const checked = (values.preferences ?? []).includes(day)
                return (
                  <label key={day} className="flex items-center gap-2">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(c) => {
                        const list = new Set(values.preferences ?? [])
                        if (c) list.add(day)
                        else list.delete(day)
                        setFieldValue("preferences", Array.from(list))
                      }}
                    />
                    <span>{day}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Active */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={!!values.isActive}
              onCheckedChange={(c) => setFieldValue("isActive", Boolean(c))}
            />
            <Label>Active</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : mode === "create" ? (
                <Plus className="mr-2 h-4 w-4" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {mode === "create" ? "Create" : "Save changes"}
            </Button>
          </DialogFooter>
        </FormikForm>)}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
