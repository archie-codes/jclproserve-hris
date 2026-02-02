// "use client";

// import { Button } from "@/components/ui/button";
// import { Printer } from "lucide-react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { toast } from "sonner";

// interface EmployeeData {
//   firstName: string;
//   lastName: string;
//   middleName?: string | null;
//   position: string | null;
//   department: string | null;
//   employeeNo: string;
//   dateHired: string | Date;
//   status: string;
//   // Add other fields you want to print...
// }

// export function PrintButton({ data }: { data: any }) { // Accepting data as prop
  
//   const generatePDF = () => {
//     const doc = new jsPDF();

//     // --- HEADER ---
//     doc.setFontSize(22);
//     doc.text("JCL PROSERVE", 105, 20, { align: "center" });
    
//     doc.setFontSize(10);
//     doc.setTextColor(100);
//     doc.text("Human Resources Department", 105, 26, { align: "center" });
//     doc.text("201 EMPLOYEE PROFILE", 105, 32, { align: "center" });

//     doc.setLineWidth(0.5);
//     doc.line(20, 38, 190, 38);

//     // --- EMPLOYEE SUMMARY ---
//     doc.setFontSize(14);
//     doc.setTextColor(0);
//     doc.text(`${data.lastName}, ${data.firstName} ${data.middleName || ""}`, 20, 50);
    
//     doc.setFontSize(10);
//     doc.setTextColor(100);
//     doc.text(data.position || "No Position", 20, 56);
//     doc.text(`ID: ${data.employeeNo}`, 150, 50, { align: "right" });

//     // --- DATA TABLE 1: Employment Details ---
//     autoTable(doc, {
//       startY: 65,
//       head: [['Employment Details', '']],
//       body: [
//         ['Department', data.department || "N/A"],
//         ['Status', data.status],
//         ['Date Hired', new Date(data.dateHired).toLocaleDateString()],
//         ['Work Email', data.email],
//       ],
//       theme: 'grid',
//       headStyles: { fillColor: [60, 60, 60] },
//       columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
//     });

//     // --- DATA TABLE 2: Government IDs ---
//     // @ts-ignore (Accessing lastAutoTable property)
//     let finalY = doc.lastAutoTable.finalY + 10;

//     autoTable(doc, {
//       startY: finalY,
//       head: [['Government Contributions', '']],
//       body: [
//         ['SSS Number', data.sssNo || "N/A"],
//         ['PhilHealth', data.philHealthNo || "N/A"],
//         ['Pag-IBIG', data.pagIbigNo || "N/A"],
//         ['TIN', data.tinNo || "N/A"],
//       ],
//       theme: 'grid',
//       headStyles: { fillColor: [60, 60, 60] },
//       columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
//     });

//     // --- FOOTER ---
//     doc.setFontSize(8);
//     doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);
//     doc.text("Confidential Document", 190, 280, { align: "right" });

//     // Save
//     doc.save(`${data.lastName}_${data.firstName}_201.pdf`);
//     toast.success("PDF Downloaded successfully", {position  : "top-right"});
//   };

//   return (
//     <Button 
//       variant="outline" 
//       size="sm" 
//       className="flex-1 sm:flex-none"
//       onClick={generatePDF}
//     >
//       <Printer className="mr-2 h-4 w-4" /> Export PDF
//     </Button>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { useState } from "react";

// --- HELPER: Currency Formatter ---
const formatCurrency = (amount: number | null) => {
  if (amount === null || amount === undefined) return "P 0.00";
  const value = amount / 100; 
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
};

// --- HELPER: Date Formatter ---
const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// --- HELPER: Tenure Calculator ---
const calculateTenure = (startDate: string | Date | null, endDate: string | Date | null) => {
    if (!startDate) return "N/A";
    
    const start = new Date(startDate);
    // If they resigned, calculate tenure until resignation. Otherwise, until today.
    const end = endDate ? new Date(endDate) : new Date();

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    if (years < 0) return "N/A"; // Error case
    if (years === 0 && months === 0) return "Less than 1 month";

    const yStr = years > 0 ? `${years} ${years === 1 ? 'yr' : 'yrs'}` : "";
    const mStr = months > 0 ? `${months} ${months === 1 ? 'mo' : 'mos'}` : "";

    return [yStr, mStr].filter(Boolean).join(" & ");
};

// --- HELPER: Convert Image URL to Base64 ---
async function imageUrlToBase64(url: string): Promise<string | null> {
    if (!url) return null;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error("Error loading image for PDF:", e);
      return null; 
    }
}

