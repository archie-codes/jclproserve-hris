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

import { StatCard } from "@/components/dashboard/stat-card";

export default function DashboardPage() {
  return (
    <div className="space-y-6 bg-background">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 ">
        <StatCard label="Total Employees" value="128" />
        <StatCard label="Active Staff" value="120" />
        <StatCard label="Pending Requests" value="6" />
      </div>

      {/* Activity */}
      <div className="rounded-lg bg-background p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-3 text-sm text-gray-600">
          <li>✔ Juan Dela Cruz added as employee</li>
          <li>✔ Payroll processed for January</li>
          <li>✔ Leave approved</li>
        </ul>
      </div>
    </div>
  );
}
