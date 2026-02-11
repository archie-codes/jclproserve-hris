import { db } from "@/src/db";
import { applicantResults, exams } from "@/src/db/schema";
import { desc, eq } from "drizzle-orm";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Printer, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResultActions } from "@/components/dashboard/recruitment/result-actions";

export default async function ExamResultsPage() {
  // Fetch results with exam details
  const results = await db.query.applicantResults.findMany({
    with: {
      exam: true,
    },
    orderBy: [desc(applicantResults.dateTaken)],
  });

  return (
    <div className="space-y-6 p-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exam Results</h1>
          <p className="text-muted-foreground">
            View and print assessment scores for walk-in applicants.
          </p>
        </div>
        
        {/* Simple Search (Visual only for now, logic can be added later) */}
        <div className="flex w-full md:w-auto items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search applicant..."
              className="w-full md:w-62.5 pl-8 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
            <p className="text-xs text-muted-foreground">All time records</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passing Rate</CardTitle>
            <div className="h-4 w-4 text-green-500 font-bold">%</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.length > 0 
                ? Math.round((results.filter(r => r.status === "PASSED").length / results.length) * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Applicants who passed</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date Taken</TableHead>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Position / Exam</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No exam results found.
                </TableCell>
              </TableRow>
            ) : (
              results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">
                    {result.dateTaken ? format(new Date(result.dateTaken), "MMM dd, yyyy p") : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{result.firstName} {result.lastName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">{result.positionApplied}</div>
                    <div className="text-xs bg-slate-100 w-fit px-1 rounded">{result.exam?.title}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-lg">{result.score}</span>
                      <span className="text-muted-foreground text-xs">/ {result.totalPoints}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={result.status === "PASSED" ? "default" : "destructive"}>
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