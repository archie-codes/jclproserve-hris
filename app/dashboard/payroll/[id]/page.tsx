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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function PayrollDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // 1. Fetch the Period Info
  const period = await db.query.payrollPeriods.findFirst({
    where: eq(payrollPeriods.id, params.id),
  });

  if (!period) return <div>Payroll period not found</div>;

  // 2. Fetch the Generated Payslips
  const slips = await db.query.payslips.findMany({
    where: eq(payslips.payrollPeriodId, params.id),
    with: {
      employee: true, // Get names
    },
    orderBy: [desc(payslips.netPay)],
  });

  return (
    <div className="p-1 animate-in fade-in duration-500">
      {/* Header with "Generate" button */}
      <PayrollHeader period={period} />

      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-slate-950">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
              <TableRow>
                <TableHead className="pl-6">Employee</TableHead>
                <TableHead className="text-center">Days Worked</TableHead>
                <TableHead className="text-right">Gross Pay</TableHead>
                <TableHead className="text-right text-red-500">
                  Deductions
                </TableHead>
                <TableHead className="text-right pr-6 font-bold text-emerald-600">
                  Net Pay
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slips.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-64 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-lg font-medium">
                        No payslips generated yet
                      </p>
                      <p className="text-sm">
                        Click "Generate Payslips" above to calculate attendance.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                slips.map((slip) => (
                  <TableRow key={slip.id} className="hover:bg-slate-50/50">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-slate-200">
                          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                            {slip.employee.firstName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {slip.employee.lastName}, {slip.employee.firstName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {slip.employee.employeeNo}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-mono">
                        {slip.daysWorked} days
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-slate-600">
                      ₱ {(slip.grossIncome || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-red-500">
                      - ₱ {(slip.totalDeductions || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right pr-6 font-mono font-bold text-emerald-600 text-base">
                      ₱ {(slip.netPay || 0).toLocaleString()}
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
