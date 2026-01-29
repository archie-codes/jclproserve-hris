import { cookies } from "next/headers";
import { db } from "@/src/db/";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  const raw = (await cookies()).get("session")?.value;
  if (!raw) return null;

  let session: { id: string } | null = null;
  try {
    session = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!session?.id) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.id),
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      image: true,
    },
  });

  if (!user || !user.isActive) return null;

  return user;
}
