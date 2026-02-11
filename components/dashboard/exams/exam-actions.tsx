"use client";

import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
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
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2, Power, Loader2, Edit } from "lucide-react";
import { deleteExam, toggleExamStatus } from "@/src/actions/exam-builder";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ExamActionsProps {
  exam: {
    id: string;
    isActive: boolean | null;
    title: string;
  };
}

export function ExamActions({ exam }: ExamActionsProps) {
  const [open, setOpen] = useState(false); // For Dropdown
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await deleteExam(exam.id);
    setIsLoading(false);
    setShowDeleteDialog(false);

    if (result.success) {
      toast.success("Exam deleted");
    } else {
      toast.error(result.error);
    }
  };

  const handleToggleStatus = async () => {
    const result = await toggleExamStatus(exam.id, !!exam.isActive);
    if (result.success) {
      toast.success(exam.isActive ? "Exam archived" : "Exam activated");
    } else {
      toast.error("Failed to update status");
    }
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/dashboard/recruitment/exams/${exam.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Manage Questions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleStatus}>
            <Power className={`mr-2 h-4 w-4 ${exam.isActive ? "text-orange-500" : "text-green-500"}`} />
            {exam.isActive ? "Deactivate / Archive" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Exam
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the exam <strong>"{exam.title}"</strong> and all its questions. 
              <br /><br />
              <span className="text-red-500 font-semibold">Warning:</span> If applicants have already taken this exam, you won't be able to delete it to preserve their results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault(); // Prevent auto-closing
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}