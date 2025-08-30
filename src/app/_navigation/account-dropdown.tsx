'use client'

import { User as AuthUser } from "../../../generated/prisma";
import { LucideLogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/themes/theme-switcher";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import axios from "axios";

interface AccountDropdownProps {
  user: AuthUser;
}

const AccountDropdown = ({ user }: AccountDropdownProps) => {

  const handleSubmit = async () => {
    try {
      await axios.get('api/auth/logout')
    } catch (err) {
      console.error("An error occurred whilst Loggin out. Please try again.", err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem >
            <ThemeSwitcher />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
            <Button onClick={handleSubmit} className="flex gap-2">
              <LucideLogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { AccountDropdown };
