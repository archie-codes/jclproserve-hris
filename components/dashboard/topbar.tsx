// "use client";

// import { UserMenu } from "@/components/dashboard/user-menu";
// import { ThemeToggle } from "@/components/theme-toggle";
// import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
// import { Search, Bell } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export function Topbar({ user }: { user: any }) {
//   return (
//     <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 sm:px-6">

//       {/* 1. Left Side: Mobile Menu & Title */}
//       <div className="flex items-center gap-4">
//         <div className="md:hidden">
//            <MobileSidebar role={user.role} />
//         </div>
//         <h1 className="text-lg font-semibold tracking-tight md:hidden">
//           HR System
//         </h1>
//       </div>

//       {/* 2. Middle: Search Bar */}
//       <div className="hidden md:flex flex-1 items-center px-4 max-w-lg">
//         <div className="relative w-full">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Search employees..."
//             className="w-full bg-slate-50 pl-9 dark:bg-slate-900/50 focus-visible:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* 3. Right Side: Actions */}
//       <div className="ml-auto flex items-center gap-2 sm:gap-4">
//         <ThemeToggle />

//         <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
//           <Bell className="h-5 w-5" />
//           <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
//           <span className="sr-only">Notifications</span>
//         </Button>

//         {/* User Profile */}
//         <div className="pl-2 border-l border-border">
//           {/* 👇 FIX: Pass the 'image' prop here */}
//           <UserMenu
//             name={user.name}
//             role={user.role}
//             image={user.image}
//           />
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import { UserMenu } from "@/components/dashboard/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { Search, Bell, Command } from "lucide-react"; // Added Command icon
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Topbar({ user }: { user: any }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-border/40 bg-background/80 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/60 sm:px-6 transition-all duration-300">
      {/* 1. Left Side: Mobile Menu & Branding */}
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <MobileSidebar role={user.role} />
        </div>

        {/* Mobile Logo Text */}
        <div className="md:hidden flex flex-col">
          <h1 className="text-sm font-bold tracking-tight leading-none">
            JC&L
          </h1>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            HRIS
          </span>
        </div>
      </div>

      {/* 2. Middle: Search Bar (Modern "Command Center" look) */}
      <div className="hidden md:flex flex-1 items-center px-4 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
          <Input
            type="search"
            placeholder="Search employees, payroll, or records..."
            className="w-full h-10 rounded-full bg-slate-100/50 dark:bg-slate-900/50 pl-10 pr-12 border-transparent focus:border-indigo-500/50 focus:bg-background focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 placeholder:text-muted-foreground/70"
          />
          {/* Visual Keyboard Hint */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 pointer-events-none">
            <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* 3. Right Side: Actions */}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        {/* Notification Bell with Pulse */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Profile Divider */}
        <div className="pl-3 ml-1 border-l border-border/60 h-6 flex items-center">
          <UserMenu name={user.name} role={user.role} image={user.image} />
        </div>
      </div>
    </header>
  );
}
