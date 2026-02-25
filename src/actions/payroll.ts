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

// export async function generatePayslipsAction(periodId: string) {
//   try {
//     // 1. Fetch current HR Settings (Rates)
//     const settings = await db.query.payrollSettings.findFirst();

//     // Fallback to standard rates if settings haven't been configured yet
//     const sssRate = settings?.sssRate ?? 0.045; // 4.5%
//     const phRate = settings?.philhealthRate ?? 0.025; // 2.5%
//     const pagibigFixed = settings?.pagibigAmount ?? 200;

//     // 2. Fetch the specific Payroll Period
//     const period = await db.query.payrollPeriods.findFirst({
//       where: eq(payrollPeriods.id, periodId),
//     });

//     if (!period) throw new Error("Payroll period not found");

//     // 3. Fetch all Active Employees
//     const allStaff = await db.query.employees.findMany({
//       where: inArray(employees.status, [
//         "REGULAR",
//         "PROBATIONARY",
//         "CONTRACTUAL",
//         "PROJECT_BASED",
//         "ACTIVE",
//       ]),
//     });

//     let grandTotalPayout = 0;

//     // 4. Loop through every employee and calculate their pay
//     const operations = allStaff.map(async (emp) => {
//       const logs = await db.query.attendance.findMany({
//         where: and(
//           eq(attendance.employeeId, emp.id),
//           gte(attendance.date, period.startDate),
//           lte(attendance.date, period.endDate),
//         ),
//       });

//       const totalHours = logs.reduce(
//         (sum, log) => sum + (log.totalHours || 0),
//         0,
//       );
//       const daysWorked = parseFloat((totalHours / 8).toFixed(2));

//       // Get Monthly Salary (Converted from Centavos in DB to standard Pesos)
//       const monthlySalary = Number(emp.basicSalary || 0) / 100;
//       const dailyRate = monthlySalary / 22;
//       const grossIncome = parseFloat((daysWorked * dailyRate).toFixed(2));

//       // Calculate Deductions using the dynamic settings
//       let sss = 0;
//       let philhealth = 0;
//       let pagibig = 0;

//       if (grossIncome > 0) {
//         // Apply dynamic rates from database
//         sss = parseFloat((monthlySalary * sssRate).toFixed(2));
//         if (sss > 1350) sss = 1350; // SSS Cap example

//         philhealth = parseFloat((monthlySalary * phRate).toFixed(2));
//         if (philhealth > 2500) philhealth = 2500; // PhilHealth Cap example

//         // Pag-IBIG standard logic: 100 for low earners, fixed amount for others
//         pagibig = monthlySalary >= 1500 ? pagibigFixed : 100;
//       }

//       const totalDeductions = parseFloat(
//         (sss + philhealth + pagibig).toFixed(2),
//       );
//       const netPay = parseFloat((grossIncome - totalDeductions).toFixed(2));

//       if (daysWorked > 0 || netPay > 0) {
//         grandTotalPayout += netPay;

//         const existingSlip = await db.query.payslips.findFirst({
//           where: and(
//             eq(payslips.payrollPeriodId, periodId),
//             eq(payslips.employeeId, emp.id),
//           ),
//         });

//         const slipData = {
//           payrollPeriodId: periodId,
//           employeeId: emp.id,
//           daysWorked,
//           grossIncome,
//           sss,
//           philhealth,
//           pagibig,
//           // 👇 Keep manual notes/deductions
//           otherDeductions: existingSlip?.otherDeductions ?? 0,
//           notes: existingSlip?.notes ?? "",
//           // 👇 Deductions total includes manual adjustments
//           totalDeductions: parseFloat(
//             (
//               sss +
//               philhealth +
//               pagibig +
//               (existingSlip?.otherDeductions ?? 0)
//             ).toFixed(2),
//           ),
//           netPay: parseFloat(
//             (
//               grossIncome -
//               (sss +
//                 philhealth +
//                 pagibig +
//                 (existingSlip?.otherDeductions ?? 0))
//             ).toFixed(2),
//           ),
//         };

//         if (existingSlip) {
//           return db
//             .update(payslips)
//             .set(slipData)
//             .where(eq(payslips.id, existingSlip.id));
//         } else {
//           return db.insert(payslips).values(slipData);
//         }
//       }
//     });

//     await Promise.all(operations);

//     // Update the total amount for the Payroll Period
//     await db
//       .update(payrollPeriods)
//       .set({ totalAmount: parseFloat(grandTotalPayout.toFixed(2)) })
//       .where(eq(payrollPeriods.id, periodId));

