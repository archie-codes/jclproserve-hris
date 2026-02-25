import { db } from "@/src/db";
import { payslips, payrollPeriods } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { format } from "date-fns";
import { PrintButton } from "@/components/dashboard/payroll/print-button";
import Image from "next/image";

const formatCurrency = (amount: number) => {
  return amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

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

export default async function PrintPayslipsPage({
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
      employee: {
        with: {
          position: true,
        },
      },
    },
    orderBy: [desc(payslips.netPay)],
  });

  const startDate = format(new Date(period.startDate), "MMMM d, yyyy");
  const endDate = format(new Date(period.endDate), "MMMM d, yyyy");

  return (
    <>
      {/* 👇 NEW: This forces the browser to hide the dashboard UI when printing */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              /* 1. Hide the Sidebar and Top Navbar */
              aside, header, nav, [data-sidebar="true"] {
                display: none !important;
              }
              
              /* 2. Force the main container to expand fully and remove scrollbars */
              html, body, main, .overflow-y-auto, .overflow-hidden {
                overflow: visible !important;
                height: auto !important;
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                background: white !important;
              }

              /* 3. Hide the Print Button itself */
              .print\\:hidden {
                display: none !important;
              }
            }
          `,
        }}
      />

      <div className="min-h-screen bg-slate-100 print:bg-white p-4 sm:p-8 print:p-0 text-black">
        <div className="mb-8 print:hidden flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-800">Print Preview</h1>
          <PrintButton />
        </div>

        <div className="max-w-4xl mx-auto space-y-8 print:space-y-0">
          {slips.map((slip) => {
            // We calculate the true Basic Pay by removing the Overtime Cash
            const basicPayAmount =
              (slip.grossIncome || 0) - (slip.overtimePay || 0);

            return (
              <div
                key={slip.id}
                className="bg-white border-2 border-slate-200 print:border-slate-800 rounded-lg p-6 sm:p-8 mb-8 print:mb-0 print:border-b-2 print:border-x-0 print:border-t-0 print:rounded-none break-inside-avoid page-break-inside-avoid"
                style={{ minHeight: "14cm" }}
              >
                {/* Header / Company Info */}
                <div className="flex flex-row justify-between items-start mb-6 border-b-2 border-slate-200 print:border-slate-800 pb-6">
                  {/* Left Side: Company Logo */}
                  <div className="shrink-0">
                    <Image
                      src="/jcl-logo.svg"
                      alt="JC&L Proserve Inc. Logo"
                      width={160}
                      height={64}
                      priority
                      /* The h-16 w-auto forces the SVG to behave and prevents it from getting too tall */
                      className="object-contain h-24 w-auto print:h-14"
                    />
                  </div>

                  {/* Right Side: Company Details */}
                  <div className="text-right">
                    <h2 className="text-xl font-black uppercase tracking-wider text-slate-900 print:text-black">
                      JC&L Proserve Inc.
                    </h2>
                    <p className="text-sm text-gray-500 print:text-black mt-0.5">
                      Pampanga, Philippines
                    </p>
                    {/* Re-styled the Official Payslip badge to look like a stamp on paper */}
                    <div className="mt-2 inline-block bg-slate-100 print:bg-transparent print:border-2 print:border-slate-800 px-3 py-1 rounded-md">
                      <h3 className="text-xs font-bold uppercase tracking-widest print:text-black">
                        Official Payslip
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Employee & Period Details */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p>
                      <span className="font-semibold w-24 inline-block">
                        Employee ID:
                      </span>{" "}
                      {slip.employee.employeeNo}
                    </p>
                    <p>
                      <span className="font-semibold w-24 inline-block">
                        Name:
                      </span>{" "}
                      {slip.employee.lastName}, {slip.employee.firstName}
                    </p>
                    <p>
                      <span className="font-semibold w-24 inline-block">
                        Position:
                      </span>{" "}
                      {slip.employee.position?.title || "Unassigned"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>
                      <span className="font-semibold">Cut-off Period:</span>
                    </p>
                    <p>
                      {startDate} - {endDate}
                    </p>
                    <p className="mt-1">
                      <span className="font-semibold">Time Rendered:</span>{" "}
                      {formatDaysWorked(slip.daysWorked || 0)}
                    </p>
                  </div>
                </div>

                {/* Financial Breakdown Table */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* Left Column: Earnings */}
                  <div>
                    <h4 className="font-bold border-b border-slate-300 print:border-slate-800 pb-1 mb-2 uppercase text-xs">
                      Earnings
                    </h4>

                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        Basic Pay{" "}
                        <span className="text-xs text-gray-500 print:text-gray-600">
                          ({formatDaysWorked(slip.daysWorked || 0)})
                        </span>
                      </span>
                      {/* Uses the new basicPayAmount we calculated above */}
                      <span>₱ {formatCurrency(basicPayAmount)}</span>
                    </div>

                    {/* Conditionally show Overtime Pay only if they earned it! */}
                    {(slip.overtimePay || 0) > 0 && (
                      <div className="flex justify-between text-sm mb-1 text-emerald-700 print:text-black">
                        <span>Overtime Pay (125%)</span>
                        <span>₱ {formatCurrency(slip.overtimePay || 0)}</span>
                      </div>
                    )}

                    <div className="flex justify-between font-bold text-sm mt-4 pt-2 border-t border-slate-200 print:border-slate-500">
                      <span>Gross Pay</span>
                      <span>₱ {formatCurrency(slip.grossIncome || 0)}</span>
                    </div>
                  </div>

                  {/* Right Column: Deductions */}
                  <div>
                    <h4 className="font-bold border-b border-slate-300 print:border-slate-800 pb-1 mb-2 uppercase text-xs text-red-600 print:text-black">
                      Deductions
                    </h4>
                    <div className="flex justify-between text-sm mb-1 text-red-600 print:text-black">
                      <span>SSS Contribution</span>
                      <span>₱ {formatCurrency(slip.sss || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1 text-red-600 print:text-black">
                      <span>PhilHealth</span>
                      <span>₱ {formatCurrency(slip.philhealth || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1 text-red-600 print:text-black">
                      <span>Pag-IBIG (HDMF)</span>
                      <span>₱ {formatCurrency(slip.pagibig || 0)}</span>
                    </div>
                    {(slip.otherDeductions || 0) > 0 && (
                      <div className="flex justify-between text-sm mb-1 text-red-600 print:text-black">
                        <span
                          className="truncate max-w-[150px]"
                          title={slip.notes || "Other Deduction"}
                        >
                          Others: {slip.notes || "Misc."}
                        </span>
                        <span>
                          ₱ {formatCurrency(slip.otherDeductions || 0)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm mt-4 pt-2 border-t border-slate-200 print:border-slate-500 text-red-600 print:text-black">
                      <span>Total Deductions</span>
                      <span>₱ {formatCurrency(slip.totalDeductions || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Net Pay */}
                <div className="bg-slate-100 print:bg-transparent p-4 rounded-md border-2 border-slate-200 print:border-slate-800 flex justify-between items-center mb-10">
                  <span className="text-lg font-bold uppercase tracking-widest">
                    Net Take Home Pay
                  </span>
                  <span className="text-2xl font-black underline underline-offset-4 decoration-double">
                    ₱ {formatCurrency(slip.netPay || 0)}
                  </span>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 text-center text-sm mt-auto pt-8">
                  <div>
                    <div className="border-b border-black w-3/4 mx-auto mb-2"></div>
                    <p className="font-semibold uppercase">Prepared By</p>
                    <p className="text-xs text-gray-500 print:text-black">
                      HR / Finance Dept.
                    </p>
                  </div>
                  <div>
                    <div className="border-b border-black w-3/4 mx-auto mb-2"></div>
                    <p className="font-semibold uppercase">Received By</p>
                    <p className="text-xs text-gray-500 print:text-black">
                      Employee Signature & Date
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
