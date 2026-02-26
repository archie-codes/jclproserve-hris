import { db } from "@/src/db";
import { payslips, payrollPeriods } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { PayrollHeader } from "@/components/dashboard/payroll/payroll-header";
import { PayrollFilters } from "@/components/dashboard/payroll/payroll-filters";
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
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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

const formatCurrency = (amount: number) => {
  return amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default async function PayrollDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; position?: string; name?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const statusFilter = resolvedSearch.status;
  const positionFilter = resolvedSearch.position?.toLowerCase();
  const nameFilter = resolvedSearch.name?.toLowerCase();

  const period = await db.query.payrollPeriods.findFirst({
    where: eq(payrollPeriods.id, resolvedParams.id),
  });

  if (!period) return <div>Payroll period not found</div>;

  const isDraft = period.status === "DRAFT";

  const slips = await db.query.payslips.findMany({
    where: eq(payslips.payrollPeriodId, resolvedParams.id),
    with: {
      employee: {
        with: {
          position: true,
        },
      },
    },
    orderBy: [desc(payslips.netPay)],
  });

  // Apply filters
  let filteredSlips = slips;

  if (statusFilter && statusFilter !== "ALL") {
    filteredSlips = filteredSlips.filter(
      (slip) => slip.employee.status === statusFilter,
    );
  }

  if (positionFilter) {
    filteredSlips = filteredSlips.filter((slip) => {
      const posName = slip.employee.position?.title || "";
      return posName.toLowerCase().includes(positionFilter);
    });
  }

  if (nameFilter) {
    filteredSlips = filteredSlips.filter((slip) => {
      const fullName =
        `${slip.employee.firstName} ${slip.employee.lastName}`.toLowerCase();
      return fullName.includes(nameFilter);
    });
  }

  return (
    <div className="p-1 animate-in fade-in duration-500">
      {/* Back Button */}
      <Link
        href="/dashboard/payroll"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-indigo-600 transition-colors mb-4"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Payroll History
      </Link>

      <PayrollHeader period={period} />

      <PayrollFilters />

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
                <TableHead className="text-right text-red-500">
                  Others
                </TableHead>
                <TableHead className="text-right pr-6 font-bold text-emerald-600">
                  Net Pay
                </TableHead>
                <TableHead className="text-right pr-4 text-blue-500 w-[50px]">
                  {isDraft ? "Action" : ""}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSlips.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="h-64 text-center text-muted-foreground"
                  >
                    No payslips found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSlips.map((slip) => (
                  <TableRow
                    key={slip.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-slate-200">
                          <AvatarImage
                            src={slip.employee.imageUrl || ""}
                            alt={`${slip.employee.firstName} ${slip.employee.lastName}`}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                            {slip.employee.firstName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {slip.employee.lastName}, {slip.employee.firstName}
                          </p>

                          {/* 👇 THE NEW BADGES SECTION */}
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground uppercase">
                              {slip.employee.employeeNo} •{" "}
                              {slip.employee.position?.title || "Unassigned"}
                            </span>

                            {slip.employee.salaryType === "DAILY" ? (
                              <Badge
                                variant="outline"
                                className="h-[18px] px-1.5 text-[9px] font-bold tracking-wider bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                              >
                                DAILY
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="h-[18px] px-1.5 text-[9px] font-bold tracking-wider bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800"
                              >
                                FIXED
                              </Badge>
                            )}
                          </div>
                          {/* 👆 END BADGES SECTION */}
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
                      {isDraft && (
                        <EditAdjustmentModal
                          slip={slip}
                          periodId={resolvedParams.id}
                        />
                      )}
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
