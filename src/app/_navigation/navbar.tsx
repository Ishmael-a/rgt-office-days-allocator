'use client'

import { LucideKanban } from 'lucide-react';
import React from 'react'
import { dashboardPath, signInPath, signUpPath } from '../paths';
import { buttonVariants } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/use-auth';
import { AccountDropdown } from './account-dropdown';
import { navItems as navbarItems } from '@/constants';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const { user, isFetched } = useAuth();
  const pathname = usePathname();

  if (!isFetched) {
    return null;
  }

  const navItems = user ? (
    <div className='flex items-center gap-8'>
      <nav className="flex space-x-12">
        {navbarItems.map((navItem, index) => (
          <Link key={index} href={navItem.href} className={`${pathname === navItem.href 
                ? 'text-primary font-semibold' 
                : 'text-muted-foreground'
          }`}>{navItem.title}</Link>
        ))}
      </nav>
      <AccountDropdown user={user} />
    </div>
  ) : (
    <>
      <Link
        href={signUpPath()}
        className={buttonVariants({ variant: "outline" })}
      >
        Sign Up
      </Link>
      <Link
        href={signInPath()}
        className={buttonVariants({ variant: "default" })}
      >
        Sign In
      </Link>
    </>
  );
  
  return (
    <nav
      className="
          animate-header-from-top
          animate-header-from-top
          supports-backdrop-blur:bg-background/60
          fixed left-0 right-0 top-0 z-20
          bg-background/95 backdrop-blur
          w-full flex justify-between py-2.5 px-5 border-b
        "
    >
      <div>
        <Link
          href={dashboardPath()}
          className={buttonVariants({ variant: "ghost" })}
        >
          <LucideKanban />
          <h2 className=" text-lg font-semibold">R.O.D.A</h2>
        </Link>
      </div>
      <div className="flex align-items gap-x-2">
        {/* <ThemeSwitcher /> */}
        {navItems}
      </div>
    </nav>
  )
}

export default Navbar
