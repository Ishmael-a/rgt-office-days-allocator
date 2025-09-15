'use client'

import { SignInForm } from '@/components/auth/sign-in'
import { CardCompact } from '@/components/card-compact'
import Link from 'next/link'
import React, { useState } from 'react'
import { signUpPath } from '../paths'
import { Card, CardAction, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ROLE_CREDENTIALS } from '@/constants'



const Page = () => {
  const [formCredentials, setFormCredentials] = useState<{
    email?: string,
    password?: string
  }>({})

  const handleUseCredentials = (role: keyof typeof ROLE_CREDENTIALS) => {
    setFormCredentials({
      email: ROLE_CREDENTIALS[role],
      password: process.env.NEXT_PUBLIC_DEFAULT_PASSWORD
    })
  }
  return (
    <div className="min-h-screen flex-1 flex flex-col items-center gap-4 justify-center">
      <CardCompact
        title="Sign In"
        description="Sign In To Your Account"
        className="w-full text-center max-w-[420px] animate-fade-in-from-top"
        content={<SignInForm email={formCredentials.email} password={formCredentials.password}/>}
        footer={
          <div>
            <Link className="text-sm text-muted-foreground hover:underline" href={signUpPath()}>
              No account yet?
            </Link>
          </div>
        }
      />
      <div className='flex flex-col gap-2 min-w-[420px]'>
        <Card className='w-full px-2 py-2.5'>
          <CardHeader className='flex justify-between items-center w-full'>
            <CardDescription>
              ADMIN
            </CardDescription>
            <CardAction>
              <Button variant={"default"} size={"sm"} className='rounded-lg text-xs' onClick={() => handleUseCredentials("ADMIN")}>Use</Button>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className='w-full px-2 py-2.5'>
          <CardHeader className='flex justify-between items-center w-full'>
            <CardDescription>
              MANAGER
            </CardDescription>
            <CardAction>
              <Button variant={"default"} size={"sm"} className='rounded-lg text-xs' onClick={() => handleUseCredentials("MANAGER")}>Use</Button>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className='w-full px-2 py-2.5'>
          <CardHeader className='flex justify-between items-center w-full'>
            <CardDescription>
              EMPLOYEE
            </CardDescription>
            <CardAction>
              <Button variant={"default"} size={"sm"} className='rounded-lg text-xs' onClick={() => handleUseCredentials("EMPLOYEE")}>Use</Button>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default Page
