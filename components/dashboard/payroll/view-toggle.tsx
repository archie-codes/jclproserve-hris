"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentView = searchParams.get("view") || "list";

  const setView = (view: "grid" | "list") => {
    const params = new URLSearchParams(searchParams);
    params.set("view", view);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-900 dark:text-white rounded-lg p-1 border shadow-sm">
      <Button
        variant="ghost" // 👇 Set base to ghost
        size="sm"
        // 👇 Conditionally apply your exact indigo colors for the active state
        className={`h-7 px-3 text-xs rounded-md transition-all ${
          currentView === "grid"
            ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => setView("grid")}
      >
        <LayoutGrid className="h-4 w-4 mr-1.5" /> Grid
      </Button>

      <Button
        variant="ghost" // 👇 Set base to ghost
        size="sm"
        // 👇 Conditionally apply your exact indigo colors for the active state
        className={`h-7 px-3 text-xs rounded-md transition-all ${
          currentView === "list"
            ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => setView("list")}
      >
        <List className="h-4 w-4 mr-1.5" /> List
      </Button>
    </div>
  );
}
