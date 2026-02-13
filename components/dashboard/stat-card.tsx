import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  color: "blue" | "green" | "red" | "purple" | "orange" | "amber";
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color,
}: StatCardProps) {
  // Map simple color names to complex Tailwind classes
  const styles = {
    blue: {
      border: "border-l-blue-500",
      bg: "bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-950 dark:to-slate-900",
      icon: "text-blue-500",
    },
    green: {
      border: "border-l-emerald-500",
      bg: "bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-950 dark:to-slate-900",
      icon: "text-emerald-500",
    },
    red: {
      border: "border-l-red-500",
      bg: "bg-gradient-to-br from-white to-red-50/50 dark:from-slate-950 dark:to-slate-900",
      icon: "text-red-500",
    },
    purple: {
      border: "border-l-purple-500",
      bg: "bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-950 dark:to-slate-900",
      icon: "text-purple-500",
    },
    orange: {
      border: "border-l-orange-500",
      bg: "bg-gradient-to-br from-white to-orange-50/50 dark:from-slate-950 dark:to-slate-900",
      icon: "text-orange-500",
    },
    amber: {
      border: "border-l-amber-500",
      bg: "bg-gradient-to-br from-white to-amber-50/50 dark:from-slate-950 dark:to-slate-900",
      icon: "text-amber-500",
    },
  };

  const currentStyle = styles[color] || styles.blue;

  return (
    <Card
      className={cn(
        "border-l-4 shadow-sm transition-all hover:shadow-md",
        currentStyle.border,
        currentStyle.bg,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className={cn("h-4 w-4", currentStyle.icon)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{trend}</p>
      </CardContent>
    </Card>
  );
}
