import React from 'react'
import { ThemeProvider as BaseThemeProvider, type ThemeProviderProps, } from 'next-themes'



const ThemeProvider:React.FC<ThemeProviderProps> = ({ children, ...props }) => {

  return (
    <BaseThemeProvider attribute={"class"} defaultTheme='system' enableSystem {...props}>
        {children}
    </BaseThemeProvider>
  )
}

export {ThemeProvider}
