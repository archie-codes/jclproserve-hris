import { db } from "@/src/db";
import { applicantResults, exams } from "@/src/db/schema";
import { desc, eq } from "drizzle-orm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Search, FileText, Target, Users, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ResultActions } from "@/components/dashboard/recruitment/result-actions";

export default async function ExamResultsPage() {
  // Fetch results with exam details
  const results = await db.query.applicantResults.findMany({
    with: {
      exam: true,
    },
    orderBy: [desc(applicantResults.dateTaken)],
  });

  // Calculate Metrics safely
  const totalApplicants = results.length;

  const passedApplicants = results.filter((r) => r.status === "PASSED").length;
  const passingRate =
    totalApplicants > 0
      ? Math.round((passedApplicants / totalApplicants) * 100)
      : 0;

  // Calculate Average Percentage Score
  const avgScorePercentage =
    totalApplicants > 0
      ? Math.round(
          (results.reduce((acc, r) => acc + r.score / (r.totalPoints || 1), 0) /
            totalApplicants) *
            100,
        )
      : 0;

  return (
    <div className="space-y-6 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Exam Results
          </h1>
          <p className="text-muted-foreground mt-1">
            View and print assessment scores for walk-in applicants.
          </p>
        </div>

        {/* Simple Search */}
        <div className="flex w-full md:w-auto items-center space-x-2">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search applicant name..."
              className="w-full pl-9 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 📊 METRIC CARDS (Using Payroll Page Styling) */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {/* Card 1: Total (Blue Theme) */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-linear-to-br from-white to-blue-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" /> Total Applicants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplicants}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time recorded exams
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Passing Rate (Emerald Theme) */}
        <Card className="border-l-4 border-l-emerald-500 shadow-sm bg-linear-to-br from-white to-emerald-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-500" /> Passing Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passingRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {passedApplicants}
              </span>{" "}
              applicants passed
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Average Score (Amber Theme) */}
        <Card className="border-l-4 border-l-amber-500 shadow-sm bg-linear-to-br from-white to-amber-50/50 dark:from-slate-950 dark:to-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" /> Avg. Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScorePercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall average performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* DATA TABLE */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-600">
                Date Taken
              </TableHead>
              <TableHead className="font-semibold text-slate-600">
                Applicant Name
              </TableHead>
              <TableHead className="font-semibold text-slate-600">
                Position / Exam
              </TableHead>
              <TableHead className="font-semibold text-slate-600">
                Score
              </TableHead>
              <TableHead className="font-semibold text-slate-600">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold text-slate-600">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-slate-500 bg-slate-50/50"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="h-8 w-8 text-slate-300" />
                    <p>No exam results found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              results.map((result) => (
                <TableRow key={result.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-700">
                    {result.dateTaken
                      ? format(new Date(result.dateTaken), "MMM dd, yyyy")
                      : "N/A"}
                    <div className="text-xs text-slate-400">
                      {result.dateTaken
                        ? format(new Date(result.dateTaken), "h:mm a")
                        : ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-900">
                      {result.firstName} {result.lastName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-slate-700">
                      {result.positionApplied}
                    </div>
                    <div className="text-xs text-blue-600 font-medium bg-blue-50 w-fit px-2 py-0.5 rounded-md mt-1">
                      {result.exam?.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-lg text-slate-900">
                        {result.score}
                      </span>
                      <span className="text-slate-400 text-sm font-medium">
                        / {result.totalPoints}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        result.status === "PASSED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {result.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ResultActions result={result} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
