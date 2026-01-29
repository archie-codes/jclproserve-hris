"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditUserForm } from "../edit-user-form";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

type Props = {
  open: boolean;
  user: User;
  onOpenChange: (open: boolean) => void;
};

export function EditUserModal({ open, user, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 👇 FIX: Added max-h-[85vh] and overflow-y-auto */}
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <EditUserForm
          user={user}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}