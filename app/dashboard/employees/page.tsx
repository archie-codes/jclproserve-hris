import { db } from "@/src/db";
import { employees } from "@/src/db/schema";
import { desc } from "drizzle-orm";
import { EmployeesClient } from "@/components/dashboard/employees/employees-client";

export default async function EmployeesPage() {
  // 1. Fetch data directly from DB
  const employeesList = await db.query.employees.findMany({
    orderBy: [desc(employees.createdAt)], // Show newest first
  });

  // 2. Pass data to the client component
  return (
    <div className="p-6">
      <EmployeesClient data={employeesList} />
    </div>
  );
}