//     revalidatePath(`/dashboard/payroll/${periodId}`);
//     return {
//       success: true,
//       message: "Payslips generated using current HR settings!",
//     };
//   } catch (error) {
//     console.error("Generate Payslips Error:", error);
//     return { success: false, error: "Failed to generate payslips." };
//   }
// }
export async function generatePayslipsAction(periodId: string) {
  try {
    const settings = await db.query.payrollSettings.findFirst();
    const sssRate = settings?.sssRate ?? 0.045;
    const phRate = settings?.philhealthRate ?? 0.025;
    const pagibigFixed = settings?.pagibigAmount ?? 200;

    const period = await db.query.payrollPeriods.findFirst({
      where: eq(payrollPeriods.id, periodId),
    });

    if (!period) throw new Error("Payroll period not found");

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

    const operations = allStaff.map(async (emp) => {
      const logs = await db.query.attendance.findMany({
        where: and(
          eq(attendance.employeeId, emp.id),
          gte(attendance.date, period.startDate),
          lte(attendance.date, period.endDate),
        ),
      });

      // 1. Calculate Standard Time
      const totalHours = logs.reduce(
        (sum, log) => sum + (log.totalHours || 0),
        0,
      );
      const daysWorked = parseFloat((totalHours / 8).toFixed(2));

      // 2. 👇 NEW: Calculate Overtime (From your awesome schema!)
      const totalOtMinutes = logs.reduce(
        (sum, log) => sum + (log.overtimeMinutes || 0),
        0,
      );
      const otHours = totalOtMinutes / 60;

      // 3. Base Salary Math
      const monthlySalary = Number(emp.basicSalary || 0) / 100; // Assuming centavos
      const dailyRate = monthlySalary / 22; // Standard 22 working days
      const hourlyRate = dailyRate / 8;

      const basicPay = parseFloat((daysWorked * dailyRate).toFixed(2));

      // 4. 👇 NEW: DOLE Overtime Math (125% premium for regular days)
      const otHourlyRate = hourlyRate * 1.25;
      const overtimePay = parseFloat((otHours * otHourlyRate).toFixed(2));

      // 5. Calculate Final Gross Income
      const grossIncome = parseFloat((basicPay + overtimePay).toFixed(2));

      // Deductions Math
      let sss = 0;
      let philhealth = 0;
      let pagibig = 0;

      if (grossIncome > 0) {
        sss = parseFloat((monthlySalary * sssRate).toFixed(2));
        if (sss > 1350) sss = 1350;

        philhealth = parseFloat((monthlySalary * phRate).toFixed(2));
        if (philhealth > 2500) philhealth = 2500;

        pagibig = monthlySalary >= 1500 ? pagibigFixed : 100;
      }

      if (daysWorked > 0 || grossIncome > 0) {
        const existingSlip = await db.query.payslips.findFirst({
          where: and(
            eq(payslips.payrollPeriodId, periodId),
            eq(payslips.employeeId, emp.id),
          ),
        });

        const totalDeductions = parseFloat(
          (
            sss +
            philhealth +
            pagibig +
            (existingSlip?.otherDeductions ?? 0)
          ).toFixed(2),
        );
        const netPay = parseFloat((grossIncome - totalDeductions).toFixed(2));

        grandTotalPayout += netPay;

        const slipData = {
          payrollPeriodId: periodId,
          employeeId: emp.id,
          daysWorked,
          overtimePay, // 👇 NEW: Save the OT cash to the database
          grossIncome,
          sss,
          philhealth,
          pagibig,
          otherDeductions: existingSlip?.otherDeductions ?? 0,
          notes: existingSlip?.notes ?? "",
          totalDeductions,
          netPay,
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

    await db
      .update(payrollPeriods)
      .set({ totalAmount: parseFloat(grandTotalPayout.toFixed(2)) })
      .where(eq(payrollPeriods.id, periodId));

    revalidatePath(`/dashboard/payroll/${periodId}`);
    return {
      success: true,
      message: "Payslips generated with Overtime calculations!",
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

    // 👇 NEW: Check for redundant / duplicate periods
    const existingPeriod = await db.query.payrollPeriods.findFirst({
      where: and(
        eq(payrollPeriods.startDate, startDate),
        eq(payrollPeriods.endDate, endDate),
      ),
    });

    // 👇 NEW: Block the creation if it exists
    if (existingPeriod) {
      return {
        success: false,
        error:
          "A payroll cut-off for these exact dates already exists. Please check the history.",
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

export async function deletePayrollPeriodAction(id: string) {
  try {
    // 1. Safety Check: Ensure it's a DRAFT
    const period = await db.query.payrollPeriods.findFirst({
      where: eq(payrollPeriods.id, id),
    });

    if (!period || period.status !== "DRAFT") {
      return { success: false, error: "Only draft periods can be deleted." };
    }

    // 2. Delete all attached payslips first (to avoid foreign key errors)
    await db.delete(payslips).where(eq(payslips.payrollPeriodId, id));

    // 3. Delete the actual period
    await db.delete(payrollPeriods).where(eq(payrollPeriods.id, id));

    revalidatePath("/dashboard/payroll");
    return { success: true, message: "Draft deleted successfully." };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: "Failed to delete period." };
  }
}

export async function lockPayrollPeriodAction(periodId: string) {
  try {
    const period = await db.query.payrollPeriods.findFirst({
      where: eq(payrollPeriods.id, periodId),
    });

    if (!period || period.status !== "DRAFT") {
      return { success: false, error: "Only draft periods can be locked." };
    }

    await db
      .update(payrollPeriods)
      .set({ status: "PAID" })
      .where(eq(payrollPeriods.id, periodId));

    revalidatePath(`/dashboard/payroll/${periodId}`);
    revalidatePath("/dashboard/payroll");
    return {
      success: true,
      message: "Payroll successfully locked and marked as Paid!",
    };
  } catch (error) {
    console.error("Lock Payroll Error:", error);
    return { success: false, error: "Failed to lock payroll." };
  }
}

export async function unlockPayrollPeriodAction(periodId: string) {
  try {
    const period = await db.query.payrollPeriods.findFirst({
      where: eq(payrollPeriods.id, periodId),
    });

    if (!period || period.status !== "PAID") {
      return {
        success: false,
        error: "Only locked/paid periods can be unlocked.",
      };
    }

    // Revert status back to DRAFT
    await db
      .update(payrollPeriods)
      .set({ status: "DRAFT" })
      .where(eq(payrollPeriods.id, periodId));

    revalidatePath(`/dashboard/payroll/${periodId}`);
    revalidatePath("/dashboard/payroll");
    return {
      success: true,
      message: "Payroll unlocked. You can now edit and recalculate.",
    };
  } catch (error) {
    console.error("Unlock Payroll Error:", error);
    return { success: false, error: "Failed to unlock payroll." };
  }
}
