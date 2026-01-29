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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { LogoutButton } from "@/components/logout-button"; // Use your logout logic here if different

interface UserMenuProps {
  name: string;
  role: string;
  image?: string | null; // 👈 Add image to the interface
}

export function UserMenu({ name, role, image }: UserMenuProps) {
  
  // Simple logout handler (adjust based on your auth system)
  const handleLogout = () => {
    // If using NextAuth: signOut();
    // If using custom auth: call your server action or delete cookie
    window.location.href = "/login"; 
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 border border-muted">
            {/* 👇 FIX: Render Image if available */}
            {image ? (
              <AvatarImage src={image} alt={name} className="object-cover" />
            ) : null}
            
            <AvatarFallback className="bg-primary/10 font-bold text-primary">
              {name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground capitalize">
              {role.toLowerCase()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}