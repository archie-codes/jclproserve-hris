// import {
//   pgTable,
//   varchar,
//   text,
//   date,
//   timestamp,
//   boolean,
//   uuid,
//   pgEnum,
//   jsonb,
//   index,
//   integer
// } from "drizzle-orm/pg-core";
// import { relations } from "drizzle-orm";

// /* ================= ENUMS ================= */

// export const userRoleEnum = pgEnum("user_role", [
//   "ADMIN",
//   "HR",
//   "STAFF",
//   "COORDINATOR",
// ]);

// // Updated for PH Labor Standards
// export const employeeStatusEnum = pgEnum("employee_status", [
//   "PROBATIONARY",
//   "REGULAR",
//   "CONTRACTUAL",
//   "PROJECT_BASED",
//   "ACTIVE", // Legacy support if you have existing data
//   "INACTIVE", // Legacy support
//   "TERMINATED",
//   "RESIGNED",
//   "AWOL",
// ]);

// export const auditActionEnum = pgEnum("audit_action", [
//   "CREATE_USER",
//   "UPDATE_USER",
//   "DELETE_USER",
//   "RESET_PASSWORD",
//   "LOGIN",
//   "LOGOUT",
// ]);

// export const genderEnum = pgEnum("gender", ["MALE", "FEMALE"]);
// export const civilStatusEnum = pgEnum("civil_status", [
//   "SINGLE",
//   "MARRIED",
//   "WIDOWED",
//   "SEPARATED",
// ]);

// /* ================= AUDIT LOGS ================= */

// export const auditLogs = pgTable("audit_logs", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   actorId: uuid("actor_id").notNull(),
//   action: auditActionEnum("action").notNull(),
//   targetId: uuid("target_id"),
//   metadata: jsonb("metadata"),
//   createdAt: timestamp("created_at").defaultNow(),
// });

// /* ================= USERS ================= */

// export const users = pgTable("users", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   email: varchar("email", { length: 255 }).notNull().unique(),
//   passwordHash: varchar("password_hash", { length: 255 }).notNull(),
//   name: varchar("name", { length: 255 }).notNull(),
//   role: userRoleEnum("role").default("ADMIN").notNull(),
//   isActive: boolean("is_active").default(true),
//   image: text("image"), // Added for Avatar URL
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// /* ================= EMPLOYEES (201 File) ================= */

// export const employees = pgTable(
//   "employees",
//   {
//     id: uuid("id").defaultRandom().primaryKey(),

//     // Link to System User (Optional, generic employees might not have login)
//     userId: uuid("user_id").references(() => users.id, {
//       onDelete: "set null",
//     }),

//     // --- A. IDENTIFIERS ---
//     employeeNo: varchar("employee_no", { length: 20 }).unique().notNull(),

//     // --- B. PERSONAL INFO ---
//     imageUrl: text("image_url"), // Profile Picture URL
//     firstName: varchar("first_name", { length: 100 }).notNull(),
//     middleName: varchar("middle_name", { length: 100 }), // Made optional as not everyone has one
//     lastName: varchar("last_name", { length: 100 }).notNull(),
//     suffix: varchar("suffix", { length: 20 }),

//     dateOfBirth: date("date_of_birth"),
//     gender: genderEnum("gender"),
//     civilStatus: civilStatusEnum("civil_status").default("SINGLE"),
//     nationality: varchar("nationality", { length: 50 }).default("FILIPINO"),
//     bloodType: varchar("blood_type", { length: 10 }),

//     // --- C. CONTACT INFO ---
//     email: varchar("email", { length: 255 }).unique().notNull(), // Work Email
//     personalEmail: varchar("personal_email", { length: 255 }),
//     mobileNumber: varchar("mobile_number", { length: 20 }),
//     address: text("address"), // Full address

//     emergencyContactName: varchar("emergency_contact_name", { length: 100 }),
//     emergencyContactPhone: varchar("emergency_contact_phone", { length: 20 }),
//     emergencyRelation: varchar("emergency_relation", { length: 50 }),

//     // --- D. EMPLOYMENT DETAILS ---
//     position: varchar("position", { length: 100 }),
//     department: varchar("department", { length: 100 }),
//     status: employeeStatusEnum("status").default("PROBATIONARY").notNull(),

//     dateHired: date("date_hired").notNull(), // Renamed from hireDate to standard
//     dateRegularized: date("date_regularized"), // +6 months usually
//     dateResigned: date("date_resigned"), // For clearance

