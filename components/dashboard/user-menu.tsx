// "use client";

// import { useState } from "react";
// import { LogOut, User, Moon, Sun } from "lucide-react";
// import { LogoutButton } from "@/components/logout-button";

// export function UserMenu({
//   name,
//   role,
// }: {
//   name: string;
//   role: string;
// }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setOpen(!open)}
//         className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
//       >
//         <User className="h-4 w-4" />
//         {name}
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-48 rounded-md bg-background shadow-lg border z-50">
//           <div className="px-4 py-2 text-xs text-muted-foreground">
//             Role: {role}
//           </div>

//           <div className="border-t p-2">
//             <LogoutButton />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { 
  LogOut, 
  User, 
  Settings, 
  Moon, 
  Sun, 
  Laptop 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

interface UserMenuProps {
  name: string;
  role: string;
  image?: string; // Added optional image prop
}

export function UserMenu({ name, role, image }: UserMenuProps) {
  // Generate initials for avatar fallback (e.g., "John Doe" -> "JD")
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground capitalize">
              {role}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />

        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          {/* Using asChild allows your LogoutButton to take over styling */}
          <div className="w-full cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
             <LogoutButton />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
