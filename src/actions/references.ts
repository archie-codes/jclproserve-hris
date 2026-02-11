"use server";
import { db } from "@/src/db";
import { departments, positions, shifts } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function getFormReferences() {
  const allDepartments = await db.select().from(departments);
  const allPositions = await db.select().from(positions);
  const allShifts = await db.select().from(shifts);
  
  return {
    departments: allDepartments,
    positions: allPositions,
    shifts: allShifts
  };
}