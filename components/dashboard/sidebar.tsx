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
  Clock,
  FileEdit,
  ClipboardList,
  Wallet,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
  X,
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
  comingSoon?: boolean;
};

// 👇 2. Apply the type to your arrays
const adminMenu: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Attendance",
    href: "/dashboard/attendance",
    icon: Clock,
    comingSoon: true,
  },
  {
    label: "Payroll",
    href: "/dashboard/payroll",
    icon: Wallet,
    comingSoon: true,
  },
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
  {
    label: "Attendance",
    href: "/dashboard/attendance",
    icon: Clock,
    comingSoon: true,
  },
  {
    label: "Payroll",
    href: "/dashboard/payroll",
    icon: Wallet,
    comingSoon: true,
  },
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
  {
    label: "Attendance",
    href: "/dashboard/attendance",
    icon: Clock,
    comingSoon: true,
  },
];

export function Sidebar({
  role,
  isMobile,
  onClose,
}: {
  role: string;
  isMobile?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  // 👇 3. Apply the type to your let variable
  let menu: MenuItem[] = staffMenu;

  if (role === "ADMIN") menu = adminMenu;
  if (role === "HR") menu = hrMenu;
  if (role === "COORDINATOR") menu = staffMenu;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [isCollapsedState, setIsCollapsed] = useState(false);

  const isCollapsed = isMobile ? false : isCollapsedState;

  useEffect(() => {
    if (pathname.includes("/dashboard/recruitment")) {
      setOpenGroups((prev) => ({ ...prev, Exams: true }));
    }
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full bg-background border-r border-border transition-all duration-300 z-50",
        isMobile ? "w-full" : isCollapsed ? "w-20" : "w-64",
      )}
    >
      {/* Toggle Sidebar Button */}
      {!isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-xs text-muted-foreground hover:text-foreground z-10 transition-transform duration-200 hover:scale-110"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      )}

      {/* Mobile Close Button */}
      {isMobile && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors z-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Header */}
      <div
        className={cn(
          "flex items-center border-b border-border transition-all duration-300 overflow-hidden",
          isCollapsed ? "h-20 justify-center px-0" : "h-20 px-5 gap-3",
        )}
      >
        <div
          className={cn(
            "shrink-0 flex items-center justify-center transition-all duration-300",
            isCollapsed ? "h-8 w-8" : "h-10 w-10",
          )}
        >
          <img
            src="/monogram.ico"
            alt="JC&L Logo"
            className="object-contain drop-shadow-sm h-full w-full"
          />
        </div>
        {!isCollapsed && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-base font-bold text-foreground whitespace-nowrap drop-shadow-sm tracking-wide">
              JC&L HRIS
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
        <div
          className={cn(
            "mb-2 transition-all duration-300",
            isCollapsed ? "px-0 text-center" : "px-3",
          )}
        >
          <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
            {isCollapsed ? "Menu" : "Main Menu"}
          </p>
        </div>

        {menu.map((item) => {
          if (item.subItems) {
            const isOpen = openGroups[item.label];
            const isGroupActive = pathname.includes("/dashboard/recruitment");

            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => {
                    if (isCollapsed) setIsCollapsed(false);
                    toggleGroup(item.label);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 group overflow-hidden",
                    isCollapsed ? "px-0 justify-center" : "px-3",
                    isGroupActive && !isOpen
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10"
                      : "text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800 dark:hover:text-white",
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                        isGroupActive && !isOpen
                          ? "text-indigo-600"
                          : "group-hover:text-indigo-500",
                      )}
                    />
                    {!isCollapsed && (
                      <span className="transition-transform duration-300 group-hover:translate-x-1 whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200",
                        isOpen ? "rotate-180" : "",
                      )}
                    />
                  )}
                </button>

                {/* 👇 The Perfectly Connected Tree Branches Layout */}
                {isOpen && !isCollapsed && (
                  <div className="relative space-y-1 mt-1 animate-in slide-in-from-top-2 duration-300">
                    {/* 1. The Vertical "Trunk" Line */}
                    <div className="absolute left-[22px] top-0 bottom-4 w-px bg-slate-200 dark:bg-slate-700"></div>

                    {item.subItems.map((sub) => {
                      const isSubActive = pathname.startsWith(sub.href || "");

                      return (
                        <div
                          key={sub.href}
                          className="relative pl-[40px] pr-3 group/sub"
                        >
                          {/* 2. The Horizontal "Branch" Line */}
                          <div
                            className={cn(
                              "absolute left-[22px] top-1/2 h-px w-[18px] -translate-y-1/2 transition-colors duration-300",
                              isSubActive
                                ? "bg-indigo-600 dark:bg-indigo-500"
                                : "bg-slate-200 dark:bg-slate-700",
                            )}
                          ></div>

                          <Link
                            href={sub.href || "#"}
                            onClick={() => {
                              if (isMobile && onClose) onClose();
                            }}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm font-medium transition-all duration-300",
                              isSubActive
                                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                                : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white",
                            )}
                          >
                            <span className="inline-block transition-transform duration-300 group-hover/sub:translate-x-1">
                              {sub.label}
                            </span>
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
              : pathname.startsWith(item.href || "");

          return (
            <Link
              key={item.href || item.label}
              href={item.href || "#"}
              onClick={() => {
                if (isMobile && onClose) onClose();
              }}
              className={cn(
                "flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 group overflow-hidden",
                isCollapsed ? "px-0 justify-center" : "px-3",
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                  : "text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800 dark:hover:text-white",
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-muted-foreground group-hover:text-indigo-500 dark:text-slate-500 dark:group-hover:text-indigo-400",
                )}
              />
              {!isCollapsed && (
                <div className="flex flex-1 items-center transition-transform duration-300 group-hover:translate-x-1 overflow-hidden pr-2">
                  <span className="whitespace-nowrap truncate">
                    {item.label}
                  </span>
                  {item.comingSoon && (
                    <span className="ml-auto inline-flex items-center rounded-full bg-red-200/50 px-2 py-0.5 text-[8px] font-bold text-red-500 dark:bg-red-700/50 dark:text-red-400 uppercase tracking-widest shrink-0">
                      COMING SOON
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div
        className={cn(
          "p-4 border-t border-border transition-all duration-300",
          isCollapsed ? "px-2" : "",
        )}
      >
        <p
          className={cn(
            "text-center text-muted-foreground transition-all duration-300",
            isCollapsed ? "text-[10px]" : "text-xs",
          )}
        >
          {isCollapsed ? "©'26" : "© 2026 JC&L Proserve"}
        </p>
      </div>
    </aside>
  );
}
