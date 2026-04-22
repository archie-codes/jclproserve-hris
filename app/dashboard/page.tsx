import { db } from "@/src/db";
import { employees } from "@/src/db/schema";
import { count, desc, eq, ne, sql } from "drizzle-orm";
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

  // 5. Fetch 10 Most Recent Employees
  const recentJoiners = await db.query.employees.findMany({
    orderBy: [desc(employees.createdAt)],
    limit: 10,

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
      imageUrl: true,
    },
  });

  // Prepare data for the client
  const stats = {
    totalEmployees: totalEmpResult.value,
    activeEmployees: activeEmpResult.value,
    resignedEmployees: resignedEmpResult.value,
  };

  // Prepared previously
  const formattedRecent = recentJoiners.map((emp) => ({
    id: emp.id,
    name: `${emp.firstName} ${emp.lastName}`,
    // 🔴 FIX 3: Extract the 'title' string from the position object
    position: emp.position ? emp.position.title : "No Position",
    createdAt: emp.createdAt,
    imageUrl: emp.imageUrl,
  }));

  // 6. Fetch Upcoming Birthdays (Current Month)
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const upcomingBirthdays = await db.query.employees.findMany({
    where: sql`EXTRACT(MONTH FROM ${employees.dateOfBirth}) = ${currentMonth}`,
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      imageUrl: true,
    },
    limit: 5,
  });

  const formattedBirthdays = upcomingBirthdays.map((emp) => ({
    id: emp.id,
    name: `${emp.firstName} ${emp.lastName}`,
    dateOfBirth: emp.dateOfBirth,
    imageUrl: emp.imageUrl,
  }));

  // 7. Fetch Birthdays (Next Month)
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextMonthBirthdays = await db.query.employees.findMany({
    where: sql`EXTRACT(MONTH FROM ${employees.dateOfBirth}) = ${nextMonth}`,
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      imageUrl: true,
    },
    limit: 5,
  });

  const formattedNextMonthBirthdays = nextMonthBirthdays.map((emp) => ({
    id: emp.id,
    name: `${emp.firstName} ${emp.lastName}`,
    dateOfBirth: emp.dateOfBirth,
    imageUrl: emp.imageUrl,
  }));

  return (
    <DashboardClient
      user={{ name: user.name, role: user.role }}
      stats={stats}
      recentEmployees={formattedRecent}
      birthdaysThisMonth={formattedBirthdays}
      birthdaysNextMonth={formattedNextMonthBirthdays}
    />
  );
}
