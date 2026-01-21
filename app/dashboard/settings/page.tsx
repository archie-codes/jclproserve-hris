import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">System Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Admin-only configuration.
      </p>
    </div>
  );
}
