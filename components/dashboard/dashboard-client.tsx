"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Briefcase,
  Plus,
  FileText,
  ChevronRight,
  Sun,
  Moon,
  Coffee,
  UserX,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardProps {
  user: {
    name: string;
    role: string;
  };
  stats: {
    totalEmployees: number;
    activeEmployees: number;
    resignedEmployees: number;
  };
  recentEmployees: {
    id: string;
    name: string;
    position: string;
    createdAt: Date | null;
  }[];
}

export default function DashboardClient({
  user,
  stats,
  recentEmployees,
}: DashboardProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [greeting, setGreeting] = useState("Welcome back");
  const router = useRouter();

  // Handle Hydration & Live Clock
  useEffect(() => {
    setDate(new Date());
    const timer = setInterval(() => setDate(new Date()), 1000);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    return () => clearInterval(timer);
  }, []);

  // Helper to get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (!date) return null;

  return (
    <div className="space-y-8 p-1 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            {greeting},{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {user.name}
            </span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Here's your daily overview. You have{" "}
            <span className="font-semibold text-foreground">
              {stats.activeEmployees} active
            </span>{" "}
            staff members today.
          </p>
        </div>

        {/* Enhanced Date Widget */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-950 p-3 pr-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <div
            className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center shadow-inner",
              greeting === "Good evening"
                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
            )}
          >
            {greeting === "Good evening" ? (
              <Moon className="h-6 w-6" />
            ) : (
              <Sun className="h-6 w-6" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {date.toLocaleDateString("en-US", { weekday: "long" })}
            </span>
            <span className="text-xl font-black font-mono text-foreground leading-none">
              {date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="text-xs text-muted-foreground">
              {date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Employees"
          value={stats.totalEmployees.toString()}
          icon={Users}
          trend="Total records"
          color="blue"
        />
        <StatCard
          label="Active Staff"
          value={stats.activeEmployees.toString()}
          icon={UserCheck}
          trend="Currently active"
          color="green"
        />
        <StatCard
          label="Resigned"
          value={stats.resignedEmployees.toString()}
          icon={UserX}
          trend="Inactive / Left"
          color="red"
        />
      </div>

      {/* 3. CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        {/* LEFT: RECENT HIRES LIST */}
        <Card className="lg:col-span-4 border-none shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Joiners</CardTitle>
                <CardDescription>
                  New employees added to the system
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => router.push("/dashboard/employees")}
              >
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentEmployees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    No recent activity.
                  </p>
                </div>
              ) : (
                recentEmployees.map((emp, i) => (
                  <div key={emp.id} className="relative flex gap-4 group">
                    {/* Timeline Line */}
                    {i !== recentEmployees.length - 1 && (
                      <div className="absolute left-5 top-12 h-full w-[2px] bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 transition-colors" />
                    )}

                    {/* Avatar with Initials */}
                    <div className="relative z-10">
                      <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-900 shadow-sm">
                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs">
                          {getInitials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className="absolute -bottom-1 -right-1 bg-green-500 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900"
                        title="Active"
                      ></div>
                    </div>

                    <div className="flex flex-col gap-1 pt-0.5 w-full">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-foreground group-hover:text-blue-600 transition-colors cursor-pointer">
                          {emp.name}
                        </p>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-muted-foreground">
                          {emp.createdAt
                            ? new Date(emp.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        Joined as{" "}
                        <span className="font-medium text-foreground">
                          {emp.position}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-3 space-y-6">
          {/* QUICK ACTIONS */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 p-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-3 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/80 hover:border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-900 dark:hover:bg-emerald-900/40 transition-all group"
                onClick={() => router.push("/dashboard/employees")}
              >
                <div className="h-10 w-10 rounded-full bg-white dark:bg-emerald-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  Add Staff
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-24 flex flex-col gap-3 border-blue-200 bg-blue-50/50 hover:bg-blue-100/80 hover:border-blue-300 dark:bg-blue-950/20 dark:border-blue-900 dark:hover:bg-blue-900/40 transition-all group"
                // onClick={() => router.push("/dashboard/payroll")}
              >
                <div className="h-10 w-10 rounded-full bg-white dark:bg-blue-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                  Run Payroll
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* WHO'S OUT WIDGET */}
          <Card className="border-orange-100 bg-linear-to-br from-orange-50 to-white dark:from-orange-950/10 dark:to-slate-950 dark:border-orange-900/30 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 text-orange-900 dark:text-orange-100">
                <Coffee className="h-4 w-4 text-orange-500" /> Who's Out?
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-white dark:bg-black text-orange-600 border-orange-200"
              >
                0 Active
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-4 text-center space-y-2">
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center">
                  <Sun className="h-6 w-6 text-orange-500" />
                </div>
                <p className="text-sm font-medium text-orange-900 dark:text-orange-200">
                  All hands on deck!
                </p>
                <p className="text-xs text-orange-700/70 dark:text-orange-300/60">
                  No approved leaves for today.
                </p>
              </div>
              <Button
                variant="ghost"
                className="w-full mt-2 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/20"
              >
                View Leave Calendar <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