//     // --- E. GOVERNMENT IDs (Text to preserve leading zeros) ---
//     sssNo: varchar("sss_no", { length: 20 }),
//     tinNo: varchar("tin_no", { length: 20 }),
//     philHealthNo: varchar("philhealth_no", { length: 20 }),
//     pagIbigNo: varchar("pagibig_no", { length: 20 }),

//     // --- F. BANKING ---
//     bankName: varchar("bank_name", { length: 100 }), // BDO, BPI, etc.
//     bankAccountNo: varchar("bank_account_no", { length: 100 }),

//     createdAt: timestamp("created_at").defaultNow(),
//     updatedAt: timestamp("updated_at").defaultNow(),

//     // --- G. COMPENSATION (New Section) ---
//     basicSalary: integer("basic_salary").default(0), // Store in cents/centavos to avoid rounding errors (e.g., 500.00 -> 50000)
//     salaryType: varchar("salary_type", { length: 20 }).default("DAILY"), // DAILY or MONTHLY
//     allowance: integer("allowance").default(0), // Non-taxable allowance
//   },
//   (table) => {
//     return [
//       index("employee_user_idx").on(table.userId),
//       index("employee_status_idx").on(table.status),
//     ];
//   },
// );

// /* ================= DOCUMENTS (New) ================= */

// export const employeeDocuments = pgTable(
//   "employee_documents",
//   {
//     id: uuid("id").defaultRandom().primaryKey(),
//     employeeId: uuid("employee_id")
//       .references(() => employees.id, { onDelete: "cascade" })
//       .notNull(),

//     fileName: varchar("file_name", { length: 255 }).notNull(),
//     fileUrl: text("file_url").notNull(), // S3 or UploadThing URL
//     documentType: varchar("document_type", { length: 50 }), // CONTRACT, RESUME, MEMO

//     uploadedAt: timestamp("uploaded_at").defaultNow(),
//   },
//   (table) => {
//     return [index("documents_employee_idx").on(table.employeeId)];
//   },
// );

// /* ================= ATTENDANCE ================= */

// export const attendance = pgTable(
//   "attendance",
//   {
//     id: uuid("id").defaultRandom().primaryKey(),
//     employeeId: uuid("employee_id")
//       .references(() => employees.id, { onDelete: "cascade" })
//       .notNull(),
//     date: date("date").notNull(),
//     timeIn: timestamp("time_in"),
//     timeOut: timestamp("time_out"),
//     createdAt: timestamp("created_at").defaultNow(),
//   },
//   (table) => {
//     return [index("attendance_employee_idx").on(table.employeeId)];
//   },
// );

// /* ================= LEAVES ================= */

// export const leaves = pgTable(
//   "leaves",
//   {
//     id: uuid("id").defaultRandom().primaryKey(),
//     employeeId: uuid("employee_id")
//       .references(() => employees.id, { onDelete: "cascade" })
//       .notNull(),
//     type: varchar("type", { length: 50 }).notNull(),
//     startDate: date("start_date").notNull(),
//     endDate: date("end_date").notNull(),
//     reason: text("reason"),
//     status: varchar("status", { length: 20 }).default("PENDING"), // PENDING, APPROVED, REJECTED
//     createdAt: timestamp("created_at").defaultNow(),
//   },
//   (table) => {
//     return [index("leaves_employee_idx").on(table.employeeId)];
//   },
// );

// /* ================= RELATIONS (For Drizzle Queries) ================= */

// export const usersRelations = relations(users, ({ one }) => ({
//   employeeProfile: one(employees, {
//     fields: [users.id],
//     references: [employees.userId],
//   }),
// }));

// export const employeesRelations = relations(employees, ({ one, many }) => ({
//   userAccount: one(users, {
//     fields: [employees.userId],
//     references: [users.id],
//   }),
//   documents: many(employeeDocuments),
//   attendance: many(attendance),
//   leaves: many(leaves),
// }));

// export const documentsRelations = relations(employeeDocuments, ({ one }) => ({
//   employee: one(employees, {
//     fields: [employeeDocuments.employeeId],
//     references: [employees.id],
//   }),
// }));

// export const attendanceRelations = relations(attendance, ({ one }) => ({
//   employee: one(employees, {
//     fields: [attendance.employeeId],
//     references: [employees.id],
//   }),
// }));

