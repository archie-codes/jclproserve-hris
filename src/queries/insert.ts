// import { db } from '../db';
// import { InsertPost, InsertUser, postsTable, usersTable } from '../schema';

// export async function createUser(data: InsertUser) {
//   await db.insert(usersTable).values(data);
// }

// export async function createPost(data: InsertPost) {
//   await db.insert(postsTable).values(data);
// }

import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import bcrypt from "bcryptjs";

export async function createAdmin() {
  const passwordHash = await bcrypt.hash("Admin@123", 12);

  await db.insert(users).values({
    email: "admin@jcl-proserve.com",
    name: "System Admin",
    passwordHash,
    role: "admin",
  });
}
