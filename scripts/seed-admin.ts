// import { db } from "@/src/db";
// import { users } from "@/src/db/schema";
// import bcrypt from "bcryptjs";

// async function seedAdmin() {
//   const passwordHash = await bcrypt.hash("Hr@123", 10);

//   await db.insert(users).values({
//     email: "hr@jcl-proserve.com",
//     name: "HR",
//     passwordHash,
//     role: "HR",
//   });

//   console.log("HR user created");
//   process.exit(0);
// }

// seedAdmin();

import "dotenv/config";
import { db } from "@/src/db";
import {
  users,
  departments,
  positions,
  shifts,
  employees,
} from "@/src/db/schema";
import bcrypt from "bcryptjs";

async function seedSuperAdmin() {
  console.log("🌱 Starting Super Admin Seed...");

  // 1. Create 'Administration' Department
  // This ensures the Admin belongs to a valid department
  const [adminDept] = await db
    .insert(departments)
    .values({
      name: "Administration",
      code: "ADMIN",
    })
    .returning();

  console.log("✅ Department 'Administration' created");

  // 2. Create 'System Owner' Position
  const [adminPos] = await db
    .insert(positions)
    .values({
      title: "System Owner",
      departmentId: adminDept.id,
    })
    .returning();

  console.log("✅ Position 'System Owner' created");

  // 3. Create a Default Shift (required for the employee profile)
  const [defaultShift] = await db
    .insert(shifts)
    .values({
      name: "Regular Shift (8am-5pm)",
      startTime: "08:00:00",
      endTime: "17:00:00",
      breakStartTime: "12:00:00",
      breakEndTime: "13:00:00",
    })
    .returning();

  console.log("✅ Default Shift created");

  // 4. Create the SUPER ADMIN User
  const passwordHash = await bcrypt.hash("Admin@123", 10); // Change this password!

  const [adminUser] = await db
    .insert(users)
    .values({
      email: "admin@jcl-proserve.com", // Your Super Admin email
      name: "Super Admin",
      passwordHash,
      role: "ADMIN", // <--- Crucial: Set to ADMIN, not HR
    })
    .returning();

  console.log("✅ Super Admin User created");

  // 5. Create the Employee Profile (Links everything together)
  // Even Admins need an employee profile to exist in the HR system
  await db.insert(employees).values({
    userId: adminUser.id,
    employeeNo: "SA-001", // Special ID for Super Admin
    firstName: "System",
    lastName: "Administrator",
    email: "admin@jcl-proserve.com",

    // Link the relations we just created
    departmentId: adminDept.id,
    positionId: adminPos.id,
    shiftId: defaultShift.id,

    status: "REGULAR",
    dateHired: new Date().toISOString(),
  });

  console.log("✅ Admin Profile linked successfully");
  console.log("🚀 Seed complete! Login: admin@jcl-proserve.com / Admin@123");
  process.exit(0);
}

seedSuperAdmin().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
