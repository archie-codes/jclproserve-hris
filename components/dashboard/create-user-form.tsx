"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { createUser } from "@/app/dashboard/users/new/actions";

export function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"ADMIN" | "HR">("ADMIN");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("role", role);

      await createUser(formData);

      toast.success("User created successfully", { position: "top-center" });

      onSuccess(); // close modal
    } catch (err) {
      toast.error("Failed to create user", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-1">
        <Input name="name" placeholder="Full name" required />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Input name="email" type="email" placeholder="Email" required />
      </div>

      {/* ✅ PASSWORD WITH SHOW/HIDE TOGGLE */}
      <div className="space-y-1 relative">
        <Input
          name="password"
          type={showPassword ? "text" : "password"} // Dynamic type
          placeholder="Password"
          required
          className="pr-10" // Add padding to the right so text doesn't hit the icon
        />
        <button
          type="button" // Important: prevents form submission on click
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* ✅ ROLE SELECTOR (Arranged) */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Role
        </label>
        <Select
          value={role}
          onValueChange={(v) => setRole(v as "ADMIN" | "HR")}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </Button>
    </form>
  );
}
