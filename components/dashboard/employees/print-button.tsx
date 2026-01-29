"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

interface EmployeeData {
  firstName: string;
  lastName: string;
  middleName?: string | null;
  position: string | null;
  department: string | null;
  employeeNo: string;
  dateHired: string | Date;
  status: string;
  // Add other fields you want to print...
}

export function PrintButton({ data }: { data: any }) { // Accepting data as prop
  
  const generatePDF = () => {
    const doc = new jsPDF();

    // --- HEADER ---
    doc.setFontSize(22);
    doc.text("JCL PROSERVE", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Human Resources Department", 105, 26, { align: "center" });
    doc.text("201 EMPLOYEE PROFILE", 105, 32, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(20, 38, 190, 38);

    // --- EMPLOYEE SUMMARY ---
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`${data.lastName}, ${data.firstName} ${data.middleName || ""}`, 20, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(data.position || "No Position", 20, 56);
    doc.text(`ID: ${data.employeeNo}`, 150, 50, { align: "right" });

    // --- DATA TABLE 1: Employment Details ---
    autoTable(doc, {
      startY: 65,
      head: [['Employment Details', '']],
      body: [
        ['Department', data.department || "N/A"],
        ['Status', data.status],
        ['Date Hired', new Date(data.dateHired).toLocaleDateString()],
        ['Work Email', data.email],
      ],
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60] },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
    });

    // --- DATA TABLE 2: Government IDs ---
    // @ts-ignore (Accessing lastAutoTable property)
    let finalY = doc.lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: finalY,
      head: [['Government Contributions', '']],
      body: [
        ['SSS Number', data.sssNo || "N/A"],
        ['PhilHealth', data.philHealthNo || "N/A"],
        ['Pag-IBIG', data.pagIbigNo || "N/A"],
        ['TIN', data.tinNo || "N/A"],
      ],
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60] },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
    });

    // --- FOOTER ---
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);
    doc.text("Confidential Document", 190, 280, { align: "right" });

    // Save
    doc.save(`${data.lastName}_${data.firstName}_201.pdf`);
    toast.success("PDF Downloaded successfully", {position  : "top-right"});
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex-1 sm:flex-none"
      onClick={generatePDF}
    >
      <Printer className="mr-2 h-4 w-4" /> Export PDF
    </Button>
  );
}