"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Printer } from "lucide-react";
import { toast } from "sonner";
import { generatePayslipsAction } from "@/src/actions/payroll"; // 👈 Import the action

export function PayrollHeader({ period }: { period: any }) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const toastId = toast.loading("Calculating attendance and pay...");

    // 👈 Call the engine!
    const res = await generatePayslipsAction(period.id);

    if (res.success) {
      toast.success(res.message, { id: toastId });
    } else {
      toast.error(res.error, { id: toastId });
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      {/* ... your title and badge code ... */}

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleGenerate}
          disabled={loading || period.status !== "DRAFT"}
          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Generate Payslips
        </Button>
        <Button variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Print All
        </Button>
      </div>
    </div>
  );
}
