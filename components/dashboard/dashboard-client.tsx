"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Clock,
  Briefcase,
  Plus,
  FileText,
  Calendar,
  ChevronRight,
  Sun,
  Moon,
  Coffee,
  Plane,
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

// Define the shape of data we expect from the Database
interface DashboardProps {
  user: {
    name: string;
    role: string;
  };
  stats: {
    totalEmployees: number;
    activeEmployees: number;
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

  if (!date) return null;

  return (
    <div className="space-y-6 p-1 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {greeting}, <span className="text-primary">{user.name}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here is what's happening in your company today.
          </p>
        </div>

        {/* Date Widget */}
        <div className="flex items-center gap-4 bg-muted/40 p-2 pr-4 rounded-full border border-border/50 shadow-xs">
          <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm border border-border">
            {greeting === "Good evening" ? (
              <Moon className="h-5 w-5 text-indigo-500" />
            ) : (
              <Sun className="h-5 w-5 text-orange-500" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-sm font-bold font-mono text-foreground leading-none">
              {date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* 2. STATS GRID (Populated with Real DB Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        {/* These two can be hooked up to Leave/Jobs tables later */}
        <StatCard
          label="Pending Leaves"
          value="0"
          icon={Clock}
          trend="To be reviewed"
          color="orange"
        />
        <StatCard
          label="Open Positions"
          value="1"
          icon={Briefcase}
          trend="Hiring"
          color="purple"
        />
      </div>

      {/* 3. CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* RECENT ACTIVITY (Showing Recent Hires) */}
        <Card className="lg:col-span-4 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Joiners</CardTitle>
            <CardDescription>New employees added to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentEmployees.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No recent activity.
                </p>
              ) : (
                recentEmployees.map((emp, i) => (
                  <div key={emp.id} className="relative flex gap-4">
                    {i !== recentEmployees.length - 1 && (
                      <div className="absolute left-4.75 top-10 h-full w-0.5 bg-muted" />
                    )}
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-4 ring-background">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1 pt-0.5">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">{emp.name}</span> joined
                        as {emp.position}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {emp.createdAt
                          ? new Date(emp.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:bg-primary/5 transition-all"
                onClick={() => router.push("/dashboard/employees")}
              >
                <Plus className="h-6 w-6 text-primary" />
                Add Employee
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:bg-blue-500/5 transition-all"
                // onClick={() => router.push("/dashboard/payroll")}
              >
                <FileText className="h-6 w-6 text-blue-500" />
                Run Payroll
              </Button>
            </CardContent>
          </Card>

          {/* Sample Who's Out Widget (Static for now until you have Leaves table) */}
          <Card className="bg-linear-to-br from-background to-muted/20 border-border/50 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Coffee className="h-4 w-4 text-orange-500" /> Who's Out Today?
              </CardTitle>
              <Badge variant="secondary">0 Active</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No one is on leave today.
              </p>
              <Button
                variant="ghost"
                className="w-full mt-4 text-xs text-muted-foreground"
              >
                View Calendar <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
