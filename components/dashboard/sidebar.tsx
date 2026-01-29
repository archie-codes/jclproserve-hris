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
  Clock,
} from "lucide-react";

// ... (Your menu arrays adminMenu, hrMenu, staffMenu remain the same) ...

const adminMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/dashboard/attendance", icon: Clock },
  { label: "Employees", href: "/dashboard/employees", icon: Users },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "System Users", href: "/dashboard/users", icon: ShieldCheck },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const hrMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/dashboard/attendance", icon: Clock },
  { label: "Employees", href: "/dashboard/employees", icon: Users },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
];

const staffMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/dashboard/attendance", icon: Clock },
];

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  let menu = staffMenu;
  if (role === "ADMIN") menu = adminMenu;
  if (role === "HR") menu = hrMenu;
  if (role === "COORDINATOR") menu = staffMenu;

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
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
