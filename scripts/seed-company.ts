import "dotenv/config";
import { db } from "@/src/db";
import { departments, positions, shifts } from "@/src/db/schema";
import { eq } from "drizzle-orm";

async function seedCompany() {
  console.log("🏢 expanding Company Structure...");

  // --- 1. ENSURE SHIFTS EXIST ---
  // We check if they exist first to avoid duplicates if you ran this before
  const existingShifts = await db.select().from(shifts);
  
  if (existingShifts.length === 0 || !existingShifts.find(s => s.name.includes("Night"))) {
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
      }
    ]);
    console.log("✅ Additional Shifts Created");
  }

  // --- 2. CREATE NEW DEPARTMENTS & POSITIONS ---

  // A. Human Resources
  try {
    const [hrDept] = await db.insert(departments).values({
      name: "Human Resources",
      code: "HR",
    }).returning();

    await db.insert(positions).values([
      { title: "HR Manager", departmentId: hrDept.id },
      { title: "Recruitment Specialist", departmentId: hrDept.id },
      { title: "Payroll Officer", departmentId: hrDept.id },
      { title: "Liaison Officer", departmentId: hrDept.id },
    ]);
    console.log("✅ HR Department Created");
  } catch (e) {
    console.log("⚠️  HR Department likely already exists, skipping...");
  }

  // B. Finance / Accounting
  try {
    const [financeDept] = await db.insert(departments).values({
      name: "Finance & Accounting",
      code: "FINANCE",
    }).returning();

    await db.insert(positions).values([
      { title: "Finance Head", departmentId: financeDept.id },
      { title: "Senior Accountant", departmentId: financeDept.id },
      { title: "Bookkeeper", departmentId: financeDept.id },
      { title: "Cashier", departmentId: financeDept.id },
    ]);
    console.log("✅ Finance Department Created");
  } catch (e) {
    console.log("⚠️  Finance Department likely already exists, skipping...");
  }

  // C. Information Technology (If you want more than just Admin)
  try {
    const [itDept] = await db.insert(departments).values({
      name: "Information Technology",
      code: "IT",
    }).returning();

    await db.insert(positions).values([
      { title: "IT Manager", departmentId: itDept.id },
      { title: "Software Engineer", departmentId: itDept.id },
      { title: "Network Administrator", departmentId: itDept.id },
      { title: "Tech Support", departmentId: itDept.id },
    ]);
    console.log("✅ IT Department Created");
  } catch (e) {
    console.log("⚠️  IT Department likely already exists, skipping...");
  }

  // D. Operations
  try {
    const [opsDept] = await db.insert(departments).values({
      name: "Operations",
      code: "OPS",
    }).returning();

    await db.insert(positions).values([
      { title: "Operations Manager", departmentId: opsDept.id },
      { title: "Area Coordinator", departmentId: opsDept.id },
      { title: "Team Leader", departmentId: opsDept.id },
      { title: "Housekeeping Utility", departmentId: opsDept.id },
      { title: "Driver", departmentId: opsDept.id },
    ]);
    console.log("✅ Operations Department Created");
  } catch (e) {
    console.log("⚠️  Operations Department likely already exists, skipping...");
  }

  // --- 3. (OPTIONAL) ADD POSITIONS TO EXISTING 'ADMINISTRATION' ---
  // If you want to add 'Executive Assistant' to your existing Admin dept
  const adminDept = await db.query.departments.findFirst({
    where: eq(departments.code, "ADMIN") // Assuming you used 'ADMIN' or 'HR' code in the first seed
  });

  if (adminDept) {
    // Check if Executive Assistant exists, if not add it
    const existingPos = await db.query.positions.findFirst({
        where: (positions, { eq, and }) => and(
            eq(positions.title, "Executive Assistant"),
            eq(positions.departmentId, adminDept.id)
        )
    });

    if (!existingPos) {
        await db.insert(positions).values({
            title: "Executive Assistant",
            departmentId: adminDept.id
        });
        console.log("✅ Added 'Executive Assistant' to Administration");
    }
  }

  console.log("🚀 Company Structure Updated Successfully!");
  process.exit(0);
}

seedCompany().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});