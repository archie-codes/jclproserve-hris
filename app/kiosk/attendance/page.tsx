"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Clock,
  LogIn,
  LogOut,
  Loader2,
  UserRound,
  LockKeyhole,
} from "lucide-react";
import { clockInOrOut } from "@/src/actions/clock-in";

export default function AttendanceKioskPage() {
  const [empId, setEmpId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState<Date | null>(null);

  // Digital Clock Logic
  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (type: "IN" | "OUT") => {
    if (!empId || !pin) {
      toast.error("Please enter your Employee ID and PIN");
      return;
    }

    setLoading(true);
    const res = await clockInOrOut(empId, pin, type);

    if (res.success) {
      toast.success(res.message, {
        duration: 5000, // Show longer so they see it
        style: {
          background: type === "IN" ? "#10b981" : "#f59e0b",
          color: "white",
          border: "none",
        },
      });
      // Clear form
      setEmpId("");
      setPin("");
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  if (!time) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
      {/* 1. BIG DIGITAL CLOCK */}
      <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-slate-900 border border-slate-800 shadow-xl">
          <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2" />
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
            Live System
          </span>
        </div>
        <h1 className="text-7xl sm:text-8xl font-black tracking-tighter tabular-nums text-white drop-shadow-2xl">
          {time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </h1>
        <p className="text-slate-400 font-medium text-xl mt-2 tracking-wide">
          {time.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* 2. LOGIN CARD */}
      <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border-slate-800 shadow-2xl ring-1 ring-white/10">
        <CardHeader className="text-center pb-2 pt-8">
          <CardTitle className="text-2xl text-white font-bold tracking-tight">
            Daily Time Record
          </CardTitle>
          <CardDescription className="text-slate-400">
            Head Office • JC&L Proserve Inc.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-8">
          {/* INPUTS */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs uppercase font-bold tracking-wider ml-1">
                Employee ID
              </Label>
              <div className="relative group">
                <UserRound className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <Input
                  placeholder="e.g. JCL-20260001"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value.toUpperCase())}
                  className="pl-12 bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 h-12 text-lg font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-xs uppercase font-bold tracking-wider ml-1">
                Security PIN
              </Label>
              <div className="relative group">
                <LockKeyhole className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <Input
                  type="password"
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="pl-12 bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 h-12 text-lg font-medium tracking-widest transition-all"
                  maxLength={6}
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-500 text-white h-16 text-lg font-bold shadow-lg shadow-emerald-900/20 transition-all"
              onClick={() => handleSubmit("IN")}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <LogIn className="mr-2 h-6 w-6" /> TIME IN
                </>
              )}
            </Button>

            <Button
              size="lg"
              className="bg-amber-600 hover:bg-amber-500 text-white h-16 text-lg font-bold shadow-lg shadow-amber-900/20 transition-all"
              onClick={() => handleSubmit("OUT")}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <LogOut className="mr-2 h-6 w-6" /> TIME OUT
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="mt-12 flex flex-col items-center gap-2 opacity-40">
        <img src="/jcl-logo.svg" alt="Logo" className="h-8 grayscale invert" />
        <p className="text-xs text-white">System v2.0 • Secured Connection</p>
      </div>
    </div>
  );
}