export function PrintButton({ data }: { data: any }) { 
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generatePDF = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Preparing PDF document...");

    try {
        // 1. PRE-LOAD IMAGE
        let imgData: string | null = null;
        if (data.imageUrl) {
             imgData = await imageUrlToBase64(data.imageUrl);
        }

        const doc = new jsPDF();

        // --- 2. HEADER ---
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("JCL PROSERVE", 105, 20, { align: "center" });
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text("Human Resources Department", 105, 26, { align: "center" });
        doc.text("201 EMPLOYEE PROFILE", 105, 32, { align: "center" });

        doc.setDrawColor(200);
        doc.setLineWidth(0.5);
        doc.line(20, 38, 190, 38);

        // --- 3. PROFILE IMAGE & SUMMARY ---
        const startY = 50;
        
        if (imgData) {
            doc.addImage(imgData, 'JPEG', 150, 42, 35, 35);
            doc.setDrawColor(220);
            doc.rect(150, 42, 35, 35); 
        } else {
            doc.setDrawColor(230);
            doc.setFillColor(245);
            doc.rect(150, 42, 35, 35, 'FD'); 
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text("No Photo", 167.5, 60, { align: 'center' });
        }

        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text(`${data.lastName}, ${data.firstName} ${data.middleName || ""}`, 20, startY);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text(data.position || "No Position", 20, startY + 6);
        
        doc.setFontSize(11);
        doc.setTextColor(50);
        doc.text(`ID: ${data.employeeNo}`, 185, 83, { align: "right" });

        // --- TABLE SETTINGS ---
        const tableTheme = 'grid';
        const headStyles = { fillColor: [40, 40, 40] as [number, number, number], textColor: 255, fontStyle: 'bold' as 'bold' };
        const columnStyles = { 0: { fontStyle: 'bold' as 'bold', cellWidth: 70, fillColor: [245, 245, 245] as [number, number, number] } };
        let finalY = 90; 

        // --- 4. PERSONAL INFORMATION ---
        autoTable(doc, {
          startY: finalY,
          head: [['Personal Information', '']],
          body: [
            ['Date of Birth', formatDate(data.dateOfBirth)],
            ['Civil Status', data.civilStatus || "N/A"],
            ['Gender', data.gender || "N/A"],
            ['Mobile Number', data.mobileNumber || "N/A"],
            ['Email Address', data.email || "N/A"],
            ['Current Address', data.address || "N/A"],
            ['Emergency Contact', `${data.emergencyContactName || "N/A"} (${data.emergencyContactPhone || "N/A"})`],
          ],
          theme: tableTheme,
          headStyles: headStyles,
          columnStyles: columnStyles,
        });

        // @ts-ignore
        finalY = doc.lastAutoTable.finalY + 10;

        // --- 5. EMPLOYMENT DETAILS ---
        autoTable(doc, {
          startY: finalY,
          head: [['Employment Information', '']],
          body: [
            ['Department', data.department || "N/A"],
            ['Position / Title', data.position || "N/A"],
            ['Employment Status', data.status],
            ['Date Hired', formatDate(data.dateHired)],
            ['Tenure', calculateTenure(data.dateHired, data.dateResigned)], // <--- ADDED HERE
            ['Date Regularized', data.dateRegularized ? formatDate(data.dateRegularized) : "—"],
            ['Date Resigned', data.dateResigned ? formatDate(data.dateResigned) : "—"],
          ],
          theme: tableTheme,
          headStyles: headStyles,
          columnStyles: columnStyles,
        });

        // @ts-ignore
        finalY = doc.lastAutoTable.finalY + 10;

        // --- 6. COMPENSATION & BENEFITS ---
        autoTable(doc, {
          startY: finalY,
          head: [['Compensation & Statutory Benefits', '']],
          body: [
            ['Salary Type', data.salaryType || "N/A"],
            ['Basic Salary', formatCurrency(data.basicSalary)],
            ['Allowance', formatCurrency(data.allowance)],
            ['Bank Name', data.bankName || "N/A"],
            ['Bank Account No.', data.bankAccountNo || "N/A"],
            ['---', '---'], 
            ['SSS Number', data.sssNo || "N/A"],
            ['PhilHealth Number', data.philHealthNo || "N/A"],
            ['Pag-IBIG / HDMF', data.pagIbigNo || "N/A"],
            ['TIN (Tax ID)', data.tinNo || "N/A"],
          ],
          theme: tableTheme,
          headStyles: headStyles,
          columnStyles: columnStyles,
          didParseCell: function (data) {
            if (data.row.raw && (data.row.raw as string[])[0] === '---') {
                data.cell.styles.fillColor = [220, 220, 220];
                data.cell.styles.textColor = [220, 220, 220]; 
                data.cell.styles.cellPadding = 1; 
            }
          }
        });

        // --- FOOTER ---
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, pageHeight - 10);
        doc.text("Confidential / For Internal Use Only", 190, pageHeight - 10, { align: "right" });

        doc.save(`${data.lastName}_${data.firstName}_Profile.pdf`);
        toast.success("PDF Downloaded successfully", { id: toastId });

    } catch (error) {
        console.error(error);
        toast.error("Failed to generate PDF", { id: toastId });
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex-1 sm:flex-none gap-2"
      onClick={generatePDF}
      disabled={isGenerating}
    >
      {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
      Print Profile
    </Button>
  );
}