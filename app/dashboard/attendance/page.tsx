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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Users, CalendarIcon, Clock, CheckCircle2, Filter } from "lucide-react";
import { toast } from "sonner";
import { getUtilityStaff, saveBulkAttendance } from "@/src/actions/attendance";
import { Badge } from "@/components/ui/badge";

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  
  // New State for Filtering
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // Local state to hold the grid data before saving
  const [entries, setEntries] = useState<{
    employeeId: string;
    name: string;
    position: string | null;
    department: string | null;
    status: string; // Added status here
    timeIn: string;
    timeOut: string;
  }[]>([]);

  // 1. Fetch Staff List on Mount
  useEffect(() => {
    async function loadStaff() {
      try {
        const staff = await getUtilityStaff();
        
        if (staff.length === 0) {
          toast.warning("No utility staff found. Check department names.");
        }

        setEntries(staff.map(s => ({
          employeeId: s.id,
          name: `${s.lastName}, ${s.firstName}`,
          
          // 🔴 FIX: Extract the string 'title' from the position object
          // Checks if position exists, otherwise returns null or a default string
          position: s.position ? s.position.title : "No Position", 

          // 🔴 FIX: Extract the string 'name' from the department object
          department: s.department ? s.department.name : "No Dept",

          status: s.status, // Map the status from DB
          timeIn: "",    
          timeOut: "",   
        })));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load staff list");
      } finally {
        setLoading(false);
      }
    }
    loadStaff();
  }, []);

  // 2. Handle Individual Input Changes
  const handleUpdate = (id: string, field: "timeIn" | "timeOut", val: string) => {
    setEntries(prev => prev.map(e => e.employeeId === id ? { ...e, [field]: val } : e));
  };

  // 3. Quick Action: Apply Standard 8-5 Shift to Empty Fields (Apply only to visible filtered entries)
  const applyStandardShift = () => {
    setEntries(prev => prev.map(e => {
        // Only apply if it matches current filter (optional logic, but usually preferred)
        const matchesFilter = statusFilter === "ALL" || e.status === statusFilter;
        
        if (matchesFilter) {
            return {
                ...e,
                timeIn: e.timeIn || "08:00",
                timeOut: e.timeOut || "17:00"
            };
        }
        return e;
    }));
    toast.info("Applied 8:00 AM - 5:00 PM to visible empty fields");
  };

  // 4. Submit to Server
  const handleSave = async () => {
    if (entries.length === 0) return;

    const toastId = toast.loading("Saving attendance records...");
    
    // Filter out rows that are completely empty to save bandwidth
    const validEntries = entries.filter(e => e.timeIn || e.timeOut);
    
    // @ts-ignore - Ignoring status field for submission as backend might not expect it in payload
    const submissionData = validEntries.map(({ status, ...rest }) => rest);

    const result = await saveBulkAttendance(selectedDate, submissionData);
    
    if (result.success) {
      toast.success(`Successfully saved ${validEntries.length} records!`, { id: toastId });
    } else {
      toast.error("Error saving records. Please try again.", { id: toastId });
    }
  };

  // --- FILTERING LOGIC ---
  const filteredEntries = entries.filter((entry) => {
    if (statusFilter === "ALL") return true;
    return entry.status === statusFilter;
  });

  return (
    <div className="space-y-6 p-1 animate-in fade-in duration-500">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Attendance Log</h1>
          <p className="text-muted-foreground mt-1">
            Daily timecard encoding for Utility & Operations personnel.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-muted/40 p-2 rounded-xl border border-border/50 shadow-sm">
          
          {/* Date Picker */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider ml-1">Log Date</span>
            <div className="relative">
              <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-9 w-40 bg-background border-input font-medium"
              />
            </div>
          </div>
          
          <div className="h-8 w-px bg-border mx-1 hidden sm:block"></div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider ml-1">Filter Status</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-37.5 bg-background">
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

          <div className="h-8 w-px bg-border mx-1 hidden sm:block"></div>

          {/* Action Buttons */}
          <Button 
            variant="secondary" 
            onClick={applyStandardShift} 
            className="h-10 mt-auto shadow-sm border border-border/50"
            title="Fill 8:00 AM - 5:00 PM"
          >
            <Clock className="mr-2 h-4 w-4 text-blue-600" /> Standard Shift
          </Button>

          <Button 
            onClick={handleSave} 
            className="h-10 mt-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-95"
          >
            <Save className="mr-2 h-4 w-4" /> Save Records
          </Button>
        </div>
      </div>

      {/* --- MAIN GRID --- */}
      <Card className="border-border/60 shadow-sm overflow-hidden bg-card">
        <CardHeader className="py-3 px-6 bg-muted/30 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
            <Users className="h-4 w-4" /> Staff List
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            Showing: {filteredEntries.length} / {entries.length}
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/10">
                <TableHead className="w-[40%] pl-6">Employee Details</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead className="text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                   <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                     <div className="flex flex-col items-center gap-2">
                       <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                       <span>Loading staff list...</span>
                     </div>
                   </TableCell>
                 </TableRow>
              ) : filteredEntries.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                     {entries.length === 0 
                        ? 'No employees found in "Utility" or "Operations" departments.' 
                        : `No ${statusFilter.toLowerCase()} employees found.`}
                   </TableCell>
                 </TableRow>
              ) : (
                filteredEntries.map((entry) => (
                  <TableRow key={entry.employeeId} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 py-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{entry.name}</span>
                            <Badge variant="outline" className="text-[10px] h-5 px-1 bg-muted/50">
                                {entry.status}
                            </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{entry.position || "Staff"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="time" 
                        value={entry.timeIn} 
                        onChange={(e) => handleUpdate(entry.employeeId, "timeIn", e.target.value)}
                        className="w-36 font-mono text-sm bg-background/50 focus:bg-background transition-colors"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="time" 
                        value={entry.timeOut} 
                        onChange={(e) => handleUpdate(entry.employeeId, "timeOut", e.target.value)}
                        className="w-36 font-mono text-sm bg-background/50 focus:bg-background transition-colors"
                      />
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {entry.timeIn && entry.timeOut ? (
                        <div className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full text-xs font-medium">
                          <CheckCircle2 className="h-3 w-3" /> Complete
                        </div>
                      ) : (
                        <span className="text-muted-foreground/40 text-xs">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}