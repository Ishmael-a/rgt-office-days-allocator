'use client'

import { Formik, Form as FormikForm, Field, ErrorMessage, FieldProps } from "formik"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSignIn } from '@/hooks/auth/use-sign-in'
import React from 'react'
import { signInSchema, SignInValues  } from "@/lib/validations"
import PasswordInput from "../common/password-input"

const initialVals:SignInValues = {
    email: "",
    password: "",
}

const SignInForm = () => {
  const { login, isPending } = useSignIn()

  const handleSubmit = async (values: SignInValues) => {
    try {
      await login(values)
    } catch (err) {
      console.error("An error occurred whilst Logging In. Please try again.", err)
    }
  }

  return (
    <Formik 
      initialValues={initialVals}
      validationSchema={signInSchema}
      onSubmit={handleSubmit}
    >
        <FormikForm  className="space-y-4">
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
            <Field name="password">
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

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </FormikForm>
    </Formik>
    
  )
}

export {SignInForm}
