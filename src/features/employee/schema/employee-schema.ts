import * as yup from "yup"


export const USER_ROLES = ["ADMIN", "MANAGER", "EMPLOYEE"] as const
export type UserRole = (typeof USER_ROLES)[number]

export const WORK_TYPES = ["HYBRID", "ONSITE", "REMOTE"] as const
export type WorkType = (typeof WORK_TYPES)[number]

export const employeeUpsertSchema = yup.object({
  userId: yup.string().optional().nullable(),

  name: yup.string().when("userId", {
    is: (v: string | null | undefined) => !v,
    then: (s) => s.required("Name is required"),
    otherwise: (s) => s.optional(),
  }),
  email: yup
    .string()
    .email("Invalid email")
    .when("userId", {
      is: (v: string | null | undefined) => !v,
      then: (s) => s.required("Email is required"),
      otherwise: (s) => s.optional(),
    }),
  role: yup
    .mixed<UserRole>()
    .oneOf(USER_ROLES as unknown as UserRole[])
    .when("userId", {
      is: (v: string | null | undefined) => !v,
      then: (s) => s.required("Role is required"),
      otherwise: (s) => s.optional(),
    }),

  departmentId: yup.string().required("Department ID is required"),

  // If you're updating and moving the employee between departments,
  // include the previousDepartmentId (the one the record is currently under)
  previousDepartmentId: yup.string().optional().nullable(),

  projectId: yup.string().optional().nullable(),
  managerId: yup.string().optional().nullable(),

  workType: yup
    .mixed<WorkType>()
    .oneOf(WORK_TYPES as unknown as WorkType[])
    .required("Work type is required"),

  officeDays: yup
    .number()
    .min(0, "Office days cannot be negative")
    .max(5, "Office days cannot exceed 5")
    .required("Office days are required"),

  preferences: yup
    .array()
    .of(yup.string())
    .transform((arr) => {
        if (!arr || arr.length === 0) return null;
        return arr.filter((v: string|undefined) => v !== undefined) 
    })
    .optional()
    .nullable(),

  isActive: yup.boolean().default(true),
})

export type EmployeeUpsertDTO = yup.InferType<typeof employeeUpsertSchema>