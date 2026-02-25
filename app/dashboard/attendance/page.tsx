"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Save,
  Users,
  CalendarIcon,
  Clock,
  CheckCircle2,
  Filter,
  Split,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getStaffAttendance,
  saveBulkAttendance,
} from "@/src/actions/attendance";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [entries, setEntries] = useState<
    {
      rowId: string;
      employeeId: string;
      name: string;
      position: string | null;
      department: string | null;
      status: string;
      timeIn: string;
      timeOut: string;
      imageUrl: string | null;
      isSplit?: boolean;
    }[]
  >([]);

  useEffect(() => {
    async function loadStaff() {
      setLoading(true);
      try {
        const staff = await getStaffAttendance(selectedDate);

        const allEntries: any[] = [];

        staff.forEach((s) => {
          if (s.attendance && s.attendance.length > 0) {
            s.attendance.forEach((log, index) => {
              allEntries.push(createEntryObject(s, log, index > 0));
            });
          } else {
            allEntries.push(createEntryObject(s, null, false));
          }
        });

        setEntries(allEntries);
      } catch (err) {
        toast.error("Failed to load staff list");
      } finally {
        setLoading(false);
      }
    }
    loadStaff();
  }, [selectedDate]);

  const createEntryObject = (s: any, log: any, isSplit: boolean) => {
    const timeInStr = log?.timeIn
      ? new Date(log.timeIn).toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Manila",
        })
      : "";
    const timeOutStr = log?.timeOut
      ? new Date(log.timeOut).toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Manila",
        })
      : "";

    return {
      rowId: log?.id || Math.random().toString(36).substr(2, 9),
      employeeId: s.id,
      name: `${s.lastName}, ${s.firstName}`,
      position: s.position ? s.position.title : "No Position",
      department: s.department ? s.department.name : "No Dept",
      status: s.status,
      timeIn: timeInStr,
      timeOut: timeOutStr,
      imageUrl: s.imageUrl,
      isSplit,
    };
  };

  const handleUpdate = (
    rowId: string,
    field: "timeIn" | "timeOut",
    val: string,
  ) => {
    setEntries((prev) =>
      prev.map((e) => (e.rowId === rowId ? { ...e, [field]: val } : e)),
    );
  };

  const handleAddSplit = (employeeId: string) => {
    const original = entries.find((e) => e.employeeId === employeeId);
    if (!original) return;

    const newRow = {
      ...original,
      rowId: Math.random().toString(36).substr(2, 9),
      timeIn: "",
      timeOut: "",
      isSplit: true,
    };

    setEntries((prev) => {
      const lastIndex = prev.map((e) => e.employeeId).lastIndexOf(employeeId);
      const updated = [...prev];
      updated.splice(lastIndex + 1, 0, newRow);
      return updated;
    });
    toast.success(`Added split shift for ${original.name}`);
  };

  const handleRemoveRow = (rowId: string) => {
    setEntries((prev) => prev.filter((e) => e.rowId !== rowId));
  };

  const applyStandardShift = () => {
    setEntries((prev) =>
      prev.map((e) => {
        const matchesFilter =
          statusFilter === "ALL" || e.status === statusFilter;
        if (matchesFilter && !e.isSplit) {
          return {
            ...e,
            timeIn: e.timeIn || "08:00",
            timeOut: e.timeOut || "17:00",
          };
        }
        return e;
      }),
    );
    toast.info("Standard shift applied to primary rows");
  };

  const handleSave = async () => {
    if (entries.length === 0) return;
    const toastId = toast.loading("Saving attendance...");

    const validEntries = entries.filter((e) => e.timeIn || e.timeOut);
    const submissionData = validEntries.map(
      ({ status, isSplit, rowId, ...rest }) => rest,
    );

    const result = await saveBulkAttendance(selectedDate, submissionData);

    if (result.success) {
      toast.success(`Saved ${validEntries.length} shift records!`, {
        id: toastId,
      });
    } else {
      toast.error("Error saving records.", { id: toastId });
    }
  };

  const filteredEntries = entries.filter((entry) => {
    if (statusFilter === "ALL") return true;
    return entry.status === statusFilter;
  });

  return (
    <div className="space-y-6 p-1 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Attendance Log
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Encoding for JC&L Proserve Inc. Supports multiple shifts per day.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-muted/40 p-2 rounded-xl border shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider ml-1">
              Log Date
            </span>
            <div className="relative">
              <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-9 w-40 bg-background font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider ml-1">
              Filter Status
            </span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 bg-background">
                <Filter className="mr-2 h-3 w-3" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Staff</SelectItem>
                <SelectItem value="REGULAR">Regular</SelectItem>
                <SelectItem value="PROBATIONARY">Probationary</SelectItem>
                <SelectItem value="CONTRACTUAL">Contractual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="secondary"
            onClick={applyStandardShift}
            className="h-10 mt-auto border shadow-sm"
          >
            <Clock className="mr-2 h-4 w-4 text-blue-600" /> Standard
          </Button>

          <Button
            onClick={handleSave}
            className="h-10 mt-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
          >
            <Save className="mr-2 h-4 w-4" /> Save All
          </Button>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10">
                <TableHead className="pl-6">Employee Details</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((entry, index) => {
                  const isDuplicateDateRow =
                    index > 0 &&
                    filteredEntries[index - 1].employeeId === entry.employeeId;

                  return (
                    <TableRow
                      key={entry.rowId}
                      className={`group transition-colors ${entry.isSplit ? "bg-indigo-50/30 dark:bg-indigo-900/10 border-t-0" : ""}`}
                    >
                      <TableCell className="pl-6 py-3">
                        <div className="flex items-center gap-3">
                          {/* 👇 The new Tree Branch Visual */}
                          {isDuplicateDateRow ? (
                            <div className="relative h-8 w-8 flex items-center justify-center opacity-70">
                              {/* Vertical Line going up */}
                              <div className="absolute left-1/2 top-0 bottom-1/2 w-[2px] bg-indigo-300 dark:bg-indigo-800 rounded-t-sm"></div>
                              {/* Horizontal Line pointing right */}
                              <div className="absolute left-1/2 top-1/2 right-0 h-[2px] bg-indigo-300 dark:bg-indigo-800 rounded-r-sm"></div>
                            </div>
                          ) : (
                            <Avatar className="h-8 w-8 shadow-sm">
                              <AvatarImage src={entry.imageUrl ?? undefined} />
                              <AvatarFallback>
                                {entry.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div className="flex flex-col">
                            <span
                              className={`font-semibold text-sm ${isDuplicateDateRow ? "italic text-indigo-600/70 dark:text-indigo-400/70" : ""}`}
                            >
                              {isDuplicateDateRow
                                ? "Split Schedule"
                                : entry.name}
                            </span>

                            {/* Hide the position for the duplicate row so it looks cleaner */}
                            {!isDuplicateDateRow && (
                              <span className="text-[10px] text-muted-foreground uppercase tracking-tight">
                                {entry.position}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Input
                          type="time"
                          value={entry.timeIn}
                          onChange={(e) =>
                            handleUpdate(entry.rowId, "timeIn", e.target.value)
                          }
                          className="w-32 font-mono text-xs bg-background"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="time"
                          value={entry.timeOut}
                          onChange={(e) =>
                            handleUpdate(entry.rowId, "timeOut", e.target.value)
                          }
                          className="w-32 font-mono text-xs bg-background"
                        />
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          {entry.isSplit ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveRow(entry.rowId)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddSplit(entry.employeeId)}
                              className="h-8 text-[10px] font-bold uppercase tracking-tighter"
                            >
                              <Split className="mr-1 h-3 w-3" /> Split Schedule
                            </Button>
                          )}
                          {entry.timeIn && entry.timeOut && (
                            <div className="ml-2 flex items-center text-emerald-600">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
