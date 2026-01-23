// // import { cookies } from "next/headers";
// // import { redirect } from "next/navigation";
// // import { LogoutButton } from "@/components/logout-button";

// // export default async function DashboardPage() {
// //   const cookie = (await cookies()).get("session");

// //   if (!cookie) redirect("/login");

// //   const user = JSON.parse(cookie.value);

// //   if (user.role !== "admin") {
// //     redirect("/login");
// //   }

// //   return (
// //     <div>
// //       <h1>Admin Dashboard</h1>
// //       <p>Welcome {user.email}</p>
// //       <LogoutButton />
// //     </div>
// //   );
// // }
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { LogoutButton } from "@/components/logout-button"; // Your component
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Activity, CreditCard, DollarSign, Users, ArrowUpRight } from "lucide-react";

// export default async function DashboardPage() {
//   // ---------------------------------------------------------
//   // 1. AUTHENTICATION LOGIC
//   // ---------------------------------------------------------
//   const cookieStore = await cookies();
//   const sessionCookie = cookieStore.get("session");

//   if (!sessionCookie) {
//     redirect("/login");
//   }

//   let user;
//   try {
//     user = JSON.parse(sessionCookie.value);
//   } catch (error) {
//     // If cookie is corrupt, force login
//     redirect("/login");
//   }

//   if (user.role !== "admin") {
//     // Optional: Redirect to a 'unauthorized' page or standard user dashboard
//     redirect("/login");
//   }

//   // ---------------------------------------------------------
//   // 2. DASHBOARD UI
//   // ---------------------------------------------------------
//   return (
//     <div className="flex flex-col gap-4">
//       {/* HEADER SECTION WITH USER DATA & LOGOUT */}
//       <div className="flex items-center justify-between">
//         <div>
//             <h1 className="text-lg font-semibold md:text-2xl">
//                 Welcome back, {user.email}
//             </h1>
//             <p className="text-sm text-muted-foreground">
//                 Here is what's happening at JC&L Proserve today.
//             </p>
//         </div>
//         <div className="flex items-center gap-2">
//             {/* We place your Logout Button here */}
//             <LogoutButton />
//         </div>
//       </div>

//       {/* STATS CARDS */}
//       <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">142</div>
//             <p className="text-xs text-muted-foreground">+4 from last month</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
//             <Activity className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">12</div>
//             <p className="text-xs text-muted-foreground">+2 new this week</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
//             <CreditCard className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">8</div>
//             <p className="text-xs text-muted-foreground">Requires approval</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Payroll Cycle</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">4 Days</div>
//             <p className="text-xs text-muted-foreground">Until next payout</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* RECENT ACTIVITY SECTION */}
//       <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        
//         {/* LEFT COLUMN: TABLE */}
//         <Card className="xl:col-span-2">
//           <CardHeader className="flex flex-row items-center">
//             <div className="grid gap-2">
//               <CardTitle>Recent Applications</CardTitle>
//               <CardDescription>
//                 Recent job applicants from the career portal.
//               </CardDescription>
//             </div>
//             <Button asChild size="sm" className="ml-auto gap-1">
//               <a href="#">
//                 View All
//                 <ArrowUpRight className="h-4 w-4" />
//               </a>
//             </Button>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Candidate</TableHead>
//                   <TableHead className="hidden xl:table-cell">Role</TableHead>
//                   <TableHead className="hidden xl:table-cell">Status</TableHead>
//                   <TableHead className="text-right">Date</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 <TableRow>
//                   <TableCell>
//                     <div className="font-medium">Liam Johnson</div>
//                     <div className="hidden text-sm text-muted-foreground md:inline">
//                       liam@example.com
//                     </div>
//                   </TableCell>
//                   <TableCell className="hidden xl:table-cell">
//                     Software Engineer
//                   </TableCell>
//                   <TableCell className="hidden xl:table-cell">
//                     <Badge className="text-xs" variant="outline">
//                       Interview
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-right">2023-06-23</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell>
//                     <div className="font-medium">Olivia Smith</div>
//                     <div className="hidden text-sm text-muted-foreground md:inline">
//                       olivia@example.com
//                     </div>
//                   </TableCell>
//                   <TableCell className="hidden xl:table-cell">
//                     HR Specialist
//                   </TableCell>
//                   <TableCell className="hidden xl:table-cell">
//                     <Badge className="text-xs" variant="secondary">
//                       New
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-right">2023-06-24</TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         {/* RIGHT COLUMN: RECENT HIRES */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Hires</CardTitle>
//           </CardHeader>
//           <CardContent className="grid gap-8">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-4 w-full">
//                   <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">OM</div>
//                   <div className="grid gap-1">
//                     <p className="text-sm font-medium leading-none">
//                       Olivia Martin
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       Marketing Manager
//                     </p>
//                   </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//                <div className="flex items-center gap-4 w-full">
//                   <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">JL</div>
//                   <div className="grid gap-1">
//                     <p className="text-sm font-medium leading-none">
//                       Jackson Lee
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       Financial Analyst
//                     </p>
//                   </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// import { StatCard } from "@/components/dashboard/stat-card";

