"use server";

import { db } from "@/src/db";
import { employees, attendance } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function clockInOrOut(
  employeeNo: string,
  pin: string,
  type: "IN" | "OUT",
) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    // 1. Find Employee
    const employee = await db.query.employees.findFirst({
      where: eq(employees.employeeNo, employeeNo),
    });

    if (!employee) return { success: false, error: "Employee ID not found." };

    // 2. Verify PIN (Simple security)
    // Note: Ensure you added 'pinCode' to your employees schema as discussed!
    if (employee.pinCode !== pin) {
      return { success: false, error: "Invalid PIN code." };
    }

    // 3. Find Today's Record
    const existingLog = await db.query.attendance.findFirst({
      where: and(
        eq(attendance.employeeId, employee.id),
        eq(attendance.date, today),
      ),
    });

    // 4. PROCESS TIME IN
    if (type === "IN") {
      if (existingLog) {
        return {
          success: false,
          error: `You already clocked in at ${existingLog.timeIn?.toLocaleTimeString()}.`,
        };
      }

      await db.insert(attendance).values({
        employeeId: employee.id,
        date: today,
        timeIn: new Date(),
        status: "PRESENT",
        totalHours: 0,
      });

      revalidatePath("/dashboard/attendance");
      return { success: true, message: `Good morning, ${employee.firstName}!` };
    }

    // 5. PROCESS TIME OUT
    if (type === "OUT") {
      if (!existingLog)
        return { success: false, error: "You haven't clocked in yet today." };
      if (existingLog.timeOut)
        return { success: false, error: "You already clocked out." };

      // Calculate Hours
      const start = new Date(existingLog.timeIn!);
      const end = new Date();
      let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      // Lunch Rule: Deduct 1 hour if worked > 5 hours
      if (diff > 5) diff -= 1;

      const finalHours = Math.max(0, parseFloat(diff.toFixed(2)));

      // Determine Status (Late/Undertime vs Present)
      // Simple rule: < 4 hours is HALF_DAY, otherwise PRESENT (or keep existing status)
      const status = finalHours < 4 ? "HALF_DAY" : existingLog.status;

      await db
        .update(attendance)
        .set({
          timeOut: end,
          totalHours: finalHours,
          status: status,
        })
        .where(eq(attendance.id, existingLog.id));

      revalidatePath("/dashboard/attendance");
      return {
        success: true,
        message: `Goodbye, ${employee.firstName}! See you tomorrow.`,
      };
    }

    return { success: false, error: "Invalid action." };
  } catch (err) {
    console.error("Clock In Error:", err);
    return { success: false, error: "System error. Please try again." };
  }
}
