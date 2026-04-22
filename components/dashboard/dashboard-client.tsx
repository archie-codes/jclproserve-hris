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
  Cake,
  CalendarDays,
  Palmtree,
  MapPin,
  Copy,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { toast } from "sonner";

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
    imageUrl: string | null;
  }[];
  birthdaysThisMonth?: {
    id: string;
    name: string;
    dateOfBirth: Date | string | null;
    imageUrl: string | null;
  }[];
  birthdaysNextMonth?: {
    id: string;
    name: string;
    dateOfBirth: Date | string | null;
    imageUrl: string | null;
  }[];
}

const PHILIPPINE_HOLIDAYS = [
  { name: "New Year's Day", date: "01-01", type: "Regular Holiday" },
  { name: "Chinese New Year", date: "02-17", type: "Special Non-Working" },
  { name: "EDSA Revolution", date: "02-25", type: "Special Non-Working" },
  { name: "Maundy Thursday", date: "04-02", type: "Regular Holiday" },
  { name: "Good Friday", date: "04-03", type: "Regular Holiday" },
  { name: "Araw ng Kagitingan", date: "04-09", type: "Regular Holiday" },
  { name: "Labor Day", date: "05-01", type: "Regular Holiday" },
  { name: "Independence Day", date: "06-12", type: "Regular Holiday" },
  { name: "Ninoy Aquino Day", date: "08-21", type: "Special Non-Working" },
  { name: "National Heroes Day", date: "08-31", type: "Regular Holiday" },
  { name: "All Saints' Day", date: "11-01", type: "Special Non-Working" },
  { name: "Bonifacio Day", date: "11-30", type: "Regular Holiday" },
  { name: "Immaculate Conception", date: "12-08", type: "Special Non-Working" },
  { name: "Christmas Day", date: "12-25", type: "Regular Holiday" },
  { name: "Rizal Day", date: "12-30", type: "Regular Holiday" },
  { name: "Last Day of the Year", date: "12-31", type: "Special Non-Working" },
];

const getUpcomingHolidays = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();

  let upcoming = PHILIPPINE_HOLIDAYS.map((h) => ({
    ...h,
    fullDate: new Date(`${currentYear}-${h.date}`),
  })).filter((h) => h.fullDate >= today);

  if (upcoming.length < 3) {
    const nextYear = PHILIPPINE_HOLIDAYS.map((h) => ({
      ...h,
      fullDate: new Date(`${currentYear + 1}-${h.date}`),
    }));
    upcoming = [...upcoming, ...nextYear];
  }

  return upcoming
    .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime())
    .slice(0, 3);
};

