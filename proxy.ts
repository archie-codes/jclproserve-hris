// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { cookies } from "next/headers";
// import { db } from "@/src/db";
// import { users } from "@/src/db/schema";
// import { eq } from "drizzle-orm";

// export async function proxy(req: NextRequest) {
//   const sessionCookie = (await cookies()).get("session")?.value;

//   // Not logged in → redirect to login
//   if (!sessionCookie) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   // FIX: Parse the JSON string into an object
//   let sessionData;
//   try {
//     sessionData = JSON.parse(sessionCookie);
//   } catch (e) {
//     // If parsing fails, the cookie is invalid -> clear it or redirect
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   // Get user
//   const user = await db.query.users.findFirst({
//     where: eq(users.id, sessionData.id), // Now accessing the real ID
//     columns: { role: true },
//   });

//   // Admin-only routes
//   const adminRoutes = ["/dashboard/users", "/dashboard/settings"];
//   const pathname = req.nextUrl.pathname;
//   const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

//   if (isAdminRoute && user?.role !== "ADMIN") {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";


export async function proxy(req: NextRequest) { // Renamed from proxy to middleware
  const sessionCookie = (await cookies()).get("session")?.value;
  const { pathname } = req.nextUrl;

  // 1. If user is logged in and tries to access the login page (root "/")
  // Redirect them to dashboard
  if (sessionCookie && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. If user is NOT logged in and tries to access dashboard
  if (!sessionCookie && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 3. Session Validation (The rest of your existing logic)
  if (sessionCookie) {
    try {
      const sessionData = JSON.parse(sessionCookie);
      
      // OPTIONAL: Performance Check
      // Querying DB in middleware on every request can be slow. 
      // Consider using JWT or only querying for Admin Routes.
      
      if (pathname.startsWith("/dashboard")) {
          const user = await db.query.users.findFirst({
            where: eq(users.id, sessionData.id),
            columns: { role: true },
          });

          const adminRoutes = ["/dashboard/users", "/dashboard/settings"];
          const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

          if (isAdminRoute && user?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
          }
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}