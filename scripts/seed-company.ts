// import "dotenv/config";
// import { db } from "@/src/db";
// import { departments, positions, shifts } from "@/src/db/schema";
// import { eq } from "drizzle-orm";

// async function seedCompany() {
//   console.log("🏢 expanding Company Structure...");

//   // --- 1. ENSURE SHIFTS EXIST ---
//   // We check if they exist first to avoid duplicates if you ran this before
//   const existingShifts = await db.select().from(shifts);

//   if (
//     existingShifts.length === 0 ||
//     !existingShifts.find((s) => s.name.includes("Night"))
//   ) {
//     await db.insert(shifts).values([
//       {
//         name: "Night Shift (10PM - 7AM)",
//         startTime: "22:00:00",
//         endTime: "07:00:00",
//         breakStartTime: "02:00:00",
//         breakEndTime: "03:00:00",
//         nightDiffEnabled: true,
//       },
//       {
//         name: "Mid Shift (1PM - 10PM)",
//         startTime: "13:00:00",
//         endTime: "22:00:00",
//         breakStartTime: "17:00:00",
//         breakEndTime: "18:00:00",
//       },
//     ]);
//     console.log("✅ Additional Shifts Created");
//   }

//   // --- 2. CREATE NEW DEPARTMENTS & POSITIONS ---

//   // A. Human Resources
//   try {
//     const [hrDept] = await db
//       .insert(departments)
//       .values({
//         name: "Human Resources",
//         code: "HR",
//       })
//       .returning();

//     await db.insert(positions).values([
//       { title: "HR Manager", departmentId: hrDept.id },
//       { title: "Recruitment Specialist", departmentId: hrDept.id },
//       { title: "Payroll Officer", departmentId: hrDept.id },
//       { title: "Liaison Officer", departmentId: hrDept.id },
//     ]);
//     console.log("✅ HR Department Created");
//   } catch (e) {
//     console.log("⚠️  HR Department likely already exists, skipping...");
//   }

//   // B. Finance / Accounting
//   try {
//     const [financeDept] = await db
//       .insert(departments)
//       .values({
//         name: "Finance & Accounting",
//         code: "FINANCE",
//       })
//       .returning();

//     await db.insert(positions).values([
//       { title: "Finance Head", departmentId: financeDept.id },
//       { title: "Finance Assistant", departmentId: financeDept.id },
//       { title: "Senior Accountant", departmentId: financeDept.id },
//       { title: "Bookkeeper", departmentId: financeDept.id },
//       { title: "Billing Staff", departmentId: financeDept.id },
//       { title: "Cashier", departmentId: financeDept.id },
//       { title: "Finance Clerk", departmentId: financeDept.id },
//       { title: "Accounting Officer", departmentId: financeDept.id },
//       { title: "Accounting Assistant", departmentId: financeDept.id },
//     ]);
//     console.log("✅ Finance Department Created");
//   } catch (e) {
//     console.log("⚠️  Finance Department likely already exists, skipping...");
//   }

//   // C. Information Technology (If you want more than just Admin)
//   try {
//     const [itDept] = await db
//       .insert(departments)
//       .values({
//         name: "Information Technology",
//         code: "IT",
//       })
//       .returning();

//     await db.insert(positions).values([
//       { title: "IT Manager", departmentId: itDept.id },
//       { title: "Software Engineer", departmentId: itDept.id },
//       { title: "Network Administrator", departmentId: itDept.id },
//       { title: "Tech Support", departmentId: itDept.id },
//       { title: "IT Staff", departmentId: itDept.id },
//       { title: "IT Clerk", departmentId: itDept.id },
//       { title: "IT Assistant", departmentId: itDept.id },
//     ]);
//     console.log("✅ IT Department Created");
//   } catch (e) {
//     console.log("⚠️  IT Department likely already exists, skipping...");
//   }

//   // D. Operations
//   try {
//     const [opsDept] = await db
//       .insert(departments)
//       .values({
//         name: "Operations",
//         code: "OPS",
//       })
//       .returning();

//     await db.insert(positions).values([
//       { title: "Operations Manager", departmentId: opsDept.id },
//       { title: "Area Coordinator", departmentId: opsDept.id },
//       { title: "Team Leader", departmentId: opsDept.id },
//       { title: "Housekeeping Utility", departmentId: opsDept.id },
//       { title: "Driver", departmentId: opsDept.id },
//       { title: "Operations Staff", departmentId: opsDept.id },
//       { title: "Operations Clerk", departmentId: opsDept.id },
//       { title: "Operations Assistant", departmentId: opsDept.id },
//     ]);
//     console.log("✅ Operations Department Created");
//   } catch (e) {
//     console.log("⚠️  Operations Department likely already exists, skipping...");
//   }

