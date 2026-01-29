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
        <div className="md:hidden">
           <MobileSidebar role={user.role} />
        </div>
        <h1 className="text-lg font-semibold tracking-tight md:hidden">
          HR System
        </h1>
      </div>

      {/* 2. Middle: Search Bar */}
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
        <ThemeToggle />

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Profile */}
        <div className="pl-2 border-l border-border">
          {/* 👇 FIX: Pass the 'image' prop here */}
          <UserMenu 
            name={user.name} 
            role={user.role} 
            image={user.image} 
          />
        </div>
      </div>
    </header>
  );
}