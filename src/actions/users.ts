"use server";

import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

/* =========================
   CREATE USER
========================= */
export async function createUser(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role =
    formData.get("role") === "ADMIN"
      ? "ADMIN"
      : formData.get("role") === "HR"
        ? "HR"
        : "STAFF";

  const rawImage = formData.get("image")?.toString();
  const image = rawImage && rawImage.trim() !== "" ? rawImage : null;

  if (!name || !email || !password) {
    throw new Error("Missing required fields");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    passwordHash,
    role,
    isActive: true,
    image,
  });

  revalidatePath("/dashboard/users");
}

/* =========================
   UPDATE USER PROFILE
========================= */

export async function updateUserProfile(userId: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  // const role = String(formData.get("role"));
  const role = formData.get("role") as "ADMIN" | "HR" | "STAFF";
  const email = String(formData.get("email") || "").trim();
  const rawImage = formData.get("image")?.toString();
  const image = rawImage && rawImage.trim() !== "" ? rawImage : null;

  if (!name) {
    throw new Error("Name is required");
  }

  await db
    .update(users)
    .set({ name, role, email, image })
    .where(eq(users.id, userId));

  revalidatePath("/dashboard/users");
  revalidatePath(`/dashboard/users/${userId}/edit`);
}

/* =========================
   RESET USER PASSWORD
========================= */

export async function resetUserPassword(userId: string, formData: FormData) {
  const newPassword = formData.get("password")?.toString();

  if (!newPassword || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
}

/* =========================
   DELETE USER (SOFT DELETE)
========================= */
// export async function deleteUser(userId: string) {
//   const currentUser = await getCurrentUser();

//   if (!currentUser || currentUser.role !== "ADMIN") {
//     throw new Error("Unauthorized");
//   }

//   if (!userId) {
//     throw new Error("User ID is required");
//   }

//   // 🚫 Prevent self-delete
//   if (currentUser.id === userId) {
//     throw new Error("You cannot delete your own account");
//   }

//   // ♻️ Soft delete instead of hard delete
//   //   await db
//   //     .update(users)
//   //     .set({ isActive: false })
//   //     .where(eq(users.id, userId));
//   try {
//     await db.delete(users).where(eq(users.id, userId));
//     revalidatePath("/dashboard/users");
//     return { success: true };
//   } catch (error) {
//     return { success: false, error: "Failed to delete" };
//   }
// }
export async function deleteUser(
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser();

    // 2. Return error objects instead of throwing
    if (!currentUser || currentUser.role !== "ADMIN") {
      return { success: false, error: "Unauthorized access" };
    }

    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    // 🚫 Prevent self-delete
    if (currentUser.id === userId) {
      return { success: false, error: "You cannot delete your own account" };
    }

    // 3. Database Operation
    await db.delete(users).where(eq(users.id, userId));

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { success: false, error: "Failed to delete user" };
  }
}
