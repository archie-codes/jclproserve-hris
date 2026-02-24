"use client";

import {
  FileText,
  Download,
  Wallet,
  CalendarDays,
  BarChart3,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Libraries for Export
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { getExportData, getRecruitmentExportData } from "@/src/actions/reports";

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

      // Flatten Data for Excel
      const cleanData = res.data.map((emp: any) => ({
        "Employee ID": emp.employeeNo,
        "First Name": emp.firstName,
        "Last Name": emp.lastName,
        Position: emp.position ? emp.position.title : "N/A",
        Department: emp.department ? emp.department.name : "N/A",
        Status: emp.status,
        "Date Hired": emp.dateHired
          ? new Date(emp.dateHired).toLocaleDateString()
          : "-",
      }));

      const worksheet = XLSX.utils.json_to_sheet(cleanData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

      XLSX.writeFile(
        workbook,
        `JCL_Employee_List_${new Date().getFullYear()}.xlsx`,
      );
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
      doc.text(
        `Official Employee Census - Generated: ${new Date().toLocaleString()}`,
        14,
        30,
      );

      // PDF Table
      autoTable(doc, {
        startY: 35,
        head: [
          ["ID", "First Name", "Last Name", "Position", "Department", "Status"],
        ],
        body: res.data.map((e: any) => [
          e.employeeNo,
          e.firstName,
          e.lastName,
          e.position ? e.position.title : "-",
          e.department ? e.department.name : "-",
          e.status,
        ]),
        headStyles: {
          fillColor: [63, 81, 181],
          fontSize: 10,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
      });

      doc.save(`JCL_Census_${new Date().getTime()}.pdf`);
      toast.success("PDF downloaded successfully", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF", { id: toastId });
    }
  };

  // --- RECRUITMENT EXPORT LOGIC ---
  const handleExportRecruitmentExcel = async () => {
    const toastId = toast.loading("Preparing Recruitment Data...");
    try {
      // You'll need to create this server action next
      const res = await getRecruitmentExportData();

      if (!res.success || !res.data) {
        toast.error(res.error || "Export failed", { id: toastId });
        return;
      }

      const cleanData = res.data.map((result: any) => ({
        "Date Taken": new Date(result.dateTaken).toLocaleDateString(),
        "First Name": result.firstName,
        "Last Name": result.lastName,
        "Position Applied": result.positionApplied,
        "Exam Title": result.exam?.title || "N/A",
        "Raw Score": `${result.score} / ${result.totalPoints}`,
        Percentage: `${result.percentage}%`,
        Status: result.status,
      }));

      const worksheet = XLSX.utils.json_to_sheet(cleanData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Exam Results");

      XLSX.writeFile(
        workbook,
        `Recruitment_Report_${new Date().getFullYear()}.xlsx`,
      );
      toast.success("Recruitment data exported!", { id: toastId });
    } catch (error) {
      toast.error("An unexpected error occurred", { id: toastId });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Export your data or view system insights.
        </p>
      </div>

      {/* 2. EXPORT CARDS (Matching "Left Border" Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EXCEL CARD */}
        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all bg-linear-to-br from-white to-emerald-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <FileSpreadsheet className="h-5 w-5" /> Master Employee List
            </CardTitle>
            <CardDescription>
              Full database export for payroll auditing or external processing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExportExcel}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <Download className="mr-2 h-4 w-4" /> Download Excel (.xlsx)
            </Button>
          </CardContent>
        </Card>

        {/* PDF CARD */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all bg-linear-to-br from-white to-blue-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Printer className="h-5 w-5" /> Official Census PDF
            </CardTitle>
            <CardDescription>
              Print-ready document suitable for government submission or filing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExportPDF}
              variant="outline"
              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
            >
              <FileText className="mr-2 h-4 w-4" /> Generate PDF Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* RECRUITMENT CARD */}
      <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-all bg-linear-to-br from-white to-purple-50/50 dark:from-slate-950 dark:to-slate-900">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
            <TrendingUp className="h-5 w-5" /> Recruitment Analytics
          </CardTitle>
          <CardDescription>
            Export applicant exam performance and passing rates for technical
            assessments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleExportRecruitmentExcel}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
          >
            <Download className="mr-2 h-4 w-4" /> Export Exam Results (.xlsx)
          </Button>
        </CardContent>
      </Card>

      {/* 3. INSIGHTS PREVIEW (Matching Style) */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          System Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payroll Card */}
          <Card className="border-l-4 border-l-indigo-500 shadow-sm bg-linear-to-br from-white to-indigo-50/50 dark:from-slate-950 dark:to-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Wallet className="h-4 w-4" /> Payroll Summary
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] text-indigo-600 border-indigo-200"
                >
                  Coming Soon
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-indigo-100 dark:border-indigo-900 rounded-lg text-center p-4">
                <TrendingUp className="h-8 w-8 text-indigo-200 dark:text-indigo-900 mb-2" />
                <p className="text-xs text-muted-foreground">
                  Detailed salary reports will appear here after your first
                  payroll run.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card className="border-l-4 border-l-amber-500 shadow-sm bg-linear-to-br from-white to-amber-50/50 dark:from-slate-950 dark:to-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" /> Attendance
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] text-amber-600 border-amber-200"
                >
                  Coming Soon
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-amber-100 dark:border-amber-900 rounded-lg text-center p-4">
                <Clock className="h-8 w-8 text-amber-200 dark:text-amber-900 mb-2" />
                <p className="text-xs text-muted-foreground">
                  Monthly absenteeism and late arrival charts are being
                  prepared.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Growth Card */}
          <Card className="border-l-4 border-l-purple-500 shadow-sm bg-linear-to-br from-white to-purple-50/50 dark:from-slate-950 dark:to-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <BarChart3 className="h-4 w-4" /> Hiring Growth
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] text-purple-600 border-purple-200"
                >
                  Coming Soon
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-purple-100 dark:border-purple-900 rounded-lg text-center p-4">
                <BarChart3 className="h-8 w-8 text-purple-200 dark:text-purple-900 mb-2" />
                <p className="text-xs text-muted-foreground">
                  Analytics regarding turnover and new hire rates.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
