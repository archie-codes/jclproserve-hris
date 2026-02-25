import { getPayrollPeriods } from "@/src/actions/payroll";
import { CreatePayrollModal } from "@/components/dashboard/payroll/create-payroll-modal";
import { DeletePeriodButton } from "@/components/dashboard/payroll/delete-period-button";
import { ViewToggle } from "@/components/dashboard/payroll/view-toggle"; // 👇 Imported Toggle
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // 👇 Imported Table components
import {
  CalendarDays,
  ChevronRight,
  Wallet,
  Banknote,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function PayrollPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const resolvedSearch = await searchParams;
  const currentView = resolvedSearch.view || "list"; // Defaults to grid view

  const periods = await getPayrollPeriods();

  const totalDisbursed = periods
    .filter((p: any) => p.status === "PAID")
    .reduce((acc: number, curr: any) => acc + (curr.totalAmount || 0), 0);

  const activePeriod = periods.find((p: any) => p.status === "DRAFT");

  const periodsByYear = periods.reduce((acc: any, period: any) => {
    const year = new Date(period.startDate).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(period);
    return acc;
  }, {});

  const years = Object.keys(periodsByYear).sort(
    (a, b) => Number(b) - Number(a),
  );

  return (
    <div className="space-y-8 p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Payroll Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage salary releases, view history, and generate payslips.
          </p>
        </div>
        <CreatePayrollModal />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm bg-linear-gradient(to bottom right, white, #ecfdf5) dark:from-slate-950 dark:to-slate-900">
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

        <Card className="border-l-4 border-l-amber-500 shadow-sm bg-linear-gradient(to bottom right, white, #fffbeb) dark:from-slate-950 dark:to-slate-900">
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

        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-linear-gradient(to bottom right, white, #eff6ff) dark:from-slate-950 dark:to-slate-900">
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
      <Separator />
      {/* Payroll History Section */}
      <div>
        {periods.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl py-16 bg-slate-50/50 dark:bg-slate-900/50 mt-8">
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
          <Tabs defaultValue={years[0]} className="w-full mt-4">
            {/* Header, Tabs, and Toggle all aligned nicely */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Payroll History
                </h2>
                <TabsList className="bg-slate-100 dark:bg-slate-900 h-9">
                  {years.map((year) => (
                    <TabsTrigger
                      key={year}
                      value={year}
                      className="px-4 sm:px-6 text-xs sm:text-sm"
                    >
                      {year}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <ViewToggle />
            </div>

            {/* Render Data for each Year */}
            {years.map((year) => (
              <TabsContent key={year} value={year} className="mt-0">
                {/* 🟢 VIEW 1: GRID VIEW */}
                {currentView === "grid" && (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {periodsByYear[year].map((period: any) => {
                      const start = new Date(period.startDate);
                      const end = new Date(period.endDate);
                      const isDraft = period.status === "DRAFT";

                      return (
                        <div key={period.id} className="relative group">
                          {isDraft && <DeletePeriodButton id={period.id} />}

                          <Link
                            href={`/dashboard/payroll/${period.id}`}
                            className="block h-full"
                          >
                            <Card
                              className={`h-full border-l-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden bg-white dark:bg-slate-950 ${isDraft ? "border-l-amber-500 border-amber-200/50" : "border-l-slate-400 dark:border-l-slate-600"}`}
                            >
                              <CardHeader className="pb-3 pl-6">
                                <div className="flex justify-between items-start pr-6">
                                  <div>
                                    <CardTitle className="text-base font-bold group-hover:text-indigo-600 transition-colors">
                                      {format(start, "MMM d")} -{" "}
                                      {format(end, "MMM d, yyyy")}
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-[10px] uppercase tracking-wider">
                                      Cut-off Period
                                    </CardDescription>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="pl-6 pb-4">
                                <div className="flex justify-between items-end">
                                  <div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
                                      Total Payout
                                    </p>
                                    <p className="text-xl font-black text-foreground">
                                      ₱{" "}
                                      {(
                                        period.totalAmount || 0
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <Badge
                                      variant="outline"
                                      className={`${isDraft ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200"} text-[10px]`}
                                    >
                                      {period.status}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 🔵 VIEW 2: LIST VIEW */}
                {currentView === "list" && (
                  <div className="rounded-xl border bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                        <TableRow>
                          <TableHead className="pl-6">Cut-off Period</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead className="text-right">
                            Total Payout
                          </TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="text-right pr-6">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {periodsByYear[year].map((period: any) => {
                          const start = new Date(period.startDate);
                          const end = new Date(period.endDate);
                          const isDraft = period.status === "DRAFT";

                          return (
                            <TableRow
                              key={period.id}
                              className="hover:bg-slate-50/50 group"
                            >
                              <TableCell className="pl-6 font-medium">
                                {format(start, "MMMM d")} -{" "}
                                {format(end, "MMMM d, yyyy")}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {start.getFullYear()}
                              </TableCell>
                              <TableCell className="text-right font-bold text-foreground">
                                ₱ {(period.totalAmount || 0).toLocaleString()}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant="outline"
                                  className={`${isDraft ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}
                                >
                                  {period.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right pr-6">
                                <div className="flex justify-end items-center gap-2">
                                  {/* Clever trick: Wrapping Delete button in relative box so absolute positioning stays inside */}
                                  {isDraft && (
                                    <DeletePeriodButton
                                      id={period.id}
                                      isTableView={true}
                                    />
                                  )}
                                  <Link
                                    href={`/dashboard/payroll/${period.id}`}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                                    >
                                      View{" "}
                                      <ChevronRight className="ml-1 h-3 w-3" />
                                    </Button>
                                  </Link>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
