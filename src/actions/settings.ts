"use server";

import { eq } from "drizzle-orm";
import { db } from "@/src/db";
import { payrollSettings } from "@/src/db/schema";
import { revalidatePath } from "next/cache";

export async function getPayrollSettings() {
  try {
    const settings = await db.query.payrollSettings.findFirst();
    return settings || null;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

export async function updatePayrollSettingsAction(data: {
  sssRate: number;
  philhealthRate: number;
  pagibigAmount: number;
}) {
  try {
    const existing = await db.query.payrollSettings.findFirst();

    if (existing) {
      await db
        .update(payrollSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(payrollSettings.id, existing.id));
    } else {
      await db.insert(payrollSettings).values(data);
    }

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Update Settings Error:", error);
    return { success: false, error: "Failed to update settings." };
  }
}
