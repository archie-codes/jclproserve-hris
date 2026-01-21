"use server";

import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function updateUserRole(
  userId: string,
  formData: FormData
) {
  const role = formData.get("role")?.toString();

  if (!role) throw new Error("Role required");

  await db
    .update(users)
    .set({ role })
    .where(eq(users.id, userId));
}