// export const leavesRelations = relations(leaves, ({ one }) => ({
//   employee: one(employees, {
//     fields: [leaves.employeeId],
//     references: [employees.id],
//   }),
// }));

/* ================= UPDATED SCHEMA 02/10/2026 ================= */

import {
  pgTable,
  varchar,
  text,
  date,
  timestamp,
  boolean,
  uuid,
  pgEnum,
  jsonb,
  index,
  integer,
  time,
  bigint,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ================= ENUMS ================= */

export const userRoleEnum = pgEnum("user_role", [
  "ADMIN",
  "HR",
  "STAFF",
  "COORDINATOR",
]);

// Updated for PH Labor Standards
export const employeeStatusEnum = pgEnum("employee_status", [
  "PROBATIONARY",
  "REGULAR",
  "CONTRACTUAL",
  "PROJECT_BASED",
  "ACTIVE", // Legacy support
  "INACTIVE", // Legacy support
  "TERMINATED",
  "RESIGNED",
  "AWOL",
]);

export const auditActionEnum = pgEnum("audit_action", [
  "CREATE_USER",
  "UPDATE_USER",
  "DELETE_USER",
  "RESET_PASSWORD",
  "LOGIN",
  "LOGOUT",
]);

export const genderEnum = pgEnum("gender", ["MALE", "FEMALE"]);
export const civilStatusEnum = pgEnum("civil_status", [
  "SINGLE",
  "MARRIED",
  "WIDOWED",
  "SEPARATED",
]);

export const loanTypeEnum = pgEnum("loan_type", [
  "SSS_SALARY",
  "SSS_CALAMITY",
  "PAGIBIG_MULTI_PURPOSE",
  "PAGIBIG_HOUSING",
  "COMPANY_LOAN",
]);

/* ================= AUDIT LOGS ================= */

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: uuid("actor_id").notNull(),
  action: auditActionEnum("action").notNull(),
  targetId: uuid("target_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ================= USERS ================= */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("ADMIN").notNull(),
  isActive: boolean("is_active").default(true),
  image: text("image"), // Added for Avatar URL
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ================= ORG STRUCTURE (New) ================= */

export const departments = pgTable("departments", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  code: varchar("code", { length: 20 }).notNull(), // e.g., "IT", "HR"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const positions = pgTable("positions", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  departmentId: uuid("department_id").references(() => departments.id),
  // Optional base rate for this position to auto-fill employee salary
  basicRate: integer("basic_rate"),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ================= SHIFT MANAGEMENT (New) ================= */

export const shifts = pgTable("shifts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(), // e.g., "Morning Shift", "Graveyard"
  startTime: time("start_time").notNull(), // "08:00:00"
  endTime: time("end_time").notNull(), // "17:00:00"
  breakStartTime: time("break_start_time"), // "12:00:00"
  breakEndTime: time("break_end_time"), // "13:00:00"
  nightDiffEnabled: boolean("night_diff_enabled").default(false),
  isActive: boolean("is_active").default(true),
});

/* ================= EMPLOYEES (201 File) ================= */

export const employees = pgTable(
  "employees",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Link to System User (Optional, generic employees might not have login)
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    // --- A. IDENTIFIERS ---
    employeeNo: varchar("employee_no", { length: 20 }).unique().notNull(),

    // --- B. PERSONAL INFO ---
    imageUrl: text("image_url"), // Profile Picture URL
    firstName: varchar("first_name", { length: 100 }).notNull(),
    middleName: varchar("middle_name", { length: 100 }), // Made optional
    lastName: varchar("last_name", { length: 100 }).notNull(),
    suffix: varchar("suffix", { length: 20 }),

    dateOfBirth: date("date_of_birth"),
    gender: genderEnum("gender"),
    civilStatus: civilStatusEnum("civil_status").default("SINGLE"),
    nationality: varchar("nationality", { length: 50 }).default("FILIPINO"),
    bloodType: varchar("blood_type", { length: 10 }),

    // --- C. CONTACT INFO ---
    email: varchar("email", { length: 255 }).unique().notNull(), // Work Email
    personalEmail: varchar("personal_email", { length: 255 }),
    mobileNumber: varchar("mobile_number", { length: 20 }),
    address: text("address"), // Full address

    emergencyContactName: varchar("emergency_contact_name", { length: 100 }),
    emergencyContactPhone: varchar("emergency_contact_phone", { length: 20 }),
    emergencyRelation: varchar("emergency_relation", { length: 50 }),

    // --- D. EMPLOYMENT DETAILS ---
    // Normalized References
    departmentId: uuid("department_id").references(() => departments.id),
    positionId: uuid("position_id").references(() => positions.id),
    shiftId: uuid("shift_id").references(() => shifts.id), // Default Shift
    managerId: uuid("manager_id"), // Self-reference usually handled in app logic

    status: employeeStatusEnum("status").default("PROBATIONARY").notNull(),

    dateHired: date("date_hired").notNull(),
    dateRegularized: date("date_regularized"), // +6 months usually
    dateResigned: date("date_resigned"), // For clearance

    // --- E. GOVERNMENT IDs (Text to preserve leading zeros) ---
    sssNo: varchar("sss_no", { length: 20 }),
    tinNo: varchar("tin_no", { length: 20 }),
    philHealthNo: varchar("philhealth_no", { length: 20 }),
    pagIbigNo: varchar("pagibig_no", { length: 20 }),

    // --- F. BANKING ---
    bankName: varchar("bank_name", { length: 100 }), // BDO, BPI, etc.
    bankAccountNo: varchar("bank_account_no", { length: 100 }),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),

    // --- G. COMPENSATION ---
    // Stored in cents (e.g., 500.00 -> 50000)
    basicSalary: bigint("basic_salary", { mode: "number" }).default(0),
    salaryType: varchar("salary_type", { length: 20 }).default("SEMI_MONTHLY"),
    deMinimis: integer("de_minimis").default(0), // Non-taxable benefits
    taxableAllowance: bigint("taxable_allowance", { mode: "number" }).default(
      0,
    ),

    // --- H. SECURITY ---
    pinCode: text("pin_code").default("1234"),
  },
  (table) => {
    return [
      index("employee_user_idx").on(table.userId),
      index("employee_status_idx").on(table.status),
      index("employee_dept_idx").on(table.departmentId),
    ];
  },
);

