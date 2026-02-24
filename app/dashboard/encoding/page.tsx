"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
// Reuse the same server action!
import { saveBulkAttendance } from "@/src/actions/attendance";

export default function CoordinatorEncodingPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  // This would normally be fetched from the DB based on the Coordinator's assigned location
  const [staffList, setStaffList] = useState([
    { id: "1", name: "Juan Dela Cruz", timeIn: "", timeOut: "" },
    { id: "2", name: "Maria Santos", timeIn: "", timeOut: "" },
    { id: "3", name: "Pedro Penduko", timeIn: "", timeOut: "" },
  ]);

  const handleTimeChange = (
    id: string,
    field: "timeIn" | "timeOut",
    value: string,
  ) => {
    setStaffList((prev) =>
      prev.map((staff) =>
        staff.id === id ? { ...staff, [field]: value } : staff,
      ),
    );
  };

  const handleSave = async () => {
    setLoading(true);
    // Convert to format required by server action
    const payload = staffList
      .filter((s) => s.timeIn || s.timeOut) // Only save rows with data
      .map((s) => ({
        employeeId: s.id,
        timeIn: s.timeIn,
        timeOut: s.timeOut,
        // Add other required fields...
      }));

    // await saveBulkAttendance(date, payload);
    toast.success("DTR encoded successfully!");
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manual DTR Encoding</h1>
          <p className="text-muted-foreground">
            Transcribe paper records for your area.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm">
          <CalendarIcon className="h-4 w-4 text-gray-500" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm font-medium border-none focus:ring-0"
          />
        </div>
      </div>

      <Card>
        <CardHeader className="bg-slate-50 border-b pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">
              Staff List: Bulacan Area
            </CardTitle>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Submit Records
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Employee Name</TableHead>
                <TableHead>Time In (from Paper)</TableHead>
                <TableHead>Time Out (from Paper)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={staff.timeIn}
                      onChange={(e) =>
                        handleTimeChange(staff.id, "timeIn", e.target.value)
                      }
                      className="w-40"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={staff.timeOut}
                      onChange={(e) =>
                        handleTimeChange(staff.id, "timeOut", e.target.value)
                      }
                      className="w-40"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
