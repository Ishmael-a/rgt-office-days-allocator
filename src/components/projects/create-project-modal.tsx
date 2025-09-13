import { ErrorMessage, Formik, Form as FormikForm } from "formik"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { colorOptions } from "@/constants"
import { Loader2, Plus, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ProjectUpsertDTO, projectUpsertSchema } from "@/features/project/schema/project-schema"
import { useEmployeesQuery } from "@/hooks/use-employee"
import { useMemo } from "react"
import { EmployeeWithUserAndDepartment } from "@/features/employee/types"
import { useUpsertProjects } from "@/hooks/use-projects"

interface UpsertProjectModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: InitialProjectData
}

export type InitialProjectData = Partial<ProjectUpsertDTO> & {
    projectId?: string;
    members?: { label: string; value: string }[]; 
}


export default function UpsertProjectModal({ isOpen, onClose, initialData }: UpsertProjectModalProps) {
      const mode: "create" | "edit" = initialData?.projectId ? "edit" : "create"
      const mutation = useUpsertProjects() 
      
        const { data: employeesData } = useEmployeesQuery(
          {
            query: {
              withDepartment: true,
              withUser: true
            }
          }
        )
        const employees: EmployeeWithUserAndDepartment[] = useMemo(() => employeesData?.data.data.employees || [], [employeesData])

      
      const handleSubmit =  async (values: ProjectUpsertDTO) => {
          try{
              const finalValues: ProjectUpsertDTO = {
                ...values,
                projectId: initialData?.projectId ?? null
              }
              console.log("Submitting project:", finalValues)
              await mutation.mutateAsync(finalValues)
              onClose()
              
            } catch (err) {
                console.error("Failed to upsert project", err)
            }
        }
        
        const initialVals: ProjectUpsertDTO = {
            name: initialData?.name ?? "",
            description: initialData?.description ?? "",
            status: initialData?.status ?? true,
            color: initialData?.color ?? "",
            memberIds: initialData?.members?.map((m) => m.value) ?? [],
        }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{mode === 'edit' ? "Edit Project" : "Create New Project"}</DialogTitle>
              <DialogDescription>
                {mode === 'edit' 
                  ? "Update project details and team members."
                  : "Add a new project and assign team members."}
              </DialogDescription>
            </DialogHeader>
            <Formik
                initialValues={initialVals}
                validationSchema={projectUpsertSchema}
                onSubmit={handleSubmit}
            >
            {({ setFieldValue, values, getFieldProps }) =>
                <FormikForm className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-1">
                        <Label htmlFor="name">Project Name *</Label>
                        <Input
                            id="name"
                            {...getFieldProps("name")}
                        />
                        <ErrorMessage
                            name="name"
                            component="div"
                            className="text-red-500 text-sm"
                        />
                    </div>

                    <div className="space-y-2 col-span-1">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={values.status ? "true" : "false"}
                            onValueChange={(value) => setFieldValue("status", value === "true")}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={"true"}>Active</SelectItem>
                                <SelectItem value={"false"}>InActive</SelectItem>
                            </SelectContent>
                        </Select>
                        <ErrorMessage
                            name="status"
                            component="div"
                            className="text-red-500 text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        {...getFieldProps("description")}
                        rows={3}
                    />
                    <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Color Theme*</Label>
                    <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setFieldValue('color', color)}
                                className={`w-8 h-8 rounded-full border-2 ${
                                    values.color === color ? "border-gray-300" : "border-gray-900"
                                }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                    <ErrorMessage
                        name="color"
                        component="div"
                        className="text-red-500 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Selected Color</Label>
                    <div className="flex flex-wrap gap-2">
                        {values.color.trim() ? <button
                            key={values.color}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 ${
                                values.color.trim() ? "border-gray-300" : "border-gray-900"
                            }`}
                            style={{ backgroundColor: values.color }}
                        /> : <p className="text-sm">None</p>}
                    </div>
                </div>

                <div className="space-y-3">
                    <Label>Team Members ({values.memberIds?.length || 0} selected)</Label>
                    <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
                    {employees.map((employee) => (
                        <div key={employee.userId} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={`member-${employee.userId}`}
                                checked={values.memberIds?.includes(employee.userId)}
                                onChange={() => {
                                    const newMembers = values.memberIds?.includes(employee.userId) ? values.memberIds.filter((id) => id !== employee.userId) : [...(values.memberIds || []), employee.userId];
                                    setFieldValue("memberIds", newMembers);
                                }}
                                className="rounded"
                            />
                            <label htmlFor={`member-${employee.userId}`} className="flex-1 flex justify-between text-sm">
                                <span>{employee.user.name.toUpperCase()}</span>
                                <span>{employee.department?.name.toUpperCase() || "No Department"} </span> 
                            </label>
                        </div>
                    ))}
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
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
                        {mode === 'edit' ? "Update Project" : "Create Project"}
                    </Button>
                </div>
                </FormikForm>
            }
            </Formik>
          </DialogContent>
        </Dialog>
    )
} 