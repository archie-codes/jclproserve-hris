"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateUserForm } from "@/components/dashboard/create-user-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};


export function CreateUserModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        {/* ✅ THIS IS REQUIRED */}
        <CreateUserForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
