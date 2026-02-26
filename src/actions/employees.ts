"use server";

import { db } from "@/src/db";
import { employees, auditLogs, payslips, attendance } from "@/src/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";

function sanitize(value: string | undefined | null) {
  if (!value || value.trim() === "") return null;
  return value;
}

// =========================
// 1. VALIDATION SCHEMA
// =========================
const createEmployeeSchema = z.object({
  // Identifiers
  employeeNo: z.string().min(1, "Employee ID is required"),

  // Personal
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  suffix: z.string().optional(),
  dateOfBirth: z.string().min(1, "Birth date is required"),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  civilStatus: z.enum(["SINGLE", "MARRIED", "WIDOWED", "SEPARATED"]).optional(),
  imageUrl: z.string().optional(),

  // Contact
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().optional(),
  address: z.string().optional(),

  // Work (UUIDs)
  departmentId: z.string().uuid("Invalid Department ID"),
  positionId: z.string().uuid("Invalid Position ID"),
  shiftId: z.string().uuid("Invalid Shift ID").optional(),

  status: z.enum(["PROBATIONARY", "REGULAR", "CONTRACTUAL", "PROJECT_BASED"]),
  dateHired: z.string().min(1, "Date hired is required"),
  dateRegularized: z.string().optional(),

  // Gov IDs
  sssNo: z.string().optional(),
  tinNo: z.string().optional(),
  philHealthNo: z.string().optional(),
  pagIbigNo: z.string().optional(),

  // Banking
  bankName: z.string().optional(),
  bankAccountNo: z.string().optional(),

  // Emergency
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),

  // Compensation
  basicSalary: z.coerce.number().min(0, "Basic salary is required"),
  salaryType: z
    .enum(["DAILY", "MONTHLY", "SEMI_MONTHLY"])
    .default("SEMI_MONTHLY"),
  allowance: z.coerce.number().optional().default(0),
});

export type EmployeeInput = z.infer<typeof createEmployeeSchema>;

// =========================
// 2. CREATE EMPLOYEE ACTION
// =========================
export async function createEmployee(rawData: EmployeeInput) {
  try {
    const user = await getCurrentUser();

    // A. Auth Check
    if (!user || (user.role !== "ADMIN" && user.role !== "HR")) {
      return { success: false, error: "Unauthorized access" };
    }

    // B. Validation
    const parsed = createEmployeeSchema.safeParse(rawData);
    if (!parsed.success) {
      console.error("Validation Error:", parsed.error.format());
      return { success: false, error: "Invalid form data" };
    }
    const data = parsed.data;

    // C. Duplicate Check
    const existing = await db.query.employees.findFirst({
      where: or(
        eq(employees.email, data.email),
        eq(employees.employeeNo, data.employeeNo),
      ),
    });

    if (existing) {
      return { success: false, error: "Email or Employee ID already exists." };
    }

    // D. Insert into Database
    const [newEmployee] = await db
      .insert(employees)
      .values({
        // Identifiers
        employeeNo: data.employeeNo,

        // Personal
        imageUrl: sanitize(data.imageUrl),
        firstName: data.firstName,
        middleName: sanitize(data.middleName),
        lastName: data.lastName,
        suffix: sanitize(data.suffix),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        civilStatus: data.civilStatus,

        // Contact
        email: data.email,
        mobileNumber: sanitize(data.mobileNumber),
        address: sanitize(data.address),

        // Work Relations (UUIDs)
        departmentId: data.departmentId,
        positionId: data.positionId,
        shiftId: data.shiftId,

        status: data.status,
        dateHired: data.dateHired,
        dateRegularized: sanitize(data.dateRegularized),

        // Govt IDs
        sssNo: sanitize(data.sssNo),
        tinNo: sanitize(data.tinNo),
        philHealthNo: sanitize(data.philHealthNo),
        pagIbigNo: sanitize(data.pagIbigNo),

        // Banking
        bankName: sanitize(data.bankName),
        bankAccountNo: sanitize(data.bankAccountNo),

        // Emergency
        emergencyContactName: sanitize(data.emergencyContactName),
        emergencyContactPhone: sanitize(data.emergencyContactPhone),

        // Compensation
        basicSalary: Math.round(data.basicSalary * 100),
        salaryType: data.salaryType,

        // 🚨 FIX: Map 'allowance' to 'taxableAllowance' 🚨
        taxableAllowance: Math.round((data.allowance || 0) * 100),
      })
      .returning({ id: employees.id, firstName: employees.firstName });

    // E. Audit Log
    try {
      await db.insert(auditLogs).values({
        actorId: user.id,
        action: "CREATE_USER",
        targetId: newEmployee.id,
        metadata: {
          description: `Created employee ${newEmployee.firstName}`,
          employeeNo: data.employeeNo,
        },
      });
    } catch (auditError) {
      console.error("Audit Log Failed:", auditError);
    }

    revalidatePath("/dashboard/employees");
    return { success: true };
  } catch (error: any) {
    console.error("SERVER ACTION ERROR:", error);
    return {
      success: false,
      error: error.message || "Database Error. Check server logs.",
    };
  }
}

