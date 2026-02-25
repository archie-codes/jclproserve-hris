"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Filter, Search } from "lucide-react";

export function PayrollFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "ALL";
  const currentPosition = searchParams.get("position") || "";
  const currentName = searchParams.get("name") || ""; // 👇 Added name state

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  // 👇 Updated to include currentName
  const hasFilters =
    currentStatus !== "ALL" || currentPosition !== "" || currentName !== "";

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4 items-end bg-white dark:bg-slate-950 p-4 rounded-xl border shadow-sm flex-wrap">
      <div className="flex items-center gap-2 text-muted-foreground mr-2 mb-2 sm:mb-0 pb-1">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      {/* 👇 NEW: Search by Name */}
      <div className="space-y-1.5 flex-1 min-w-[150px] sm:max-w-[200px]">
        <label className="text-[10px] uppercase font-bold text-muted-foreground">
          Employee Name
        </label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name..."
            className="h-9 pl-9"
            defaultValue={currentName}
            onBlur={(e) => updateFilter("name", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                updateFilter("name", e.currentTarget.value);
            }}
          />
        </div>
      </div>

      <div className="space-y-1.5 flex-1 min-w-[150px] sm:max-w-[200px]">
        <label className="text-[10px] uppercase font-bold text-muted-foreground">
          Employment Status
        </label>
        <Select
          value={currentStatus}
          onValueChange={(val) => updateFilter("status", val)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="REGULAR">Regular</SelectItem>
            <SelectItem value="PROBATIONARY">Probationary</SelectItem>
            <SelectItem value="CONTRACTUAL">Contractual</SelectItem>
            <SelectItem value="PROJECT_BASED">Project Based</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="h-9 px-3 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <X className="h-4 w-4 mr-2" /> Clear
        </Button>
      )}
    </div>
  );
}
