// "use client";

// import Link from "next/link";
// import {
//   LayoutDashboard,
//   Users,
//   FileText,
//   Settings,
// } from "lucide-react";

// const adminMenu = [
//   { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { label: "Employees", href: "/dashboard/employees", icon: Users },
//   { label: "Reports", href: "/dashboard/reports", icon: FileText },
//   { label: "Settings", href: "/dashboard/settings", icon: Settings },
//   { label: "Users", href: "/dashboard/users", icon: Users },
// ];

// const hrMenu = [
//   { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { label: "Employees", href: "/dashboard/employees", icon: Users },
// ];

// export function Sidebar({ role }: { role: any }) {

//   const menu = role === "ADMIN" ? adminMenu : hrMenu;
//   return (
//     <aside className="w-64 bg-background border-r hidden md:block">
//       <div className="p-6 text-2xl font-bold">HR System</div>

//       <nav className="px-4 space-y-2">
//         {menu.map((item) => (
//           <Link
//             key={item.href}
//             href={item.href}
//             className="flex items-center gap-3 rounded-md px-3 py-2 text-sm"
//           >
//             <item.icon className="h-4 w-4" />
//             {item.label}
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   );
// }


// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils"; // Ensure you have this helper, or just use string interpolation
// import {
//   LayoutDashboard,
//   Users,
//   FileText,
//   Settings,
//   ShieldCheck,
//   Briefcase,
//   LogOut,
//   UserCircle
// } from "lucide-react";

// const adminMenu = [
//   { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { label: "Employees", href: "/dashboard/employees", icon: Users }, // Manpower
//   { label: "Reports", href: "/dashboard/reports", icon: FileText },
//   { label: "System Users", href: "/dashboard/users", icon: ShieldCheck }, // Admins/HR
//   { label: "Settings", href: "/dashboard/settings", icon: Settings },
// ];

// const hrMenu = [
//   { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { label: "Employees", href: "/dashboard/employees", icon: Users },
//   { label: "Reports", href: "/dashboard/reports", icon: FileText },
// ];

// export function Sidebar({ role }: { role: "ADMIN" | "HR" }) {
//   const pathname = usePathname();
//   const menu = role === "ADMIN" ? adminMenu : hrMenu;

//   return (
//     <aside className="w-64 flex-col h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-colors duration-300 hidden md:flex">
      
//       {/* 1. Header Area */}
//       <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
//         <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
//         <span className="text-lg font-bold text-gray-900 dark:text-gray-50 tracking-tight">
//           JC&L HRIS
//         </span>
//       </div>

//       {/* 2. Navigation Items */}
//       <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
//         <div className="px-3 mb-2">
//           <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
//             Main Menu
//           </p>
//         </div>
        
//         {menu.map((item) => {
//           const isActive = pathname === item.href;
          
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={cn(
//                 "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                 isActive 
//                   ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" 
//                   : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
//               )}
//             >
//               <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400")} />
//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* 3. Footer / User Info */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-800">
//         <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
//           <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900">
//              <UserCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
//               {role === "ADMIN" ? "Administrator" : "HR Staff"}
//             </p>
//             <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
//               View Profile
//             </p>
//           </div>
//           {/* Optional Logout Icon could go here */}
//         </div>
//       </div>
//     </aside>
//   );
// }

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import {
//   LayoutDashboard,
//   Users,
//   FileText,
//   Settings,
//   ShieldCheck,
//   Briefcase,
//   UserCircle,
//   Clock // Added Clock icon for staff attendance later
// } from "lucide-react";

// // 1. Define Menus for each Role
// const adminMenu = [
//   { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { label: "Employees", href: "/dashboard/employees", icon: Users },
//   { label: "Reports", href: "/dashboard/reports", icon: FileText },
//   { label: "System Users", href: "/dashboard/users", icon: ShieldCheck },
//   { label: "Settings", href: "/dashboard/settings", icon: Settings },
// ];

// const hrMenu = [
//   { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { label: "Employees", href: "/dashboard/employees", icon: Users },
//   { label: "Reports", href: "/dashboard/reports", icon: FileText },
// ];

// const staffMenu = [
//   { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   // Staff usually see their own attendance/leaves (Future feature)
//   { label: "My Attendance", href: "/dashboard/attendance", icon: Clock }, 
// ];

// // 2. Update the Type to accept ANY string or specific union
// export function Sidebar({ role }: { role: string }) { 
//   const pathname = usePathname();

//   // 3. Logic to choose the correct menu
//   let menu = staffMenu; // Default to staff (safest)
//   if (role === "ADMIN") menu = adminMenu;
//   if (role === "HR") menu = hrMenu;

//   return (
//     <aside className="w-64 flex-col h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-colors duration-300 hidden md:flex">
      
//       {/* Header */}
//       <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
//         <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
//         <span className="text-lg font-bold text-gray-900 dark:text-gray-50 tracking-tight">
//           JC&L HRIS
//         </span>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
//         <div className="px-3 mb-2">
//           <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
//             Main Menu
//           </p>
//         </div>
        
//         {menu.map((item) => {
//           const isActive = pathname === item.href;
          
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={cn(
//                 "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                 isActive 
//                   ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" 
//                   : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
//               )}
//             >
//               <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400")} />
//               {item.label}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Footer */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-800">
//         <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
//           <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900">
//              <UserCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
//               {/* Pretty print the role name */}
//               {role === "ADMIN" ? "Administrator" : role === "HR" ? "HR Manager" : "Staff Member"}
//             </p>
//             <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
//               View Profile
//             </p>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ShieldCheck,
  Briefcase,
  UserCircle,
  Clock 
} from "lucide-react";

// ... (Your menu arrays adminMenu, hrMenu, staffMenu remain the same) ...

const adminMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/dashboard/employees", icon: Users },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "System Users", href: "/dashboard/users", icon: ShieldCheck },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const hrMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/dashboard/employees", icon: Users },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
];

const staffMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Attendance", href: "/dashboard/attendance", icon: Clock }, 
];

export function Sidebar({ role }: { role: string }) { 
  const pathname = usePathname();

  let menu = staffMenu;
  if (role === "ADMIN") menu = adminMenu;
  if (role === "HR") menu = hrMenu;

  return (
    // 🔴 FIX: Removed 'hidden md:flex' and 'h-screen'. Added 'h-full'.
    // This ensures it stays visible when rendered inside the Mobile Sheet.
    <aside className="w-full flex flex-col h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-colors duration-300">
      
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
        <span className="text-lg font-bold text-gray-900 dark:text-gray-50 tracking-tight">
          JC&L HRIS
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <div className="px-3 mb-2">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Main Menu
          </p>
        </div>
        
        {menu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900">
             <UserCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {role === "ADMIN" ? "Administrator" : role === "HR" ? "HR Manager" : "Staff Member"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              View Profile
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}