/* ================= DOCUMENTS ================= */

export const employeeDocuments = pgTable(
  "employee_documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    employeeId: uuid("employee_id")
      .references(() => employees.id, { onDelete: "cascade" })
      .notNull(),

    fileName: varchar("file_name", { length: 255 }).notNull(),
    fileUrl: text("file_url").notNull(), // S3 or UploadThing URL
    documentType: varchar("document_type", { length: 50 }), // CONTRACT, RESUME, MEMO

    uploadedAt: timestamp("uploaded_at").defaultNow(),
  },
  (table) => {
    return [index("documents_employee_idx").on(table.employeeId)];
  },
);

/* ================= ATTENDANCE ================= */

export const attendance = pgTable(
  "attendance",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    employeeId: uuid("employee_id")
      .references(() => employees.id, { onDelete: "cascade" })
      .notNull(),

    // Shift assigned for this specific day (in case they change shifts)
    shiftId: uuid("shift_id").references(() => shifts.id),

    date: date("date").notNull(),

    timeIn: timestamp("time_in"),
    breakOut: timestamp("break_out"), // Lunch Start
    breakIn: timestamp("break_in"), // Lunch End
    timeOut: timestamp("time_out"),

    totalHours: doublePrecision("total_hours").default(0),

    // Computed columns (Populated via backend logic)
    lateMinutes: integer("late_minutes").default(0),
    undertimeMinutes: integer("undertime_minutes").default(0),
    overtimeMinutes: integer("overtime_minutes").default(0),
    ndHours: integer("nd_hours").default(0), // Night Differential

    status: varchar("status", { length: 20 }).default("PRESENT"), // PRESENT, ABSENT, LEAVE
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return [index("attendance_employee_idx").on(table.employeeId)];
  },
);

/* ================= LEAVES ================= */

export const leaves = pgTable(
  "leaves",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    employeeId: uuid("employee_id")
      .references(() => employees.id, { onDelete: "cascade" })
      .notNull(),
    type: varchar("type", { length: 50 }).notNull(), // SICK, VACATION, MATERNITY
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    reason: text("reason"),
    status: varchar("status", { length: 20 }).default("PENDING"), // PENDING, APPROVED, REJECTED
    approvedBy: uuid("approved_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return [index("leaves_employee_idx").on(table.employeeId)];
  },
);

