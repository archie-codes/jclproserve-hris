"use server";

import { db } from "@/src/db";
import { attendance, employees } from "@/src/db/schema";
import { eq, and, asc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Fetches all staff and their attendance logs for a specific date.
 * Updated to support multiple shifts per employee.
 */
export async function getStaffAttendance(dateStr: string) {
  try {
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
        attendance: {
          where: eq(attendance.date, dateStr),
          orderBy: [asc(attendance.timeIn)], // Keep shifts in chronological order
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
  timeIn: string; // Format: "HH:mm"
  timeOut: string; // Format: "HH:mm"
};

/**
 * Saves all attendance records from the grid.
 * Handles split shifts by clearing existing logs for the edited employees
 * and re-inserting the current state of the UI grid.
 */
export async function saveBulkAttendance(
  dateStr: string,
  records: AttendanceRecord[],
) {
  try {
    // 1. Identify which employees are being updated in this batch
    const employeeIds = Array.from(new Set(records.map((r) => r.employeeId)));
    if (employeeIds.length === 0) return { success: true };

    // 2. Clear existing records sequentially
    // Step A: Delete all existing logs for these specific employees on this date
    await db
      .delete(attendance)
      .where(
        and(
          eq(attendance.date, dateStr),
          inArray(attendance.employeeId, employeeIds),
        ),
      );

    // Step B: Prepare the new records for insertion
    const recordsToInsert = records
      // 👇 FIX 1: Changed && to || so it keeps active shifts (Time In only)
      .filter((r) => r.timeIn || r.timeOut)
      .map((record) => {
        let timeInDate = null;
        let timeOutDate = null;
        let totalHours = 0;
        let overtimeMinutes = 0;

        // Safely parse dates if they exist
        if (record.timeIn) {
          timeInDate = new Date(`${dateStr}T${record.timeIn}:00+08:00`);
        }
        if (record.timeOut) {
          timeOutDate = new Date(`${dateStr}T${record.timeOut}:00+08:00`);
        }

        // 👇 FIX 2: Only do the math if BOTH times exist
        if (timeInDate && timeOutDate) {
          let diffInMs = timeOutDate.getTime() - timeInDate.getTime();
          // Handle graveyard shift (crossing midnight)
          if (diffInMs < 0) {
            diffInMs += 24 * 60 * 60 * 1000;
          }

          let rawHours = diffInMs / (1000 * 60 * 60);

          // Lunch deduction rule
          if (rawHours >= 9) {
            rawHours -= 1;
          }

          totalHours = parseFloat(rawHours.toFixed(2));
          overtimeMinutes =
            totalHours > 8 ? Math.round((totalHours - 8) * 60) : 0;
        }

        return {
          employeeId: record.employeeId,
          date: dateStr,
          timeIn: timeInDate,
          timeOut: timeOutDate,
          totalHours: totalHours,
          overtimeMinutes: overtimeMinutes,
          status: "PRESENT",
        };
      });

    // Step C: Insert the new rows
    if (recordsToInsert.length > 0) {
      await db.insert(attendance).values(recordsToInsert);
    }

    revalidatePath("/dashboard/attendance");
    return { success: true };
  } catch (error) {
    console.error("Attendance Save Error:", error);
    return { success: false, error: "Failed to save records." };
  }
}

/**
 * Handles manual entry via the Modal.
 * This uses a simple Insert, as the modal is usually for adding single missing logs.
 */
export async function addManualTimeLogAction(formData: FormData) {
  try {
    const employeeId = formData.get("employeeId") as string;
    const date = formData.get("date") as string;
    const timeInStr = formData.get("timeIn") as string;
    const timeOutStr = formData.get("timeOut") as string;

    if (!employeeId || !date || !timeInStr || !timeOutStr) {
      return { success: false, error: "All fields are required." };
    }

    const timeIn = new Date(`${date}T${timeInStr}:00+08:00`);
    const timeOut = new Date(`${date}T${timeOutStr}:00+08:00`);

    let diffMs = timeOut.getTime() - timeIn.getTime();
    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;

    const totalHours = diffMs / (1000 * 60 * 60);

    await db.insert(attendance).values({
      employeeId,
      date,
      timeIn,
      timeOut,
      totalHours: parseFloat(totalHours.toFixed(2)),
      status: "PRESENT",
    });

    revalidatePath("/dashboard/attendance");
    return { success: true, message: "Manual time log added successfully!" };
  } catch (error) {
    console.error("Manual Log Error:", error);
    return { success: false, error: "Failed to save time log." };
  }
}
