import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        {/* Subtle background pulse */}
        <div className="absolute h-12 w-12 rounded-full bg-blue-100 animate-ping opacity-75" />
        {/* Main spinning icon */}
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 relative z-10" />
      </div>
      <p className="text-sm font-medium text-slate-500 animate-pulse">
        Loading data...
      </p>
    </div>
  );
}
