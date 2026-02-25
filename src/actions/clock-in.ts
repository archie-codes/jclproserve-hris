"use server";

import { db } from "@/src/db";
import { employees, attendance } from "@/src/db/schema";
import { eq, and, desc } from "drizzle-orm"; // 👇 Added 'desc' here
import { revalidatePath } from "next/cache";

export async function clockInOrOut(
  employeeNo: string,
  pin: string,
  type: "IN" | "OUT",
) {
  // Force Philippine Timezone for the "Today" string
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  try {
    // 1. Find Employee
    const employee = await db.query.employees.findFirst({
      where: eq(employees.employeeNo, employeeNo),
    });

    if (!employee) return { success: false, error: "Employee ID not found." };

    // 2. Verify PIN
    if (employee.pinCode !== pin) {
      return { success: false, error: "Invalid PIN code." };
    }

    // 3. Find Today's LATEST Record (✨ Split Shift Upgrade ✨)
    // By ordering by timeIn descending, we get their most recent punch
    const latestLog = await db.query.attendance.findFirst({
      where: and(
        eq(attendance.employeeId, employee.id),
        eq(attendance.date, today),
      ),
      orderBy: [desc(attendance.timeIn)],
    });

    // 4. PROCESS TIME IN
    if (type === "IN") {
      if (latestLog) {
        // Condition A: They are currently clocked in and forgot to clock out
        if (!latestLog.timeOut) {
          const timeInString = latestLog.timeIn?.toLocaleTimeString("en-US", {
            timeZone: "Asia/Manila",
          });
          return {
            success: false,
            error: `You already clocked in at ${timeInString}. Please clock out first.`,
          };
        }

        // Condition B: They ALREADY completed a shift today (TimeOut exists)
        // 👇 This prevents the automatic creation of a split schedule!
        if (latestLog.timeOut) {
          return {
            success: false,
            error: "You have already completed your shift for today.",
          };
        }
      }

      // Safe to clock in! (Creates their FIRST and ONLY shift of the day)
      await db.insert(attendance).values({
        employeeId: employee.id,
        date: today,
        timeIn: new Date(),
        status: "PRESENT",
        totalHours: 0,
      });

      revalidatePath("/dashboard/attendance");
      return {
        success: true,
        message: `Good morning, ${employee.firstName}!`,
      };
    }

    // 5. PROCESS TIME OUT
    if (type === "OUT") {
      // If no logs today, or the latest log already has a time out
      if (!latestLog)
        return { success: false, error: "You haven't clocked in yet today." };
      if (latestLog.timeOut)
        return {
          success: false,
          error: "You already clocked out of your latest shift.",
        };

      // Calculate Hours
      const start = new Date(latestLog.timeIn!);
      const end = new Date();
      let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      // Lunch Rule: Deduct 1 hour if worked > 5 hours
      if (diff > 5) diff -= 1;

      const finalHours = Math.max(0, parseFloat(diff.toFixed(2)));

      // Note: If this is a split shift (e.g. 4 hrs + 4 hrs), each individual shift might be < 4.
      // We'll keep your half day logic local to this specific punch segment.
      const status = finalHours < 4 ? "HALF_DAY" : latestLog.status;

      await db
        .update(attendance)
        .set({
          timeOut: end,
          totalHours: finalHours,
          status: status,
        })
        .where(eq(attendance.id, latestLog.id));

      revalidatePath("/dashboard/attendance");
      return {
        success: true,
        message: `Goodbye, ${employee.firstName}! Shift ended successfully.`,
      };
    }

    return { success: false, error: "Invalid action." };
  } catch (err) {
    console.error("Clock In Error:", err);
    return { success: false, error: "System error. Please try again." };
  }
}
