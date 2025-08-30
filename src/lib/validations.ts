import * as Yup from 'yup'

export const signInSchema = Yup.object({
    email: Yup
        .string()
        .min(1, "Email is required")
        .max(191, "Email is too long")
        .email("Invalid Email").required("Email is required"),
    password: Yup.string().min(6,"Password is too short").max(191).required("Password is required"),
})

export type SignInValues = Yup.InferType<typeof signInSchema>



export const signupSchema = Yup.object({
    username: Yup.string()
        .required("Username is required")
        .min(1, "Username is required")
        .max(191, "Username is too long")
        .matches(/^\S+$/, "Username cannot contain spaces"),
    email: Yup.string()
        .required("Email is required")
        .min(1, "Email is required")
        .max(191, "Email is too long")
        .email("Invalid email address"),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password is too short")
        .max(191, "Password is too long"),
    confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .min(6, "Password is too short")
        .max(191, "Password is too long")
        .oneOf([Yup.ref('password')], "Passwords do not match")
});

export type SignUpValues = Yup.InferType<typeof signupSchema>