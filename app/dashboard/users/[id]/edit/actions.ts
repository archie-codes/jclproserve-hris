"use server";

import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(
  userId: string,
  formData: FormData
) {
  const name = String(formData.get("name") || "").trim();
  // const role = String(formData.get("role"));
  const role = formData.get("role") as "ADMIN" | "HR" | "STAFF";
  const email = String(formData.get("email") || "").trim();

  if (!name) {
    throw new Error("Name is required");
  }

  await db
    .update(users)
    .set({ name, role, email })
    .where(eq(users.id, userId));

  revalidatePath("/dashboard/users");
  revalidatePath(`/dashboard/users/${userId}/edit`);
}

