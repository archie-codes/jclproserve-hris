"use server";

import { db } from "@/src/db";
import { attendance, employees } from "@/src/db/schema";
import { eq, and, or, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getUtilityStaff() {
  try {
    // Fetch active employees in Utility or Operations departments
    // Adjust "Utility" to match exactly what you type in your dropdown
    const staff = await db.query.employees.findMany({
      where: and(
        or(
          eq(employees.position, "UTILITY"),
          eq(employees.position, "OPERATIONS"),
          eq(employees.position, "MAINTENANCE")
        ),
        eq(employees.status, "PROBATIONARY"), // Only active staff
        // If you use "REGULAR" or "PROBATIONARY" instead of ACTIVE, change this line
      ),
      orderBy: [asc(employees.lastName)],
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        position: true,
      },
    });
    
    return staff;
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

type AttendanceRecord = {
  employeeId: string;
  timeIn: string;  // Format: "08:00"
  timeOut: string; // Format: "17:00"
};

export async function saveBulkAttendance(dateStr: string, records: AttendanceRecord[]) {
  try {
    const operations = records.map(async (record) => {
      // 1. Skip rows that have no time data to avoid cluttering DB
      if (!record.timeIn && !record.timeOut) return;

      // 2. Combine Date + Time into a full Timestamp Object
      // e.g., "2024-01-30" + "08:00" = 2024-01-30T08:00:00.000Z
      const timeInDate = record.timeIn ? new Date(`${dateStr}T${record.timeIn}`) : null;
      const timeOutDate = record.timeOut ? new Date(`${dateStr}T${record.timeOut}`) : null;

      // 3. Check if a record already exists for this person on this specific date
      const existing = await db.query.attendance.findFirst({
        where: and(
          eq(attendance.employeeId, record.employeeId),
          eq(attendance.date, dateStr)
        ),
      });

      // 4. Update if exists, Insert if new
      if (existing) {
        return db.update(attendance)
          .set({ 
            timeIn: timeInDate, 
            timeOut: timeOutDate 
          })
          .where(eq(attendance.id, existing.id));
      } else {
        return db.insert(attendance).values({
          employeeId: record.employeeId,
          date: dateStr,
          timeIn: timeInDate,
          timeOut: timeOutDate,
        });
      }
    });

    await Promise.all(operations);
    revalidatePath("/dashboard/attendance");
    return { success: true };
  } catch (error) {
    console.error("Attendance Save Error:", error);
    return { success: false, error: "Failed to save records." };
  }
}