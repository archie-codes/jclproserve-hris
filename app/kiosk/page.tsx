import { db } from "@/src/db";
import { exams } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { KioskForm } from "@/components/kiosk/kiosk-form";

export const dynamic = "force-dynamic";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-300">
      {/* Background decoration - Adjusted for Dark Mode */}
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/20 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:mask-[linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0))] -z-10 pointer-events-none" />

      {/* 🔴 MAIN CARD
         - bg-white dark:bg-slate-900: Changes card background
         - border-slate-200 dark:border-slate-800: Darkens the border
      */}
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 relative transition-all duration-300">
        {/* Header Section 
           - bg-slate-900 dark:bg-black: Makes header slightly darker in dark mode
           - border-b: Adds a separator line in dark mode so it doesn't blend too much
        */}
        <div className="bg-slate-900 dark:bg-black px-8 py-6 text-white flex justify-between items-center rounded-t-2xl border-b border-transparent dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              JC&L Recruitment
            </h1>
            <p className="text-slate-400 text-sm">
              Applicant Assessment Portal
            </p>
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

      <p className="mt-6 text-center text-slate-400 dark:text-slate-500 text-xs">
        &copy; {new Date().getFullYear()} JC&L HRIS System. All rights reserved.
      </p>
    </div>
  );
}