//   // E. Administration
//   try {
//     const [adminDept] = await db
//       .insert(departments)
//       .values({
//         name: "Administration",
//         code: "ADMIN",
//       })
//       .returning();

//     await db.insert(positions).values([
//       { title: "Executive Assistant", departmentId: adminDept.id },
//       { title: "Admin Staff", departmentId: adminDept.id },
//       { title: "Admin Clerk", departmentId: adminDept.id },
//       { title: "Admin Assistant", departmentId: adminDept.id },
//     ]);
//     console.log("✅ Administration Department Created");
//   } catch (e) {
//     console.log(
//       "⚠️  Administration Department likely already exists, skipping...",
//     );
//   }

//   // F. Sales & Marketing
//   try {
//     const [salesDept] = await db
//       .insert(departments)
//       .values({
//         name: "Sales & Marketing",
//         code: "SALES",
//       })
//       .returning();

//     await db.insert(positions).values([
//       { title: "Sales Manager", departmentId: salesDept.id },
//       { title: "Sales Executive", departmentId: salesDept.id },
//       { title: "Marketing Specialist", departmentId: salesDept.id },
//       { title: "Sales Staff", departmentId: salesDept.id },
//       { title: "Sales Clerk", departmentId: salesDept.id },
//       { title: "Sales Assistant", departmentId: salesDept.id },
//     ]);
//     console.log("✅ Sales & Marketing Department Created");
//   } catch (e) {
//     console.log(
//       "⚠️  Sales & Marketing Department likely already exists, skipping...",
//     );
//   }

//   //Engineering
//   try {
//     const [engineeringDept] = await db
//       .insert(departments)
//       .values({
//         name: "Engineering",
//         code: "ENGINEERING",
//       })
//       .returning();

//     await db.insert(positions).values([
//       { title: "Engineering Manager", departmentId: engineeringDept.id },
//       { title: "Engineering Specialist", departmentId: engineeringDept.id },
//       { title: "Engineering Staff", departmentId: engineeringDept.id },
//       { title: "Engineering Clerk", departmentId: engineeringDept.id },
//       { title: "Engineering Assistant", departmentId: engineeringDept.id },
//     ]);
//     console.log("✅ Engineering Department Created");
//   } catch (e) {
//     console.log(
//       "⚠️  Engineering Department likely already exists, skipping...",
//     );
//   }

//   //Architecture
//   try {
//     const [architectureDept] = await db
//       .insert(departments)
//       .values({
//         name: "Architecture",
//         code: "ARCHITECTURE",
//       })
//       .returning();

//     await db.insert(positions).values([
//       { title: "Architecture Manager", departmentId: architectureDept.id },
//       { title: "Architecture Specialist", departmentId: architectureDept.id },
//       { title: "Architecture Staff", departmentId: architectureDept.id },
//       { title: "Architecture Clerk", departmentId: architectureDept.id },
//       { title: "Architecture Assistant", departmentId: architectureDept.id },
//     ]);
//     console.log("✅ Architecture Department Created");
//   } catch (e) {
//     console.log(
//       "⚠️  Architecture Department likely already exists, skipping...",
//     );
//   }

//   // --- 3. (OPTIONAL) ADD POSITIONS TO EXISTING 'ADMINISTRATION' ---
//   // If you want to add 'Executive Assistant' to your existing Admin dept
//   const adminDept = await db.query.departments.findFirst({
//     where: eq(departments.code, "ADMIN"), // Assuming you used 'ADMIN' or 'HR' code in the first seed
//   });

//   if (adminDept) {
//     // Check if Executive Assistant exists, if not add it
//     const existingPos = await db.query.positions.findFirst({
//       where: (positions, { eq, and }) =>
//         and(
//           eq(positions.title, "Executive Assistant"),
//           eq(positions.departmentId, adminDept.id),
//         ),
//     });

//     if (!existingPos) {
//       await db.insert(positions).values({
//         title: "Executive Assistant",
//         departmentId: adminDept.id,
//       });
//       console.log("✅ Added 'Executive Assistant' to Administration");
//     }
//   }

//   console.log("🚀 Company Structure Updated Successfully!");
//   process.exit(0);
// }

// seedCompany().catch((err) => {
//   console.error("❌ Seeding failed:", err);
//   process.exit(1);
// });

import "dotenv/config";
import { db } from "@/src/db";
import { departments, positions, shifts } from "@/src/db/schema";
import { eq } from "drizzle-orm";

