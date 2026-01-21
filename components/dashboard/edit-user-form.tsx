"use client";

import { useTransition, useState } from "react";
import { updateUserRole } from "@/app/dashboard/users/[id]/edit/actions";
import { resetUserPassword } from "@/app/dashboard/users/[id]/edit/reset-password";
import { Button } from "@/components/ui/button";

export function EditUserForm({ user }: { user: any }) {
  const [pending, startTransition] = useTransition();
  const [password, setPassword] = useState("");

  /* ---------------- Role Update ---------------- */
  function handleRoleUpdate(formData: FormData) {
    startTransition(async () => {
      await updateUserRole(user.id, formData);
      window.location.reload();
    });
  }

  /* ---------------- Password Reset ---------------- */
  function handlePasswordReset(formData: FormData) {
    const confirmed = confirm(
      "Are you sure you want to reset this user's password?"
    );

    if (!confirmed) return;

    startTransition(async () => {
      await resetUserPassword(user.id, formData);
      setPassword("");
      alert("Password reset successfully");
    });
  }

  return (
    <div className="space-y-8">
      {/* ===== USER INFO ===== */}
      <div>
        <p className="text-sm text-muted-foreground">Email</p>
        <p className="font-medium">{user.email}</p>
      </div>

      {/* ===== ROLE FORM ===== */}
      <form action={handleRoleUpdate} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Role</label>
          <select
            name="role"
            defaultValue={user.role}
            className="w-full rounded-md border border-border bg-background p-2"
          >
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
          </select>
        </div>

        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save Role"}
        </Button>
      </form>

      {/* ===== DIVIDER ===== */}
      <hr className="border-border" />

      {/* ===== DANGER ZONE ===== */}
      <div className="space-y-4 rounded-md border border-destructive/30 bg-destructive/5 p-4">
        <h3 className="font-semibold text-destructive">
          Danger Zone
        </h3>

        <form action={handlePasswordReset} className="space-y-3">
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (min 8 chars)"
            className="w-full rounded-md border border-border bg-background p-2"
            required
            minLength={8}
          />

          <Button
            type="submit"
            variant="destructive"
            disabled={pending}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
