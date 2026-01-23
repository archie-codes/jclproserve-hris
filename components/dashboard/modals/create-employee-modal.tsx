"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateEmployeeForm } from "@/components/dashboard/employees/create-employee-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateEmployeeModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl"> {/* Slightly wider for grid layout */}
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        
        <CreateEmployeeForm onSuccess={() => onOpenChange(false)} />
        
      </DialogContent>
    </Dialog>
  );
}