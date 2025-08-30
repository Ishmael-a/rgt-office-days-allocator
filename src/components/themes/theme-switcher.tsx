'use client';

import { useTheme } from 'next-themes'
import React from 'react'
import { Button } from '../ui/button';
import { LucideMoon, LucideSun } from 'lucide-react';

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
  return (
    <Button
      variant={"outline"}
      size={"lg"}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className='flex gap-2'
    >
      <LucideSun
        className="
          h-4 w-4 
          rotate-0 scale-100 transition-transform 
          duration-300 ease-in-out 
          dark:scale-0 dark:-rotate-90"
      />
      <LucideMoon 
        className="
          absolute h-4 w-4 
          rotate-90 scale-0 transition-transform 
          dark:rotate-0 dark:scale-100 
          duration-300 ease-in-out" 
      />

      Toggle Theme
    </Button>
  );
}

export {ThemeSwitcher}
