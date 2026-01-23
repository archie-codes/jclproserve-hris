// "use client";

// import { useState } from "react";
// import { Menu, X } from "lucide-react";
// import Link from "next/link";

// export function MobileSidebar({ role }: { role: string }) {
//   const [open, setOpen] = useState(false);

//   const menu =
//     role === "admin"
//       ? [
//           { label: "Dashboard", href: "/dashboard" },
//           { label: "Employees", href: "/dashboard/employees" },
//           { label: "Reports", href: "/dashboard/reports" },
//         ]
//       : [
//           { label: "Dashboard", href: "/dashboard" },
//           { label: "Employees", href: "/dashboard/employees" },
//         ];

//   return (
//     <>
//       <button
//         onClick={() => setOpen(true)}
//         className="md:hidden"
//       >
//         <Menu className="h-5 w-5" />
//       </button>

//       {open && (
//         <div className="fixed inset-0 z-50 bg-black/40">
//           <aside className="absolute left-0 top-0 h-full w-64 bg-background p-6">
//             <button onClick={() => setOpen(false)}>
//               <X />
//             </button>

//             <nav className="mt-6 space-y-3">
//               {menu.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   onClick={() => setOpen(false)}
//                   className="block rounded px-3 py-2 hover:bg-gray-100"
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//             </nav>
//           </aside>
//         </div>
//       )}
//     </>
//   );
// }


"use client";

import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
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
        <Sidebar role={role} /> 
      </SheetContent>
    </Sheet>
  );
}