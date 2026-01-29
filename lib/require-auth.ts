// import { cookies } from "next/headers";
// import { db } from "@/src/db";
// import { users } from "@/src/db/schema";
// import { eq } from "drizzle-orm";

// export async function requireAuth() {
//   const session = (await cookies()).get("session")?.value;
//   if (!session) throw new Error("Unauthorized");

//   const user = await db.query.users.findFirst({
//     where: eq(users.id, session),
//   });

//   if (!user) throw new Error("Unauthorized");

//   return user;
// }

import { cookies } from "next/headers";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function requireAuth() {
  const raw = (await cookies()).get("session")?.value;
  
  if (!raw) {
    throw new Error("Unauthorized: No session found");
  }

  // 👇 FIX: Parse the cookie string to JSON to get the real ID
  let session: { id: string } | null = null;
  try {
    session = JSON.parse(raw);
  } catch {
    throw new Error("Unauthorized: Invalid session format");
  }

  if (!session?.id) {
    throw new Error("Unauthorized: Missing user ID");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.id),
  });

  if (!user) {
    throw new Error("Unauthorized: User not found");
  }

  return user;
}