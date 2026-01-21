"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
} from "lucide-react";

const adminMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/dashboard/employees", icon: Users },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Users", href: "/dashboard/users", icon: Users },
];

const hrMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/dashboard/employees", icon: Users },
];

export function Sidebar({ role }: { role: any }) {

  const menu = role === "admin" ? adminMenu : hrMenu;
  return (
    <aside className="w-64 bg-background border-r hidden md:block">
      <div className="p-6 text-2xl font-bold">HR System</div>

      <nav className="px-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
