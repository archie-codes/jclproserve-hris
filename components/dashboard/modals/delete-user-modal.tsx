"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/app/dashboard/users/new/actions";
import { toast } from "sonner";
import { useState } from "react";

type User = {
  id: string;
  name: string;
};

type Props = {
  open: boolean;
  user: User;
  onOpenChange: (open: boolean) => void;
};

export function DeleteUserModal({ open, user, onOpenChange }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteUser(user.id);
      toast.success(`User "${user.name}" deleted`, { position: "top-center" });
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete user", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Delete User
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <b>{user.name}</b>? This action cannot be undone.
        </p>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