async function seedCompany() {
  console.log("🏢 Expanding Company Structure...");

  // --- 1. ENSURE SHIFTS EXIST ---
  const existingShifts = await db.select().from(shifts);
  if (
    existingShifts.length === 0 ||
    !existingShifts.find((s) => s.name.includes("Night"))
  ) {
    await db.insert(shifts).values([
      {
        name: "Night Shift (10PM - 7AM)",
        startTime: "22:00:00",
        endTime: "07:00:00",
        breakStartTime: "02:00:00",
        breakEndTime: "03:00:00",
        nightDiffEnabled: true,
      },
      {
        name: "Mid Shift (1PM - 10PM)",
        startTime: "13:00:00",
        endTime: "22:00:00",
        breakStartTime: "17:00:00",
        breakEndTime: "18:00:00",
      },
    ]);
    console.log("✅ Additional Shifts Created");
  }

  // --- 2. BULLETPROOF HELPER FUNCTION ---
  // This safely creates the department (if missing) and appends any missing positions.
  async function syncDepartment(name: string, code: string, titles: string[]) {
    // 1. Find or create the department
    let dept = await db.query.departments.findFirst({
      where: eq(departments.code, code),
    });

    if (!dept) {
      const [newDept] = await db
        .insert(departments)
        .values({ name, code })
        .returning();
      dept = newDept;
      console.log(`✅ Created Department: ${name}`);
    }

    // 2. Get existing positions for this department
    const existing = await db.query.positions.findMany({
      where: eq(positions.departmentId, dept.id),
    });
    const existingTitles = existing.map((p) => p.title);

    // 3. Find which titles are missing from the database
    const missingTitles = titles.filter((t) => !existingTitles.includes(t));

    // 4. Insert only the missing titles
    if (missingTitles.length > 0) {
      await db.insert(positions).values(
        missingTitles.map((title) => ({
          title,
          departmentId: dept!.id,
        })),
      );
      console.log(
        `➕ Added ${missingTitles.length} new position(s) to ${name}`,
      );
    } else {
      console.log(`➖ ${name} is already up to date.`);
    }
  }

  // --- 3. SYNC ALL DEPARTMENTS & POSITIONS ---

  await syncDepartment("Human Resources", "HR", [
    "HR Manager",
    "Recruitment Specialist",
    "Payroll Officer",
    "Liaison Officer",
  ]);

  await syncDepartment("Finance & Accounting", "FINANCE", [
    "Finance Head",
    "Finance Assistant",
    "Senior Accountant",
    "Bookkeeper",
    "Billing Staff",
    "Cashier",
    "Finance Clerk",
    "Accounting Officer",
    "Accounting Assistant",
  ]);

  await syncDepartment("Information Technology", "IT", [
    "IT Manager",
    "Software Engineer",
    "Network Administrator",
    "Tech Support",
    "IT Staff",
    "IT Clerk",
    "IT Assistant",
  ]);

  await syncDepartment("Operations", "OPS", [
    "Operations Manager",
    "Area Coordinator",
    "Team Leader",
    "Housekeeping Utility",
    "Driver",
    "Operations Staff",
    "Operations Clerk",
    "Operations Assistant",
  ]);

  await syncDepartment("Administration", "ADMIN", [
    "Executive Assistant",
    "Admin Staff",
    "Admin Clerk",
    "Admin Assistant",
  ]);

  await syncDepartment("Sales & Marketing", "SALES", [
    "Sales Manager",
    "Sales Executive",
    "Marketing Specialist",
    "Sales Staff",
    "Sales Clerk",
    "Sales Assistant",
  ]);

  await syncDepartment("Engineering", "ENGINEERING", [
    "Engineering Manager",
    "Engineering Specialist",
    "Engineering Staff",
    "Engineering Clerk",
    "Engineering Assistant",
  ]);

  await syncDepartment("Architecture", "ARCHITECTURE", [
    "Architecture Manager",
    "Architecture Specialist",
    "Architecture Staff",
    "Architecture Clerk",
    "Architecture Assistant",
  ]);

  await syncDepartment("Farm Operations", "FARM", [
    "Farm Manager",
    "Farm Boy",
    "Agricultural Technician", // Feel free to remove if not needed!
  ]);

  await syncDepartment("Construction", "CONST", [
    "Construction Manager",
    "Site Foreman",
    "Heavy Equipment Operator",
    "Construction Worker",
    "Mason",
  ]);

  console.log("🚀 Company Structure Updated Successfully!");
  process.exit(0);
}

seedCompany().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
