"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { deletePayrollPeriodAction } from "@/src/actions/payroll";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// 👇 Added `isTableView` to the props
export function DeletePeriodButton({
  id,
  isTableView = false,
}: {
  id: string;
  isTableView?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePayrollPeriodAction(id);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <Button
        variant="destructive"
        size="icon"
        // 👇 Dynamic CSS: If it's a table, be a normal button. If grid, float in the corner!
        className={
          isTableView
            ? "h-8 w-8 shadow-sm transition-all"
            : "absolute top-3 right-3 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        }
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        disabled={isPending}
        title="Delete Draft"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Draft Period?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this draft cut-off period and wipe
              all associated payslips.
              <br className="mb-2" />
              <strong>This action cannot be undone.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Yes, Delete Draft"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
