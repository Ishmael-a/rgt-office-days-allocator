'use client'

import { Formik, Form as FormikForm, Field, ErrorMessage, FieldProps } from "formik"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSignUp } from '@/hooks/auth/use-sign-up'
import React from 'react'
import PasswordInput from '../common/password-input'
import { SignUpValues,signupSchema } from "@/lib/validations"

const initialVals:SignUpValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
}

const SignUpForm = () => {
  const { signup, isPending } = useSignUp()

  const handleSubmit = async (values: SignUpValues) => {
    try {
        const signupDto = {
            email: values.email,
            password: values.password,
            username: values.username
        }
      await signup(signupDto)
    } catch (err) {
      console.error("An error occurred whilst Signing Up. Please try again.", err)
    }
  }

  return (
    <Formik 
        initialValues={initialVals}
        validationSchema={signupSchema}
        onSubmit={handleSubmit}
    >
        <FormikForm  className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Field 
              name="username"
              placeholder="Enter your username"
              as={Input}
            />
            <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Field
              name="email"
              placeholder="Enter your email"
              as={Input}
            />
            <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Field name={"password"}>
            {({field}:FieldProps) => (             
                <PasswordInput
                id="password"
                {...field}
                />
            )}
            </Field>
            <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Password</Label>
            <Field name="confirmPassword">
            {({field}:FieldProps) => (             
                <PasswordInput
                id="confirmPassword"
                {...field}
                />
            )}
            </Field>
            <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing up..." : "Sign Up"}
          </Button>
        </FormikForm>
    </Formik>
  )
}

export {SignUpForm}
