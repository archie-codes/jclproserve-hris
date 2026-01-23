// import { UserMenu } from "@/components/dashboard/user-menu";
// import { ThemeToggle } from "@/components/theme-toggle";
// import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
// import {
//   Users,
//   Briefcase,
//   TrendingUp,
//   Clock,
//   Search,
//   Bell,
//   Settings,
// } from "lucide-react";
// import { Input } from "../ui/input";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";

// export function Topbar({ user }: { user: any }) {
//   return (
//     // <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
//     //   <div className="flex items-center gap-4">
//     //     <MobileSidebar role={user.role} />
//     //     <h1 className="font-semibold">Dashboard</h1>
//     //   </div>

//     //   <div className="flex items-center gap-3">
//     //     <ThemeToggle />
//     //     <UserMenu name={user.name} role={user.role} />
//     //   </div>
//     // </header>
//     <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
//       <div className="mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
//               <Users className="w-5 h-5 text-white" />
//             </div>
//             <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
//               HR Dashboard
//             </h1>
//           </div>

//           <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
//             <div className="relative w-full">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
//               <Input
//                 placeholder="Search employees, reports..."
//                 className="pl-10 bg-slate-50 dark:bg-slate-800 dark:text-white border-0 focus-visible:ring-1 focus-visible:ring-indigo-500 dark:placeholder:text-slate-500"
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <ThemeToggle />
//             <Button variant="ghost" size="icon" className="relative">
//               <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
//               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
//             </Button>
//             <div className="flex items-center gap-3">
//               <UserMenu name={user.name} role={user.role} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


"use client";

import { UserMenu } from "@/components/dashboard/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Topbar({ user }: { user: any }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 sm:px-6">
      
      {/* 1. Left Side: Mobile Menu & Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Trigger (Hidden on Desktop) */}
        <div className="md:hidden">
           <MobileSidebar role={user.role} />
        </div>

        {/* Title (Visible on Mobile mostly, or if you want context on Desktop) */}
        <h1 className="text-lg font-semibold tracking-tight md:hidden">
          HR System
        </h1>
      </div>

      {/* 2. Middle: Search Bar (Hidden on Mobile, centered/left on Desktop) */}
      <div className="hidden md:flex flex-1 items-center px-4 max-w-lg">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees..."
            className="w-full bg-slate-50 pl-9 dark:bg-slate-900/50 focus-visible:ring-blue-500"
          />
        </div>
      </div>

      {/* 3. Right Side: Actions */}
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Profile */}
        <div className="pl-2 border-l border-border">
          <UserMenu name={user.name} role={user.role} />
        </div>
      </div>
    </header>
  );
}
