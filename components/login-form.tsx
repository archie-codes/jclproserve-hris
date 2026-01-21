"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Lock, Mail, Eye, EyeOff } from "lucide-react"; // Added Eye, EyeOff
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // 1. Add state to track visibility
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Success → go to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-4xl mx-auto", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0 shadow-xl border-muted/40">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-125">
          {/* LEFT SIDE: FORM */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center p-6 md:p-10 bg-background"
          >
            <FieldGroup className="space-y-6">
              <div className="flex flex-col gap-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back
                </h1>
                <p className="text-muted-foreground text-sm">
                  Please enter your details to sign in.
                </p>
              </div>

              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="juan@jcl-proserve.com"
                      className="pl-9"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                      href="#"
                      className="text-xs font-medium text-primary hover:underline underline-offset-4"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* 2. Password Input Wrapper */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-9 pr-10"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* 5. The Toggle Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      ) : (
                        <Eye
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </Field>
              </div>

              <Field>
                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full text-base font-semibold py-5"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          {/* RIGHT SIDE: VISUALS */}
          <div className="relative hidden h-full flex-col bg-zinc-100 text-zinc-900 p-10 md:flex dark:bg-zinc-900 dark:text-white dark:border-l">
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/5 dark:to-white/5" />

            <div className="relative z-20 flex h-full flex-col items-center justify-center text-center">
              <div className="mb-6 rounded-xl p-4 backdrop-blur-sm bg-white/40 shadow-sm dark:bg-white/10">
                <img
                  src="/jcl-logo.svg"
                  alt="JC&L Logo"
                  className="h-36 w-auto drop-shadow-md"
                />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">
                JC&L Proserve Inc.
              </h2>
              <p className="mt-2 text-muted-foreground max-w-xs text-sm text-balance">
                Reliable workforce solutions. Your trusted employment partner.
              </p>
            </div>

            <div className="relative z-20 mt-auto">
              <p className="text-xs text-muted-foreground text-center">
                © 2026 Secure Portal
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-primary">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
