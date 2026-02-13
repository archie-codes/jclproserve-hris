import { db } from "@/src/db";
import { employees } from "@/src/db/schema";
import { count, desc, eq, ne } from "drizzle-orm";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { requireAuth } from "@/lib/require-auth";

export default async function DashboardPage() {
  // 1. Get Current User
  const user = await requireAuth();

  // 2. Fetch Total Employees Count
  const [totalEmpResult] = await db.select({ value: count() }).from(employees);

  // 3. Fetch Active Employees Count (Everyone NOT Resigned)
  const [activeEmpResult] = await db
    .select({ value: count() })
    .from(employees)
    .where(ne(employees.status, "RESIGNED"));

  // 4. Fetch Resigned Employees Count (Only Resigned)
  const [resignedEmpResult] = await db
    .select({ value: count() })
    .from(employees)
    .where(eq(employees.status, "RESIGNED"));

  // 5. Fetch 5 Most Recent Employees
  const recentJoiners = await db.query.employees.findMany({
    orderBy: [desc(employees.createdAt)],
    limit: 4,

    // 🔴 FIX 1: Use 'with' to fetch the Position relation
    with: {
      position: true,
    },

    // 🔴 FIX 2: Only put raw columns here (removed 'position: true')
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      createdAt: true,
    },
  });

  // Prepare data for the client
  const stats = {
    totalEmployees: totalEmpResult.value,
    activeEmployees: activeEmpResult.value,
    resignedEmployees: resignedEmpResult.value,
  };

  const formattedRecent = recentJoiners.map((emp) => ({
    id: emp.id,
    name: `${emp.firstName} ${emp.lastName}`,
    // 🔴 FIX 3: Extract the 'title' string from the position object
    position: emp.position ? emp.position.title : "No Position",
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
