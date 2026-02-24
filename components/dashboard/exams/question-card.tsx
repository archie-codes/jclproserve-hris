"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  GripVertical,
  MoreHorizontal,
  Trash2,
  CheckCircle2,
  Loader2,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { deleteQuestionAction } from "@/src/actions/exam-builder";
import { EditQuestionModal } from "./edit-question-modal";

export function QuestionCard({ q, i }: { q: any; i: number }) {
  const [showImages, setShowImages] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check if the question or any of its choices have an image attached
  const hasAnyImage = q.imageUrl || q.choices.some((c: any) => c.imageUrl);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteQuestionAction(q.id, q.examId);
      if (result.success) {
        toast.success("Question deleted successfully");
      } else {
        toast.error("Failed to delete question");
      }
    });
  };

  return (
    <>
      <Card className="group relative overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-blue-300">
        {/* Sleek Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

        <CardHeader className="p-0 border-b bg-slate-50/50">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <GripVertical className="h-4 w-4 text-slate-300 cursor-grab hover:text-slate-500" />
              <div className="flex items-center justify-center bg-white shadow-sm border text-blue-700 font-black h-7 w-7 rounded-md text-sm">
                {i + 1}
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                {q.points || 1} {q.points === 1 ? "Point" : "Points"}
              </Badge>
            </div>

            <div className="flex items-center gap-1">
              {/* Media Toggle Button */}
              {hasAnyImage && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => setShowImages(!showImages)}
                >
                  {showImages ? (
                    <EyeOff className="h-4 w-4 mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {showImages ? "Hide Media" : "Show Media"}
                </Button>
              )}

              {/* Actions Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MoreHorizontal className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => setIsEditModalOpen(true)}
                    className="cursor-pointer"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Question
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Question Text */}
            <p className="font-semibold text-lg text-slate-900 leading-relaxed">
              {q.text}
            </p>

            {/* Question Image */}
            {q.imageUrl && showImages && (
              <div className="relative w-full h-64 bg-slate-100/50 rounded-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
                <Image
                  src={q.imageUrl}
                  alt="Question"
                  fill
                  className="object-contain p-4 drop-shadow-sm"
                  unoptimized
                />
              </div>
            )}

            {/* Choices Grid */}
            <div
              className={cn(
                "grid gap-3",
                q.choices.some((c: any) => c.imageUrl) && showImages
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1",
              )}
            >
              {q.choices.map((c: any) => (
                <div
                  key={c.id}
                  className={cn(
                    "relative p-4 rounded-xl border-2 flex items-start gap-3 transition-all",
                    c.isCorrect
                      ? "bg-emerald-50/50 border-emerald-500 shadow-sm"
                      : "bg-white border-slate-100 hover:border-slate-300",
                  )}
                >
                  {/* Correct/Incorrect Indicator */}
                  <div className="mt-0.5 shrink-0">
                    {c.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 drop-shadow-sm" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-200" />
                    )}
                  </div>

                  {/* Choice Content */}
                  <div className="flex-1 space-y-2">
                    <span
                      className={cn(
                        "text-sm block",
                        c.isCorrect
                          ? "font-semibold text-emerald-900"
                          : "font-medium text-slate-600",
                      )}
                    >
                      {c.text}
                    </span>

                    {/* Choice Image */}
                    {c.imageUrl && showImages && (
                      <div className="relative w-full h-28 bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm animate-in fade-in duration-300 mt-2">
                        <Image
                          src={c.imageUrl}
                          alt=""
                          fill
                          className="object-contain p-2"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Question Modal Component */}
      <EditQuestionModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        question={q}
      />
    </>
  );
}
