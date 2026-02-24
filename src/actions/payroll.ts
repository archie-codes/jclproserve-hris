"use server";

import { db } from "@/src/db";
import {
  attendance,
  employees,
  payslips,
  payrollPeriods,
} from "@/src/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPayrollPeriods() {
  const periods = await db.query.payrollPeriods.findMany({
    orderBy: [desc(payrollPeriods.startDate)],
  });
  return periods;
}

export async function createPayrollPeriod(startDate: string, endDate: string) {
  try {
    if (new Date(startDate) >= new Date(endDate)) {
      return { success: false, error: "End date must be after start date." };
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
    console.error("Create Payroll Error:", error);
    return { success: false, error: "Failed to create payroll period." };
  }
}

export async function generatePayslips(payrollPeriodId: string) {
  try {
    // 1. Get the Payroll Period dates
    const period = await db.query.payrollPeriods.findFirst({
      where: eq(payrollPeriods.id, payrollPeriodId),
    });

    if (!period) return { success: false, error: "Period not found" };
    if (period.status === "LOCKED" || period.status === "PAID") {
      return { success: false, error: "Cannot regenerate a locked payroll." };
    }

    // 2. Get All Regular Employees
    const activeEmployees = await db.query.employees.findMany({
      where: eq(employees.status, "REGULAR"),
    });

    let totalPayrollCost = 0;

    // 3. Loop through each employee and calculate
    for (const emp of activeEmployees) {
      // A. Fetch Attendance for this Date Range
      const logs = await db.query.attendance.findMany({
        where: and(
          eq(attendance.employeeId, emp.id),
          gte(attendance.date, period.startDate), // >= Start Date
          lte(attendance.date, period.endDate), // <= End Date
        ),
      });

      // B. Sum up hours from the 'totalHours' column we just created
      let totalHours = 0;
      let daysWorked = 0;

      logs.forEach((log) => {
        if (log.totalHours && log.totalHours > 0) {
          totalHours += log.totalHours;
          // Count as 1 day if they worked at least 4 hours (adjust rule as needed)
          if (log.totalHours >= 4) daysWorked += 1;
        }
      });

      // C. FINANCIAL CALCULATION
      // Assumption: basicSalary is the DAILY Rate.
      // If it's Monthly, divide by 22 or 30.
      const dailyRate = emp.basicSalary || 500; // Default fallback rate
      const grossIncome = dailyRate * daysWorked;

      // Deductions (Simple % rules)
      const sss = grossIncome * 0.045;
      const philhealth = grossIncome * 0.04;
      const pagibig = 100; // Fixed
      const totalDeductions = sss + philhealth + pagibig;

      const netPay = grossIncome - totalDeductions;

      // D. Save or Update Payslip
      const existingPayslip = await db.query.payslips.findFirst({
        where: and(
          eq(payslips.payrollPeriodId, payrollPeriodId),
          eq(payslips.employeeId, emp.id),
        ),
      });

      if (existingPayslip) {
        await db
          .update(payslips)
          .set({
            daysWorked,
            grossIncome,
            sss,
            philhealth,
            pagibig,
            totalDeductions,
            netPay,
            generatedAt: new Date(),
          })
          .where(eq(payslips.id, existingPayslip.id));
      } else {
        await db.insert(payslips).values({
          payrollPeriodId,
          employeeId: emp.id,
          daysWorked,
          basicSalary: dailyRate,
          grossIncome,
          sss,
          philhealth,
          pagibig,
          totalDeductions,
          netPay,
        });
      }

      totalPayrollCost += netPay;
    }

    // 4. Update the Payroll Period Total Amount
    await db
      .update(payrollPeriods)
      .set({ totalAmount: totalPayrollCost })
      .where(eq(payrollPeriods.id, payrollPeriodId));

    revalidatePath(`/dashboard/payroll/${payrollPeriodId}`);
    return {
      success: true,
      message: `Processed ${activeEmployees.length} employees.`,
    };
  } catch (error) {
    console.error("Payroll Error:", error);
    return { success: false, error: "Calculation failed." };
  }
}
