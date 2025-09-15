'use client'

import { User as AuthUser } from "../../../generated/prisma";
import { LucideLogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/themes/theme-switcher";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { signInPath } from "../paths";
import { toast } from "sonner";

interface AccountDropdownProps {
  user: AuthUser;
}

const AccountDropdown = ({ user }: AccountDropdownProps) => {

  const handleSubmit = async () => {
    try {
      const response = await axios.get('api/auth/logout')
      if(response.status===200 || response.data.success){
        window.location.href =  signInPath();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("An error occurred whilst Loggin out. Please try again.", err)
      toast("Error Logging Out: "+err.message)
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
            <Button onClick={handleSubmit} className="flex gap-2 w-full">
              <LucideLogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { AccountDropdown };
