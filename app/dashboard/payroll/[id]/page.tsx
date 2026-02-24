import { db } from "@/src/db";
import { payslips, payrollPeriods } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { PayrollHeader } from "@/components/dashboard/payroll/payroll-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EditAdjustmentModal } from "@/components/dashboard/payroll/edit-adjustment-modal";

// HELPER: Converts decimal days (6.7) into human-readable text (6 days, 5.6 hrs)
function formatDaysWorked(decimalDays: number) {
  if (Number.isInteger(decimalDays)) {
    return `${decimalDays} days`;
  }
  const fullDays = Math.floor(decimalDays);
  const leftoverFraction = decimalDays - fullDays;
  const leftoverHours = parseFloat((leftoverFraction * 8).toFixed(1));

  if (fullDays === 0) return `${leftoverHours} hrs`;
  if (leftoverHours === 0) return `${fullDays} days`;

  return `${fullDays} days, ${leftoverHours} hrs`;
}

// HELPER: Standardizes Philippine Peso formatting
const formatCurrency = (amount: number) => {
  return amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default async function PayrollDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  const period = await db.query.payrollPeriods.findFirst({
    where: eq(payrollPeriods.id, resolvedParams.id),
  });

  if (!period) return <div>Payroll period not found</div>;

  const slips = await db.query.payslips.findMany({
    where: eq(payslips.payrollPeriodId, resolvedParams.id),
    with: {
      employee: true,
    },
    orderBy: [desc(payslips.netPay)],
  });

  return (
    <div className="p-1 animate-in fade-in duration-500">
      <PayrollHeader period={period} />

      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-slate-950">
        <CardContent className="p-0">
          <Table className="text-xs sm:text-sm">
            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
              <TableRow>
                <TableHead className="pl-6">Employee</TableHead>
                <TableHead className="text-right">Basic Salary</TableHead>
                <TableHead className="text-center">Time Rendered</TableHead>
                <TableHead className="text-right">Gross Pay</TableHead>
                <TableHead className="text-right text-red-500">SSS</TableHead>
                <TableHead className="text-right text-red-500">PHIC</TableHead>
                <TableHead className="text-right text-red-500">HDMF</TableHead>
                {/* 👇 Added Others Header */}
                <TableHead className="text-right text-red-500">
                  Others
                </TableHead>
                <TableHead className="text-right pr-6 font-bold text-emerald-600">
                  Net Pay
                </TableHead>
                <TableHead className="text-right text-blue-500">
                  Adjustment
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slips.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-64 text-center text-muted-foreground"
                  >
                    No payslips generated yet.
                  </TableCell>
                </TableRow>
              ) : (
                slips.map((slip) => (
                  <TableRow
                    key={slip.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-slate-200">
                          {/* 👇 Add this line - it will show the photo if it exists */}
                          <AvatarImage
                            src={slip.employee.imageUrl || ""}
                            alt={`${slip.employee.firstName} ${slip.employee.lastName}`}
                            className="object-cover"
                          />

                          {/* The fallback stays here in case the photo fails to load */}
                          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                            {slip.employee.firstName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {slip.employee.lastName}, {slip.employee.firstName}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase">
                            {slip.employee.employeeNo}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-right text-slate-500">
                      ₱{" "}
                      {formatCurrency(
                        Number(slip.employee.basicSalary || 0) / 100,
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className="font-medium whitespace-nowrap"
                      >
                        {formatDaysWorked(slip.daysWorked || 0)}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right font-mono text-slate-600">
                      ₱ {formatCurrency(slip.grossIncome || 0)}
                    </TableCell>

                    <TableCell className="text-right font-mono text-red-500">
                      {formatCurrency(slip.sss || 0)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-red-500">
                      {formatCurrency(slip.philhealth || 0)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-red-500">
                      {formatCurrency(slip.pagibig || 0)}
                    </TableCell>

                    {/* 👇 NEW: Other Deductions & Notes */}
                    <TableCell className="text-right font-mono text-red-500">
                      <div
                        className="flex flex-col items-end"
                        title={slip.notes || ""}
                      >
                        <span>{formatCurrency(slip.otherDeductions || 0)}</span>
                        {slip.notes && (
                          <span className="text-[9px] text-muted-foreground italic truncate max-w-[80px]">
                            {slip.notes}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right pr-6 font-mono font-bold text-emerald-600">
                      ₱ {formatCurrency(slip.netPay || 0)}
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <EditAdjustmentModal
                        slip={slip}
                        periodId={resolvedParams.id}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
