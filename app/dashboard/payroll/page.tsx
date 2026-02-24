import { getPayrollPeriods } from "@/src/actions/payroll";
import { CreatePayrollModal } from "@/components/dashboard/payroll/create-payroll-modal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ChevronRight,
  Wallet,
  Banknote,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic"; // Ensure we always see the latest data

export default async function PayrollPage() {
  const periods = await getPayrollPeriods();

  // Quick Stats Calculation
  const totalDisbursed = periods
    .filter((p) => p.status === "PAID")
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  const activePeriod = periods.find((p) => p.status === "DRAFT");

  return (
    <div className="space-y-8 p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Payroll Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage salary releases, view history, and generate payslips.
          </p>
        </div>
        {/* This is the modal we built earlier */}
        <CreatePayrollModal />
      </div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm bg-linear-to-br from-white to-emerald-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Banknote className="h-4 w-4 text-emerald-500" /> Total Disbursed
              (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱ {totalDisbursed.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully paid out
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm bg-linear-to-br from-white to-amber-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-amber-500" /> Current Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activePeriod ? (
              <div>
                <div className="text-xl font-bold text-amber-700 dark:text-amber-400">
                  {format(new Date(activePeriod.startDate), "MMM d")} -{" "}
                  {format(new Date(activePeriod.endDate), "MMM d")}
                </div>
                <p className="text-xs text-muted-foreground animate-pulse font-medium">
                  Processing now...
                </p>
              </div>
            ) : (
              <div>
                <span className="text-lg font-medium text-muted-foreground">
                  No Active Cycle
                </span>
                <p className="text-xs text-muted-foreground">
                  All periods completed
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-linear-to-br from-white to-blue-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4 text-blue-500" /> Total Periods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{periods.length}</div>
            <p className="text-xs text-muted-foreground">Cycles recorded</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Payroll Periods List */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          Payroll History
        </h2>

        {periods.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl py-16 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              No payroll records yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Create your first cut-off period to get started.
            </p>
            <CreatePayrollModal />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {periods.map((period) => {
              const start = new Date(period.startDate);
              const end = new Date(period.endDate);
              const isDraft = period.status === "DRAFT";

              return (
                <Link
                  key={period.id}
                  href={`/dashboard/payroll/${period.id}`}
                  className="group"
                >
                  <Card
                    className={`
                    border-l-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden bg-white dark:bg-slate-950
                    ${isDraft ? "border-l-amber-500 border-amber-200/50" : "border-l-slate-400 dark:border-l-slate-600"}
                  `}
                  >
                    <CardHeader className="pb-3 pl-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-bold group-hover:text-indigo-600 transition-colors">
                            {format(start, "MMMM d")} - {format(end, "d, yyyy")}
                          </CardTitle>
                          <CardDescription className="mt-1 text-xs">
                            {start.getFullYear()} Cut-off
                          </CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className={`
                          ${
                            isDraft
                              ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }
                        `}
                        >
                          {period.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pl-6 pb-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
                            Total Payout
                          </p>
                          <p className="text-2xl font-black text-foreground">
                            ₱ {(period.totalAmount || 0).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full h-8 w-8 bg-slate-50 dark:bg-slate-900 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 transition-colors"
                        >
                          {isDraft ? (
                            <ChevronRight className="h-4 w-4" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
