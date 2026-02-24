"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit2 } from "lucide-react";
import { updatePayslipAdjustment } from "@/src/actions/payroll-adjustments";
import { toast } from "sonner";

export function EditAdjustmentModal({
  slip,
  periodId,
}: {
  slip: any;
  periodId: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(slip.otherDeductions || 0);
  const [notes, setNotes] = useState(slip.notes || "");

  async function handleSubmit() {
    setLoading(true);
    const res = await updatePayslipAdjustment({
      id: slip.id,
      otherDeductions: Number(amount),
      notes,
      periodId,
    });

    if (res.success) {
      toast.success("Adjustment saved");
      setOpen(false);
    } else {
      toast.error("Failed to save");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-indigo-600"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Adjustment: {slip.employee.lastName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Other Deduction Amount (₱)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Notes / Reason</Label>
            <Textarea
              placeholder="e.g. Uniform Charge, Salary Loan, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600"
          >
            {loading ? "Saving..." : "Apply Adjustment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
