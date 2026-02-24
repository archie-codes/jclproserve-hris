import { db } from "@/src/db";
import { exams, questions, questionChoices } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AddQuestionForm } from "@/components/dashboard/exams/add-question-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ImageIcon, Hash, Target, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { QuestionCard } from "@/components/dashboard/exams/question-card";

interface PageProps {
  params: Promise<{ examId: string }>;
}

export default async function ExamDetailPage({ params }: PageProps) {
  const { examId } = await params;

  // 1. Updated Fetch: Include points, imageUrls, and sort by 'order'
  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, examId),
    with: {
      questions: {
        with: {
          choices: true,
        },
        // IMPORTANT: Sort by order so the reordering works correctly
        orderBy: (questions, { asc }) => [asc(questions.order)],
      },
    },
  });

  if (!exam) return notFound();

  // Calculate total points for the exam
  const totalPoints = exam.questions.reduce(
    (acc, q) => acc + (q.points || 1),
    0,
  );

  return (
    <div className="p-6 space-y-8 mx-auto animate-in fade-in">
      {/* 🔙 BACK BUTTON SECTION */}
      <div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/recruitment/exams">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Exams
          </Link>
        </Button>
      </div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              {exam.title}
            </h1>
            <Badge
              variant={exam.isActive ? "default" : "secondary"}
              className="h-6"
            >
              {exam.isActive ? "Active" : "Draft"}
            </Badge>
          </div>
          <p className="text-slate-500 text-lg max-w-2xl">
            {exam.description || "No description provided."}
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 py-1 px-3"
            >
              <Target className="mr-2 h-3.5 w-3.5" /> Passing:{" "}
              {exam.passingScore}%
            </Badge>
            <Badge
              variant="outline"
              className="bg-slate-50 text-slate-700 py-1 px-3"
            >
              Time: {exam.timeLimit} mins
            </Badge>
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200 py-1 px-3"
            >
              Total Weight: {totalPoints} pts
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: QUESTIONS LIST (8 Cols) */}
        <div className="lg:col-span-8 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">
              Questions ({exam.questions.length})
            </h2>
          </div>

          {exam.questions.length === 0 ? (
            <div className="p-12 border-2 border-dashed rounded-xl text-center bg-slate-50/50">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"></div>
              <p className="text-slate-500 font-medium">
                No questions added yet.
              </p>
              <p className="text-slate-400 text-sm">
                Use the form on the right to start building your exam.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {exam.questions.map((q, i) => (
                <QuestionCard key={q.id} q={q} i={i} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: ADD FORM (4 Cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 h-[calc(100vh-16rem)] overflow-y-auto pr-2 pb-4">
            <AddQuestionForm examId={exam.id} />

            {/* Summary Tooltip Card */}
            <Card className="mt-4 bg-slate-900 text-white border-none">
              <CardContent className="p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Builder Tips
                </h4>
                <ul className="text-xs space-y-2 text-slate-300">
                  <li>• Use **Points** to weight harder questions more.</li>
                  <li>
                    • For visual puzzles, upload images to `/public/uploads` and
                    use the path.
                  </li>
                  <li>• At least one choice **must** be marked as correct.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
