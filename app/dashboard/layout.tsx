import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="hidden md:block w-64 shrink-0">
        <Sidebar role={user.role} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
