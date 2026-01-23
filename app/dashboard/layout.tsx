// import Link from "next/link";
// import {
//   Bell,
//   CircleUser,
//   Home,
//   LineChart,
//   Menu,
//   Package,
//   Package2,
//   Search,
//   ShoppingCart,
//   Users,
//   Settings,
//   Briefcase,
//   Calendar,
//   FileText
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
//       {/* DESKTOP SIDEBAR */}
//       <div className="hidden border-r bg-muted/40 md:block">
//         <div className="flex h-full max-h-screen flex-col gap-2">
//           <div className="flex h-14 items-center border-b px-4 lg:h-15 lg:px-6">
//             <Link href="/" className="flex items-center gap-2 font-semibold">
//               <img src="/jcl-logo.svg" alt="Logo" className="h-6 w-auto" />
//               <span className="">JC&L Proserve</span>
//             </Link>
//             <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
//               <Bell className="h-4 w-4" />
//               <span className="sr-only">Toggle notifications</span>
//             </Button>
//           </div>
//           <div className="flex-1">
//             <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
//               <Link
//                 href="/dashboard"
//                 className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
//               >
//                 <Home className="h-4 w-4" />
//                 Dashboard
//               </Link>
//               <Link
//                 href="#"
//                 className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
//               >
//                 <Users className="h-4 w-4" />
//                 Employees
//               </Link>
//               <Link
//                 href="#"
//                 className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
//               >
//                 <Briefcase className="h-4 w-4" />
//                 Jobs & Projects
//               </Link>
//               <Link
//                 href="#"
//                 className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
//               >
//                 <Calendar className="h-4 w-4" />
//                 Attendance
//               </Link>
//               <Link
//                 href="#"
//                 className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
//               >
//                 <FileText className="h-4 w-4" />
//                 Payroll
//               </Link>
//               <Link
//                 href="#"
//                 className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
//               >
//                 <Settings className="h-4 w-4" />
//                 Settings
//               </Link>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div className="flex flex-col">
//         <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-15 lg:px-6">
//           {/* MOBILE MENU TRIGGER */}
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="shrink-0 md:hidden"
//               >
//                 <Menu className="h-5 w-5" />
//                 <span className="sr-only">Toggle navigation menu</span>
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left" className="flex flex-col">
//               <nav className="grid gap-2 text-lg font-medium">
//                 <Link
//                   href="#"
//                   className="flex items-center gap-2 text-lg font-semibold"
//                 >
//                   <img src="/jcl-logo.svg" alt="Logo" className="h-8 w-auto mb-4" />
//                 </Link>
//                 <Link
//                   href="#"
//                   className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground"
//                 >
//                   <Home className="h-5 w-5" />
//                   Dashboard
//                 </Link>
//                 <Link
//                   href="#"
//                   className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
//                 >
//                   <Users className="h-5 w-5" />
//                   Employees
//                 </Link>
//               </nav>
//             </SheetContent>
//           </Sheet>

//           {/* SEARCH BAR */}
//           <div className="w-full flex-1">
//             <form>
//               <div className="relative">
//                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   type="search"
//                   placeholder="Search employees..."
//                   className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
//                 />
//               </div>
//             </form>
//           </div>

//           {/* USER DROPDOWN */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="secondary" size="icon" className="rounded-full">
//                 <Avatar className="h-8 w-8">
//                     <AvatarImage src="/avatars/01.png" alt="@juan" />
//                     <AvatarFallback>JC</AvatarFallback>
//                 </Avatar>
//                 <span className="sr-only">Toggle user menu</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>My Account</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Profile</DropdownMenuItem>
//               <DropdownMenuItem>Settings</DropdownMenuItem>
//               <DropdownMenuItem>Support</DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Logout</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </header>
        
//         {/* PAGE CONTENT INJECTED HERE */}
//         <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// import { redirect } from "next/navigation";
// import { getCurrentUser } from "@/lib/auth";
// import { Sidebar } from "@/components/dashboard/sidebar";
// import { Topbar } from "@/components/dashboard/topbar";

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const user = await getCurrentUser();

//   if (!user) {
//     redirect("/login");
//   }

//   return (
//     <div className="flex h-screen bg-background text-foreground">
//       <Sidebar role={user.role} />

//       <div className="flex flex-1 flex-col">
//         <Topbar user={user} />
//         <main className="flex-1 overflow-y-auto p-6">{children}</main>
//       </div>
//     </div>
//   );
// }


import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      
      {/* 🔴 FIX: Wrapped Sidebar in a div that is HIDDEN on mobile (hidden) and SHOWN on desktop (md:block) */}
      <div className="hidden md:block w-64 shrink-0">
         <Sidebar role={user.role} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {children}
        </main>
      </div>
    </div>
  );
}