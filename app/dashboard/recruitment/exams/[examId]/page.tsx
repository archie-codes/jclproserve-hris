import { db } from "@/src/db";
import { exams, questions, questionChoices } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AddQuestionForm } from "@/components/dashboard/exams/add-question-form";
import { Button } from "@/components/ui/button"; // Import Button
import { ChevronLeft } from "lucide-react"; // Import Icon
import Link from "next/link"; // Import Link

interface PageProps {
  params: Promise<{ examId: string }>;
}

export default async function ExamDetailPage({ params }: PageProps) {
  const { examId } = await params;

  // Fetch Exam with Questions & Choices
  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, examId),
    with: {
      questions: {
        with: {
          choices: true,
        },
        orderBy: (questions, { asc }) => [asc(questions.id)], 
      },
    },
  });

  if (!exam) return notFound();

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
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{exam.title}</h1>
          <Badge variant={exam.isActive ? "default" : "secondary"}>
            {exam.isActive ? "Active" : "Draft"}
          </Badge>
        </div>
        <p className="text-muted-foreground">{exam.description || "No description."}</p>
        <div className="flex gap-4 text-sm mt-2 font-medium">
          <span className="bg-muted px-2 py-1 rounded">Passing Score: {exam.passingScore}%</span>
          <span className="bg-muted px-2 py-1 rounded">Time Limit: {exam.timeLimit} mins</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: QUESTIONS LIST */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Questions ({exam.questions.length})</h2>
          
          {exam.questions.length === 0 ? (
            <div className="p-8 border border-dashed rounded-lg text-center text-muted-foreground">
              No questions added yet. Use the form to add one.
            </div>
          ) : (
            <div className="space-y-4">
              {exam.questions.map((q, i) => (
                <Card key={q.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <span className="font-bold text-lg text-muted-foreground">#{i + 1}</span>
                      <div className="space-y-3 w-full">
                        <p className="font-medium text-lg">{q.text}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.choices.map((c) => (
                            <div 
                              key={c.id} 
                              className={`p-2 rounded border text-sm ${
                                c.isCorrect 
                                  ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20" 
                                  : "bg-muted/30"
                              }`}
                            >
                              {c.text} {c.isCorrect && "✅"}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: ADD FORM */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <AddQuestionForm examId={exam.id} />
          </div>
        </div>
      </div>
    </div>
  );
}