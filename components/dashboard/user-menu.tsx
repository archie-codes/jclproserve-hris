"use client";

import { useState } from "react";
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
import { LogOut, User, ShieldCheck, Mail, Settings } from "lucide-react";
import { LogoutButton } from "@/components/logout-button"; // Use your logout logic here if different
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface UserMenuProps {
  name: string;
  role: string;
  image?: string | null; // 👈 Add image to the interface
  email?: string | null;
}

export function UserMenu({ name, role, image, email }: UserMenuProps) {
  const [showProfile, setShowProfile] = useState(false);

  // Simple logout handler (adjust based on your auth system)
  const handleLogout = () => {
    // If using NextAuth: signOut();
    // If using custom auth: call your server action or delete cookie
    window.location.href = "/login";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none p-0"
          >
            <Avatar className="h-10 w-10 border border-border shadow-sm">
              {/* 👇 FIX: Render Image if available */}
              {image ? (
                <AvatarImage src={image} alt={name} className="object-cover" />
              ) : null}

              <AvatarFallback className="bg-primary/5 font-semibold text-primary">
                {name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
          <DropdownMenuLabel className="font-normal mb-2">
            <div className="flex flex-col space-y-2 bg-muted/40 p-3 rounded-md border border-border/50">
              <p className="text-sm font-semibold leading-none text-foreground">
                {name}
              </p>
              <p className="text-xs leading-none text-muted-foreground capitalize flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-primary" />
                {role.toLowerCase()}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            onSelect={() => setShowProfile(true)}
            className="cursor-pointer py-2.5 transition-all focus:bg-primary/10 focus:text-primary rounded-md"
          >
            <User className="mr-2 h-4 w-4" />
            <span className="font-medium">Profile Details</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-500/10 cursor-pointer py-2.5 flex items-center rounded-md transition-all gap-2"
            onClick={handleLogout}
          >
            <div className="flex items-center w-full">
              <div className="flex-1 font-medium">
                <LogoutButton />
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-2xl bg-background sm:rounded-2xl">
          <DialogTitle className="sr-only">Profile Information</DialogTitle>
          <DialogHeader className="sr-only">
            <DialogTitle>Profile Information</DialogTitle>
          </DialogHeader>

          {/* Cover gradient */}
          <div className="h-32 w-full bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
            {/* Optional decorative elements */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          </div>

          <div className="px-6 pb-8 pt-0 relative">
            {/* Avatar overlapping cover */}
            <div className="flex justify-center items-end -mt-12 mb-4">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl rounded-full bg-background z-10 transition-transform hover:scale-105 duration-300">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt={name}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="text-4xl bg-primary/10 font-bold text-primary">
                  {name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center justify-center space-y-1.5 mt-2 text-center">
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-bold text-2xl tracking-tight text-foreground">
                  {name}
                </h3>
                <ShieldCheck className="h-6 w-6 text-blue-500 drop-shadow-sm" />
              </div>
              <Badge
                variant="secondary"
                className="font-medium bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
              >
                {role.toUpperCase()}
              </Badge>
            </div>

            {/* Details Cards */}
            <div className="mt-7 space-y-3">
              <div className="group flex items-center gap-3 text-sm text-foreground bg-muted/40 hover:bg-muted/80 p-3.5 rounded-xl border border-border/40 transition-all cursor-default shadow-sm hover:shadow-md">
                <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium mb-0.5">
                    Email Address
                  </span>
                  <span className="font-medium text-sm truncate max-w-[200px]">
                    {email ||
                      `${name.toLowerCase().replace(/\s+/g, ".")}@jclproserve.com`}
                  </span>
                </div>
              </div>

              <div className="group flex items-center gap-3 text-sm text-foreground bg-muted/40 hover:bg-muted/80 p-3.5 rounded-xl border border-border/40 transition-all cursor-default shadow-sm hover:shadow-md">
                <div className="h-9 w-9 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-300">
                  <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium mb-0.5">
                    Account Details
                  </span>
                  <span className="font-medium text-sm">
                    Manage preferences & settings
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
