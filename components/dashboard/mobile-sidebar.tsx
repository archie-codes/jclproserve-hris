"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MobileSidebar({ role }: { role: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 w-72">
        {/* ✅ FIX: Add hidden Header & Title to satisfy accessibility rules */}
        <SheetHeader className="sr-only">
          <SheetTitle>Mobile Menu</SheetTitle>
          <SheetDescription>
            Navigation menu for mobile devices
          </SheetDescription>
        </SheetHeader>

        {/* Your existing Sidebar component */}
        <Sidebar role={role} isMobile={true} onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
