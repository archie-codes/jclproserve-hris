import { db } from "@/src/db";
import { exams } from "@/src/db/schema";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileEdit, Clock, Target, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { CreateExamModal } from "@/components/dashboard/exams/create-exam-modal";
import { ExamActions } from "@/components/dashboard/exams/exam-actions";

export default async function ExamsPage() {
  const allExams = await db.select().from(exams).orderBy(desc(exams.createdAt));

  return (
    <div className="space-y-8 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Exam Management
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Create, manage, and assign standardized tests for applicants.
          </p>
        </div>
        <CreateExamModal />
      </div>

      {/* EXAMS GRID */}
      {allExams.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl py-20 bg-slate-50/50">
          <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <FileEdit className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="font-bold text-xl text-slate-900">
            No Exams Created Yet
          </h3>
          <p className="text-slate-500 mt-2 mb-6 max-w-sm text-center">
            You haven't set up any assessment exams. Click the button above to
            create your first exam.
          </p>
          <CreateExamModal />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allExams.map((exam) => (
            <Card
              key={exam.id}
              className={`
                group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                border-l-4 bg-linear-to-br from-white
                ${
                  exam.isActive
                    ? "border-l-emerald-500 hover:border-emerald-500 to-emerald-50/30"
                    : "border-l-slate-300 hover:border-slate-400 to-slate-50"
                }
              `}
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-2 pr-4">
                  <Badge
                    variant={exam.isActive ? "default" : "secondary"}
                    className={
                      exam.isActive
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 shadow-none border-0"
                        : "bg-slate-100 text-slate-600 shadow-none"
                    }
                  >
                    {exam.isActive ? "Active" : "Archived"}
                  </Badge>
                  <CardTitle className="text-xl font-bold text-slate-900 line-clamp-1 leading-tight group-hover:text-blue-600 transition-colors">
                    {exam.title}
                  </CardTitle>
                </div>

                {/* ACTIONS MENU */}
                <div className="relative z-10 bg-white/50 rounded-full backdrop-blur-sm">
                  <ExamActions exam={exam} />
                </div>
              </CardHeader>

              <CardContent>
                {/* Description */}
                <p className="text-sm text-slate-500 line-clamp-2 h-10 mt-1 mb-5">
                  {exam.description || "No description provided for this exam."}
                </p>

                {/* Metrics Row */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1.5 bg-white border shadow-sm px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-600">
                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                    {exam.timeLimit} mins
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border shadow-sm px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-600">
                    <Target className="h-3.5 w-3.5 text-amber-500" />
                    Pass: {exam.passingScore}%
                  </div>
                </div>

                {/* Bottom Action Button */}
                <Button
                  className="w-full bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-all shadow-none group-hover:bg-blue-600 group-hover:text-white"
                  asChild
                >
                  <Link
                    href={`/dashboard/recruitment/exams/${exam.id}`}
                    className="flex items-center justify-center"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Manage Questions
                    <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
