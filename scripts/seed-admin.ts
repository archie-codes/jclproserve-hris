import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const passwordHash = await bcrypt.hash("Admin@123", 10);

  await db.insert(users).values({
    email: "admin@company.com",
    passwordHash,
    role: "Admin",
  });

  console.log("Admin user created");
}

seedAdmin();
