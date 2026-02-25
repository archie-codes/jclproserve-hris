"use client";

import { useState, useEffect } from "react";
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
  Clock,
  FileEdit,
  ClipboardList,
  Wallet,
  ChevronDown,
  LucideIcon,
} from "lucide-react";

// 👇 1. Define the strict TypeScript shapes
type SubItem = {
  label: string;
  href: string;
};

type MenuItem = {
  label: string;
  icon: LucideIcon;
  href?: string; // Optional because Groups don't have an href
  subItems?: SubItem[]; // Optional because standard links don't have subItems
};

// 👇 2. Apply the type to your arrays
const adminMenu: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/dashboard/attendance", icon: Clock },
  { label: "Payroll", href: "/dashboard/payroll", icon: Wallet },
  {
    label: "Exams",
    icon: FileEdit,
    subItems: [
      { label: "Exam Builder", href: "/dashboard/recruitment/exams" },
      { label: "Exam Results", href: "/dashboard/recruitment/results" },
    ],
  },
  { label: "Employees", href: "/dashboard/employees", icon: Users },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "System Users", href: "/dashboard/users", icon: ShieldCheck },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const hrMenu: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/dashboard/attendance", icon: Clock },
  { label: "Payroll", href: "/dashboard/payroll", icon: Wallet },
  {
    label: "Exams",
    icon: FileEdit,
    subItems: [
      { label: "Exam Builder", href: "/dashboard/recruitment/exams" },
      { label: "Exam Results", href: "/dashboard/recruitment/results" },
    ],
  },
  { label: "Employees", href: "/dashboard/employees", icon: Users },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
];

const staffMenu: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/dashboard/attendance", icon: Clock },
];

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  // 👇 3. Apply the type to your let variable
  let menu: MenuItem[] = staffMenu;

  if (role === "ADMIN") menu = adminMenu;
  if (role === "HR") menu = hrMenu;
  if (role === "COORDINATOR") menu = staffMenu;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (pathname.includes("/dashboard/recruitment")) {
      setOpenGroups((prev) => ({ ...prev, Exams: true }));
    }
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="w-full flex flex-col h-full bg-background border-r border-border transition-colors duration-300">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground tracking-tight leading-none">
              JC&L
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              HR System
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <div className="px-3 mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main Menu
          </p>
        </div>

        {menu.map((item) => {
          if (item.subItems) {
            const isOpen = openGroups[item.label];
            const isGroupActive = pathname.includes("/dashboard/recruitment");

            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                    isGroupActive && !isOpen
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800 dark:hover:text-white",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isOpen ? "rotate-180" : "",
                    )}
                  />
                </button>

                {/* 👇 The Perfectly Connected Tree Branches Layout */}
                {isOpen && (
                  <div className="relative space-y-1 mt-1 animate-in slide-in-from-top-2 duration-200">
                    {/* 1. The Vertical "Trunk" Line - Aligned exactly to the center of the icon above (22px) */}
                    <div className="absolute left-[22px] top-0 bottom-4 w-px bg-slate-300 dark:bg-slate-700"></div>

                    {item.subItems.map((sub) => {
                      const isSubActive = pathname.startsWith(sub.href || "");

                      return (
                        // padding-left is exactly 40px (22px for trunk + 18px for branch)
                        <div key={sub.href} className="relative pl-[40px] pr-3">
                          {/* 2. The Horizontal "Branch" Line - Connects seamlessly from 22px to 40px */}
                          <div
                            className={cn(
                              "absolute left-[22px] top-1/2 h-px w-[18px] -translate-y-1/2 transition-colors duration-200",
                              isSubActive
                                ? "bg-indigo-600 dark:bg-indigo-500"
                                : "bg-slate-300 dark:bg-slate-700",
                            )}
                          ></div>

                          <Link
                            href={sub.href || "#"}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                              isSubActive
                                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                                : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white",
                            )}
                          >
                            {sub.label}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // 👇 4. Tell TS that item.href is guaranteed to exist here
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href || ""); // Fallback added for TS safety

          return (
            <Link
              key={item.href || item.label}
              href={item.href || "#"} // Fallback added for TS safety
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                  : "text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800 dark:hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-muted-foreground group-hover:text-foreground dark:text-slate-500 dark:group-hover:text-slate-300",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          © 2026 JC&L Proserve
        </p>
      </div>
    </aside>
  );
}
