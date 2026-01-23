"use server";

import { db } from "@/src/db";
import { employees, auditLogs } from "@/src/db/schema";
import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth"; 

// Validation Schema
const addEmployeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  employeeNo: z.string().min(1, "Employee ID is required"),
  department: z.string().optional(),
  position: z.string().optional(),
  hireDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
});

export async function addEmployee(formData: FormData) {
  const user = await getCurrentUser();

  // 1. Authorization
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized access");
  }

  // 2. Parse Data
  const rawData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    employeeNo: formData.get("employeeNo"),
    department: formData.get("department"),
    position: formData.get("position"),
    hireDate: formData.get("hireDate"),
  };

  const parsed = addEmployeeSchema.safeParse(rawData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { firstName, lastName, email, employeeNo, department, position, hireDate } = parsed.data;

  // 3. Check Duplicates
  const existing = await db.query.employees.findFirst({
    where: or(eq(employees.email, email), eq(employees.employeeNo, employeeNo)),
  });

  if (existing) {
    throw new Error("Employee with this Email or ID already exists.");
  }

  // 4. Insert Employee
  const newEmployee = await db
    .insert(employees)
    .values({
      firstName,
      lastName,
      email,
      employeeNo,
      department: department || "General",
      position: position || "Staff",
      hireDate: hireDate,
      status: "ACTIVE",
    })
    .returning({ id: employees.id });

  // 5. Audit Log
  await db.insert(auditLogs).values({
    actorId: user.id,
    action: "CREATE_USER", // or create a new enum value CREATE_EMPLOYEE
    targetId: newEmployee[0].id,
    metadata: { employeeName: `${firstName} ${lastName}`, email },
  });

  revalidatePath("/dashboard/employees");
  return { success: true };
}