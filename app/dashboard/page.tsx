import { db } from "@/src/db";
import { employees } from "@/src/db/schema";
import { count, desc, eq } from "drizzle-orm";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { requireAuth } from "@/lib/require-auth";

export default async function DashboardPage() {
  // 1. Get Current User (for the "Welcome, Name" message)
  const user = await requireAuth();

  // 2. Fetch Total Employees Count
  const [totalEmpResult] = await db.select({ value: count() }).from(employees);
  
  // 3. Fetch Active Employees Count (Assuming you have an 'isActive' or 'status' column)
  // If you don't have this column yet, you can remove the .where() part
  const [activeEmpResult] = await db
    .select({ value: count() })
    .from(employees)
    // .where(eq(employees.status, "Active")); // Uncomment if you have a status column

  // 4. Fetch 5 Most Recent Employees for "Recent Activity"
  const recentJoiners = await db.query.employees.findMany({
    orderBy: [desc(employees.createdAt)],
    limit: 4,
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      position: true,
      createdAt: true,
    },
  });

  // Prepare data for the client
  const stats = {
    totalEmployees: totalEmpResult.value,
    activeEmployees: activeEmpResult.value || totalEmpResult.value, // Fallback if no status logic
  };

  const formattedRecent = recentJoiners.map((emp) => ({
    id: emp.id,
    name: `${emp.firstName} ${emp.lastName}`,
    position: emp.position || "Employee",
    createdAt: emp.createdAt,
  }));

  return (
    <DashboardClient 
      user={{ name: user.name, role: user.role }}
      stats={stats} 
      recentEmployees={formattedRecent} 
    />
  );
}