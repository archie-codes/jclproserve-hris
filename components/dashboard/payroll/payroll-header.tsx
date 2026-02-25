"use client";

import { useTransition } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Lock, Printer, CheckCircle, Unlock } from "lucide-react";
import {
  generatePayslipsAction,
  lockPayrollPeriodAction,
  unlockPayrollPeriodAction,
} from "@/src/actions/payroll";
import { toast } from "sonner";
import Link from "next/link"; // 👇 Make sure Link is imported!

export function PayrollHeader({ period }: { period: any }) {
  const [isGenerating, startGenerating] = useTransition();
  const [isLocking, startLocking] = useTransition();
  const [isUnlocking, startUnlocking] = useTransition();

  const isDraft = period.status === "DRAFT";

  const handleGenerate = () => {
    startGenerating(async () => {
      const result = await generatePayslipsAction(period.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleLock = () => {
    if (
      !confirm(
        "Are you sure? Once locked, you cannot recalculate or edit this payroll period.",
      )
    )
      return;

    startLocking(async () => {
      const result = await lockPayrollPeriodAction(period.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleUnlock = () => {
    if (
      !confirm(
        "WARNING: Unlocking this payroll will allow numbers to be recalculated. Are you sure you want to revert to Draft?",
      )
    )
      return;

    startUnlocking(async () => {
      const result = await unlockPayrollPeriodAction(period.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white dark:bg-slate-950 p-6 rounded-xl border shadow-sm">
      {/* Left Side: Period Info */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold tracking-tight">Payroll Cut-off</h1>
          <Badge
            variant="outline"
            className={
              isDraft
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }
          >
            {isDraft ? (
              <span className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3" /> DRAFT
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" /> PAID / LOCKED
              </span>
            )}
          </Badge>
        </div>
        <p className="text-muted-foreground flex items-center gap-2">
          {format(new Date(period.startDate), "MMMM d, yyyy")} —{" "}
          {format(new Date(period.endDate), "MMMM d, yyyy")}
        </p>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {isDraft ? (
          <>
            <Button
              variant="outline"
              onClick={handleGenerate}
              disabled={isGenerating || isLocking || isUnlocking}
              className="flex-1 md:flex-none border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
              />
              {isGenerating ? "Calculating..." : "Generate"}
            </Button>

            <Button
              onClick={handleLock}
              disabled={
                isGenerating ||
                isLocking ||
                isUnlocking ||
                period.totalAmount === 0
              }
              className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isLocking ? "Locking..." : "Approve & Lock"}
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            onClick={handleUnlock}
            disabled={isUnlocking}
            className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            title="Revert to Draft"
          >
            <Unlock className="mr-2 h-4 w-4" />
            {isUnlocking ? "Unlocking..." : "Unlock"}
          </Button>
        )}

        {/* 👇 NEW: Print Button moved OUTSIDE the condition so it's always visible */}
        <Link
          href={`/dashboard/payroll/${period.id}/print`}
          target="_blank"
          className="flex-1 md:flex-none"
        >
          <Button
            variant="default"
            disabled={period.totalAmount === 0} // Prevents clicking if no slips are generated yet
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Printer className="mr-2 h-4 w-4" />
            {isDraft ? "Preview Payslips" : "Print Payslips"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
