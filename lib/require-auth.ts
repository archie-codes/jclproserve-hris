import { cookies } from "next/headers";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function requireAuth() {
  const session = (await cookies()).get("session")?.value;
  if (!session) throw new Error("Unauthorized");

  const user = await db.query.users.findFirst({
    where: eq(users.id, session),
  });

  if (!user) throw new Error("Unauthorized");

  return user;
}
