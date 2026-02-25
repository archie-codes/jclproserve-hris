"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Assuming this is the shape of your data based on your schema
type AttendanceLog = {
  id: string;
  date: string;
  timeIn: Date | null;
  timeOut: Date | null;
  totalHours: number | null;
  status: string | null;
  shift?: { name: string }; // If you join the shift table
};

export function DTRTable({ logs }: { logs: AttendanceLog[] }) {
  // 👇 1. THE MAGIC: Group the logs by Date
  const groupedLogs = logs.reduce(
    (acc: Record<string, AttendanceLog[]>, log) => {
      // We use the date string as the key (e.g., "2026-02-15")
      const dateKey = log.date.toString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(log);
      return acc;
    },
    {},
  );

  // Sort the dates so the newest is at the top
  const sortedDates = Object.keys(groupedLogs).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <div className="rounded-xl border bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
          <TableRow>
            <TableHead className="pl-6 w-[200px]">Date</TableHead>
            <TableHead>Shift / Status</TableHead>
            <TableHead>Time In</TableHead>
            <TableHead>Time Out</TableHead>
            <TableHead className="text-right pr-6">Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDates.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                No attendance records found for this period.
              </TableCell>
            </TableRow>
          ) : (
            sortedDates.map((dateKey) => {
              const dayLogs = groupedLogs[dateKey];

              // 👇 2. Render multiple rows for the same date
              return dayLogs.map((log, index) => {
                const isFirstShift = index === 0;
                const isLastShift = index === dayLogs.length - 1;

                return (
                  <TableRow
                    key={log.id}
                    // Remove bottom border if there's another shift on the same day to visually connect them
                    className={`hover:bg-slate-50/50 ${!isLastShift ? "border-b-0" : ""}`}
                  >
                    {/* Only show the Date on the very first row of that day */}
                    <TableCell
                      className={`pl-6 ${isFirstShift ? "font-medium text-foreground" : "text-transparent select-none"}`}
                    >
                      {format(new Date(dateKey), "MMM d, yyyy (EEE)")}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Example styling for shifts */}
                        <Badge
                          variant="outline"
                          className="text-xs bg-slate-50"
                        >
                          {log.shift?.name || `Shift ${index + 1}`}
                        </Badge>
                        {log.status === "LATE" && (
                          <Badge
                            variant="destructive"
                            className="text-[10px] h-5"
                          >
                            LATE
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-600">
                      {log.timeIn
                        ? format(new Date(log.timeIn), "hh:mm a")
                        : "--:--"}
                    </TableCell>

                    <TableCell className="text-slate-600">
                      {log.timeOut
                        ? format(new Date(log.timeOut), "hh:mm a")
                        : "--:--"}
                    </TableCell>

                    <TableCell className="text-right pr-6 font-medium">
                      {log.totalHours ? log.totalHours.toFixed(2) : "0.00"}
                    </TableCell>
                  </TableRow>
                );
              });
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