/* ================= PAYROLL MODULE (New) ================= */

// export const payrollRuns = pgTable("payroll_runs", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   startDate: date("start_date").notNull(), // e.g. Oct 1
//   endDate: date("end_date").notNull(), // e.g. Oct 15
//   payoutDate: date("payout_date").notNull(), // e.g. Oct 15 or 16

//   // REGULAR, 13TH_MONTH, FINAL_PAY
//   type: varchar("type", { length: 20 }).default("REGULAR"),
//   status: varchar("status", { length: 20 }).default("DRAFT"), // DRAFT, APPROVED, PAID

//   processedBy: uuid("processed_by").references(() => users.id),
//   createdAt: timestamp("created_at").defaultNow(),
// });

// export const payslips = pgTable("payslips", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   payrollRunId: uuid("payroll_run_id")
//     .references(() => payrollRuns.id)
//     .notNull(),
//   employeeId: uuid("employee_id")
//     .references(() => employees.id)
//     .notNull(),

//   // Earnings (Stored as integers/cents)
//   basicPay: integer("basic_pay").notNull(),
//   overtimePay: integer("overtime_pay").default(0),
//   nightDiffPay: integer("night_diff_pay").default(0),
//   holidayPay: integer("holiday_pay").default(0),
//   allowances: integer("allowances").default(0),

//   // Deductions
//   sssDeduction: integer("sss_deduction").default(0),
//   philhealthDeduction: integer("philhealth_deduction").default(0),
//   pagibigDeduction: integer("pagibig_deduction").default(0),
//   taxDeduction: integer("tax_deduction").default(0),
//   loanDeductions: integer("loan_deductions").default(0),
//   lateDeductions: integer("late_deductions").default(0), // Computed from lates
//   undertimeDeductions: integer("undertime_deductions").default(0),

//   // Totals
//   grossPay: integer("gross_pay").notNull(),
//   netPay: integer("net_pay").notNull(),

//   // JSON snapshot of calculations for transparency/audit
//   calculationSnapshot: jsonb("calculation_snapshot"),
//   createdAt: timestamp("created_at").defaultNow(),
// });

/* ================= PAYROLL MODULE (Aligned with Server Actions) ================= */

export const payrollPeriods = pgTable("payroll_periods", {
  id: uuid("id").defaultRandom().primaryKey(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: text("status", { enum: ["DRAFT", "LOCKED", "PAID"] }).default(
    "DRAFT",
  ),
  totalAmount: doublePrecision("total_amount").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payslips = pgTable("payslips", {
  id: uuid("id").defaultRandom().primaryKey(),
  payrollPeriodId: uuid("payroll_period_id")
    .references(() => payrollPeriods.id)
    .notNull(),
  employeeId: uuid("employee_id")
    .references(() => employees.id)
    .notNull(),

  // Earnings
  basicSalary: doublePrecision("basic_salary").default(0),
  daysWorked: doublePrecision("days_worked").default(0),
  grossIncome: doublePrecision("gross_income").default(0),

  // Deductions
  sss: doublePrecision("sss").default(0),
  philhealth: doublePrecision("philhealth").default(0),
  pagibig: doublePrecision("pagibig").default(0),
  totalDeductions: doublePrecision("total_deductions").default(0),

  // Net
  netPay: doublePrecision("net_pay").default(0),
  generatedAt: timestamp("generated_at").defaultNow(),
});

// Update Relations accordingly
export const payrollPeriodRelations = relations(payrollPeriods, ({ many }) => ({
  payslips: many(payslips),
}));

export const payslipRelations = relations(payslips, ({ one }) => ({
  period: one(payrollPeriods, {
    fields: [payslips.payrollPeriodId],
    references: [payrollPeriods.id],
  }),
  employee: one(employees, {
    fields: [payslips.employeeId],
    references: [employees.id],
  }),
}));

/* ================= LOAN LEDGER (New) ================= */

export const loans = pgTable("loans", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: uuid("employee_id")
    .references(() => employees.id)
    .notNull(),
  type: loanTypeEnum("type").notNull(),

  principalAmount: integer("principal_amount").notNull(),
  monthlyAmortization: integer("monthly_amortization").notNull(),

  totalPaid: integer("total_paid").default(0),
  status: varchar("status", { length: 20 }).default("ACTIVE"), // ACTIVE, PAID_OFF

  startDate: date("start_date"),
  endDate: date("end_date"),

  createdAt: timestamp("created_at").defaultNow(),
});

/* ================= FOR EXAMS ================= */

// 1. EXAMS (The Test Definitions)
export const exams = pgTable("exams", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(), // e.g. "General Logic"
  description: text("description"),
  passingScore: integer("passing_score").default(70), // Percentage
  timeLimit: integer("time_limit").default(60), // Minutes
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. QUESTIONS (Linked to Exam)
export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  examId: uuid("exam_id").references(() => exams.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  imageUrl: text("image_url"), // 👈 NEW: For visual puzzles
  points: integer("points").default(1), // 👈 EXISTING: Keep this!
  order: integer("order").notNull().default(0),
});

// 3. CHOICES (For Multiple Choice)
export const questionChoices = pgTable("question_choices", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid("question_id").references(() => questions.id, {
    onDelete: "cascade",
  }),
  text: text("text").notNull(),
  imageUrl: text("image_url"), // 👈 NEW: For option visuals
  isCorrect: boolean("is_correct").notNull().default(false),
});

// 4. APPLICANT EXAM RESULTS (The Record of the Walk-in)
export const applicantResults = pgTable("applicant_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  examId: uuid("exam_id").references(() => exams.id),

  // Basic Applicant Info (Captured at Kiosk start)
  lastName: text("last_name").notNull(),
  firstName: text("first_name").notNull(),
  positionApplied: text("position_applied").notNull(),

  // Result Data
  score: integer("score").notNull(), // e.g. 15
  totalPoints: integer("total_points").notNull(), // e.g. 20
  percentage: integer("percentage").notNull(), // e.g. 75
  status: text("status").notNull(), // "PASSED" or "FAILED"

  dateTaken: timestamp("date_taken").defaultNow(),
});

