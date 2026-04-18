import { db } from "@/src/db";
import { employees } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Briefcase,
  AlertOctagon,
} from "lucide-react";
import { format } from "date-fns";

export default async function DigitalIdVerificationPage({
  params,
}: {
  params: Promise<{ employeeNo: string }>;
}) {
  const resolvedParams = await params;

  // Fetch employee by their ID number with relations for full details
  const employee = await db.query.employees.findFirst({
    where: eq(employees.employeeNo, resolvedParams.employeeNo),
    with: {
      department: true,
      position: true,
    },
  });

  // If someone scans a fake/deleted ID, show a 404 page
  if (!employee) return notFound();

  const isActive =
    employee.status !== "RESIGNED" && employee.status !== "TERMINATED";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* --- Animated Ambient Background --- */}
      <div
        className={`absolute top-[-20%] left-[-10%] w-160 h-160 blur-3xl rounded-full animate-pulse mix-blend-screen pointer-events-none ${isActive ? "bg-indigo-600/10" : "bg-red-600/10"}`}
      ></div>
      <div
        className={`absolute bottom-[-10%] right-[-10%] w-160 h-160 blur-3xl rounded-full animate-pulse delay-700 mix-blend-screen pointer-events-none ${isActive ? "bg-blue-500/10" : "bg-orange-500/10"}`}
      ></div>
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>

      <div className="w-full max-w-6xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* --- Verification Status Float --- */}
        <div className="flex justify-center mb-6 relative z-20">
          <div
            className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border ${
              isActive
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/20"
                : "bg-red-500/10 border-red-500/50 text-red-400 shadow-red-500/40"
            }`}
          >
            {isActive ? (
              <CheckCircle2 className="w-5 h-5 animate-pulse drop-shadow-md" />
            ) : (
              <AlertTriangle className="w-5 h-5 animate-pulse drop-shadow-md" />
            )}
            <span className="font-bold tracking-widest text-xs sm:text-sm uppercase drop-shadow-sm">
              {isActive ? "Verified Active Record" : "Inactive / Invalid"}
            </span>
          </div>
        </div>

        {/* --- Main Digital True-Twin Card --- */}
        {isActive ? (
          // ==============================================
          // ACTIVE VIEW (Your exact 3-Column Layout)
          // ==============================================
          <div className="bg-white/5 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 relative ring-1 ring-white/5 flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              {/* COLUMN 1: Basic Info */}
              <div className="p-8 flex flex-col items-center text-center relative z-10">
                <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none"></div>

                <div className="relative mb-5 w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700/50 shadow-2xl ring-4 ring-black/20">
                  <Image
                    src={employee.imageUrl || "/placeholder.jpg"}
                    alt="Employee Photo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                  {employee.firstName} {employee.lastName} {employee.suffix}
                </h1>
                <p className="text-slate-300 font-mono mt-3 mb-8 tracking-widest bg-black/40 px-4 py-1.5 rounded-lg text-sm border border-white/5 shadow-inner">
                  ID: {employee.employeeNo}
                </p>

                {/* Position & Department */}
                <div className="w-full flex flex-col gap-4 mt-auto">
                  <div className="bg-black/20 border border-white/5 p-4 rounded-2xl backdrop-blur-sm shadow-inner relative overflow-hidden group text-left">
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Position
                      </span>
                    </div>
                    <p className="text-slate-100 font-medium truncate text-sm">
                      {employee.position?.title || "N/A"}
                    </p>
                  </div>
                  <div className="bg-black/20 border border-white/5 p-4 rounded-2xl backdrop-blur-sm shadow-inner relative overflow-hidden group text-left">
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
                      <Building2 className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Department
                      </span>
                    </div>
                    <p className="text-slate-100 font-medium truncate text-sm">
                      {employee.department?.name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* COLUMN 2: Front ID */}
              <div className="p-8 flex flex-col items-center justify-center relative bg-white/5">
                <h3 className="text-[11px] font-bold text-indigo-300/80 uppercase tracking-widest text-center mb-6 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Physical Front ID
                </h3>

                <div className="w-full">
                  {employee.idFrontUrl ? (
                    <div className="group relative w-full aspect-[0.63] rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-indigo-500/20 hover:border-indigo-500/30">
                      <Image
                        src={employee.idFrontUrl}
                        alt="Front of ID"
                        fill
                        className="object-contain bg-slate-900/80"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[1.58/1] rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center bg-black/20 text-slate-500">
                      <span className="text-xs tracking-widest uppercase font-semibold">
                        No Front Scan
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* COLUMN 3: Back ID */}
              <div className="p-8 flex flex-col items-center justify-center relative bg-white/5">
                <h3 className="text-[11px] font-bold text-indigo-300/80 uppercase tracking-widest text-center mb-6 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Physical Back ID
                </h3>

                <div className="w-full">
                  {employee.idBackUrl ? (
                    <div className="group relative w-full aspect-[0.63] rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-indigo-500/20 hover:border-indigo-500/30">
                      <Image
                        src={employee.idBackUrl}
                        alt="Back of ID"
                        fill
                        className="object-contain bg-slate-900/80"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[1.58/1] rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center bg-black/20 text-slate-500">
                      <span className="text-xs tracking-widest uppercase font-semibold">
                        No Back Scan
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Timestamp */}
            <div className="bg-black/60 p-5 w-full text-center border-t border-white/10 text-[10px] text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 uppercase tracking-widest shadow-inner mt-auto">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Authenticated by JC&L System
              </span>
              <span className="hidden sm:inline opacity-50">|</span>
              <span className="opacity-70">
                {format(new Date(), "MMM dd, yyyy HH:mm:ss")}
              </span>
            </div>
          </div>
        ) : (
          // ==============================================
          // INACTIVE / RESIGNED VIEW (Security Lockdown)
          // ==============================================
          <div className="max-w-2xl mx-auto bg-red-950/40 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-red-500/20 relative ring-1 ring-red-500/10 flex flex-col">
            <div className="p-8 flex flex-col items-center text-center relative z-10">
              <div className="absolute inset-0 bg-linear-to-b from-red-500/5 to-transparent pointer-events-none"></div>

              <div className="relative mb-5 w-32 h-32 rounded-full overflow-hidden border-4 border-red-900/80 shadow-2xl ring-4 ring-black/40 grayscale opacity-80">
                <Image
                  src={employee.imageUrl || "/placeholder.jpg"}
                  alt="Employee Photo"
                  fill
                  className="object-cover"
                />
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                {employee.firstName} {employee.lastName} {employee.suffix}
              </h1>

              <div className="mt-8 bg-black/40 border border-red-500/20 p-6 rounded-2xl backdrop-blur-sm shadow-inner relative overflow-hidden w-full max-w-md">
                <div className="flex flex-col items-center gap-3 text-red-400">
                  <AlertOctagon className="w-10 h-10 animate-pulse" />
                  <p className="font-black text-xl tracking-widest uppercase">
                    ACCESS DENIED
                  </p>
                  <p className="text-sm text-red-200/70 font-medium">
                    This individual is no longer employed by JC&L Proserve. Do
                    not allow entry.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Timestamp */}
            <div className="bg-black/80 p-5 w-full text-center border-t border-red-500/20 text-[10px] text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 uppercase tracking-widest shadow-inner mt-auto">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                Security Alert Logged
              </span>
              <span className="hidden sm:inline opacity-50">|</span>
              <span className="opacity-70">
                {format(new Date(), "MMM dd, yyyy HH:mm:ss")}
              </span>
            </div>
          </div>
        )}

        {/* Decorative Bottom Glow */}
        <div
          className={`h-1 w-2/3 mx-auto mt-6 bg-linear-to-r from-transparent ${isActive ? "via-indigo-500/30" : "via-red-500/40"} to-transparent blur-md`}
        ></div>
      </div>
    </div>
  );
}
