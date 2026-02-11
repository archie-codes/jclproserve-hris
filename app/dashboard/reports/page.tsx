"use client";

import { 
  FileText, 
  Download, 
  Wallet, 
  CalendarDays, 
  BarChart3, 
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Libraries for Export
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { getExportData } from "@/src/actions/reports";

export default function ReportsPage() {
  
  // --- EXCEL EXPORT LOGIC ---
  const handleExportExcel = async () => {
    const toastId = toast.loading("Preparing Excel file...");
    try {
        const res = await getExportData();
        
        if (!res.success || !res.data) {
          toast.error(res.error || "Export failed", { id: toastId });
          return;
        }

        // 🔴 STEP 1: Flatten Data for Excel (Fixes [object Object])
        const cleanData = res.data.map((emp: any) => ({
            "Employee ID": emp.employeeNo,
            "First Name": emp.firstName,
            "Last Name": emp.lastName,
            "Position": emp.position ? emp.position.title : "N/A",      // Fix Object
            "Department": emp.department ? emp.department.name : "N/A", // Fix Object
            "Status": emp.status,
            "Date Hired": emp.dateHired ? new Date(emp.dateHired).toLocaleDateString() : "-",
        }));

        const worksheet = XLSX.utils.json_to_sheet(cleanData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
        
        // Generate file
        XLSX.writeFile(workbook, `JCL_Employee_List_${new Date().getFullYear()}.xlsx`);
        toast.success("Excel downloaded successfully", { id: toastId });
    } catch (error) {
        console.error(error);
        toast.error("An unexpected error occurred", { id: toastId });
    }
  };

  // --- PDF EXPORT LOGIC ---
  const handleExportPDF = async () => {
    const toastId = toast.loading("Generating PDF Report...");
    try {
        const res = await getExportData();

        if (!res.success || !res.data) {
          toast.error(res.error || "Export failed", { id: toastId });
          return;
        }

        const doc = new jsPDF();
        
        // PDF Header
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text("JC&L PROSERVE HRIS", 14, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Official Employee Census - Generated: ${new Date().toLocaleString()}`, 14, 30);

        // PDF Table
        autoTable(doc, {
          startY: 35,
          head: [['ID', 'First Name', 'Last Name', 'Position', 'Department', 'Status']],
          body: res.data.map((e: any) => [
            e.employeeNo, 
            e.firstName, 
            e.lastName, 
            e.position ? e.position.title : "-",     // 🔴 Fix: Extract Title
            e.department ? e.department.name : "-",  // 🔴 Fix: Extract Name
            e.status
          ]),
          headStyles: { 
            fillColor: [63, 81, 181], // Professional Indigo
            fontSize: 10,
            fontStyle: 'bold'
          }, 
          styles: {
            fontSize: 9,
            cellPadding: 3,
          },
          alternateRowStyles: {
            fillColor: [245, 247, 250] // Light gray for readability
          }
        });

        doc.save(`JCL_Census_${new Date().getTime()}.pdf`);
        toast.success("PDF downloaded successfully", { id: toastId });
    } catch (error) {
        console.error(error);
        toast.error("Failed to generate PDF", { id: toastId });
    }
  };

  return (
    <div className="space-y-6 p-1 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Export your data or view system insights.</p>
      </div>

      {/* QUICK EXPORT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-primary/5 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" /> Master Employee List
            </CardTitle>
            <CardDescription>Get all employee data in a spreadsheet for payroll or filtering.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExportExcel} className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Download className="mr-2 h-4 w-4" /> Download Excel (.xlsx)
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/30 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" /> Official Census PDF
            </CardTitle>
            <CardDescription>Generate a clean, professional PDF document for documentation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExportPDF} variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
              <Download className="mr-2 h-4 w-4" /> Download PDF Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* DASHBOARD PREVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" /> Payroll Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground text-xs text-center p-4">
              Detailed salary reports will appear here after payroll processing.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" /> Attendance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground text-xs text-center p-4">
              Monthly absenteeism charts are being prepared.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" /> Hiring Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground text-xs text-center p-4">
              Analytics visualization loading...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}