// =========================
// 3. GENERATE NEXT ID
// =========================
export async function getNextEmployeeId() {
  try {
    const lastEmployee = await db.query.employees.findFirst({
      orderBy: [desc(employees.createdAt)],
      columns: { employeeNo: true },
    });

    const currentYear = new Date().getFullYear();
    const prefix = "JCL";

    if (!lastEmployee || !lastEmployee.employeeNo) {
      return `${prefix}-${currentYear}0001`;
    }

    const lastId = lastEmployee.employeeNo;
    const parts = lastId.split("-");

    if (parts.length < 2) return `${prefix}-${currentYear}0001`;

    const numberPart = parts[1];
    const idYear = parseInt(numberPart.substring(0, 4));
    const idSequence = parseInt(numberPart.substring(4));

    if (idYear !== currentYear) {
      return `${prefix}-${currentYear}0001`;
    }

    const nextSequence = idSequence + 1;
    const paddedSequence = nextSequence.toString().padStart(4, "0");

    return `${prefix}-${currentYear}${paddedSequence}`;
  } catch (error) {
    console.error("Error generating ID:", error);
    return "";
  }
}

// =========================
// 4. UPDATE EMPLOYEE
// =========================
type UpdateEmployeeData = Partial<EmployeeInput> & {
  dateResigned?: string | null;
};

export async function updateEmployee(id: string, data: any) {
  if (!id) return { success: false, error: "Missing ID" };

  try {
    // Sanitize Compensation before update
    const safeBasic =
      data.basicSalary !== undefined
        ? Math.round(Number(data.basicSalary) * 100)
        : undefined;
    const safeAllowance =
      data.allowance !== undefined
        ? Math.round(Number(data.allowance) * 100)
        : undefined;

    await db
      .update(employees)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: sanitize(data.middleName),
        suffix: sanitize(data.suffix),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        civilStatus: data.civilStatus,
        imageUrl: sanitize(data.imageUrl),

        employeeNo: data.employeeNo,
        status: data.status,

        departmentId: data.departmentId,
        positionId: data.positionId,
        shiftId: data.shiftId,

        dateResigned: sanitize(data.dateResigned),
        dateHired: data.dateHired,
        dateRegularized: sanitize(data.dateRegularized),

        email: data.email,
        mobileNumber: sanitize(data.mobileNumber),
        address: sanitize(data.address),

        sssNo: sanitize(data.sssNo),
        philHealthNo: sanitize(data.philHealthNo),
        pagIbigNo: sanitize(data.pagIbigNo),
        tinNo: sanitize(data.tinNo),

        bankName: sanitize(data.bankName),
        bankAccountNo: sanitize(data.bankAccountNo),

        emergencyContactName: sanitize(data.emergencyContactName),
        emergencyContactPhone: sanitize(data.emergencyContactPhone),

        basicSalary: safeBasic,
        salaryType: data.salaryType,

        // 🚨 FIX: Map 'allowance' to 'taxableAllowance' 🚨
        taxableAllowance: safeAllowance,
      })
      .where(eq(employees.id, id));

    revalidatePath("/dashboard/employees");
    return { success: true };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "Failed to update employee" };
  }
}

// // =========================
// // 5. DELETE EMPLOYEE
// // =========================
// export async function deleteEmployee(id: string) {
//   try {
//     await db.delete(employees).where(eq(employees.id, id));
//     revalidatePath("/dashboard/employees");
//     return { success: true };
//   } catch (error) {
//     console.error("Delete error:", error);
//     return { success: false, error: "Failed to delete employee" };
//   }
// }

// =========================
// 5. DELETE EMPLOYEE
// =========================
export async function deleteEmployee(id: string) {
  try {
    // 1. HARD DELETE: Wipe out the child records FIRST
    // This clears out the dummy's history so the database doesn't complain about Foreign Keys
    await db.delete(payslips).where(eq(payslips.employeeId, id));
    await db.delete(attendance).where(eq(attendance.employeeId, id));

    // (If you have a table for loans/deductions, you would delete them here too)

    // 2. NOW you can safely delete the dummy employee
    await db.delete(employees).where(eq(employees.id, id));

    revalidatePath("/dashboard/employees");
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: "Failed to delete employee" };
  }
}
