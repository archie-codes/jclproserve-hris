import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

// export async function proxy(req: NextRequest) {
//   const session = (await cookies()).get("session")?.value;

//   // Not logged in → redirect to login
//   if (!session) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // Get user
//   // const user = await db.query.users.findFirst({
//   //   where: eq(users.id, session),
//   //   columns: { role: true },
//   // });
//   const user = await db.query.users.findFirst({
//     // Cast session to 'any' to bypass the check
//     where: eq(users.id, (session as any).id),
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
export async function proxy(req: NextRequest) {
  const sessionCookie = (await cookies()).get("session")?.value;

  // Not logged in → redirect to login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // FIX: Parse the JSON string into an object
  let sessionData;
  try {
    sessionData = JSON.parse(sessionCookie);
  } catch (e) {
    // If parsing fails, the cookie is invalid -> clear it or redirect
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Get user
  const user = await db.query.users.findFirst({
    where: eq(users.id, sessionData.id), // Now accessing the real ID
    columns: { role: true },
  });

  // Admin-only routes
  const adminRoutes = ["/dashboard/users", "/dashboard/settings"];
  const pathname = req.nextUrl.pathname;
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute && user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
