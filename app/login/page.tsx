// "use client";

// import { LoginForm } from "@/components/login-form";

// export default function LoginPage() {
//   return (
//     <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
//       <div className="w-full max-w-sm md:max-w-4xl">
//         <LoginForm />
//       </div>
//     </div>
//   );
// }
"use client";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 overflow-hidden bg-slate-50 dark:bg-black">
      {/* Background Decor - Mesh Gradients */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none"></div>

      {/* Login Card Wrapper */}
      <div className="w-full max-w-sm md:max-w-4xl z-10">
        {/* Optional: Add Logo above form */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500">
            JC&L Human Resource Information System
          </p>
        </div>

        {/* Ensure your LoginForm component has 'bg-white/60 backdrop-blur-xl' in its class for the glass effect */}
        <LoginForm />

        <p className="mt-8 text-center text-xs text-slate-400">
          &copy; 2026 JC&L Proserve. Secure Connection.
        </p>
      </div>
    </div>
  );
}
