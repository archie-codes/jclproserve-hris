"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditEmployeeForm } from "@/components/dashboard/employees/edit-employee-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: any;
};

export function EditEmployeeModal({ open, onOpenChange, employee }: Props) {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>

        <EditEmployeeForm
          employee={employee}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