export default function DashboardClient({
  user,
  stats,
  recentEmployees,
  birthdaysThisMonth,
  birthdaysNextMonth,
}: DashboardProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [greeting, setGreeting] = useState("Welcome back");
  const router = useRouter();

  type BirthdayEmp = NonNullable<DashboardProps["birthdaysThisMonth"]>[number];
  const [selectedBirthday, setSelectedBirthday] = useState<BirthdayEmp | null>(
    null,
  );

  const handleBirthdayClick = (emp: BirthdayEmp) => {
    setSelectedBirthday(emp);
    // Slight delay to allow modal to mount properly without stealing rendering frame priority from the canvas
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.5 },
        colors: [
          "#db2777",
          "#f472b6",
          "#fbbf24",
          "#34d399",
          "#60a5fa",
          "#8b5cf6",
        ],
        zIndex: 999999, // Ensure it shoots over the Radix overlay mask
      });
    }, 250);
  };

  const calculateAge = (dob: Date | string | null | undefined) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle Hydration & Live Clock
  const [upcomingHolidays, setUpcomingHolidays] = useState<any[]>([]);

  useEffect(() => {
    setDate(new Date());
    setUpcomingHolidays(getUpcomingHolidays());
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

  const donutData = [
    { name: "Active", value: stats.activeEmployees, color: "#10b981" }, // Emerald 500
    { name: "Resigned", value: stats.resignedEmployees, color: "#ef4444" }, // Red 500
    {
      name: "Probationary/Other",
      value: Math.max(
        0,
        stats.totalEmployees - stats.activeEmployees - stats.resignedEmployees,
      ),
      color: "#f59e0b",
    }, // Amber 500
  ].filter((item) => item.value > 0);

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
                year: "numeric",
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

      {/* 2.5 ANALYTICS & CELEBRATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* WORKFORCE DISTRIBUTION DONUT CHART */}
        <Card className="border-blue-100 bg-linear-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-950 dark:border-blue-900/30 shadow-md overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Workforce Distribution</CardTitle>
            <CardDescription>
              Active vs Inactive Staff Breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow:
                      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                  }}
                  itemStyle={{ fontWeight: "bold", color: "#333" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* BIRTHDAYS THIS MONTH */}
        <Card className="border-pink-100 bg-linear-to-br from-pink-50 to-white dark:from-pink-950/20 dark:to-slate-950 dark:border-pink-900/30 shadow-md">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2 text-pink-700 dark:text-pink-300">
                <Cake className="h-5 w-5 text-pink-500" /> Birthdays
              </CardTitle>
              <CardDescription>Upcoming staff celebrations</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="this-month" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-3 bg-pink-50 dark:bg-pink-950/30 text-pink-800 dark:text-pink-200">
                <TabsTrigger
                  value="this-month"
                  className="data-[state=active]:bg-white data-[state=active]:text-pink-700 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-100"
                >
                  This Month
                </TabsTrigger>
                <TabsTrigger
                  value="next-month"
                  className="data-[state=active]:bg-white data-[state=active]:text-pink-700 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-100"
                >
                  Next Month
                </TabsTrigger>
              </TabsList>

              <TabsContent value="this-month" className="mt-0">
                <div className="space-y-3 max-h-[190px] overflow-y-auto pr-2 custom-scrollbar">
                  {!birthdaysThisMonth || birthdaysThisMonth.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center h-[160px]">
                      <div className="h-14 w-14 bg-pink-100 dark:bg-pink-900/40 rounded-full flex items-center justify-center mb-3">
                        <Cake className="h-7 w-7 text-pink-300" />
                      </div>
                      <p className="text-secondary-foreground text-sm font-medium">
                        No birthdays this month.
                      </p>
                    </div>
                  ) : (
                    birthdaysThisMonth.map((emp) => {
                      const day = emp.dateOfBirth
                        ? new Date(emp.dateOfBirth).getDate()
                        : null;
                      return (
                        <div
                          key={emp.id}
                          onClick={() => handleBirthdayClick(emp)}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-slate-900 border border-pink-100/50 dark:border-pink-900/20 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-pink-100 dark:border-pink-900">
                              {emp.imageUrl && (
                                <AvatarImage
                                  src={emp.imageUrl}
                                  alt={emp.name}
                                  className="object-cover"
                                />
                              )}
                              <AvatarFallback className="bg-pink-100 text-pink-700 text-xs font-bold">
                                {getInitials(emp.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {emp.name}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-pink-400" />{" "}
                                Turning older!
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-center bg-pink-100 dark:bg-pink-900/40 rounded-lg px-4 py-1.5 shadow-sm">
                            <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold uppercase tracking-wider">
                              Day
                            </span>
                            <span className="text-xl font-black text-pink-700 dark:text-pink-300 leading-none">
                              {day}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              <TabsContent value="next-month" className="mt-0">
                <div className="space-y-3 max-h-[190px] overflow-y-auto pr-2 custom-scrollbar">
                  {!birthdaysNextMonth || birthdaysNextMonth.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center h-[160px]">
                      <div className="h-14 w-14 bg-pink-100 dark:bg-pink-900/40 rounded-full flex items-center justify-center mb-3">
                        <Cake className="h-7 w-7 text-pink-300" />
                      </div>
                      <p className="text-secondary-foreground text-sm font-medium">
                        No birthdays next month.
                      </p>
                    </div>
                  ) : (
                    birthdaysNextMonth.map((emp) => {
                      const day = emp.dateOfBirth
                        ? new Date(emp.dateOfBirth).getDate()
                        : null;
                      return (
                        <div
                          key={emp.id}
                          onClick={() => handleBirthdayClick(emp)}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-slate-900 border border-pink-100/50 dark:border-pink-900/20 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-pink-100 dark:border-pink-900">
                              {emp.imageUrl && (
                                <AvatarImage
                                  src={emp.imageUrl}
                                  alt={emp.name}
                                  className="object-cover"
                                />
                              )}
                              <AvatarFallback className="bg-pink-100 text-pink-700 text-xs font-bold">
                                {getInitials(emp.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {emp.name}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-pink-400" />{" "}
                                Turning older!
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-center bg-pink-100 dark:bg-pink-900/40 rounded-lg px-4 py-1.5 shadow-sm">
                            <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold uppercase tracking-wider">
                              Day
                            </span>
                            <span className="text-xl font-black text-pink-700 dark:text-pink-300 leading-none">
                              {day}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 3. CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        {/* LEFT: RECENT HIRES LIST */}
        <Card className="lg:col-span-4 border-emerald-100 bg-linear-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-950 dark:border-emerald-900/30 shadow-lg">
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
                        {emp.imageUrl && (
                          <AvatarImage
                            src={emp.imageUrl}
                            alt={emp.name}
                            className="object-cover"
                          />
                        )}
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
          <Card className="border-amber-100 bg-linear-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-950 dark:border-amber-900/30 shadow-md overflow-hidden">
            <CardHeader className="pb-4 border-b border-amber-100 dark:border-amber-900/30">
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

          {/* UPCOMING HOLIDAYS WIDGET */}
          <Card className="border-indigo-100 bg-linear-to-br from-indigo-50 to-white dark:from-indigo-950/10 dark:to-slate-950 dark:border-indigo-900/30 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Palmtree className="h-32 w-32 text-indigo-900" />
            </div>
            <CardHeader className="pb-3 flex flex-row items-center justify-between relative z-10 mt-1">
              <CardTitle className="text-base flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                <CalendarDays className="h-4 w-4 text-indigo-500" /> PH Holidays
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-white dark:bg-black text-indigo-600 border-indigo-200 uppercase text-[10px] tracking-wider font-bold"
              >
                Upcoming
              </Badge>
            </CardHeader>
            <CardContent className="relative z-10 pt-2 pb-5">
              <div className="space-y-3">
                {upcomingHolidays.map((holiday, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-indigo-50 dark:border-indigo-900/20 shadow-sm transition-colors hover:bg-white dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center bg-indigo-100 dark:bg-indigo-900/40 rounded-lg w-12 h-12 shadow-inner">
                        <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                          {holiday.fullDate.toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </span>
                        <span className="text-lg font-black text-indigo-700 dark:text-indigo-300 leading-none">
                          {holiday.fullDate.getDate()}
                        </span>
                      </div>
                      <div className="flex flex-col pt-1">
                        <p className="text-sm font-bold text-foreground leading-tight">
                          {holiday.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium mt-1">
                          <MapPin className="h-3 w-3 text-indigo-400" />{" "}
                          {holiday.type}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Birthday Modal */}
      <Dialog
        open={!!selectedBirthday}
        onOpenChange={(open) => {
          if (!open) setSelectedBirthday(null);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex flex-col items-center gap-3 pt-6 pb-2">
              <Avatar className="h-24 w-24 border-4 border-pink-100 shadow-sm">
                {selectedBirthday?.imageUrl && (
                  <AvatarImage
                    src={selectedBirthday.imageUrl}
                    alt={selectedBirthday.name}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-pink-100 text-pink-700 text-3xl font-bold">
                  {selectedBirthday ? getInitials(selectedBirthday.name) : ""}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span>{selectedBirthday?.name}</span>
                <span className="text-xs font-normal text-muted-foreground flex items-center justify-center gap-1">
                  <Cake className="w-3 h-3 text-pink-400" /> Birthday
                  Celebration
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 px-2">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Date of Birth
                </span>
                <span className="text-base font-medium">
                  {selectedBirthday?.dateOfBirth
                    ? new Date(selectedBirthday.dateOfBirth).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )
                    : "N/A"}
                </span>
              </div>
              <Cake className="w-8 h-8 text-pink-200 dark:text-pink-900/50" />
            </div>

            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Turning Age
                </span>
                <span className="text-xl font-black text-pink-600 dark:text-pink-400">
                  {calculateAge(selectedBirthday?.dateOfBirth)} years old
                </span>
              </div>
              <Sparkles className="w-8 h-8 text-pink-200 dark:text-pink-900/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pb-2 px-2 w-full">
            <Button
              className="w-full bg-pink-600 hover:bg-pink-700 text-white shadow-sm"
              onClick={() => {
                const url = `${window.location.origin}/greetings/birthday/${selectedBirthday?.id}`;
                navigator.clipboard.writeText(url);
                toast.success("Greeting link copied!");
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              className="w-full text-pink-600 border-pink-200 hover:bg-pink-50 hover:text-pink-700 dark:border-pink-900/40 dark:hover:bg-pink-900/20"
              onClick={() => setSelectedBirthday(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
