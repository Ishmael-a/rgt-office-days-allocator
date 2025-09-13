import { ErrorMessage, Formik, Form as FormikForm } from "formik"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { DepartmentUpsertDTO, departmentUpsertSchema } from "@/features/department/schema/department-schema"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { colorOptions } from "@/constants"
import { useUpsertDepartment } from "@/hooks/use-department"
import { Loader2, Plus, Save } from "lucide-react"

interface UpsertDepartmentModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: InitialDepartmentData
}

export type InitialDepartmentData = Partial<DepartmentUpsertDTO> & {
    departmentId?: string
}


export default function UpsertDepartmentModal({ isOpen, onClose, initialData }: UpsertDepartmentModalProps) {
      const mutation = useUpsertDepartment() 
      const mode: "create" | "edit" = initialData?.departmentId ? "edit" : "create"

      
      const handleSubmit =  async (values: DepartmentUpsertDTO) => {
          try{
              const finalValues: DepartmentUpsertDTO = {
                ...values,
                departmentId: initialData?.departmentId ?? null
              }
              console.log("Submitting department:", finalValues)
              await mutation.mutateAsync(finalValues)
              onClose()
              
            } catch (err) {
                console.error("Failed to upsert department", err)
            }
        }
        
        const initialVals: DepartmentUpsertDTO = {
            name: initialData?.name ?? "",
            description: initialData?.description ?? "",
            color: initialData?.color ?? "",
            managerId: initialData?.managerId ?? null,
        }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>{mode === 'edit' ? "Edit Department" : "Create New Department"}</DialogTitle>
                <DialogDescription>
                {mode === 'edit' ? "Update department information." : "Add a new department to organize your teams."}
                </DialogDescription>
            </DialogHeader>
            <Formik
                initialValues={initialVals}
                validationSchema={departmentUpsertSchema}
                onSubmit={handleSubmit}
            >
            {({ setFieldValue, values, getFieldProps }) => 
                <FormikForm className="space-y-4 overflow-y-auto">
                    <div className="space-y-2">
                        <Label htmlFor="name">Department Name *</Label>
                        <Input
                            {...getFieldProps("name")}
                            placeholder="Enter department name"
                        />
                        <ErrorMessage
                            name="name"
                            component="div"
                            className="text-red-500 text-sm"
                        />
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
                        {mode === 'edit' ? "Update Department" : "Create Department"}</Button>
                    </div>
                </FormikForm>
            }
            </Formik>
            </DialogContent>
        </Dialog>
    )
} 