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
import { Eye, EyeOff, User, X } from "lucide-react";
import { createUser } from "@/src/actions/users";

// 👇 Import UploadThing components
import { UploadButton } from "@/lib/uploadthing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"ADMIN" | "HR" | "STAFF">("ADMIN");
  const [showPassword, setShowPassword] = useState(false);

  // State for the image URL
  const [imageUrl, setImageUrl] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("role", role);
      // Append the image URL to the form data
      formData.set("image", imageUrl);

      await createUser(formData);

      toast.success("User created successfully");
      onSuccess();
    } catch (err) {
      toast.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 👇 IMAGE UPLOAD SECTION */}
      <div className="flex flex-col items-center gap-4 mb-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-muted shadow-sm">
            {imageUrl ? (
              <AvatarImage src={imageUrl} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-muted flex items-center justify-center">
              <User className="h-10 w-10 opacity-50" />
            </AvatarFallback>
          </Avatar>

          {/* Remove Button (Only visible if image exists) */}
          {imageUrl && (
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-1 shadow-md hover:bg-destructive/90 transition-colors"
              title="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-1">
          <UploadButton
            endpoint="userImage"
            onClientUploadComplete={(res) => {
              if (res?.[0]) {
                setImageUrl(res[0].url);
                toast.success("Photo uploaded successfully");
              }
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload failed: ${error.message}`);
            }}
            appearance={{
              button:
                "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md shadow-sm transition-colors text-sm font-medium",
              container: "w-max",
              allowedContent: "hidden", // We hide the default text to use our custom one below
            }}
          />
          {/* 👇 HERE IS THE HELPER TEXT */}
          <p className="text-xs text-muted-foreground">
            Allowed: JPG, PNG (Max 4MB)
          </p>
        </div>
      </div>
      {/* 👆 END IMAGE SECTION */}

      {/* Name */}
      <div className="space-y-1">
        <Input name="name" placeholder="Full name" required />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Input name="email" type="email" placeholder="Email" required />
      </div>

      {/* Password */}
      <div className="space-y-1 relative">
        <Input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
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

      {/* Role */}
      <div className="space-y-1">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Role
        </label>
        <Select
          value={role}
          onValueChange={(v) => setRole(v as "ADMIN" | "HR" | "STAFF")}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="STAFF">STAFF</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </Button>
    </form>
  );
}
