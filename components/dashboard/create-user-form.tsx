"use client";

import { useTransition } from "react";
import { createUser } from "@/app/dashboard/users/new/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateUserForm() {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          await createUser(formData);
          window.location.href = "/dashboard/users";
        })
      }
      className="space-y-4"
    >
      <Input name="name" placeholder="Full name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Password" required />

      <select
        name="role"
        className="w-full rounded-md border border-border bg-background p-2"
        required
      >
        <option value="hr">HR</option>
        <option value="admin">Admin</option>
      </select>

      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create User"}
      </Button>
    </form>
  );
}

