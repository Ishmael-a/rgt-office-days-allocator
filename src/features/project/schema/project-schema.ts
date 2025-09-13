import * as yup from "yup"

export const projectUpsertSchema = yup.object({
  name: yup.string().required("Project name is required"),
  description: yup.string().optional(),
  projectId: yup.string().optional().nullable(),
  memberIds: yup.array().of(yup.string()).nullable(),
  status: yup.boolean().default(true),
  color: yup.string().matches(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color").required("Color is required"),
})

export type ProjectUpsertDTO = yup.InferType<typeof projectUpsertSchema>