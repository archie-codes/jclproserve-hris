// import { redirect } from "next/navigation";
// import { getCurrentUser } from "@/lib/auth";

// export default async function SettingsPage() {
//   const user = await getCurrentUser();

//   if (!user || user.role !== "ADMIN") {
//     redirect("/dashboard");
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold">System Settings</h1>
//       <p className="mt-2 text-muted-foreground">
//         Admin-only configuration.
//       </p>
//     </div>
//   );
// }


import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Mock initial data
  const initialSettings = {
    systemName: "JC&L Proserve System",
    maintenanceMode: false,
    allowRegistrations: true,
    supportEmail: "admin@jclproserve.com",
  };

  return (
    <div className="mx-auto">
      <div className="mb-8">
        {/* Added dark: variants for text colors */}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          System Settings
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Manage global configurations and admin preferences.
        </p>
      </div>
      
      <SettingsClient user={user} initialSettings={initialSettings} />
    </div>
  );
}