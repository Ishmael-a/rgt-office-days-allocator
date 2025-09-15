import { requireRole } from '@/app/_auth/require-role';
import { UserRole } from '@/types';
import React from 'react'

const Layout = async ({ children }:Readonly<{ children: React.ReactNode }>) => {
  await requireRole([UserRole.ADMIN]);

  return (
    <div>
        {children}
    </div>
  )
}

export default Layout
