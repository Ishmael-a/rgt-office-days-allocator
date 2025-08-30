import Link from 'next/link'
import React from 'react'
import { CardCompact } from '@/components/card-compact'
import { SignUpForm } from '@/components/auth/sign-up'
import { signInPath,  } from '../paths'

const page = () => {
  return (
    <div className="min-h-screen flex-1 flex flex-col items-center justify-center">
      <CardCompact
        title="Sign Up"
        description="Register Your Account"
        className="w-full text-center max-w-md animate-fade-in-from-top"
        content={<SignUpForm />}
        footer={
          <>
            <Link className="text-sm text-muted-foreground hover:underline" href={signInPath()}>
              Already Have An Account?
            </Link>
          </>
        }
      />
    </div>
  )
}

export default page
