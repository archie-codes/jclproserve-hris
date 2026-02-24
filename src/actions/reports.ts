"use server";

import { db } from "@/src/db";
import { applicantResults, employees } from "@/src/db/schema";
import { asc, desc } from "drizzle-orm";

export async function getExportData() {
  try {
    const data = await db.query.employees.findMany({
      orderBy: [asc(employees.lastName)],

      // 🔴 FIX: Use 'with' to fetch related tables (Department & Position)
      with: {
        department: true,
        position: true,
      },

      // 🔴 FIX: Only keep raw database columns here
      columns: {
        employeeNo: true,
        firstName: true,
        lastName: true,
        email: true,
        // department: true, ❌ REMOVED
        // position: true,   ❌ REMOVED
        status: true,
        dateHired: true,
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Export Error:", error);
    return { success: false, error: "Failed to fetch data for export" };
  }
}

export async function getRecruitmentExportData() {
  try {
    const data = await db.query.applicantResults.findMany({
      with: {
        exam: true, // This matches the 'with' logic in your Employee export
      },
      orderBy: [desc(applicantResults.dateTaken)],
    });

    return { success: true, data };
  } catch (error) {
    console.error("Recruitment Export Error:", error);
    return { success: false, error: "Failed to fetch recruitment data" };
  }
}
