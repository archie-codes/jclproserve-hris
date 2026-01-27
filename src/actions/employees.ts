"use server";

import { db } from "@/src/db";
import { employees, auditLogs } from "@/src/db/schema";
import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { desc } from "drizzle-orm";
function sanitize(value: string | undefined | null) {
  if (!value || value.trim() === "") return null;
  return value;
}

const createEmployeeSchema = z.object({
  imageUrl: z.string().optional(),
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().min(1),
  suffix: z.string().optional(),
  dateOfBirth: z.string(), 
  gender: z.enum(["MALE", "FEMALE"]),
  civilStatus: z.enum(["SINGLE", "MARRIED", "WIDOWED", "SEPARATED"]),
  
  email: z.string().email(),
  mobileNumber: z.string().min(1),
  address: z.string().optional(),
  
  employeeNo: z.string().min(1),
  department: z.string().min(1),
  position: z.string().min(1),
  status: z.enum(["PROBATIONARY", "REGULAR", "CONTRACTUAL", "PROJECT_BASED"]),
  dateHired: z.string(), 
  
  sssNo: z.string().optional(),
  tinNo: z.string().optional(),
  philHealthNo: z.string().optional(),
  pagIbigNo: z.string().optional(),
  
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

type UpdateEmployeeData = {
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  dateOfBirth: string;
  gender?: string;
  civilStatus?: string;
  imageUrl?: string;
  
  employeeNo: string;
  status: string;
  department: string;
  position: string;
  dateHired: string;
  email?: string;

  sssNo?: string;
  philHealthNo?: string;
  pagIbigNo?: string;
  tinNo?: string;
  bankName?: string;
  bankAccountNo?: string;

  address?: string;
  mobileNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
};

type EmployeeInput = z.infer<typeof createEmployeeSchema>;

export async function createEmployee(rawData: EmployeeInput) {
  try {
    const user = await getCurrentUser();

    // 1. Auth Check
    if (!user || (user.role !== "ADMIN" && user.role !== "HR")) {
      return { success: false, error: "Unauthorized access" };
    }

    // 2. Validation
    const parsed = createEmployeeSchema.safeParse(rawData);
    if (!parsed.success) {
      console.error("Validation Error:", parsed.error);
      return { success: false, error: "Invalid form data" };
    }
    const data = parsed.data;

    // 3. Duplicate Check
    const existing = await db.query.employees.findFirst({
      where: or(
        eq(employees.email, data.email),
        eq(employees.employeeNo, data.employeeNo)
      ),
    });

    if (existing) {
      return { success: false, error: "Email or Employee ID already exists." };
    }

    console.log("Attempting to insert employee...", data); // Debug Log

    // 4. Insert with Sanitization
    const [newEmployee] = await db
      .insert(employees)
      .values({
        imageUrl: data.imageUrl,
        firstName: data.firstName,
        middleName: sanitize(data.middleName), // Handle empty string
        lastName: data.lastName,
        suffix: sanitize(data.suffix) ?? "",
        dateOfBirth: data.dateOfBirth, // String "YYYY-MM-DD" is fine for Postgres Date
        gender: data.gender,
        civilStatus: data.civilStatus,
        
        email: data.email,
        mobileNumber: data.mobileNumber,
        address: sanitize(data.address),
        
        employeeNo: data.employeeNo,
        department: data.department,
        position: data.position,
        status: data.status,
        dateHired: data.dateHired,
        
        sssNo: sanitize(data.sssNo),
        tinNo: sanitize(data.tinNo),
        philHealthNo: sanitize(data.philHealthNo),
        pagIbigNo: sanitize(data.pagIbigNo),
        
        emergencyContactName: sanitize(data.emergencyContactName),
        emergencyContactPhone: sanitize(data.emergencyContactPhone),
      })
      .returning({ id: employees.id, name: employees.firstName });

    console.log("Employee inserted:", newEmployee.id);

    // 5. Audit Log (Wrapped in try/catch so it doesn't fail the whole request)
    try {
        await db.insert(auditLogs).values({
            actorId: user.id,
            action: "CREATE_USER",
            targetId: newEmployee.id,
            metadata: { 
                description: `Created employee ${newEmployee.name}`,
                employeeNo: data.employeeNo 
            },
        });
    } catch (auditError) {
        console.error("Audit Log Failed (Non-fatal):", auditError);
        // We continue because the employee was successfully created
    }

    revalidatePath("/dashboard/employees");
    return { success: true };

  } catch (error: any) {
    // 6. Log the REAL error to your terminal
    console.error("SERVER ACTION ERROR:", error);

    // 👇 ADD THIS SPECIFIC CHECK FOR DUPLICATES
    if (error.code === "23505") {
      return { 
        success: false, 
        error: "This Employee ID or Email is already taken." 
      };
    }
    
    // Return a readable error if possible
    return { 
        success: false, 
        error: error.message || "Database Error. Check server logs." 
    };
  }
}

// =========================
// GENERATE NEXT EMPLOYEE ID
// =========================
export async function getNextEmployeeId() {
  try {
    // 1. Get the most recently created employee
    const lastEmployee = await db.query.employees.findFirst({
      orderBy: [desc(employees.createdAt)], 
      columns: { employeeNo: true },
    });

    const currentYear = new Date().getFullYear();
    const prefix = "JCL";

    // 2. If no employees exist yet, start the first one
    if (!lastEmployee || !lastEmployee.employeeNo) {
      return `${prefix}-${currentYear}0001`;
    }

    // 3. Parse the last ID (Expected format: JCL-20250001)
    const lastId = lastEmployee.employeeNo;
    const parts = lastId.split("-"); // ["JCL", "20250001"]
    
    if (parts.length < 2) {
      // Fallback if format is weird
      return `${prefix}-${currentYear}0001`;
    }

    const numberPart = parts[1]; // "20250001"
    
    // Check if the ID is from the current year
    const idYear = parseInt(numberPart.substring(0, 4));
    const idSequence = parseInt(numberPart.substring(4));

    if (idYear !== currentYear) {
      // New Year? Reset sequence (Optional, but good practice)
      return `${prefix}-${currentYear}0001`;
    }

    // 4. Increment the sequence
    const nextSequence = idSequence + 1;
    
    // Pad with zeros (e.g., 1 -> 0001, 15 -> 0015)
    const paddedSequence = nextSequence.toString().padStart(4, "0");

    return `${prefix}-${currentYear}${paddedSequence}`;

  } catch (error) {
    console.error("Error generating ID:", error);
    return ""; // Return empty if error, let user type manually
  }
}

// =========================
// UPDATE EMPLOYEE
// =========================
export async function updateEmployee(id: string, data: UpdateEmployeeData) {
  if (!id) return { success: false, error: "Missing ID" };

  try {
    await db
      .update(employees)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName || null,
        suffix: data.suffix || null,
        dateOfBirth: data.dateOfBirth,
        gender: (data.gender as "MALE" | "FEMALE") || null,
        civilStatus: (data.civilStatus as "SINGLE" | "MARRIED" | "WIDOWED" | "SEPARATED") || null,
        imageUrl: data.imageUrl || null,

        employeeNo: data.employeeNo,
        status: data.status as "PROBATIONARY" | "REGULAR" | "CONTRACTUAL" | "PROJECT_BASED" | "ACTIVE" | "INACTIVE" | "TERMINATED" | "RESIGNED" | "AWOL",
        department: data.department || null,
        position: data.position || null,
        dateHired: data.dateHired,
        email: data.email || "",

        sssNo: data.sssNo || null,
        philHealthNo: data.philHealthNo || null,
        pagIbigNo: data.pagIbigNo || null,
        tinNo: data.tinNo || null,
        
        bankName: data.bankName || null,
        bankAccountNo: data.bankAccountNo || null,

        address: data.address || null,
        mobileNumber: data.mobileNumber || null,
        emergencyContactName: data.emergencyContactName || null,
        emergencyContactPhone: data.emergencyContactPhone || null,
      })
      .where(eq(employees.id, id));

    revalidatePath("/dashboard/employees");
    return { success: true }; // 👈 This fixes the "Property success does not exist" error
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "Failed to update employee" };
  }
}


// =========================
// DELETE EMPLOYEE
// =========================
export async function deleteEmployee(id: string) {
  try {
    // 1. Perform database operation
    await db.delete(employees).where(eq(employees.id, id));

    // MOCK: simulating DB delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 2. Critical: Revalidate the page to update the UI
    // Change this path to match your actual route
    revalidatePath("/dashboard/employees");

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: "Failed to delete employee" };
  }
}
