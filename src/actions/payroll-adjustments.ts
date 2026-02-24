"use server";

import { db } from "@/src/db";
import { payslips } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updatePayslipAdjustment(data: {
  id: string;
  otherDeductions: number;
  notes: string;
  periodId: string;
}) {
  try {
    // 1. Fetch current payslip to get gov deductions and gross income
    const slip = await db.query.payslips.findFirst({
      where: eq(payslips.id, data.id),
    });

    if (!slip) throw new Error("Payslip not found");

    // 2. Recalculate Totals
    const sss = slip.sss || 0;
    const ph = slip.philhealth || 0;
    const pagibig = slip.pagibig || 0;
    const gross = slip.grossIncome || 0;

    const newTotalDeductions = parseFloat(
      (sss + ph + pagibig + data.otherDeductions).toFixed(2),
    );
    const newNetPay = parseFloat((gross - newTotalDeductions).toFixed(2));

    // 3. Update Database
    await db
      .update(payslips)
      .set({
        otherDeductions: data.otherDeductions,
        notes: data.notes,
        totalDeductions: newTotalDeductions,
        netPay: newNetPay,
      })
      .where(eq(payslips.id, data.id));

    revalidatePath(`/dashboard/payroll/${data.periodId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