/* ================= RELATIONS (For Drizzle Queries) ================= */

export const usersRelations = relations(users, ({ one }) => ({
  employeeProfile: one(employees, {
    fields: [users.id],
    references: [employees.userId],
  }),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  userAccount: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  }),
  position: one(positions, {
    fields: [employees.positionId],
    references: [positions.id],
  }),
  shift: one(shifts, {
    fields: [employees.shiftId],
    references: [shifts.id],
  }),
  documents: many(employeeDocuments),
  attendance: many(attendance),
  leaves: many(leaves),
  payslips: many(payslips),
  loans: many(loans),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
  employees: many(employees),
  positions: many(positions),
}));

export const positionsRelations = relations(positions, ({ one, many }) => ({
  department: one(departments, {
    fields: [positions.departmentId],
    references: [departments.id],
  }),
  employees: many(employees),
}));

export const documentsRelations = relations(employeeDocuments, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeDocuments.employeeId],
    references: [employees.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(employees, {
    fields: [attendance.employeeId],
    references: [employees.id],
  }),
  shift: one(shifts, {
    fields: [attendance.shiftId],
    references: [shifts.id],
  }),
}));

export const leavesRelations = relations(leaves, ({ one }) => ({
  employee: one(employees, {
    fields: [leaves.employeeId],
    references: [employees.id],
  }),
  approver: one(users, {
    fields: [leaves.approvedBy],
    references: [users.id],
  }),
}));

export const payslipsRelations = relations(payslips, ({ one }) => ({
  period: one(payrollPeriods, {
    fields: [payslips.payrollPeriodId],
    references: [payrollPeriods.id],
  }),
  employee: one(employees, {
    fields: [payslips.employeeId],
    references: [employees.id],
  }),
}));
export const loansRelations = relations(loans, ({ one }) => ({
  employee: one(employees, {
    fields: [loans.employeeId],
    references: [employees.id],
  }),
}));

/* ================= RELATIONS FOR EXAMS ================= */

export const examsRelations = relations(exams, ({ many }) => ({
  questions: many(questions),
  results: many(applicantResults),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  exam: one(exams, { fields: [questions.examId], references: [exams.id] }),
  choices: many(questionChoices),
}));

export const questionChoicesRelations = relations(
  questionChoices,
  ({ one }) => ({
    question: one(questions, {
      fields: [questionChoices.questionId],
      references: [questions.id],
    }),
  }),
);

export const applicantResultsRelations = relations(
  applicantResults,
  ({ one }) => ({
    exam: one(exams, {
      fields: [applicantResults.examId],
      references: [exams.id],
    }),
  }),
);
