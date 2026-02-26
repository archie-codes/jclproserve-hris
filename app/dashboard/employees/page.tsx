// import { db } from "@/src/db";
// import { employees } from "@/src/db/schema";
// import { desc } from "drizzle-orm";
// import { EmployeesClient } from "@/components/dashboard/employees/employees-client";

// export default async function EmployeesPage() {
//   // 1. Fetch data directly from DB
//   const employeesList = await db.query.employees.findMany({
//     orderBy: [desc(employees.createdAt)], // Show newest first
//   });

//   // 2. Pass data to the client component
//   return <EmployeesClient data={employeesList} />;
// }

// app/dashboard/employees/page.tsx

import { db } from "@/src/db";
import { employees } from "@/src/db/schema";
import { desc } from "drizzle-orm";
import { EmployeesClient } from "@/components/dashboard/employees/employees-client";
import { cookies } from "next/headers";
import { ChangePinModal } from "@/components/dashboard/employees/change-pin-modal";

export default async function EmployeesPage() {
  // 1. Get Role from Cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  let userRole = "USER";

  if (sessionCookie) {
    try {
      const sessionData = JSON.parse(sessionCookie);
      userRole = sessionData.role;
    } catch (e) {
      console.error("Session parse error:", e);
    }
  }

  // 2. Fetch data WITH RELATIONS
  // We use db.query to easily fetch related tables (department, position, shift)
  const employeesData = await db.query.employees.findMany({
    orderBy: [desc(employees.createdAt)],
    with: {
      department: true,
      position: true,
      shift: true,
    },
  });

  // 3. Transform Data to match Client Component Props
  // We convert Date objects to Strings here to satisfy the Client Type
  const formattedEmployees = employeesData.map((emp) => ({
    ...emp,
    // Convert Dates to ISO strings
    dateHired: emp.dateHired ? new Date(emp.dateHired).toISOString() : null,
    dateRegularized: emp.dateRegularized
      ? new Date(emp.dateRegularized).toISOString()
      : null,
    dateResigned: emp.dateResigned
      ? new Date(emp.dateResigned).toISOString()
      : null,
    dateOfBirth: emp.dateOfBirth
      ? new Date(emp.dateOfBirth).toISOString()
      : null,
    createdAt: emp.createdAt ? new Date(emp.createdAt).toISOString() : null,
    updatedAt: emp.updatedAt ? new Date(emp.updatedAt).toISOString() : null,

    // Map mismatched fields (Schema uses 'taxableAllowance', Client uses 'allowance')
    allowance: emp.taxableAllowance ?? 0,
  }));

  // 4. Pass the transformed data
  return <EmployeesClient data={formattedEmployees} userRole={userRole} />;
}
