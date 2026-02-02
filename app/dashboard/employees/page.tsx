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

export default async function EmployeesPage() {
  // 1. Get Role from Cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  
  let userRole = "USER"; // Default fallback

  if (sessionCookie) {
    try {
      const sessionData = JSON.parse(sessionCookie);
      userRole = sessionData.role; 
    } catch (e) {
      console.error("Session parse error:", e);
    }
  }

  // 2. Fetch data directly from DB
  const employeesList = await db.query.employees.findMany({
    orderBy: [desc(employees.createdAt)],
  });

  // 3. Pass data AND userRole
  return <EmployeesClient data={employeesList} userRole={userRole} />;
}