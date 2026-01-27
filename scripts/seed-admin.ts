import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const passwordHash = await bcrypt.hash("Hr@123", 10);

  await db.insert(users).values({
    email: "hr@jcl-proserve.com",
    name: "HR",
    passwordHash,
    role: "HR",
  });

  console.log("HR user created");
  process.exit(0);
}

seedAdmin();
