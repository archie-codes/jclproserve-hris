"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Cake } from "lucide-react";

const COLORS = [
  "#ec4899",
  "#f43f5e",
  "#d946ef",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#fbbf24",
  "#a855f7",
];

const BalloonSvg = ({ color }: { color: string }) => (
  <svg
    viewBox="0 0 100 200"
    className="w-[80px] h-[160px] opacity-90 drop-shadow-xl"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 15 C 20 15, 10 40, 10 65 C 10 100, 40 120, 50 130 C 60 120, 90 100, 90 65 C 90 40, 80 15, 50 15 Z"
      fill={color}
    />
    <path
      d="M30 35 C 25 45, 25 55, 30 65"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <polygon points="45,130 55,130 50,135" fill={color} />
    <path
      d="M50 135 Q 40 150 50 170 T 50 200"
      stroke="rgba(150,150,150,0.5)"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

function FloatingBalloons() {
  const [mounted, setMounted] = useState(false);
  const [balloons, setBalloons] = useState<any[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 45 }).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `-${Math.random() * 15}s`,
      duration: `${10 + Math.random() * 10}s`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      scale: 0.6 + Math.random() * 0.6,
      swayDuration: `${3 + Math.random() * 4}s`,
    }));
    setBalloons(generated);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes slideUp {
          0% { transform: translateY(50vh); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translateY(-130vh); opacity: 0; }
        }
        @keyframes gentleSway {
          0% { transform: translateX(-30px) rotate(-5deg); }
          100% { transform: translateX(30px) rotate(5deg); }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {balloons.map((b, i) => (
          <div
            key={i}
            className="absolute bottom-[-200px]"
            style={{
              left: b.left,
              animation: `slideUp ${b.duration} linear infinite ${b.delay}`,
            }}
          >
            <div
              style={{
                animation: `gentleSway ${b.swayDuration} ease-in-out infinite alternate`,
                transform: `scale(${b.scale})`,
              }}
            >
              <BalloonSvg color={b.color} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

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
      <div
        className="absolute inset-0 w-full h-full bg-[radial-gradient(#fbcfe8_1px,transparent_1px)] dark:bg-[radial-gradient(#831843_1px,transparent_1px)] opacity-50 z-0"
        style={{ backgroundSize: "32px 32px" }}
      ></div>

      <FloatingBalloons />

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
