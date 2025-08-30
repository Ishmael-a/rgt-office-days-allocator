'use client'

import { Input } from '@/components/ui/input';
import clsx from 'clsx';
import { LucideEye, LucideEyeClosed } from 'lucide-react';
import React, { useState } from 'react'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement>{
    id: string
}

const PasswordInput: React.FC<PasswordInputProps> = (props) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={passwordVisible ? "text" : "password"}
      />
      <div
        className=""
        onClick={() =>
          setPasswordVisible((prevPasswordVisible) => !prevPasswordVisible)
        }
      >
        <LucideEyeClosed
          className={clsx(
            "w-4 h-4 absolute top-2.5 right-3 text-muted-foreground duration-300 ease-in-out",
            {
              "scale-0": passwordVisible,
              "scale-100": !passwordVisible,
            }
          )}
        />
        <LucideEye
          className={clsx(
            "w-4 h-4 absolute top-2.5 right-3 text-muted-foreground duration-300 ease-in-out",
            {
              "scale-0": !passwordVisible,
              "scale-100": passwordVisible,
            }
          )}
        />
      </div>
    </div>
  );
};

export default PasswordInput
