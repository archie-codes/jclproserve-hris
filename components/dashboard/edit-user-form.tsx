"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/app/dashboard/users/[id]/edit/actions";
import { resetUserPassword } from "@/app/dashboard/users/[id]/edit/reset-password";
import { toast } from "sonner";
import { Eye, EyeOff, Save, Lock, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ 1. Add onSuccess to the props definition
export function EditUserForm({ 
  user, 
  onSuccess 
}: { 
  user: any; 
  onSuccess: () => void; 
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Form States
  const [name, setName] = useState(user.name ?? "");
  const [role, setRole] = useState<"ADMIN" | "HR">(user.role ?? "HR");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* -------- PROFILE UPDATE -------- */
  function handleProfileUpdate(formData: FormData) {
    formData.set("role", role);

    startTransition(async () => {
      await updateUserProfile(user.id, formData);
      router.refresh(); 
      toast.success("Profile updated successfully", { position: "top-center" });
      
      // ✅ 2. Close modal on success
      onSuccess();
    });
  }

  /* -------- PASSWORD RESET -------- */
  function handlePasswordReset(formData: FormData) {
    startTransition(async () => {
      await resetUserPassword(user.id, formData);
      setPassword("");
      toast.success("Password reset successfully", { position: "top-center" });
      
      // ✅ Optional: Close modal after password reset too
      onSuccess();
    });
  }

  return (
    <div className="grid gap-6">
      {/* CARD 1: GENERAL INFORMATION */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Update the user's display name and access role.
          </CardDescription>
        </CardHeader>
        <form action={handleProfileUpdate}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as "ADMIN" | "HR")}
                name="role"
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

            <div className="space-y-2 mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={user.email}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            </div>

          </CardContent>
          
          {/* ✅ 3. Updated Footer with Cancel Button */}
          <CardFooter className="border-t px-6 py-4 flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onSuccess} // Closes modal
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* CARD 2: SECURITY & DANGER ZONE */}
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Manage password and security settings. proceed with caution.
          </CardDescription>
        </CardHeader>

        <form action={handlePasswordReset}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Reset Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
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
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters long.
              </p>
            </div>
          </CardContent>

          <CardFooter className="border-t bg-destructive/10 px-6 py-4 flex justify-between items-center">
            <span className="text-xs text-muted-foreground hidden sm:block">
              This action cannot be undone efficiently without admin access.
            </span>
            <Button
              type="submit"
              variant="destructive"
              disabled={pending || password.length < 8}
            >
              <Lock className="mr-2 h-4 w-4" />
              Reset Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}