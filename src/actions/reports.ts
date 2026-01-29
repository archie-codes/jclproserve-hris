"use server";

import { db } from "@/src/db";
import { employees } from "@/src/db/schema";
import { asc } from "drizzle-orm";

export async function getExportData() {
  try {
    const data = await db.query.employees.findMany({
      orderBy: [asc(employees.lastName)],
      columns: {
        employeeNo: true,
        firstName: true,
        lastName: true,
        email: true,
        department: true,
        position: true,
        status: true,
        dateHired: true,
      }
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Failed to fetch data for export" };
  }
}