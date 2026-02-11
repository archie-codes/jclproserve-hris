import { db } from "@/src/db";
import { exams } from "@/src/db/schema";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileEdit, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { CreateExamModal } from "@/components/dashboard/exams/create-exam-modal";
import { ExamActions } from "@/components/dashboard/exams/exam-actions"; // 👈 Import this

export default async function ExamsPage() {
  const allExams = await db.select().from(exams).orderBy(desc(exams.createdAt));

  return (
    <div className="space-y-6 p-4 md:p-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exam Management</h1>
          <p className="text-muted-foreground">Create and manage standardized tests for applicants.</p>
        </div>
        <CreateExamModal /> 
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allExams.length === 0 ? (
          <div className="col-span-full text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
            <FileEdit className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg">No Exams Created</h3>
            <p className="text-muted-foreground">Click the "Create Exam" button to start.</p>
          </div>
        ) : (
          allExams.map((exam) => (
            <Card key={exam.id} className="group hover:border-primary/50 transition-all shadow-sm relative">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-bold truncate pr-4 leading-tight">
                    {exam.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${exam.isActive ? "bg-green-500" : "bg-orange-300"}`} />
                        <span className="text-xs text-muted-foreground font-medium">
                            {exam.isActive ? "Active" : "Archived"}
                        </span>
                    </div>
                </div>
                
                {/* 🔴 INSERT THE ACTIONS MENU HERE */}
                <ExamActions exam={exam} />
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2 h-10 mt-2">
                  {exam.description || "No description provided."}
                </p>
                
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-6">
                  <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded">
                    <Clock className="h-3 w-3" />
                    {exam.timeLimit} mins
                  </div>
                  <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded">
                    <CheckCircle className="h-3 w-3" />
                    Pass: {exam.passingScore}%
                  </div>
                </div>

                <Button className="w-full" variant="outline" asChild>
                  <Link href={`/dashboard/recruitment/exams/${exam.id}`}>
                    Manage Questions &rarr;
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}