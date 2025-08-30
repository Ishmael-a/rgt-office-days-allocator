import React from 'react'
import getAuthOrRedirect from '../_auth/get-auth-or-redirect';
import Navbar from '../_navigation/navbar';

const AuthenticatedLayout = async ({ children }:Readonly<{ children: React.ReactNode }>) => {
  await getAuthOrRedirect();

  return (
    <div>
      <Navbar/>
      <div className='mt-20 mx-30 min-h-screen flex-1 '>
        {children}
      </div>
    </div>
  )
}

export default AuthenticatedLayout
