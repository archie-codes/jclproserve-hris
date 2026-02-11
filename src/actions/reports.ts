"use server";

import { db } from "@/src/db";
import { employees } from "@/src/db/schema";
import { asc } from "drizzle-orm";

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
      }
    });
    
    return { success: true, data };
  } catch (error) {
    console.error("Export Error:", error);
    return { success: false, error: "Failed to fetch data for export" };
  }
}