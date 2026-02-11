import { db } from "@/src/db";
import { exams } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { KioskForm } from "@/components/kiosk/kiosk-form";

export default async function KioskPage() {
  const activeExams = await db.query.exams.findMany({
    where: eq(exams.isActive, true),
    with: {
      questions: {
        with: {
          choices: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-grid-slate-200/50 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      {/* 🔴 FIX: Removed 'overflow-hidden' from here */}
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl border border-slate-200 relative">
        
        {/* Header Section: Added rounded-t-2xl to keep the top corners round */}
        <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center rounded-t-2xl">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">JC&L Recruitment</h1>
            <p className="text-slate-400 text-sm">Applicant Assessment Portal</p>
          </div>
          <div className="hidden md:block">
            <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium border border-white/20">
              Kiosk Mode
            </span>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="p-6 md:p-10 min-h-100">
          <KioskForm exams={activeExams} />
        </div>
      </div>

      <p className="mt-6 text-center text-slate-400 text-xs">
        &copy; {new Date().getFullYear()} JC&L HRIS System. All rights reserved.
      </p>
    </div>
  );
}