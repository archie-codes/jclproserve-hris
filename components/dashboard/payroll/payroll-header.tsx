"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generatePayslips } from "@/src/actions/payroll";
import { toast } from "sonner";
import { Loader2, RefreshCw, ArrowLeft, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export function PayrollHeader({ period }: { period: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    toast.info("Calculating attendance and deductions...");

    const res = await generatePayslips(period.id);

    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/payroll")}
            className="h-8 px-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Payroll Details</h1>
          <Badge
            variant={period.status === "DRAFT" ? "outline" : "default"}
            className="ml-2"
          >
            {period.status}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm ml-8">
          Period: {new Date(period.startDate).toLocaleDateString()} -{" "}
          {new Date(period.endDate).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {period.status === "DRAFT" && (
          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={loading}
            className="bg-white dark:bg-slate-900 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {period.totalAmount > 0 ? "Recalculate" : "Generate Payslips"}
          </Button>
        )}
        <Button variant="secondary">
          <Printer className="mr-2 h-4 w-4" /> Print All
        </Button>
      </div>
    </div>
  );
}
