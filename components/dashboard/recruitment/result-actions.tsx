"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // 👈 Import Dialog components
import { MoreHorizontal, Printer, Trash2, Loader2, Eye } from "lucide-react"; // 👈 Import Eye icon
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import { deleteApplicantResult } from "@/src/actions/recruitment";

// Type definition (same as before)
type Result = {
  id: string;
  firstName: string;
  lastName: string;
  positionApplied: string;
  score: number;
  totalPoints: number;
  percentage: number;
  status: string;
  dateTaken: Date | null;
  exam?: { title: string } | null;
};

export function ResultActions({ result }: { result: Result }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false); // 👈 New State for View
  const [isDeleting, setIsDeleting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // --- PRINT HANDLER ---
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Exam_Result_${result.lastName}_${result.firstName}`,
  });

  // --- DELETE HANDLER ---
  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteApplicantResult(result.id);
    setIsDeleting(false);
    setShowDeleteDialog(false);

    if (res.success) {
      toast.success("Result record deleted");
    } else {
      toast.error("Failed to delete record");
    }
  };

  // --- REUSABLE CERTIFICATE COMPONENT ---
  // We extract this so we can use it in both "Print" (hidden) and "View" (visible)
  const ResultCertificate = () => (
    <div className="p-10 font-sans text-slate-900 border bg-white mx-auto max-w-2xl h-full">
      <div className="text-center border-b pb-6 mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">
          JC&L Human Resources
        </h1>
        <p className="text-sm text-slate-500">
          Recruitment & Assessment Division
        </p>
      </div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-xl font-bold text-blue-900">
            Official Exam Result
          </h2>
          <p className="text-sm text-slate-500">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <span
            className={`px-4 py-1 rounded border-2 font-bold uppercase tracking-wide ${
              result.status === "PASSED"
                ? "border-green-600 text-green-700 bg-green-50"
                : "border-red-600 text-red-700 bg-red-50"
            }`}
          >
            {result.status}
          </span>
        </div>
      </div>
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8">
        <table className="w-full text-left">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 text-sm text-slate-500 font-medium w-1/3">
                Applicant Name
              </td>
              <td className="py-2 font-bold text-lg">
                {result.firstName} {result.lastName}
              </td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 text-sm text-slate-500 font-medium">
                Position Applied
              </td>
              <td className="py-2 font-semibold">{result.positionApplied}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 text-sm text-slate-500 font-medium">
                Exam Title
              </td>
              <td className="py-2">
                {result.exam?.title || "Standard Assessment"}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-sm text-slate-500 font-medium">
                Date Taken
              </td>
              <td className="py-2">
                {result.dateTaken
                  ? new Date(result.dateTaken).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mb-12">
        <div className="text-center">
          <p className="text-sm uppercase font-bold text-slate-400 mb-2">
            Final Score
          </p>
          <div className="flex items-end justify-center gap-2">
            <span className="text-6xl font-black text-slate-900">
              {result.score}
            </span>
            <span className="text-2xl font-medium text-slate-400 mb-2">
              / {result.totalPoints}
            </span>
          </div>
          <p className="text-lg font-medium text-blue-600 mt-2">
            {result.percentage}% Accuracy
          </p>
        </div>
      </div>
      <div className="mt-12 text-center text-[10px] text-slate-300">
        System Generated Document • JC&L HRIS • Ref: {result.id}
      </div>
    </div>
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* 👇 NEW VIEW ACTION */}
          <DropdownMenuItem onClick={() => setShowViewDialog(true)}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handlePrint()}>
            <Printer className="mr-2 h-4 w-4" /> Print Result
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Record
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* --- 1. VIEW DIALOG --- */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        {/* 🔴 UPDATE: Changed max-w-3xl to max-w-5xl for a wider view */}
        <DialogContent className="max-w-5xl w-full overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Assessment Result</DialogTitle>
          </DialogHeader>
          <div className="mt-4 border shadow-sm flex justify-center bg-slate-50 py-8">
            {/* Render the certificate here for viewing */}
            {/* Added 'bg-white shadow-lg' to make it look like a paper on a desk */}
            <div className="bg-white shadow-lg max-w-2xl w-full">
              <ResultCertificate />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- 2. DELETE DIALOG --- */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this result?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the exam record for{" "}
              <strong>
                {result.firstName} {result.lastName}
              </strong>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- 3. HIDDEN PRINT TEMPLATE --- */}
      <div style={{ display: "none" }}>
        <div ref={contentRef}>
          <ResultCertificate />
        </div>
      </div>
    </>
  );
}
