import * as yup from "yup"

export const departmentUpsertSchema = yup.object({
  name: yup.string().required("Department name is required"),
  description: yup.string().optional(),
  managerId: yup.string().optional().nullable(),
  departmentId: yup.string().optional().nullable(),
  color: yup.string().matches(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color").required("Color is required"),
})

export type DepartmentUpsertDTO = yup.InferType<typeof departmentUpsertSchema>