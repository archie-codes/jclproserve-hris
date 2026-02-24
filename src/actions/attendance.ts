"use server";

import { db } from "@/src/db";
import { attendance, employees } from "@/src/db/schema";
import { eq, and, asc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getStaffAttendance(dateStr: string) {
  try {
    // 1. Fetch active employees
    const staff = await db.query.employees.findMany({
      where: inArray(employees.status, [
        "REGULAR",
        "PROBATIONARY",
        "CONTRACTUAL",
      ]),
      orderBy: [asc(employees.lastName)],
      with: {
        department: true,
        position: true,
        // 👇 Fetch their attendance specifically for the selected date!
        attendance: {
          where: eq(attendance.date, dateStr),
          limit: 1,
        },
      },
    });

    return staff;
  } catch (error) {
    console.error("Error fetching staff attendance:", error);
    return [];
  }
}

type AttendanceRecord = {
  employeeId: string;
  timeIn: string; // Format: "08:00"
  timeOut: string; // Format: "17:00"
};

export async function saveBulkAttendance(
  dateStr: string,
  records: AttendanceRecord[],
) {
  try {
    const operations = records.map(async (record) => {
      // 1. Skip rows that have no time data to avoid cluttering DB
      if (!record.timeIn && !record.timeOut) return;

      // 2. Combine Date + Time into a full Timestamp Object
      const timeInDate = record.timeIn
        ? new Date(`${dateStr}T${record.timeIn}:00+08:00`)
        : null;
      const timeOutDate = record.timeOut
        ? new Date(`${dateStr}T${record.timeOut}:00+08:00`)
        : null;

      // 👇 FIX: Calculate the total hours worked (with Night Shift support!)
      let calculatedHours = 0;
      if (timeInDate && timeOutDate) {
        // Get the difference in milliseconds
        let diffInMs = timeOutDate.getTime() - timeInDate.getTime();

        // 🔥 THE NIGHT SHIFT FIX:
        // If diffInMs is negative, they crossed midnight. Add 24 hours (in ms).
        if (diffInMs < 0) {
          diffInMs += 24 * 60 * 60 * 1000;
        }

        // Convert milliseconds to hours (1000ms * 60s * 60m)
        let rawHours = diffInMs / (1000 * 60 * 60);

        // Optional: If you want to automatically deduct 1 hour for lunch
        // when they work a full 9-hour shift
        if (rawHours >= 9) {
          rawHours -= 1;
        }

        // Round to 2 decimal places (e.g., 8.00)
        calculatedHours = parseFloat(rawHours.toFixed(2));
      }

      // 3. Check if a record already exists for this person on this specific date
      const existing = await db.query.attendance.findFirst({
        where: and(
          eq(attendance.employeeId, record.employeeId),
          eq(attendance.date, dateStr),
        ),
      });

      // 4. Update if exists, Insert if new
      if (existing) {
        return db
          .update(attendance)
          .set({
            timeIn: timeInDate,
            timeOut: timeOutDate,
            totalHours: calculatedHours,
          })
          .where(eq(attendance.id, existing.id));
      } else {
        return db.insert(attendance).values({
          employeeId: record.employeeId,
          date: dateStr,
          timeIn: timeInDate,
          timeOut: timeOutDate,
          totalHours: calculatedHours,
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