// export default function DashboardPage() {
//   return (
//     <div className="space-y-6 bg-background">
//       {/* Stats */}
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-3 ">
//         <StatCard label="Total Employees" value="128" />
//         <StatCard label="Active Staff" value="120" />
//         <StatCard label="Pending Requests" value="6" />
//       </div>

//       {/* Activity */}
//       <div className="rounded-lg bg-background p-6 shadow-sm">
//         <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
//         <ul className="space-y-3 text-sm text-gray-600">
//           <li>✔ Juan Dela Cruz added as employee</li>
//           <li>✔ Payroll processed for January</li>
//           <li>✔ Leave approved</li>
//         </ul>
//       </div>
//     </div>
//   );
// }


import { 
  Users, 
  UserCheck, 
  Clock, 
  Briefcase, 
  Activity,
  PlusCircle,
  FileText
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card"; 

// Mock Data (Replace with DB calls later)
const stats = [
  { label: "Total Employees", value: "128", icon: Users, trend: "+4% from last month", color: "blue" },
  { label: "Active Staff", value: "120", icon: UserCheck, trend: "98% attendance", color: "green" },
  { label: "Pending Requests", value: "6", icon: Clock, trend: "Requires attention", color: "orange" },
  { label: "Open Positions", value: "3", icon: Briefcase, trend: "Recruiting", color: "purple" },
];

const activities = [
  { id: 1, user: "Juan Dela Cruz", action: "was added as an employee", time: "2 hours ago", icon: PlusCircle, color: "text-green-600" },
  { id: 2, user: "System", action: "processed payroll for January", time: "5 hours ago", icon: FileText, color: "text-blue-600" },
  { id: 3, user: "Maria Santos", action: "approved leave request", time: "1 day ago", icon: UserCheck, color: "text-purple-600" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-1"> {/* Added padding buffer */}
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Overview of your HR metrics and daily activities.</p>
        </div>
        
        {/* Date Filter Bubble */}
        <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard 
            key={i} 
            label={stat.label} 
            value={stat.value} 
            icon={stat.icon} 
            trend={stat.trend} 
            color={stat.color}
          />
        ))}
      </div>

      {/* 3. Main Content Area (Grid split 2:1 on large screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Activity (Takes up 2/3 width) */}
        <div className="lg:col-span-2 bg-background dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h2>
            </div>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
          </div>
          
          <div className="p-6">
            <div className="space-y-8"> 
              {activities.map((item, i) => (
                <div key={item.id} className="relative flex gap-4">
                  {/* Timeline Line */}
                  {i !== activities.length - 1 && (
                    <div className="absolute left-2.75 top-8 h-full w-px bg-gray-200 dark:bg-gray-800" />
                  )}
                  
                  {/* Icon Bubble */}
                  <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700`}>
                    <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{item.user}</span> {item.action}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
            Quick Actions
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Common tasks you perform daily.
          </p>

          <div className="space-y-3">
            <button className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
              Add New Employee <PlusCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </button>
            <button className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
              Generate Report <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}