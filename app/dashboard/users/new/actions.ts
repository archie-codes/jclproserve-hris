// "use server";

// import { db } from "@/src/db";
// import { users } from "@/src/db/schema";
// import bcrypt from "bcryptjs";
// import { revalidatePath } from "next/cache";
// import { getCurrentUser } from "@/lib/auth";

// export async function createUser(formData: FormData) {
//   const currentUser = await getCurrentUser();
//   const name = String(formData.get("name"));
//   const email = String(formData.get("email"));
//   const password = String(formData.get("password"));
//   const role = formData.get("role") === "ADMIN" ? "ADMIN" : "HR"; // 👈 safe fallback

//   const passwordHash = await bcrypt.hash(password, 10);

//   if (currentUser?.role !== "admin") {
//     throw new Error("Unauthorized");
//   }

//   await db.insert(users).values({
//     name,
//     email,
//     passwordHash,
//     role,
//     isActive: true,
//   });

//   revalidatePath("/dashboard/users");
// }


// "use server";

// import { db } from "@/src/db";
// import { users } from "@/src/db/schema";
// import bcrypt from "bcryptjs";
// import { revalidatePath } from "next/cache";
// import { getCurrentUser } from "@/lib/auth";
// import { eq } from "drizzle-orm";

// /* =========================
//    CREATE USER
// ========================= */
// export async function createUser(formData: FormData) {
//   const currentUser = await getCurrentUser();

//   if (currentUser?.role !== "ADMIN") {
//     throw new Error("Unauthorized");
//   }

//   const name = String(formData.get("name"));
//   const email = String(formData.get("email"));
//   const password = String(formData.get("password"));
//   const role = formData.get("role") === "ADMIN" ? "ADMIN" : "HR";

//   const passwordHash = await bcrypt.hash(password, 10);

//   await db.insert(users).values({
//     name,
//     email,
//     passwordHash,
//     role,
//     isActive: true,
//   });

//   revalidatePath("/dashboard/users");
// }

// /* =========================
//    DELETE USER
// ========================= */
// export async function deleteUser(userId: string) {
//   const currentUser = await getCurrentUser();

  
//   if (currentUser?.role !== "ADMIN") {
//     throw new Error("Unauthorized");
//   }

//   if (!userId) {
//     throw new Error("User ID is required");
//   }

//   await db.delete(users).where(eq(users.id, userId));

//   revalidatePath("/dashboard/users");
// }


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
  const role = formData.get("role") === "ADMIN" ? "ADMIN" : "HR";

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
  });

  revalidatePath("/dashboard/users");
}

/* =========================
   DELETE USER (SOFT DELETE)
========================= */
export async function deleteUser(userId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  // 🚫 Prevent self-delete
  if (currentUser.id === userId) {
    throw new Error("You cannot delete your own account");
  }

  // ♻️ Soft delete instead of hard delete
  await db
    .update(users)
    .set({ isActive: false })
    .where(eq(users.id, userId));

  revalidatePath("/dashboard/users");
}
