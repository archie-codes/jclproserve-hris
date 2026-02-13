"use client";

import {
  Construction,
  Wallet,
  ArrowLeft,
  Hammer,
  HardHat,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function PayrollPage() {
  return (
    <div className="h-[calc(100vh-100px)] w-full flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
      {/* Main Container */}
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-8">
        {/* Animated Icon Wrapper */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full animate-pulse" />
          <div className="relative h-32 w-32 bg-linear-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900 rounded-3xl border border-indigo-100 dark:border-indigo-900 shadow-xl flex items-center justify-center rotate-3 transition-transform hover:rotate-0 duration-500">
            <Wallet className="h-14 w-14 text-indigo-600 dark:text-indigo-400" />

            {/* Floating Tools */}
            <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 animate-bounce delay-100">
              <Hammer className="h-6 w-6 text-orange-500" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 animate-bounce delay-300">
              <HardHat className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <Badge
            variant="outline"
            className="px-4 py-1 border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800 rounded-full"
          >
            <Construction className="mr-2 h-3 w-3" /> Work In Progress
          </Badge>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Payroll is{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-500">
              Developing
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            We are currently coding the automated salary calculation engine.
            This feature will be available in the next system update.
          </p>
        </div>

        {/* Feature Preview List (To build hype) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
          <Card className="p-4 border-dashed border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/10">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Automated Computation</p>
                <p className="text-xs text-muted-foreground">
                  Auto-calculate lates & absences
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-dashed border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/10">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Payslip Generation</p>
                <p className="text-xs text-muted-foreground">
                  One-click PDF printing
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Button */}
        <Button
          asChild
          variant="ghost"
          className="mt-8 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
