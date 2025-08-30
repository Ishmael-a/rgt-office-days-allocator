import { SignInForm } from '@/components/auth/sign-in'
import { CardCompact } from '@/components/card-compact'
import Link from 'next/link'
import React from 'react'
import { signUpPath } from '../paths'

const page = () => {
  return (
    <div className="min-h-screen flex-1 flex flex-col items-center justify-center">
      <CardCompact
        title="Sign In"
        description="Sign In To Your Account"
        className="w-full text-center max-w-[420px] animate-fade-in-from-top"
        content={<SignInForm />}
        footer={
          <div>
            {/* <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo accounts:</p>
            <p>Admin: admin@company.com</p>
            <p>Manager: manager.eng@company.com</p>
            <p>Password: demo123 (for all accounts)</p>
            </div> */}
            <Link className="text-sm text-muted-foreground hover:underline" href={signUpPath()}>
              No account yet?
            </Link>
          </div>
        }
      />
    </div>
  )
}

export default page
