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
      <div className="hidden md:block shrink-0">
        <Sidebar role={user.role} />
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="relative h-full w-full bg-white dark:bg-slate-950">
            <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          </div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
          <Topbar user={user} />
          <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
