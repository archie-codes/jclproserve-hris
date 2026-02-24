"use server";

import { db } from "@/src/db";
import {
  attendance,
  employees,
  payrollPeriods,
  payslips,
  payrollSettings,
} from "@/src/db/schema";
import { eq, and, gte, lte, desc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPayrollPeriods() {
  try {
    const periods = await db.query.payrollPeriods.findMany({
      orderBy: [desc(payrollPeriods.startDate)],
    });
    return periods;
  } catch (error) {
    console.error("Error fetching payroll periods:", error);
    return [];
  }
}

export async function generatePayslipsAction(periodId: string) {
  try {
    // 1. Fetch current HR Settings (Rates)
    const settings = await db.query.payrollSettings.findFirst();

    // Fallback to standard rates if settings haven't been configured yet
    const sssRate = settings?.sssRate ?? 0.045; // 4.5%
    const phRate = settings?.philhealthRate ?? 0.025; // 2.5%
    const pagibigFixed = settings?.pagibigAmount ?? 200;

    // 2. Fetch the specific Payroll Period
    const period = await db.query.payrollPeriods.findFirst({
      where: eq(payrollPeriods.id, periodId),
    });

    if (!period) throw new Error("Payroll period not found");

    // 3. Fetch all Active Employees
    const allStaff = await db.query.employees.findMany({
      where: inArray(employees.status, [
        "REGULAR",
        "PROBATIONARY",
        "CONTRACTUAL",
        "PROJECT_BASED",
        "ACTIVE",
      ]),
    });

    let grandTotalPayout = 0;

    // 4. Loop through every employee and calculate their pay
    const operations = allStaff.map(async (emp) => {
      const logs = await db.query.attendance.findMany({
        where: and(
          eq(attendance.employeeId, emp.id),
          gte(attendance.date, period.startDate),
          lte(attendance.date, period.endDate),
        ),
      });

      const totalHours = logs.reduce(
        (sum, log) => sum + (log.totalHours || 0),
        0,
      );
      const daysWorked = parseFloat((totalHours / 8).toFixed(2));

      // Get Monthly Salary (Converted from Centavos in DB to standard Pesos)
      const monthlySalary = Number(emp.basicSalary || 0) / 100;
      const dailyRate = monthlySalary / 22;
      const grossIncome = parseFloat((daysWorked * dailyRate).toFixed(2));

      // Calculate Deductions using the dynamic settings
      let sss = 0;
      let philhealth = 0;
      let pagibig = 0;

      if (grossIncome > 0) {
        // Apply dynamic rates from database
        sss = parseFloat((monthlySalary * sssRate).toFixed(2));
        if (sss > 1350) sss = 1350; // SSS Cap example

        philhealth = parseFloat((monthlySalary * phRate).toFixed(2));
        if (philhealth > 2500) philhealth = 2500; // PhilHealth Cap example

        // Pag-IBIG standard logic: 100 for low earners, fixed amount for others
        pagibig = monthlySalary >= 1500 ? pagibigFixed : 100;
      }

      const totalDeductions = parseFloat(
        (sss + philhealth + pagibig).toFixed(2),
      );
      const netPay = parseFloat((grossIncome - totalDeductions).toFixed(2));

      if (daysWorked > 0 || netPay > 0) {
        grandTotalPayout += netPay;

        const existingSlip = await db.query.payslips.findFirst({
          where: and(
            eq(payslips.payrollPeriodId, periodId),
            eq(payslips.employeeId, emp.id),
          ),
        });

        const slipData = {
          payrollPeriodId: periodId,
          employeeId: emp.id,
          daysWorked,
          grossIncome,
          sss,
          philhealth,
          pagibig,
          // 👇 If an existing slip has manual notes/deductions, keep them!
          otherDeductions: existingSlip?.otherDeductions ?? 0,
          notes: existingSlip?.notes ?? "",
          // 👇 Total deductions now includes 'otherDeductions'
          totalDeductions: parseFloat(
            (
              sss +
              philhealth +
              pagibig +
              (existingSlip?.otherDeductions ?? 0)
            ).toFixed(2),
          ),
          netPay: parseFloat(
            (
              grossIncome -
              (sss +
                philhealth +
                pagibig +
                (existingSlip?.otherDeductions ?? 0))
            ).toFixed(2),
          ),
        };

        if (existingSlip) {
          return db
            .update(payslips)
            .set(slipData)
            .where(eq(payslips.id, existingSlip.id));
        } else {
          return db.insert(payslips).values(slipData);
        }
      }
    });

    await Promise.all(operations);

    // Update the total amount for the Payroll Period
    await db
      .update(payrollPeriods)
      .set({ totalAmount: parseFloat(grandTotalPayout.toFixed(2)) })
      .where(eq(payrollPeriods.id, periodId));

    revalidatePath(`/dashboard/payroll/${periodId}`);
    return {
      success: true,
      message: "Payslips generated using current HR settings!",
    };
  } catch (error) {
    console.error("Generate Payslips Error:", error);
    return { success: false, error: "Failed to generate payslips." };
  }
}

export async function createPayrollPeriod(startDate: string, endDate: string) {
  try {
    if (new Date(endDate) < new Date(startDate)) {
      return {
        success: false,
        error: "End date cannot be before the start date.",
      };
    }

    await db.insert(payrollPeriods).values({
      startDate,
      endDate,
      status: "DRAFT",
      totalAmount: 0,
    });

    revalidatePath("/dashboard/payroll");
    return { success: true };
  } catch (error) {
    console.error("Create Payroll Period Error:", error);
    return { success: false, error: "Failed to create new cut-off period." };
  }
}
