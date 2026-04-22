"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Cake } from "lucide-react";

export function BirthdayClient({ employee }: { employee: any }) {
  useEffect(() => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  const name = `${employee.firstName} ${employee.lastName}`;

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-linear-to-br from-pink-50 via-white to-pink-100 dark:from-slate-950 dark:via-pink-950/20 dark:to-slate-900 overflow-hidden px-4">
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(#fbcfe8_1px,transparent_1px)] dark:bg-[radial-gradient(#831843_1px,transparent_1px)] background-size:32px_32px opacity-50 z-0"></div>

      <div className="flex flex-col items-center gap-6 z-10 p-10 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-pink-100 dark:border-pink-900/30 shadow-2xl max-w-xl text-center w-full transform animate-in zoom-in-95 duration-1000">
        <Avatar className="w-32 h-32 border-4 border-pink-200 dark:border-pink-800 shadow-xl">
          <AvatarImage src={employee.imageUrl} className="object-cover" />
          <AvatarFallback className="bg-pink-100 text-pink-500 font-bold text-4xl">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-3">
          <h2 className="text-pink-500 dark:text-pink-400 text-lg sm:text-xl font-bold uppercase tracking-widest flex justify-center items-center gap-2 drop-shadow-sm">
            <Cake className="text-pink-400" /> Happy Birthday{" "}
            <Sparkles className="text-pink-400" />
          </h2>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
            {name}
          </h1>
        </div>
        <div className="mt-8 pt-6 border-t border-pink-200 dark:border-pink-900/50 w-full space-y-4">
          <p className="text-slate-600 dark:text-slate-300 text-lg px-4 italic font-medium leading-relaxed">
            "Wishing you a year filled with joy, success, and beautiful
            moments."
          </p>
          <p className="mt-4 font-black text-pink-600 dark:text-pink-400 text-lg uppercase tracking-wider">
            From your JC&L Proserve Inc. Family ❤️
          </p>
        </div>
      </div>
    </div>
  );
}
